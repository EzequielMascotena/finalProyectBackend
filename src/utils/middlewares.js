function handlePolicies(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send("Inicia sesión para acceder a esta página");
    }

    if (req.session.user.role === 'admin') {
        next();
    } else if (req.session.user.role === 'user') {
        next();
    } else {
        return res.status(403).send("Acceso denegado");
    }
}

module.exports = handlePolicies;