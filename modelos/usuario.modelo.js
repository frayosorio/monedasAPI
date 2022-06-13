//Cargar la libreria con la conexion a la bd
var sql = require('./bd');

var seg = require('../configuracion/seguridad.config');
//Cargar la libreria de encriptación
const Bcrypt = require('bcrypt');
//Cargar la libreria de firmado
const jwt = require('jsonwebtoken');

//constructor
var Usuario = function (usuario) {
    this.id = usuario.Id;
    this.usuario = usuario.Usuario;
    this.nombre = usuario.Nombre;
}

//Metodo que actualiza las credenciales de un usuario
Usuario.cambiarClave = (usuario, clave, resultado) => {
    sql.query("CALL spActualizarClaveUsuario( ?, ?);",
        [usuario, Bcrypt.hashSync(clave, 10)], (err, res) => {//Verificar si hubo error ejecutando la consulta
            //Verificar si hubo error ejecutando la consulta
            if (err) {
                console.log("Error actualizando usuario:", err);
                resultado(err, null);
                return;
            }
            //La consulta no afectó registros
            if (res.affectedRows == 0) {
                //No se encontraron registros
                resultado({ tipo: "No encontrado" }, null);
                return;
            }

            console.log("Usuario actualizado :", { usuario });
            resultado(null, { usuario });
        });
}

function obtenerClave(usuario) {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT Nombre, Clave FROM Usuario WHERE Usuario='${usuario}';`, (err, res) => {
            //Verificar si hubo error ejecutando la consulta
            if (err) {
                return reject(err);
            } else {
                if (res.length === 0) {
                    return resolve('');
                }
                return resolve(res[0]);
            }
        });
    });
}

//Metodo que valida las credenciales de un usuario
Usuario.validarAcceso = async (usuario, clave, resultado) => {

    const usuarioEncontrado = await obtenerClave(usuario);

    if (usuarioEncontrado) {

        const claveGuardada = usuarioEncontrado.Clave;

        if (Bcrypt.compareSync(clave, claveGuardada)) {

            // Se firma la petición con jsonwebtoken
            const token = jwt.sign(
                { usuario: usuario },
                seg.CLAVE,
                { expiresIn: seg.VIGENCIA },
            );
            const data = JSON.stringify({
                mensaje: 'Autenticación correcta',
                usuario: usuarioEncontrado.Nombre,
                token: token
            });

            resultado(null, data);
            console.log("Usuario autorizado :", data);
        }
        else {
            resultado({ tipo: "Credenciales no válidas" }, null);
        }
    }
    else {
        resultado({ tipo: "No encontrado" }, null);
    }


    /*
    resultado({ tipo: "No encontrado" }, null);
    console.log("Credenciales no válidas");
    */
}


module.exports = Usuario;