myAppModule.controller('usersController', function ($scope, $route, $cookies, $routeParams, $location, userFactory){
	$scope.currentUser;
	$scope.users = [];
	$scope.validations = {};
	$scope.homes;

	$scope.allHomes = function() {
		console.log("client - homesController - allHomes");
		userFactory.allHomes(function(data) {
			$scope.homes = data;
		})
	};

	$scope.checkUser = function(){
		userFactory.getCurrentUser(function(data) {
			console.log('current user',data);
			if(data){
				console.log("logged in");
				$scope.currentUser = data;
				$scope.allHomes();
			} else {
				console.log("not logged in");
				$location.path('/');
			}
		})
	}();
	$scope.logout = function() {
		console.log("client - homesController - logout");
		userFactory.logout(function(){
			$route.reload();
		});
	}
	$scope.addUser = function () {
		userFactory.addUser($scope.newUser, function(err) {
			console.log(err);
			if(err){
				console.log('fail');
				$scope.validations = err;
				$scope.newUser = {};
				// $location.path('/register');
			} else {
				console.log('succeed');
				$location.path('/login');
			}
		});
	}
	$scope.addHome = function(newHome) {
		console.log("client - homesController - addHome");
		if(newHome && newHome.name) {
			console.log(true);
			userFactory.addHome(newHome, function() {
				userFactory.allHomes(function(data) {
					$scope.homes = data;
				})
			})
		} else {
			console.log(false);
		}
		$scope.newHome = {};
	}
	$scope.deleteHome = function(home) {
		console.log("client - homesController - deleteHome");
	}
});