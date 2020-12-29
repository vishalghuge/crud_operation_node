const express = require('express')
const router = express.Router()
const userController = require('../controller/usercontroller');
const multer  = require('multer');
var path = require('path')

router.use(express.static(path.join(__dirname, 'uploads')));

router.post('/add', userController.create);
router.get('/alllist', userController.findAll);
router.post('/update/:id', userController.update);
router.post('/delete/:id', userController.delete);
router.post("/upload",userController.uploadimage);



module.exports = router