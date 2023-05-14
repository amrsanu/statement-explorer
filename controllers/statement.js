exports.getIndex = (req, res, next) => {
  res.render('statement/index', {
    pageTitle: 'Home',
    path: '/',
  });
};