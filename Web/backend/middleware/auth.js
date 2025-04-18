const isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/');
  };
  
  const hasRole = (role) => {
    return (req, res, next) => {
      if (req.session.user?.ROLE === role) return next();
      res.status(403).render('error', {
        message: 'Bạn không có quyền truy cập trang này',
        layout: 'login'
      });
    };
  };

  module.exports = { isAuthenticated, hasRole };