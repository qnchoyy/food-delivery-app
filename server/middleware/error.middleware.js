const errorMiddleware = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = new Error('Resource not found');
        error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error = new Error('Duplicate field value entered');
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error = new Error(Object.values(err.errors).map(val => val.message).join(', '));
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
};

export default errorMiddleware;