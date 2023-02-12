const db = require('../db')
const path = require('path');


class imageController {
    async uploadImg(req,res) {
        const {username} = req.body
        const { filename, mimetype, size } = req.file;
        const filepath = req.file.path
        db
        .query('insert into image_files (filename, filepath, mimetype,size, user_id) values ($1,$2,$3,$4, (select user_id from users where user_name = $5)) ', [filename, filepath, mimetype, size, username])
        .then(() => 
            res.json({ success: true, filename }))
        .catch(err =>{
                console.log(err)
                res.status(400).json({ success: false, message: 'upload failed', stack: err.stack })
            }
        );
    }

    async loadImg(req, res){
        const { username} = req.body;  
        console.log(username) 
        const images = await db.query('select * from image_files where user_id = (select user_id from users where user_name = $1)', [username]) 

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
}

module.exports = new imageController()