const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role.some(role => allowedRoles.includes(role))) {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    };
};

module.exports = authorize;
