export function createSwipeController(discoveryService) {
  return function recordSwipe(req, res, next) {
    try {
      const { targetId, action } = req.body || {};
      const result = discoveryService.recordSwipe(req.user.id, targetId, action);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
