export function createFeedController(discoveryService) {
  return function getFeed(req, res, next) {
    try {
      const profiles = discoveryService.getFeed(req.user.id);
      res.json({
        profiles
      });
    } catch (err) {
      next(err);
    }
  };
}
