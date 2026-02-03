export const allowRoles = (roles = []) => {
  return (req, res, next) => {
    // auth.middleware.js ne req.user set kar diya hoga
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions"
      });
    }
    next();
  };
};
