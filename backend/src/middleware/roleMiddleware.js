export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    const user = req.user;
    const permissions = await Role.findOne({ name: user.role });
    if (permissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};
