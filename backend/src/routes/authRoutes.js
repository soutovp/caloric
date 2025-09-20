const express = require('express');
const asyncHandler = require('../utils/asyncHandler.js');
const { protect } = require('../middlewares/authMiddleware.js');
const {
    registerUser,
    loginUser,
    requestPasswordReset,
    resetPassword,
    findOrCreateGoogleUser,
} = require('../services/authService.js');
const { getUserById, updateUserProfile } = require('../services/userService.js');
const {generateToken} = require('../utils/jwtUtils.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE_AUTH, FRONTEND_URL } = require('../config');
const {prisma} = require('../config/prisma.js');

const router = express.Router();

//--- Configuraçção do Passport para Google Strategy ---
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_AUTH.CLIENT_ID,
            clientSecret: GOOGLE_AUTH.CLIENT_SECRET,
            callbackURL: GOOGLE_AUTH.CALLBACK_URL,
        },
        async (acessToken, refreshToken, profile, done) =>{
            try{
                //Chama o serviço para encontrar ou criar o utilizador Google
                const user = await findOrCreateGoogleUser(profile);
                done(null, user);
            }catch(error){
                done(error, null);
            }
        }
    )
);

// Serialização e Desserialização do Utilizador para Passport
// Necessário para Passport, mesmo que estejamos a usar JWT para autenticação principal
// Isto lida com como o utilizador é guardado e recuperado na sessão do Passport
// (mesmo que a sessão esteja desativada para a rota de callback, é uma boa prática ter)
passport.serializeUser((user, done)=>done(null, user.id));
passport.deserializeUser(async (id, done)=>{
    try{
        const user = await prisma.user.findUnique({where: {id} });
        done(null, user);
    }catch(error){
        done(error, null);
    }
});

// @desc    Registrar novo utilizador
// @route   POST /api/auth/register
// @access  Public
router.post(
    '/register',
    asyncHandler(async (req, res)=>{
        const { name, email, password, gender, objective, activity } = req.body;
        // Chama o serviço de autenticação para registrar o utilizador
        const { user, token } = await registerUser(name, email, password, {gender, objective, activity});
        res.status(201).json({user, token, message: 'Registro bem-sucedido!'});
    })
);

// @desc    Autenticar utilizador e obter token
// @route   POST /api/auth/login
// @access  Public
router.post(
    '/login',
    asyncHandler(async (req,res)=>{
        const {email, password} = req.body;
        const {user, token} = await loginUser(email, password);
        res.json({user, token, message: 'Login bem-sucedido!'});
    })
);

// @desc    Obter perfil do utilizador logado
// @route   GET /api/auth/me
// @access  Private ( requer token JWT )1
router.get(
    '/me',
    protect,
    asyncHandler(async (req,res)=>{
        //req.user é populado pelo middleware 'protect'
        const user = await getUserById(req.user.id); // Chama o serviço para obter dados do utilizador
        res.json(user); // Retorna os dados do utilizador
    })
);

// @desc Atualizar perfil do utilizador logado
// @route PUT /api/auth/me
// @access Private ( requer token JWT )
router.put(
    '/me',
    protect, //Usa o middleware de proteção
    asyncHandler(async(req,res)=>{
        //req.user é populado pelo middleware 'protect'
        const {name, gender, objective, activity} = req.body;
        //Chama o serviço para atualizar o perfil
        const updatedUser = await updateUserProfile(req.user.id, {name, gender, objective, activity});
        res.json(updatedUser); // Retorna os dados do utilizador atualizados
    })
);

// @desc    Solicitar redefinição de senha
// @route   POST /api/auth/forgot-password
// @access  Public
router.post(
    '/forgot-password',
    asyncHandler(async (req,res)=>{
        const {email} = req.body;
        const result = await requestPasswordReset(email);
        res.json({message: result.message});
    })
);

// @desc    Redefinir senha com token
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post(
    '/reset-password/:token',
    asyncHandler(async (req,res)=>{
        const {token} = req.params;
        const {newPassword} = req.body;
        // Chama o serviço de autenticação para redefinir a senha
        const result = await resetPassword(token, newPassword);
        res.json({message: result.message});
    })
);

// @desc    Iniciar fluxo de autenticação Google
// @route   GET /api/auth/google
// @access  Public
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// @desc    Callback da autenticação Google
// @route   GET /api/auth/google/callback
// @access  Public
router.get(
    '/google/callback',
    //Não usamos sessão aqui, pois queremos gerar nosso próprio JWT
    passport.authenticate('google', {failureRedirect: `${FRONTEND_URL}/login?error=auth_failed`, session: false}),
    asyncHandler(async (req,res)=>{
        //Se a autenticação Passport for bem-sucedida, req.user conterá o utilizador.
        if(req.user){
            const token = generateToken(req.user.id); // Geramos nosso próprio JWT
            //Redireciona para o frontend com o token
            res.redirect(`${FRONTEND_URL}/?token=${token}`);
        }else{
            res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
        }
    })
);

module.exports = router;