import express from 'express'

import { Adminlogin } from '../controller/userController.js'
const UserRouter = express.Router()

UserRouter.post('/admin',Adminlogin)
 

export default UserRouter