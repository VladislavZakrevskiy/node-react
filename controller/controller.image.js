const db = require('../db')
const path = require('path');


class imageController {
    async uploadImg(req,res) {
        let {username, post_id} = req.body
        console.log(post_id)
        if(post_id){
            username = null
        }
        const { filename, mimetype, size } = req.file;
        const filepath = req.file.path
        db
        .query('insert into image_files (filename, filepath, mimetype,size, user_id, post_id) values ($1,$2,$3,$4, (select user_id from users where user_name = $5), $6) ', [filename, filepath, mimetype, size, username, post_id])
        .then(() => 
            res.json({ success: true, filename }))
        .catch(err =>{
                console.log(err)
                res.status(400).json({ success: false, message: 'upload failed', stack: err.stack })
            }
        );
    }

    async loadImg(req, res){
        const { username, post_id} = req.body;  
        let images
        if(post_id){
            images = await db.query('select * from image_files where post_id = $1', [post_id]) 
        }
        else {
            images = await db.query('select * from image_files where user_id = (select user_id from users where user_name = $1)', [username]) 
        }
        try {
            if (images.rows[0]) {
                const dirname = path.resolve();
                const fullfilepath = path.join(dirname, images.rows[0].filepath);
                return res.type(images.rows[0].mimetype).sendFile(fullfilepath);
              }
              return res.status(400).json({ success: false, message: 'not found'});
            
        } catch (error) {
            res.status(404).json({ success: false, message: 'not found', stack: err.stack })
        }
    }

    async deletePostImage(req,res){
        const {post_id} = req.body
        db.query('delete from image_files where post_id = $1', [post_id]).then(()=> res.json('ok')).catch(e=>res.json(e))
    }

    async deleteUserImage(req,res){
        const {username} = req.body
        db.query('delete from image_files where user_id = (select user_id from users where user_name = $1)', [username]).then(()=> res.json('ok')).catch(e=>res.json(e))
    }
}

module.exports = new imageController()