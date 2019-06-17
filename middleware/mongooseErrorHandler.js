module.exports = (err, req, res, next) => {
    if (err.errors) {
        const error = {};
        const keys = Object.keys(err.errors);

        keys.forEach((key) => {
            let message = err.errors[key].message;

            if (err.errors[key].properties && err.errors[key].properties.message) {
                message = err.errors[key].properties.message.replace('`{PATH}`', key);
            }

            message = message.replace('Path ', '').replace(key,'').trim();
            error[key] = message;
        });

        return res.status(500).json(error); // or return next(error);
    }

    next();
}