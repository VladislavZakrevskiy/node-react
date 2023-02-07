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
            const candidate = db.query('select * from users where user_name = $1', [username])
            if(!candidate){
                const hashPassword = bcrypt.hashSync(password, 7)
                const id = v4()
                const user = await db.query(
                    'insert into users (user_id, user_name, password, address, telephone, date_birth, email) values ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
                    [id,username, hashPassword, address, telephone, date_birth, email])
                res.json( user.rows[0])
            }
            else res.json('Такой пользователь есть')
        } catch (error) {
            console.log(error)
            res.json("Server Error")
        }
    }

    async login(req, res) {//y
        try {
            const {username, password} = req.body
            const user = await db.query('select * from users where user_name = $1',
            [username])
            if(!user){
                return res.json(`Пользователь ${username} не найден`)
            }
           
            const validPassword = bcrypt.compareSync(password,  user.rows[0].password)
            if(!validPassword){
                return res.status(400).json({message: `Неверный пароль `}) 
            }
            const accessToken = await generateAccessToken(user.rows[0].user_id)
            res.json(accessToken)
            return;
        } catch (error) {
            console.log(error)
            res.json(error)
        }
        
    }

    async getUserById(req,res ) {//y
        try {
            const {id} = req.body
            const user = await db.query('select * from users where user_id = $1', [id])
            res.json(user.rows[0])
        } catch (error) {
            console.log(error)
            res.json(error)
        }   
    }

    async getUserByName(req,res ) {//y
        try {
            const {username} = req.body
            const user = await db.query('select * from users where user_name = $1', [username])
            res.json(user.rows[0])
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async getAllUsers(req,res ) {//y
        const users = await db.query('select * from users' )
        res.json(users.rows)
    }

    async deleteUser(req, res) {
        try {
            const {id} = req.body
            const user = db.query('delete from users where user_id = $1', [id])
            res.json(user)
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }

    async updateUser(req, res) {
        try {
            
            const {user_id,username, address, telephone, email} = req.body
            const user = await db.query('update users set user_name = $1, address = $2, telephone = $3, email = $4 where user_id= $5',
            [username, address, telephone, email,user_id])

        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
}

module.exports = new usersController()