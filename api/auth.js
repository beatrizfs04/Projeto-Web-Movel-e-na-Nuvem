const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const auth = express.Router();
const bcrypt = require('bcrypt');
const sql = require('../modules/pool');
const jwt = require('../modules/jwt');
const util = require('util');
const authFunctions = require('../modules/auth');

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true 
}));

// Middleware para verificar autorização
auth.get('/isAuthorized', async (req, res) => {
    try {
        const isAuthorized = await jwt.verifyToken(req.cookies?.userToken, req);
        if (!isAuthorized) return res.status(401).json({ error: "Sessão Inválida, Sem Acesso." });
        return res.status(200).json({message: 'Utilizador autenticado com sucesso.', user: req.user})
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Rota de login para pacientes (link)
auth.post('/login/patient', async (req, res) => {
    const { id, token } = req.body;
    if (!id || !token) return res.status(400).json({ error: 'Parâmetros de login inválidos' });
    try {
        const userResults = await new Promise((resolve, reject) => { sql.query('SELECT id, token FROM patient WHERE id=? AND token=?', [id, token], (err, results) => { if (err) reject(err); resolve(results); }); });
        if (userResults.length === 0) return res.status(401).json({ error: 'Credenciais inválidas ou usuário não encontrado' });
        const userToken = await authFunctions.LoginPatient(id);
        setSecureCookie(res, userToken);
        return res.status(200).json({
            message: "Paciente autenticado com sucesso!",
            redirect: '/utente'
        });
    } catch (error) {
        console.error('Patient login error:', error);
        return res.status(500).json({ error: 'Erro durante o processo de login' });
    }
});

// Rota de login para médicos e atendentes (form)
auth.post('/login/staff', async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        if (!email || !password || !userType) return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        if (!['doctor', 'attendant'].includes(userType)) return res.status(400).json({ error: 'Tipo de usuário inválido' });
        try {
            let staffResults;
            if (userType === 'doctor') staffResults = await new Promise((resolve, reject) => { sql.query(`SELECT d.id, d.password, u.id as user_id FROM doctor d JOIN user u ON d.id = u.id WHERE d.email=? AND u.type='doctor'`, [email], async (err, results) => { if (err) {reject(err);} resolve(results); }); });
            else staffResults = await new Promise((resolve, reject) => { sql.query(`SELECT a.id, u.id as user_id FROM attendant a JOIN user u ON a.id = u.id WHERE a.email=? AND a.password=? AND u.type='attendant'`, [email, password], (err, results) => { if (err) reject(err); resolve(results); }); });
            
            if (staffResults.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });
            if (userType === 'doctor') { if (!await bcrypt.compare(password, staffResults[0].password)) { return res.status(401).json({ error: 'Credenciais inválidas' }); } }

            const userId = staffResults[0].user_id; let userToken;
            
            if (userType === "doctor") {userToken = await authFunctions.LoginDoctor(userId); type = 'medico';}
            else {userToken = await authFunctions.LoginAttendant(userId); type = 'atendente';}
            
            setSecureCookie(res, userToken);
            return res.status(200).json({
                message: "Autenticação bem-sucedida!",
                userType,
                redirect: `/${type}`
            });
        } catch (error) {
            console.error('Staff login error:', error);
            return res.status(500).json({ error: 'Erro durante o processo de login' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro durante o processo de login' });
    }
});

// Rota de logout
auth.post('/logout', (req, res) => {
    res.clearCookie('userToken');
    return res.status(200).json({ message: 'Logout realizado com sucesso' });
});

// configura cookies
function setSecureCookie(res, token) {
    res.cookie('userToken', token, { 
        httpOnly: true, 
        secure: false,
        maxAge: 3600000
    });
}

module.exports = auth;