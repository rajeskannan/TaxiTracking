var adminGroupRole=function(group) {
	return function(req, res, next) {
		if (req.user && req.session.role === group)
			next();
		else
			res.send(401, 'Sorry! You don\'t have permission to access this page.');
	};
};

module.exports=adminGroupRole;