import {compare} from 'bcrypt';
import {sign} from 'jsonwebtoken'
import cookie from 'cookie'
import getUser from 'src/api/getUser'

export function setLoginJWTHeader(res, user :any){
  console.log(process.env.SECRET)
  const claims = {sub: user._id.toString(),email:user.email,name:user.name,admin:user.admin}
  const jwt = sign(claims,process.env.SECRET, { expiresIn: '6h' })
  var userCookieData =JSON.stringify({name:user.name,email:user.email})
  res.setHeader('Set-Cookie',[
    cookie.serialize('auth',jwt,{ // Handles Authentication
      httpOnly:true, 
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 21600, //6 hours
      path: '/'
  }),
    cookie.serialize('data',userCookieData,{ // Basic User Data
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 21600, //6 hours
      path: '/',
  })])
}

async function loginCall (req, res){
  if (req.method === 'POST'){
    const {email, password} = req.body
    const user = await getUser(email)
    if (user == undefined || !email || !password){
      console.log("something went wrong no user")
      res.status(404).json({message:"User does not exist or password incorrect"})
      return
    }
    const hash = user.password
    compare(password, hash, function(err, result) {
        if (err){
            res.status(404).json({message: 'User does not exist or password incorrect'})
            return
        }
        else if (result){
            setLoginJWTHeader(res,user)
            res.status(201).send({message: 'User logged in'})
            return
        }
        else{
          res.status(404).send({message: 'User does not exist or password incorrect'})
        
        }
    });
  }
  else {
    res.status(405).json({message: "We only support POST"})
  }
}
export default loginCall;
