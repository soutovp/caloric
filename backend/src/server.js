const app = require('./app.js');
const {PORT, NODE_ENV} = require('./config');

app.listen(PORT, ()=>{
    console.log(`Servidor ${NODE_ENV} a correr em http://localhost:${PORT}`);
});