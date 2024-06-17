const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    // Ubicación del directorio destino
    destination: function(req, file, cb) {
        let folder = 'documents';
        
        if (file.fieldname === 'profile') {
            folder = 'profiles';
        } else if (file.fieldname === 'product') {
            folder = 'products';
        }

        cb(null, path.join(__dirname, `/public/img/${folder}`));
    },
    // Nombre del archivo
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});


const uploader = multer ({
    storage,
    // validacion
    onError: function (err, next){
        console.log(err);
        next()
    }
})

module.exports = uploader


