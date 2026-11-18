export function createMatchesController(discoveryService) {
  return function getMatches(req, res, next) {
    try {
      const matches = discoveryService.getMatches(req.user.id);
      res.json({
        matches
      });
    } catch (err) {
      next(err);
    }
  };
}
