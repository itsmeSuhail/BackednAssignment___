import jwt from "jsonwebtoken";
export const CreatToken = (obj) => {
    return jwt.sign(obj, process.env.JwtSecret, { expiresIn: "1d" });
}
export const CreatTokenWithTime = (obj, time) => {
    return jwt.sign(obj, process.env.JwtSecret, { expiresIn: time });
}
export const verifyTokenWithTime = (Token) => {
    try {
        const check = jwt.verify(Token, process.env.JwtSecret);
        return check ? check : null;
    } catch (error) {
        return null;
    }
}

export const verifyToken = (Token) => {
    try {
        const check = jwt.verify(Token, process.env.JwtSecret, { expiresIn: "1d" });
        return check ? check : null;
    } catch (error) {
        return null;
    }
}
