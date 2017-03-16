// First at the top of your routes.js file you'll have to require the controller
var users = require('./../server/controllers/users.js');
var bodyParser = require("body-parser");
module.exports = function(app) {
	app.use(bodyParser.json());

	// .get
	app.get('/allHomes', function(req, res) {
		console.log('routes: /allHomes');
		users.allHomes(req, res);
	})

	app.post('/getUser', function(req, res) {
		console.log('routes: /getUser');
		users.getOneUser(req, res);
	});
	app.post('/addUser', function(req, res) {
		console.log('routes: /addUser');
		users.addUser(req, res);
	});
	app.post('/getHome', function(req, res) {
		console.log('routes: /getHome');
		users.getHome(req, res);
	});
	app.post('/addHome', function(req, res) {
		console.log('routes: /addHome');
		users.addHome(req, res);
	});
	app.post('/addChore', function(req, res) {
		console.log('routes: /addChore');
		users.addChore(req, res);
	});
	app.post('/completeChore', function(req, res) {
		console.log('routes: /completeChore');
		users.completeChore(req, res);
	})
	app.post('/uncompleteChore', function(req, res) {
		console.log('routes: /uncompleteChore');
		users.uncompleteChore(req, res);
	})
	app.post('/resetAllChores', function(req, res) {
		console.log('routes: /resetAllChores');
		users.resetAllChores(req, res);
	})
	app.post('/moveHomeToUser', function(req, res) {
		console.log('routes: /moveHomeToUser');
		users.moveHomeToUser(req, res);
	})
	app.post('/moveUserToHome', function(req, res) {
		console.log('routes: /moveUserToHome');
		users.moveUserToHome(req, res);
	})
	app.post('/moveUserToUser', function(req, res) {
		console.log('routes: /moveUserToUser');
		users.moveUserToUser(req, res);
	})
	app.post('/moveUserToTrashBin', function(req, res) {
		console.log('routes: /moveUserToTrashBin');
		users.moveUserToTrashBin(req, res);
	})
	app.post('/moveHomeToTrashBin', function(req, res) {
		console.log('routes: /moveHomeToTrashBin');
		users.moveHomeToTrashBin(req, res);
	})
	app.post('/addUserHome', function(req, res) {
		console.log('routes: /addUserHome');
		users.addUserHome(req, res);
	});
};