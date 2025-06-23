const express = require('express');
const app = express();
var users = express.Router();
const bcrypt = require('bcrypt');
const sql = require('../modules/pool');
const task = require('../modules/task');
const auth = require('../modules/auth');
const mail = require('../modules/mail');
const doc = require('./docs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/* ATENDENTE */

/* ------ GESTÃO PACIENTES */
users.get("/attendant/patients", async (req, res) => {
    try {
        sql.query("SELECT * FROM patient", [], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json(results);
        });     
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

users.post("/attendant/patient", async (req, res) => {
    try {
        const {patient, name, email, contact, sex, age, profession, etiology, doctor, process, surgery} = req.body;
        const token = await auth.assignToken();
        try {
            sql.query("INSERT INTO user (id, type) VALUES (?, ?)", [patient, "patient"], async (err, results) => {
                if (err) return res.status(500).json({ error: 'user:' + err.message });
                sql.query("INSERT INTO patient (id, token, name, email, contact, sex, age, profession, etiology, doctor, process, surgery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [patient, token, name, email, contact, sex, age, profession, etiology, doctor, process, surgery], async (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });
                    const created = task.createAllTasks(patient, process, surgery);
                    if (!created) return res.status(500).json({ error: "Não Foi Possível Criar as Tarefas." });
                    await mail.sendPatientMail(email, patient, token);
                    return res.status(200).json({message: "Paciente e Tarefas Criadas com Sucesso!"})
                });
            });
        } catch (error) {
            return res.status(500).json({ error: 'query:' + error });
        }
    } catch (error) {
        return res.status(500).json({ error: 'body:' + error });
    }
});

users.delete("/attendant/patient", (req, res) => {
    const id = (req.query && req.query.id ? req.query.id : null);
    if (!id || id==null) return res.status(404).json({ error: "ID do Utente Inválido." });
    try {
        sql.query("DELETE FROM state WHERE patient = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: 'patient:' + err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Utente não encontrado" });
            sql.query("DELETE FROM patient WHERE id = ?", [id], (err) => {
                if (err) return res.status(500).json({ error: 'user:' + err.message });
                if (result.affectedRows === 0) return res.status(404).json({ error: "Utente não encontrado" });
                sql.query("DELETE FROM user WHERE id = ?", [id], (err) => {
                    if (err) return res.status(500).json({ error: 'state:' + err.message });
                    return res.json({ message: "Utente eliminado com sucesso" });
                });
            });
        });
    } catch (error) {
        return res.status(500).json({ error: 'total:' + error.message });
    }
});

/* ------ GESTÃO MÉDICOS */

users.get("/attendant/doctors", async (req, res) => {
    try {
        sql.query("SELECT * FROM doctor", [], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            else return res.json(results);
        });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

users.post("/attendant/doctor", async (req, res) => {
    try {
        const {id, name, email, password, contact} = req.body;
        try {
            sql.query("INSERT INTO user (id, type) VALUES (?, ?)", [id, "doctor"], async (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                try{
                    const cipherPassword = await bcrypt.hash(password, 10);
                    sql.query("INSERT INTO doctor (id, name, email, password, contact) VALUES (?, ?, ?, ?, ?)", [id, name, email, cipherPassword, contact], (err, results) => {
                        if (err) return res.status(500).json({ error: err.message });
                        else return res.json(results);
                    });
                } catch (error) {
                    return res.status(500).json({ error: error });
                }
            });
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

users.delete("/attendant/doctor", (req, res) => {
    const id = (req.query && req.query.id ? req.query.id : null);
    if (!id || id==null) return res.status(404).json({ error: "ID do Médico Inválido." });
    try {
        sql.query("DELETE FROM doctor WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Médico não encontrado" });
            sql.query("DELETE FROM user WHERE id = ?", [id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                return res.json({ message: "Médico eliminado com sucesso" });
            });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});




/* DOCTOR  */

/* ------ GESTÃO PACIENTES */

users.get("/doctor/patients", async (req, res) => {
    try {
        const doctorId = req.query.doctorId;
        if (!doctorId) return res.status(400).json({ error: "doctorId é obrigatório" });
        
        sql.query("SELECT * FROM patient WHERE doctor = ?", [doctorId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/* MÉDICO 

users.get("/medico/patients", async (req, res) => {
    const doctor = (req.query && req.query.doctor ? req.query.doctor : null);
    if (!doctor || doctor==null) return res.status(404).json({ error: "ID do Médico Inválido." });
    try {
        sql.query("SELECT * FROM patient WHERE doctor = ?", [doctor], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            else return res.json(results);
        });        
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

users.get("/medico/patient", async (req, res) => {
    const doctor = (req.query && req.query.doctor ? req.query.doctor : null);
    if (!doctor || doctor==null) return res.status(404).json({ error: "ID do Médico Inválido." });
    const patient = (req.query && req.query.patient ? req.query.patient : null);
    if (!patient || patient==null) return res.status(404).json({ error: "ID do Utente Inválido." });
    try {
        sql.query("SELECT * FROM patient WHERE doctor = ? AND id = ?", [doctor, patient], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            else return res.json(results);
        });      
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

*/

module.exports = users;