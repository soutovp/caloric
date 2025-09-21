const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler.js');
const {prisma} = require('../config/prisma.js');
const {JWT_SECRET} = require('../config');

//Middleware para proteger rotas ( verifica o token JWT)
const protect = asyncHandler(async (req,res,next)=>{
    let token;
    const autorization = req.headers.authorization.split(' ');
    //Verifica se o cabeçalho de autorização existe e começa com 'Bearer'
    if (req.headers.authorization && autorization[0] === 'Bearer') {
		try {
			token = autorization[1];

			//Verifica o token
			const decoded = jwt.verify(token, JWT_SECRET);

			//Busca o utilizador no banco de dados com base no ID do token
			//Excluímos a senha do objeto do utilizador para segurança
			req.user = await prisma.user.findUnique({
				where: { id: decoded.userId },
				select: {
					id: true,
					email: true,
					name: true,
					weight: true,
					height: true,
					birth: true,
					gender: true,
					objective: true,
					activity: true,
					googleId: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			if (!req.user) {
				res.status(401);
				throw new Error('Não autorizado, utilizador não encontrado.');
			}
			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error('Não autorizado, token falhou.');
		}
	}
    if(!token){
        res.status(401);
        throw new Error('Não autorizado, nenhum token recebido.');
    }
});

module.exports = { protect };