//Cargar la libreria con la conexion a la bd
var sql = require('./bd');

//constructor
var Moneda = function (moneda) {
    this.id = moneda.Id;
    this.moneda = moneda.Moneda;
    this.sigla = moneda.Sigla;
    this.simbolo = moneda.Simbolo;
    this.emisor = moneda.Emisor;
}

//Metodo que obtiene un registro basado en la clave primaria
Moneda.obtener = (idMoneda, resultado) => {
    sql.query(`SELECT * FROM Moneda WHERE Id=${idMoneda};`, (err, res) => {
        //Verificar si hubo error ejecutando la consulta
        if (err) {
            console.log("Error consultando una moneda:", err);
            resultado(err, null);
            return;
        }
        //La consulta devuelve resultados
        if (res.length) {
            console.log("Moneda encontrada :", res[0]);
            resultado(null, res[0]);
            return;
        }
        //No se encontraron registros
        resultado({ tipo: "No encontrado" }, null);
    });
}

//Metodo que obtiene la lista de monedas
Moneda.listar = (resultado) => {
    sql.query('CALL spListarMonedas;', (err, res) => {
        //Verificar si hubo error ejecutando la consulta
        if (err) {
            console.log("Error consultando lista de monedas:", err);
            resultado(err, null);
            return;
        }
        //La consulta devuelve resultados
        console.log("Lista de monedas encontradas :", res[0]);
        resultado(null, res[0]);
    });
}

//Metodo que actualiza un registro 
Moneda.actualizar = (moneda, resultado) => {
    sql.query('CALL spActualizarMoneda(?, ?, ?, ?, ?);', //consulta sql
        [moneda.id, moneda.moneda, moneda.sigla, moneda.simbolo, moneda.emisor], //parametros
        (err, res) => {
            //Verificar si hubo error ejecutando la consulta
            if (err) {
                console.log("Error actualizando moneda:", err);
                resultado(err, null);
                return;
            }
            //La consulta no afectó registros
            if (res.affectedRows == 0) {
                //No se encontraron registros
                resultado({ tipo: "No encontrado" }, null);
                return;
            }

            console.log("Moneda actualizada :", moneda);
            resultado(null, moneda);

        });
}

//Metodo que elimina un registro 
Moneda.eliminar = (idMoneda, resultado) => {
    sql.query('DELETE FROM Moneda WHERE Id = ?', idMoneda, (err, res) => {
        //Verificar si hubo error ejecutando la consulta
        if (err) {
            console.log("Error eliminando la moneda:", err);
            resultado(err, null);
            return;
        }
        //La consulta no afectó registros
        if (res.affectedRows == 0) {
            //No se encontraron registros
            resultado({ tipo: "No encontrado" }, null);
            return;
        }

        console.log("Moneda eliminida con id :", idMoneda);
        resultado(null, res);
    });
}


module.exports = Moneda;