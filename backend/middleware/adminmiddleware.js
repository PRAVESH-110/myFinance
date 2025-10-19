const {JWT_ADMIN_PASSWORD}= process.env;
const jwt= require("jsonwebtoken");

const adminmiddleware = (req, res, next) => {
    const header = req.headers.authorization;

    if(!header){
        return res.status(401).json({message:"Authorization header missing"});
    }

    const token = header.startsWith("Bearer ") ? header.slice(7) : header;

    try{
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
        req.admin = decoded.id;
        next();
    }
    catch(error){
        return res.status(401).json({
            message:"Invalid or expired token"
        });
    }

}

module.exports = {
    adminmiddleware: adminmiddleware
}