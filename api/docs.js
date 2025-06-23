const express = require('express');
const app = express();
var doc = express.Router();
const sql = require('../modules/pool');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

doc.post("/doctor/documento", async (req, res) => {
    try {
        const {doctorId, name, path} = req.body;
        if (!doctorId || !name || !path) return res.status(400).json({ error: "Falta um parâmetro obrigatório" });
        
        sql.query("INSERT INTO document (doctor, name, path) VALUES (?, ?, ?)", [doctorId, name, path], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

doc.get("/doctor/documentos", async (req, res) => {
    try {
        const doctorId = req.query.doctorId;
        if (!doctorId) return res.status(400).json({ error: "doctorId é obrigatório" });
        
        sql.query("SELECT * FROM document WHERE doctor = ?", [doctorId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

doc.delete("/doctor/docDelete", async (req, res) => {
    const id = (req.query && req.query.id ? req.query.id : null)
    if (!id || id==null) return res.status(404).json({ error: "ID do Documento Inválido." });
    try{
        sql.query("DELETE * FROM document WHERE document.id = ?", [id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            else return res.json(results);
        });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

module.exports = doc;