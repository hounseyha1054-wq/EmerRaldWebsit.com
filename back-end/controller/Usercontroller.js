import jwt from 'jsonwebtoken'
const  Adminlogin=async(req,res)=>{
     try {

        const {email,password}=req.body
        if(email==process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASSWORD){
            const token = jwt.sign({email,password},process.env.JWT_SECRET_KEY)
            return res.status(200).json({message:"Admin login successfully", token})
        }else{
            return res.status(401).json({message:"Invalid email or password"})
        }
        
    } catch (error) {
        res.status(500).json({message:"Admin is not working"})
    }
}

export {Adminlogin}