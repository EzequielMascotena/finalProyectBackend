const { Router } = require('express');

const handlePolicies = require('../utils/middlewares')

const UserManager = require('../controllers/managers/UserManager')
const uploader = require('../utils/multer')

const router = new Router()
const userManager = new UserManager();

router.get('/current', userManager.getCurrentUser)
router.get('/premium/:uid', userManager.switchUserRole)

router.get('/', userManager.getAllUsers)

router.delete('/', userManager.deleteInactiveUsers);

// Ruta para subir documentos
router.post('/:uid/documents', uploader.array('documents', 3), userManager.addFiles)

// Ruta para subir perfiles
router.post('/:uid/profile', uploader.array('profile', 3), userManager.addProfile)

// Ruta para subir productos
router.post('/:uid/product', uploader.array('product', 6), userManager.addProduct)

//Rutas para el Admin
router.get('/admin', handlePolicies('admin'), userManager.viewUsers);
router.post('/admin/role/:uid', userManager.changeUserRole);
router.delete('/admin/:uid', userManager.deleteUser);
//ruta para simular el delete deesde HBS
router.post('/admin/:uid', userManager.deleteUser);


module.exports = router