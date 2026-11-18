export function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'] || 'user_001';
  req.user = {
    id: userId
  };
  next();
}
