const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const util = require('util');
const jwt = require('jsonwebtoken');
const jwtVerify = util.promisify(jwt.verify);
var functions = {};

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true 
}));

functions.verifyToken = async (token, req) => {
    if (!token) {
        console.error('No Token Provided.');
        return false;
    }

    try {
        const decoded = await jwtVerify(token, 'project');
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            type: decoded.type
        };
        return true;
    } catch (error) {
        console.error('Not authorized!', error);
        return false;
    }
}


functions.createToken = async(data) => {
    try {
        const token = await jwt.sign(
            data,
            "project",
            { expiresIn: "1h" }
        )
        return token;
    } catch (err) {
        throw err;
    }
}

module.exports = functions