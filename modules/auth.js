const util = require('util')
const sql = require('../modules/pool');
const sqlQuery = util.promisify(sql.query).bind(sql);
const jwt = require('../modules/jwt');
var functions = {};

functions.LoginPatient = async function(id) {
    try {
        const results = await sqlQuery('SELECT * FROM patient WHERE id=?', [id]);
        if (results.length === 0) return null;
        const patient = results[0];
        const token = jwt.createToken({id: patient.id, name: patient.name, email: patient.email, contact: patient.contact, doctor: patient.doctor, process: patient.process, surgery: patient.surgery, type:"patient"});
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

functions.LoginDoctor = async function(id) {
     try {
        const results = await sqlQuery('SELECT * FROM doctor WHERE id=?', [id]);
        if (results.length === 0) return null;
        const doctor = results[0];
        const token = jwt.createToken({id: doctor.id, name: doctor.name, email: doctor.email, password: doctor.password, contact: doctor.contact, type:"doctor"});
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

functions.LoginAttendant = async function(id) {
    try {
        const results = await sqlQuery('SELECT * FROM attendant WHERE id=?', [id]);
        if (results.length === 0) return null;
        const attendant = results[0];
        const token = jwt.createToken({id: attendant.id, entity: attendant.entity, email: attendant.email, password: attendant.password, type:"attendant"});
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

functions.createToken = async function() {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';  
    let token = '';

    for (let i = 0; i < 6; i++) token += letters[Math.floor(Math.random() * letters.length)];
    for (let i = 0; i < 6; i++) token += numbers[Math.floor(Math.random() * numbers.length)];
    token = token.split('').sort(() => 0.5 - Math.random()).join('');
  
    return token;
}

functions.assignToken = async function(){
    const token = await functions.createToken();
    const results = await sql.query('SELECT * FROM patient WHERE token=?', [token]);
    if (results.length > 0) { functions.assignToken(); }
    return token;
}

module.exports = functions;