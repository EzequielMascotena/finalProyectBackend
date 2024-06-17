const { Router } = require('express');

const UserManager = require('../controllers/managers/UserManager')
const uploader = require('../utils/multer')

const router = new Router()
const userManager = new UserManager();

router.get('/current', userManager.getCurrentUser)
router.get('/premium/:uid', userManager.switchUserRole)

// Ruta para subir documentos
router.post('/:uid/documents', uploader.array('documents'), userManager.addFiles)

// Ruta para subir perfiles
router.post('/:uid/profile', uploader.array('profile'), userManager.addProfile)

// Ruta para subir productos
router.post('/:uid/product', uploader.array('product'), userManager.addProduct)


module.exports = router