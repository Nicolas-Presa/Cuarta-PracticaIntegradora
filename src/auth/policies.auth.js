const handlePolicies = policies => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ status: 'ERR', data: 'Usuario no autorizado' });

        const userRole = req.user.role.toUpperCase();
        policies.forEach((policy, index) => policies[index] = policies[index].toUpperCase());

        if (policies.includes('PUBLIC') || policies.includes(userRole)) {
            return next();
        } else {
            return res.status(403).send({ status: 'ERR', data: 'Sin permisos suficientes' });
        }
    }
};

export default handlePolicies