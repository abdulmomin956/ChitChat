const jwt = require('jsonwebtoken')

export const verifyJWT = (token) => {
    if (!token) {
        return false
    }
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return false
        }
        if (decoded.username) {
            return true
        }
    })
}

export const isAdmin = (token) => {
    if (!token) {
        return false
    }
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return false
        }
        if (decoded.username === "abdulmomin956") {
            return true
        }
    })
}

export const returnUsername = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return false
        }
        if (decoded.username) {
            return decoded.username
        }
    })
}
