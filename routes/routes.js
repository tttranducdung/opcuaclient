var mongoClient = require('mongodb').MongoClient;
module.exports = function(app, passport) {
  
    // HOME SECTION =========================
    app.get('/hmi', isLoggedIn, function(req, res) {
        res.render('hmi', {
            user : req.user
        });
    });
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
    
        res.redirect('/');
    }
    app.get('/history', isLoggedIn, function(req, res) {
        res.render('history.ejs')
    });
    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    })
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    // process the login form
    app.post('/', passport.authenticate('local-login', {
        successRedirect : '/hmi', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
};
// route middleware to ensure user is logged in


