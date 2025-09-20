const bcrypt = require('bcryptjs');
const { prisma } = require('../config/prisma');
const { generateToken } = require('../utils/jwtUtils.js');

/**
 * Registra um novo utilizador.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {object} profileData - Dados adicionais do perfil ( gender, objective, activityLevel)
 * @returns {object} O objeto do utilizador ( sem a senha ) e o token.
 * @throws {Error} Se o e-mail já estiver em uso ou se houver um erro de validação.
 */
const registerUser = async (name, email, password, profileData = {}) =>{
    if(!email || !password || !name){
        throw new Error('Nome, e-mail e senha são obrigatórios.');
    }
    const existingUser = await prisma.user.findUnique({
        where: {email: email},
    });
    if(existingUser){
        throw new Error('Este e-mail já está em uso.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            gender: profileData.gender || null,
            objective: profileData.objective || null,
            activity: profileData.activity || null,
        },
    });

    const userForResponse = {...newUser};
    delete userForResponse.password;
    const token = generateToken(newUser.id);

    return {user: userForResponse, token};
};

/**
 * Authentica um utilizador
 * @param {string} email
 * @param {string} password
 * @returns {object} O objeto do utilizador ( sem a senha ) e o token.
 * @throws {Error} Se as credenciais forem inválidas.
 */
const loginUser = async ( email, password) => {
    if(!email || !password){
        throw new Error('E-mail e senha são obrigatórios.');
    }

    const user = await prisma.user.findUnique({
        where: { email: email},
    });

    if(!user){
        throw new Error('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        throw new Error('Credenciais inválidas.');
    }

    const userForResponse = {...user};
    delete userForResponse.password; // Remove a senha do objeto de resposta
    const token = generateToken(user.id); // Gera o token

    return { user: userForResponse, token};
};

// Redefinição de senha
const requestPasswordReset = async(email)=>{
    console.log(`Solicitação de reedefinição de senha para: ${email}`);
    return {message: 'Se o e-mail estiver registrado, receberá um link para redefinir a sua senha.'};
};

const resetPassword = async (token, newPassword)=>{
    //Lógica para verificar o token e atualizar a senha
    //Por enquanto, apenas um placeholder
    console.log(`Redefinição de senha com token: ${token}`);
    //E: Verificar token no DB, atualizar senha
}

// Funções para Google GAuth ( ainda por implementar, apenas placegholders)
const findOrCreateGoogleUser = async(profile)=>{
    //Lógica para encontrar ou criar um utilizador via Google ID
    // Por enquanto, apenas um placeholder
    console.log(`Google profile recebido: ${profile.id}`);

    let user = await prisma.user.findUnique({
        where: {googleId: profile.id},
    });
    if(!user){
        //Tenta encontrar por email, caso o utilizador já tenha uma conta local com o mesmo e-mail
        user = await prisma.user.findUnique({
            where: {email: profile.emails[0].value},
        });

        if(user){
            //Se encontrou por e-mail, associa o googleId à conta existente
            user = await prisma.user.update({
                where: {id: user.id},
                data: {googleId: profile.id},
            });
        }else{
            //Cria um novo utilizador
            user = await prisma.user.create({
                data:{
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    googleId: profile.id,
                    password: bcrypt.hashSync(Math.random().toString(36).substring(7), 10), // Senha aleatória para users Google
                },
            });
        }
    }
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    requestPasswordReset,
    resetPassword,
    findOrCreateGoogleUser
};