export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  
  res.redirect('/auth/login');
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  
  res.redirect('/chats');
};