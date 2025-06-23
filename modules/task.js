const express = require('express');
const app = express();
const sql = require('../modules/pool');
const path = require('path');
const fs = require('fs');
var functions = {};

functions.createAllTasks = async(patient, process, surgery) => {
    sql.query("SELECT task FROM acesstasks WHERE process=?", [process], async(err, results) => {
        if (err) return false;
        results.map(result =>
            sql.query("SELECT * FROM task WHERE id=?", [result.task], async(err, results) => {
                if (err) return false;
                const interval = results[0].interval;
                const surgeryDate = new Date(surgery);
                let finalDate = new Date(surgeryDate);
                finalDate.setDate(finalDate.getDate() + interval);
                const formattedDate = finalDate.toISOString().split('T')[0];
                sql.query("INSERT INTO state (patient, task, create_date, done) VALUES (?, ?, ?, ?)", [patient, result.task, formattedDate, 0], (err, results) => {
                    if (err) return false;
                    return true;
                });
            }) 
        );
    })
}

functions.createFileName = async() => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';  
    let token = '';

    for (let i = 0; i < 2; i++) token += letters[Math.floor(Math.random() * letters.length)];
    for (let i = 0; i < 2; i++) token += numbers[Math.floor(Math.random() * numbers.length)];
    for (let i = 0; i < 2; i++) token += letters[Math.floor(Math.random() * letters.length)];
    token += "-";
    for (let i = 0; i < 2; i++) token += letters[Math.floor(Math.random() * letters.length)];
    for (let i = 0; i < 2; i++) token += numbers[Math.floor(Math.random() * numbers.length)];
    for (let i = 0; i < 2; i++) token += letters[Math.floor(Math.random() * letters.length)];
    token += "-";
    for (let i = 0; i < 2; i++) token += letters[Math.floor(Math.random() * letters.length)];
    for (let i = 0; i < 2; i++) token += numbers[Math.floor(Math.random() * numbers.length)];
    for (let i = 0; i < 2; i++) token += letters[Math.floor(Math.random() * letters.length)];
  
    return token;
}

functions.saveBase64Image = async(base64String) => {
  const base64Data = base64String.replace(/^data:image\/png;base64,/, '');
  const picName = await functions.createFileName();
  const outputPath = `../anexos/fotografias/${picName}.png`;
  
  fs.writeFileSync(path.join(__dirname, outputPath), base64Data, 'base64');

  return (picName+".png");
}

module.exports = functions;