const db = require('../db')
const {v4} =require('uuid') 

class postsController {
    async createPost(req,res){//y
        try {
            const {post_id,title, body, username, date_made} = req.body
            if(!post_id){
                post_id = v4()
            }
            const user = await db.query('select * from users where user_name = $1', [username])
            if(user){
                const post = await db.query('insert into posts (post_id, user_id, title, body, date_made) values ($1,$2,$3,$4,$5) returning *',
                [post_id, user.rows[0].user_id, title, body, date_made])
                res.json(post.rows[0])
                return
            }
            else {
                res.json("Server or data dase error")
                return
            }
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async deletePost(req,res){//y
        try {
            const {post_id} = req.body
            const post = await db.query('delete from posts where post_id = $1 returning *', [post_id])
            res.json(post.rows[0])
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async getPost(req,res){//y
        try {
            const {id} = req.params
            const post = await db.query('select * from posts where post_id = $1', [id])
            res.json(post.rows[0])
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async getPostsByUser(req,response){//y
        try {
            const {username,limit, page} = req.body
            console.log([username,limit,page])
            
            
            const posts = await db.query('select * from posts left join users on users.user_id = posts.user_id where user_name = $1' ,[username])
            let allPosts = await posts.rows
            let countPages = Math.ceil(allPosts.length/limit)
            if(limit < 0 ){
                response.json({arr:posts.rows})
                return
            }
            if(page>countPages){
                response.status(200).json()
                return
                 
            }
            let postList = [] 
            for(let i=0;i<countPages;i++){
                let arr = []
                for(let j=0;j<limit;j++){
                    arr.push(allPosts[0])
                    allPosts.splice(0,1)
                    }
                postList.push(arr)
                }
                let ans = postList[page-1].filter(el => typeof(el) == 'object')
                response.json({arr: ans, leng: posts.rowCount}) 
            }
            catch (error) {
            console.log(error)
            response.status(403).json(error)
        }
    }

    async updatePost(req,res) {//y
        try {
            const {title, body, post_id} = req.body
            const post = await db.query('update posts set title = $1, body = $2 where post_id = $3',
            [title, body, post_id])
            res.json(post.rows)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

}

module.exports = new postsController()