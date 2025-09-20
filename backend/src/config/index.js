require('dotenv').config();

module.exports = {
	PORT: process.env.PORT || 3000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
	DATABASE_URL: process.env.DATABASE_URL,
	FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8000',

	//Configuração do Google Auth
	GOOGLE_AUTH: {
		CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
	},

    //Configuraões de E-mail para reset de Senha ( se aplicável )
    EMAIL:{
        HOST: process.env.EMAIL_SERVICE_HOST,
        PORT: process.env.EMAIL_SERVICE_PORT,
        USER: process.env.EMAIL_SERVICE_USER,
        PASS: process.env.EMAIL_SERVICE_PASS,
        FROM: process.env.RESET_PASSWORD_EMAIL_FROM || 'noreply@caloric.com.br',
        SUBJECT: process.env.RESET_PASSWORD_EMAIL_SUBJECT || 'Redefinir Senha - Caloric',
    },
};