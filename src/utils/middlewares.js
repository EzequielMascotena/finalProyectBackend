function handlePolicies(role) {
    return function(req, res, next) {
        if (!req.session.user) {
            return res.status(401).send("Inicia sesión para acceder a esta página");
        }

        if (role === 'admin' && req.session.user.role !== 'admin') {
            return res.status(403).send("Acceso denegado, solo los administradores de la pagina pueden ingresar aqui");
        }

        if (role === 'user' && req.session.user.role !== 'user') {
            return res.status(403).send("Acceso denegado, como administrador no puede ingresar aqui.");
        }

        next();
    };
}

module.exports = handlePolicies;
