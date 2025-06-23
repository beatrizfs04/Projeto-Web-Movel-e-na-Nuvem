/* Requirements */
const path = require('path');
const express = require('express');
const app = express();

const auth = require('./api/auth');
const docs = require('./api/docs');
const tasks = require('./api/tasks');
const users = require('./api/users_info');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ 
  extended: true,
  limit: '50mb'
}));

/* Web */
app.use('/fotos', express.static(path.join(__dirname, '/anexos/fotografias')));
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, '/views/2-auth/login.html'));});

app.get('/atendente', (req, res) => {res.sendFile(path.join(__dirname, '/views/atendente/utentes.html'));});
app.get('/atendente/medicos', function(req, res) { res.sendFile(path.join(__dirname, '/views/atendente/medicos.html')) });
app.get('/atendente/novo_user', function(req, res) { res.sendFile(path.join(__dirname, '/views/atendente/novo_user.html')) });

app.get('/medico', (req, res) => {res.sendFile(path.join(__dirname, '/views/medico/utentes.html'));});
app.get('/medico/dados', function(req, res) { res.sendFile(path.join(__dirname, '/views/medico/dados.html')) });
app.get('/medico/documentos', function(req, res) { res.sendFile(path.join(__dirname, '/views/medico/documentos.html')) });

app.get('/utente', (req, res) => {res.sendFile(path.join(__dirname, '/views/utente/tarefas.html'));});
app.get('/utente/tarefas', function(req, res) { res.sendFile(path.join(__dirname, '/views/utente/tarefas.html')) });
app.get('/utente/formulario', function(req, res) { res.sendFile(path.join(__dirname, '/views/utente/tarefas/formulario.html'))});
app.get('/utente/fotografia', function(req, res) { res.sendFile(path.join(__dirname, '/views/utente/tarefas/fotografia.html'))});
app.get('/utente/tutoriais', function(req, res) { res.sendFile(path.join(__dirname, '/views/utente/tutoriais.html')) });

app.get('/404', function(req, res) { res.sendFile(path.join(__dirname, '/views/404.html')) });

app.get('/logout', (req, res) => {
  res.clearCookie('userToken');
  res.redirect('/');
});

/* API */
app.use('/api/auth/', auth);
app.use('/api/docs/', docs);
app.use('/api/tasks/', tasks);
app.use('/api/users_info/', users);

/* Assets */
app.use('/exercise', function(req, res) { res.sendFile(path.join(__dirname, 'anexos/exemplos/1.jpg'));});
app.use('/logo', function(req, res) { res.sendFile(path.join(__dirname, '/views/1-assets/images/logo_sns.png'));});
app.use('/404logo', function(req, res) { res.sendFile(path.join(__dirname, '/views/1-assets/images/manutencao.png'));});

app.use('/styles', function(req, res) { res.sendFile(path.join(__dirname, '/views/1-assets/styles/default.css'));});
app.use('/styles-form', function(req, res) { res.sendFile(path.join(__dirname, '/views/1-assets/styles/formulario.css'));});
app.use('/styles-login', function(req, res) { res.sendFile(path.join(__dirname, '/views/1-assets/styles/login.css'));});
app.use('/styles-font', function(req, res) { res.sendFile(path.join(__dirname, '/views/1-assets/styles/font-awesome.css'));});

app.use('/script/session', function(req, res) { res.sendFile(path.join(__dirname, '/views/1-assets/scripts/session.js'));});

app.use((req, res) => {
    res.redirect('/404');
});

/* ON LOAD */
app.listen(5000, () => { console.log(`> http://localhost:5000`) });