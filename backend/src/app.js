const express = require('express');
const cors = require('cors');
const {PORT, NODE_ENV, FRONTEND_URL} = require('./config');
const {notFound, errorHandler} = require('./middlewares/errorMiddleware');
const passport = require('passport');

const app = express();

const corsOptions = {
    origin: FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSucessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.get('/', (req,res)=>{
    res.send('A API do Caloric V3 está no ar!');
});

// ROTAS
const authRoutes = require('./routes/authRoutes.js');
app.use('/api/auth', authRoutes);

// Middlewares de tratamento de erro ( DEVE ser o último a ser adicionado)
app.use(notFound);
app.use(errorHandler);

module.exports = app;