const express = require( 'express')
const router = express.Router()
const commentsController = require("../controller/controller.comments")
const authMiddleWare = require('../middlware/authMiddleWare')

router.get('/:id', authMiddleWare, commentsController.getAllComments)//{post_id}
router.post('/create', authMiddleWare, commentsController.createComment)//{post_id, email, name, body}
router.delete('/delete', authMiddleWare, commentsController.deleteComment)//{comments_id}
router.patch('/update', authMiddleWare, commentsController.updateComment)//{comments_id, email, body}

module.exports = router