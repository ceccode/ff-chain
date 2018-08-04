module.exports = (req, res, next) => {
  req.blockchain.addBlock(req.body.data);
  next();
};
