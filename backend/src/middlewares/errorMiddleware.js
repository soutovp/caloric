const notFound = (req, res, next)=>{
    const error = new Error(`Não encontrado - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next)=>{
	// Se o status da resposta já foi definido para 200 (sucesso),
	// mas ocorreu um erro, muda para 500 (Erro Interno do Servidor).
	// Caso contrário, mantém o status que pode ter sido definido pelo erro (ex: 404).
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);

	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	});
};

module.exports = { notFound, errorHandler };