const db = require('../db')
const bcrypt = require('bcryptjs')
const {v4} =require('uuid') 
const {secret} = require('../config')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')

async function generateAccessToken(userId){
    const user = await db.query('select * from users where user_id = $1', [userId])
    const payload = {
    userId
    }
    const options = {expiresIn: '1m'}
    const token = jwt.sign(payload,secret,options)
    return token
}

class usersController {//y
    async registration(req, res) {
    
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message:'Ошибка при регистрации', errors})
                return;
            }
            const {username, password, address, telephone, date_birth, email} = req.body
            const candidate =await db.query('select * from users where user_name = $1', [username])
            
            if(  !candidate.rows[0]){
                const hashPassword = bcrypt.hashSync(password, 7)
                const id = v4()
                const user = await db.query(
                    'insert into users (user_id, user_name, password, address, telephone, date_birth, email) values ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
                    [id,username, hashPassword, address, telephone, date_birth, email])
                    res.json( user.rows[0])
            }
            else res.status(403).json('Такой пользователь есть ')
            
        } catch (error) {
            console.log(error)
            res.status(401).json("Заполните все поля")
        }
    }

    async login(req, res) {//y
        try {
            const {username, password} = req.body
            const user = await db.query('select * from users where user_name = $1',
            [username])
            if(!user.rows[0]){
                
                res.status(403).json(`Пользователь ${username} не найден`)
                return
            }
            const validPassword = bcrypt.compareSync(password,  user.rows[0].password)
            if(!validPassword){
                return res.status(400).json( `Неверный пароль`) 
            }
            const accessToken = await generateAccessToken(user.rows[0].user_id)
            res.json({token: accessToken, username:user.rows[0].user_name})
            return;
        } catch (error) {
            console.log(error)
            res.status(401).json(error)
        }
        
    }

    async getUserById(req,res ) {//y
        try {
            const {id} = req.body
            const user = await db.query('select * from users where user_id = $1', [id])
            res.json(user.rows[0])
        } catch (error) {
            console.log(error)
            res.status(403).json(error)
        }   
    }

    async getUserByName(req,res ) {//y
        try {
            const {username} = req.body
            const user = await db.query('select * from users where user_name = $1', [username])
            res.json(user.rows[0])
        } catch (error) {
            console.log(error)
            res.status(403).json(error)
        }
    }

    async getAllUsers(req,res ) {//y
        const users = await db.query('select * from users' )
        res.json(users.rows)
    }

    async deleteUser(req, res) {
        try {
            const {username} = req.body
            const user = db.query('delete from users where user_name = $1', [username])
            res.json(user)
        } catch (error) {
            console.log(error)
            res.status(403).json(error)
        }
    }

    async updateUser(req, res) {
        try {
            
            const {old_username,new_username , address, telephone, email} = req.body
            console.log([old_username,new_username , address, telephone, email])
            const user = await db.query('update users set user_name = $1, address = $2, telephone = $3, email = $4 where user_name= $5',
            [new_username, address, telephone, email,old_username])
            res.json(user.rows[0])

        } catch (error) {
            console.log(error)
            res.status(403).json(error)
        }
    }
}

module.exports = new usersController()