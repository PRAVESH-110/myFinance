const {JWT_USER_PASSWORD}= process.env;
const jwt= require("jsonwebtoken");

const usermiddleware = (req, res, next) => {
    const token = req.body.token;

    if(!token){
        return res.status(401).json({
            message: "Request missing token"
        })
    }
    try{
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        req.user = decoded.id;
        next();
    }
    catch(error){
        return res.status(401).json({
            message:"Invalid or expired token"
        });
    }

}

module.exports = {
    usermiddleware: usermiddleware
}