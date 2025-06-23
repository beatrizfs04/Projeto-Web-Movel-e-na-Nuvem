const express = require('express');
const app = express();
var tasks = express.Router();
const util = require('util');
const sql = require('../modules/pool');
const sqlQuery = util.promisify(sql.query).bind(sql);
const jwt = require('../modules/jwt');
const taskFunctions = require('../modules/task')
const cron = require('node-cron');
const mail = require('../modules/mail');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

tasks.get("/tarefas", async (req, res) => {
    try {
        const Authenticated = await jwt.verifyToken(req.cookies?.userToken, req);
        if (!Authenticated) return res.status(401).json({ error: "Sessão inválida" });

        const patientId = req.user.id;
        const { data } = req.query;
        
        const queryForms = `
            SELECT t.id, t.type, f.title, t.interval, s.create_date
            FROM task t
            LEFT JOIN form f ON t.id = f.id
            LEFT JOIN acesstasks at ON at.task = t.id
            LEFT JOIN patient pa ON pa.process = at.process
            LEFT JOIN state s ON t.id = s.task AND s.done = 0
            WHERE t.type = 'form' AND s.patient = ? 
            AND s.create_date <= CURRENT_DATE()
        `;
        
        const queryPhotos = `
            SELECT t.id, t.type, p.title, t.interval, s.create_date
            FROM task t
            LEFT JOIN photo p ON t.id = p.id
            LEFT JOIN acesstasks at ON at.task = t.id
            LEFT JOIN patient pa ON pa.process = at.process
            LEFT JOIN state s ON t.id = s.task AND s.done = 0
            WHERE t.type = 'photo' AND s.patient = ?
            AND s.create_date <= CURRENT_DATE()
        `;
        
        const [forms, photos] = await Promise.all([
            new Promise((resolve, reject) => {
                const formParams = data ? [patientId, data] : [patientId];
                sql.query(queryForms, formParams, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            }),
            new Promise((resolve, reject) => {
                const photoParams = data ? [patientId, data] : [patientId];
                sql.query(queryPhotos, photoParams, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            })
        ]);
        
        const results = [...forms, ...photos];
        
        res.json(results);
        
    } catch (error) {
        console.error('Endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

tasks.get("/tarefas/form", async (req, res) => {
    const formId = req.query.formId;
    if (!formId || isNaN(formId)) return res.status(400).json({ error: "ID do formulário inválido" });
    
    try {
        sql.query(`
            SELECT 
                MIN(q.id) as id,
                q.question as enunciado,
                GROUP_CONCAT(q.option ORDER BY q.id SEPARATOR '||') as opcoes
            FROM formquestion fq
            JOIN question q ON fq.question = q.questionId
            WHERE fq.form = ?
            GROUP BY q.question
            ORDER BY fq.id;
        `, [formId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const questions = results.map(row => ({
                id: row.id,
                enunciado: row.enunciado,
                opcoes: row.opcoes.split('||') 
            }));
            
            res.json(questions);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

tasks.post("/answer/submit", async (req, res) => {
    try {
        const { answers, taskId } = req.body;
        try {
            for (const answer of answers) {
                sqlQuery(
                "INSERT INTO questionpatient (patient, question, answered) VALUES (?, ?, ?)",
                [answer.patient, parseInt(answer.question), parseInt(answer.answer)]);
            }
            sqlQuery(
                "UPDATE state SET done = 1 WHERE task = ? AND patient = ?",
                [taskId, answers[0].patient]
            );
            res.json({ success: true, message: 'Formulário submetido com sucesso' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

tasks.get("/tarefas/photo", async (req, res) => {
    const photoId = req.query.photoId;
    try {
        sqlQuery(`
            SELECT exemplo, title 
            FROM photo 
            WHERE id = ?
        `, [photoId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (results.length === 0) {
                return res.status(404).json({ error: "Fotografia não encontrada" });
            }
            
            const image = results[0].exemplo.toString('base64');
            res.json({
                title: results[0].title,
                image: `data:image/png;base64,${image}`
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

tasks.post("/photo/submit", async (req, res) => {
    try {
        const {patient, path, photoId} = req.body;
        try {
            const fileName = await taskFunctions.saveBase64Image(path);
            sqlQuery("INSERT INTO patientPhoto (patient, path, date) VALUES (?, ?, NOW())", [patient, fileName], async (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                sqlQuery("UPDATE state SET done = 1 WHERE task = ? AND patient = ?", [photoId, patient], async (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.json(results);
                });
            });
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

tasks.get("/tarefas/tutorial", async (req, res) => {
    const patientId = (req.query && req.query.patientId ? req.query.patientId : null);
    if (!patientId || patientId==null) return res.status(404).json({ error: "ID do Utente Inválido." });
    try {
        sqlQuery(`SELECT t.id, t.title, t.content FROM tutorial t
                    JOIN task ON t.id = task.id
                    JOIN acesstasks ac ON t.id = task.id
                    JOIN patient p ON ac.process = p.process WHERE p.id = ?
                    GROUP BY t.id
                `,
            [patientId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json(results);
        });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});



cron.schedule('* * * * *', async () => {
  try {    
    const today = new Date().toISOString().split('T')[0];
    
    const patientQuery = await sqlQuery(`
      SELECT id 
      FROM user 
      WHERE type = 'patient'
    `);

    const patients = patientQuery || [];
    
    for (const patient of patients) {
      try {
        const results = await sqlQuery(`
          SELECT s.*, p.email 
          FROM state s
          JOIN patient p ON s.patient = p.id
          WHERE DATE(s.create_date) = ?
          AND s.patient = ?
        `, [today, patient.id]);

        const states = results || [];
        
        if (states.length > 0) {        
            var stateEmail;  
            for (const state of states) {
                stateEmail = state.email
            }
            try {
                await mail.sendStateMail(
                    stateEmail,
                    states.length
                );
            } catch (emailError) {
                console.error(`Erro ao enviar email para ${stateEmail}:`, emailError);
            }
        } 
      } catch (patientError) {
        console.error(`Erro ao processar paciente ${patient.id}:`, patientError);
      }
    }    
  } catch (error) {
    console.error('Erro no cron job:', error);
  }
}, {
  scheduled: true,
  timezone: "Europe/Lisbon" 
});

module.exports = tasks;