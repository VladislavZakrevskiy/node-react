const express = require( 'express')
const { check } = require('express-validator')
const router = express.Router()
const userController = require("../controller/controller.users")
const authMiddleWare = require('../middlware/authMiddleWare')


router.post('/reg',[
    check('username', 'Имя не может быть пустым').notEmpty(),
    check('password', 'пароль должен быть больше 4 и меньше 30 символов').isLength({min: 4, max: 30})
], userController.registration)//{username, password, address, telephone, date_birth, email}
router.post('/login', userController.login)//{username, password}
router.post('/byId', authMiddleWare, userController.getUserById)//{id}
router.post('/byName', authMiddleWare, userController.getUserByName)//{username}
router.get('/allUsers', userController.getAllUsers)//*
router.delete('/delete', authMiddleWare, userController.deleteUser)//{id}
router.patch('/update', authMiddleWare, userController.updateUser)//{user_id,username, address, telephone, email}

module.exports = router