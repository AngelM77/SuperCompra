function onDeviceReady() {
    tareas.Tablas();
    tareas.Consultar();
}

function inicio() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

var tareas = new Tareas();

function Tareas (){};

Tareas.prototype.CrearDB = function() {
    var nombrecorto = 'SuperCompra';
    var version = '1.0';
    var nombrebase = 'SuperCompra';
    var size = 1*1024*1024;
    var db = openDatabase(nombrecorto, version, nombrebase, size);

    return db;
};

Tareas.prototype.Tablas = function() {
    var db, SqlSuper, SqlPaquete, SqlArticulos, SqlPrecios, SqlLista;

    db = tareas.CrearDB();

    SqlSuper = 'CREATE TABLE IF NOT EXISTS super (id UNSIGNED INT NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, nombre VARCHAR(45) NOT NULL)';
    SqlPaquete = 'CREATE TABLE IF NOT EXISTS paquete (id UNSIGNED INT NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, internos UNSIGNED SMALLINT(5) NOT NULL, peso UNSIGNED MEDIUMINT(8) NOT NULL, unidad VARCHAR(2) NOT NULL)';
    SqlArticulos = 'CREATE TABLE IF NOT EXISTS articulos (id UNSIGNED INT NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, nombre VARCHAR(45) NOT NULL, paquetePeso TINYINT(1) UNSIGNED NULL, unidad VARCHAR(2) NULL, idPaquete UNSIGNED INT NULL)';
    SqlPrecios = 'CREATE TABLE IF NOT EXISTS precios (id UNSIGNED INT NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, idArticulo UNSIGNED INT NOT NULL, idSuper UNSIGNED INT, precio UNSIGNED DECIMAL NOT NULL)';
    SqlLista = 'CREATE TABLE IF NOT EXISTS lista (id UNSIGNED INT NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, idArticulo UNSIGNED INT NOT NULL, idPrecio UNSIGNED INT NULL, cantidad SMALLINT(5) UNSIGNED NULL)';

    db.transaction(function(tx) {
        tx.executeSql(SqlSuper);
        tx.executeSql(SqlPaquete);
        tx.executeSql(SqlArticulos);
        tx.executeSql(SqlPrecios);
        tx.executeSql(SqlLista);
    });
};

Tareas.prototype.Consultar = function() {
    var db, SqlConsulta;

    db = tareas.CrearDB();
    SqlConsulta = 'SELECT id, articulos.nombre AS articulo FROM lista INNER JOIN articulos ON lista.idArticulo=articulos.id;';

    db.transaction(function(tx) {
        tx.executeSql(SqlConsulta, [], function(tx, results) {
            cantidad = results.rows.length;
            if(cantidad === 0) {
                
            }else{
                var cuerpo = document.getElementById('cuerpo');
                cuerpo.innerHTML = '';

                for(i=0; i<cantidad; i++) {
                    task = results.rows.item(i);

                    cuerpo.innerHTML += task.articulo + '<br />';
                }
            }
        });
    });
}