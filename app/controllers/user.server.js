function userCtrl() {
  this.getCurrentUser = function(req, res) {
    if (req.user) {
      return res.send(req.user);
    } else {
      return res.sendStatus(404);
    }
  }

  this.getLastSearch = function(req, res) {
    if (req.session.lastSearch) {
      return res.send(req.session.lastSearch);
    } else {
      return res.sendStatus(404);
    }
  }
  
}

module.exports = userCtrl;