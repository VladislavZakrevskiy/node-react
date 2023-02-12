const express = require( 'express')
const router = express.Router()
const postsController = require("../controller/controller.posts")
const authMiddleWare = require('../middlware/authMiddleWare')

router.post('/create', authMiddleWare, postsController.createPost)//{title, body, user_id, date_made}
router.post('/delete', authMiddleWare, postsController.deletePost)//{post_id}
router.get('/:id', authMiddleWare, postsController.getPost)//*
router.post('/getByUser',authMiddleWare, postsController.getPostsByUser)//{user_id}
router.patch('/update', authMiddleWare, postsController.updatePost)//{title, body, post_id}

module.exports = router