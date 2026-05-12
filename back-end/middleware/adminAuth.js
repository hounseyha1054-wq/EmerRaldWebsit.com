import jwt from 'jsonwebtoken'

const adminAuth=async(req,res)=>{
        const token = req.headers.authorization

        if(!token){
            return res.status(401).json({message:"Unauthorized user!"})
        }
        const token_decode= jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(token_decode.email !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(401).json({status:false,message:"Unauthorized user!"})
        }
        next()

}
export default adminAuth