function handlePolicies(...allowedRoles) {
    return function (req, res, next) {
        const user = req.session.user;
        if (!user) {
            return res.status(401).send("Inicia sesión para acceder a esta página");
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).send("Acceso denegado, no tienes permisos para acceder a esta página");
        }

        next();
    };
}

module.exports = handlePolicies;
