const auth = require("./auth");
const cache = require('memory-cache');


// Tack a user object onto each request if possible
function addUser(req, res, next) {
  if (!req.userinfo) {
    return next();
  }

  auth.oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      cache.put('currentUser',user.profile.login);
      next();
    }).catch(err => {
      cache.del('currentUser');
      next(err);
    });
};


// Only let the user access the route if they are authenticated.
function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}


module.exports = { addUser, loginRequired };
