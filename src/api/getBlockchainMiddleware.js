const getBlockchainMiddleware = bc => (req, res, next) => {
  if (bc) {
    req.blockchain = bc;
    return next();
  }
  return res.send(500);
};

module.exports = getBlockchainMiddleware;
