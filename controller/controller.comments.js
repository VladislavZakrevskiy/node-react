const { v4 } = require('uuid')
const db = require('../db')

class commentsController {//y
    async getAllComments(req,res) {
        const {post_id} = req.body
        const comments = await db.query('select * from comments where post_id = $1', [post_id])
        res.json(comments.rows)
    }

    async createComment(req,res) {//y
        try {
            const {post_id, email, name, body} = req.body
            const comments_id = v4()
            const comment = await db.query('insert into comments (comments_id, post_id, email, name, body) values ($1,$2,$3,$4,$5)',
            [comments_id,post_id, email, name, body])
            res.json(comment.rows[0])

        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async deleteComment(req,res) {//y
        try {
            const {comments_id} = req.body
            const comment = await db.query('delete from comments where comments_id = $1', [comments_id])
            res.json(comment.rows[0])
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async updateComment(req,res) {//y
        try {
            const {comments_id, email, body} = req.body
            const comment = await db.query('update comments set email = $1, body = $2 where comments_id = $3 ',
            [email, body, comments_id])
            res.json(comment.rows)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
}

module.exports = new commentsController()