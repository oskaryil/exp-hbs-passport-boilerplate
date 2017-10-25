const router = require('express').Router();
const UserController = require('../controllers/user.controller.js');

router.get('/', function(req, res) {
  res.render('index', {
    title: config.site.name,
    user: req.user
  });
});

router.route('/login').get(UserController.login).post(UserController.postLogin);

router.route('/register').get(UserController.signup).post(UserController.postSignup);

// POST
// router.post('/locallogin', passport.authenticate('local', {
//     failureRedirect:'/login',
//     failureFlash: true
//   }), function(req, res, next) {
//   console.log('success');
//   res.redirect('/');
// });

module.exports = router;
