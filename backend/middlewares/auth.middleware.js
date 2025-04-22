export function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Acceso denegado. Requiere permisos de administrador" });
}

export function isUser(req, res, next) {
  if (req.user && req.user.role === "user") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Acceso denegado. Requiere permisos de usuario" });
}
