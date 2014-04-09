
/*
 * render index.html
 */
exports.renderIndex = function(req, res){
	res.render('index.html',{message: req.flash('error')});
};

exports.renderInvalid = function(req, res){
	var errorP= {'message':req.flash('error')};
	res.write(JSON.stringify(errorP));
	res.end();
};

/*
 * render Home.html
 */
exports.renderHome = function(req, res){
	res.render('home.html');
};

/*
 * render Contact.html 
 */
exports.renderContact = function(req, res){
	res.render('contact.html');
};
/*
 * render about.html
 */
exports.renderAbout = function(req, res){
	res.render('about.html');
};
/*
 * render Login page.html
 */
exports.renderLoginModal = function(req, res){
	res.render('login.html');
};

/*
 * render userHome page.html
 */
exports.renderUserHome = function(req, res){
	res.render('userHome.html');
};
/*
 * logout code
 */
exports.userLogout = function(req, res){
	req.logout();
	req.session.destroy();
	res.redirect('/');
};
