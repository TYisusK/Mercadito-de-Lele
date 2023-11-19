var multer=require("multer");
var fs = require("fs");

function subirArchivo(){
    var storage= multer.diskStorage({
        destination: './Web/images',
        filename: (req,file,cb)=>{
            console.log(file.originalname);
            var archivo = Date.now()+file.originalname;
            cb(null,archivo);
        }
    });
    return multer({storage}).single('foto');
}

function eliminarArchivo(archivo) {
  return async (req, res, next) => {
    try {
      fs.unlinkSync(`./Web/images/${archivo}`);
      next();
    } catch (err) {
      console.error("Error al eliminar el archivo: " + err);
      res.status(500).send("Error al eliminar el archivo.");
    }
  };
}

//-----------------------------Productos--------------------------

function subirArchivoProd(){
    var storage= multer.diskStorage({
        destination: './Web/imagesProd',
        filename: (req,file,cb)=>{
            console.log(file.originalname);
            var archivoProd = file.originalname;
            cb(null,archivoProd);
        }
    });
    return multer({storage}).single('foto');
}

function eliminarArchivoProd(archivo) {
    return async (req, res, next) => {
      try {
        fs.unlinkSync(`./Web/imagesProd/${archivo}`);
        next();
      } catch (err) {
        console.error("Error al eliminar el archivo de Producto: " + err);
        res.status(500).send("Error al eliminar el archivo de Producto");
      }
    };
  }

module.exports={
    subirArchivo,
    eliminarArchivo,
    subirArchivoProd,
    eliminarArchivoProd
}


