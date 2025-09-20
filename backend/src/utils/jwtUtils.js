const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRATION} = require('../config');

/**
 * Gera um token JWT para um determinado ID de utilizador.
 * @param {string} userId - O ID do utilizador para incluir no payload do token.
 * @returns {string} O token JWT gerado.
*/
const generateToken = (userId)=>{
    return jwt.sign({userId}, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
    });
};

/**
 * Verifica e decodifica um token JWT.
 * @param {string} token - O token JWT a ser verificado.
 * @returns {object} O payload decodificado do token, ou lança um erro se inválido.
 */
const verifyToken = (token)=>{
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {generateToken, verifyToken};