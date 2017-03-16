myAppModule.controller('loginController', function ($scope, $cookies, $routeParams, $location, userFactory){

	$scope.validations = {};

	$scope.entry = function(user) { 	
		console.log("client - loginController - entry");
		if(user){
			userFactory.entry(user, function(data) {
				if(data === null) {
					console.log("creating new user");
					userFactory.addUser(user, function(data) {
						userFactory.entry(user,function(data) {
							console.log("found user");
							$location.path('/world');
							console.log("welcome!");
						})
					})
				} else {
					console.log("found user");
					$location.path('/world');
					console.log("welcome!");
				}
			});
		} else {
			$scope.validations.name = " - cannot be blank";
		}
	}
});