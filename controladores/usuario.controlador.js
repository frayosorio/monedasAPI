//Cargar el modelo de las paises
var Usuario = require('../modelos/usuario.modelo');

//Metodo web para actualizar clave de un usuario
exports.cambiarClave = (req, res) => {
    //validar que la solicitud tenga datos
    if (!req.body) {
        res.status(400).send({ message: 'El contenido del mensaje debe tener las credenciales a actualizar' });
    }

    Usuario.cambiarClave(req.body.Usuario, req.body.Clave, (err, data) => {
        //Verificar si hubo error
        if (err) {
            if (err.tipo == "No encontrado") {
                res.status(404).send({ message: 'Usuario no existente' });
            }
            else {
                res.status(500).send({ message: 'Error cambiando clave del usuario' });
            }
        }
        else {
            //Se devuelve los registros obtenidos
            res.send(data[0]);
        }
    });
}

//Metodo web para validar credenciales de un usuario
exports.validarAcceso = (req, res) => {
    //validar que la solicitud tenga datos
    if (!req.body) {
        res.status(400).send({ message: 'El contenido del mensaje debe tener las credenciales de acceso' });
    }

    Usuario.validarAcceso(req.body.Usuario, req.body.Clave, (err, data) => {
        //Verificar si hubo error
        if (err) {
            if (err.tipo == "No encontrado") {
                res.status(404).send({ mensaje: 'Usuario no encontrado' });
            }
            else {
                res.status(500).send({ mensaje: 'Credenciales no válidas' });
            }
        }
        else {
            //Se devuelve la autorización
            res.send(data);
        }
    });
}