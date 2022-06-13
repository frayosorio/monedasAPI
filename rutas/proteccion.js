const express = require('express');
const proteccion = express.Router(); 
var seg = require('../configuracion/seguridad.config');
//Cargar la libreria de firmado
const jwt = require('jsonwebtoken');

proteccion.use((req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
      jwt.verify(token, seg.CLAVE, (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token no válido' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Falta el Token' 
      });
    }
 });

 module.exports = proteccion;