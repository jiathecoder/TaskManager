myAppModule.controller('homesController', function ($scope, $route, $cookies,$routeParams, $location, userFactory){
	$scope.home;
	$scope.validations;
	$scope.chores;
	$scope.currentUser;
	$scope.newMember;

	$scope.moveTo;
	$scope.itemMoved;

	// $scope.$watch('home', function(home) {
 //        console.log(home);
 //    }, true);
	function getHome() {
		userFactory.getHome($routeParams, function(data) {;
			$scope.home = data;
			console.log("what");
		})
	}

	$scope.getHome = function() {
		console.log("client - homesController - getHome");
		userFactory.getHome($routeParams, function(data) {
			if(!data) {
				console.log('error');
				$location.path('/world');
			} else {
				console.log('success');
				$scope.home = data;	
			}
		})
	};

	$scope.checkUser = function(){
		userFactory.getCurrentUser(function(data) {
			console.log('current user',data);
			if(data){
				console.log("logged in");
				$scope.currentUser = data;
				$scope.getHome();
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
	// complete chore
	$scope.completeChore = function(chore_id, user_id) {
		console.log('completeChore');
		var data = {chore_id:chore_id, user_id:user_id};
		userFactory.completeChore(data, function(data){
			console.log(data);
			getHome();
		});
	}
	$scope.uncompleteChore = function(chore_id, user_id) {
		console.log('uncompleteChore');
		var data = {chore_id:chore_id, user_id:user_id};
		userFactory.uncompleteChore(data, function(data){
			console.log(data);
			getHome();
		});
	}
	// MOVING CHORES
	$scope.choreMoved = function(moveFrom){
		console.log('choreMoved');
		console.log('itemMoved',$scope.itemMoved);
		console.log('moveFrom',moveFrom);
		console.log('moveTo',$scope.moveTo);
		var data = {};
		data.item = $scope.itemMoved;
		data.moveFrom = moveFrom;
		data.moveTo = $scope.moveTo;

		function getHome() {
			userFactory.getHome($routeParams, function(data) {;
				$scope.home = data;
				console.log("what");
			})
		}

		if(moveFrom.hasOwnProperty("home") && $scope.moveTo.hasOwnProperty("name")){
			console.log('move from home to user');
			userFactory.moveHomeToUser(data, function(data) {
				console.log(data);
				getHome();
			})
		} else if(moveFrom.hasOwnProperty("name") && $scope.moveTo.hasOwnProperty("home")){
			console.log('move from user to home');
			userFactory.moveUserToHome(data, function(data) {
				console.log(data);
				getHome();
			})
		} else if(moveFrom.hasOwnProperty("name") && $scope.moveTo.hasOwnProperty("name")) {
			console.log('move from user to user');
			userFactory.moveUserToUser(data, function(data) {
				console.log(data);
				getHome();
			})
		} else if(moveFrom.hasOwnProperty("name") && $scope.moveTo === "trashBin"){
			console.log('move from user to trash bin');
			userFactory.moveUserToTrashBin(data, function(data){
				console.log(data);
				getHome();
			})
		} else if(moveFrom.hasOwnProperty("home") && $scope.moveTo === "trashBin") {
			console.log('move from home to trash bin');
			userFactory.moveHomeToTrashBin(data, function(data){
				console.log(data);
				getHome();
			})
		}
	}
	$scope.moveChore = function(item, moveTo) {
		console.log('moveChore');
		$scope.itemMoved = item;
		$scope.moveTo = moveTo;
		return item;
	}
	// MOVING CHORES
	$scope.addChore = function(newChore) {
		console.log("client - homesController - addChore");
		console.log(newChore);
		if(newChore && newChore.name !== undefined){
			console.log(true);
			console.log(newChore.name);
			newChore.home = $routeParams;
			userFactory.addChore(newChore, function(data) {
				userFactory.getHome($routeParams, function(data) {;
					$scope.home = data;
				})
			});
		} else {
			console.log(false);
		}

		$scope.newChore = {};
	}
	$scope.resetAllChores = function (home){
		console.log("client - homesController - resetAllChores");
		console.log('incomplete feature');
		userFactory.resetAllChores(home, function(data) {
			console.log(data);
		})
	}
	$scope.addFamily = function(user) {
		console.log("client - homesController - addFamily");
		console.log(user);
		//check if name is blank
		if(user){
			userFactory.entry(user, function(data) {
				//check if user exist in database
				if(data === null) {
					//user does not exist
					userFactory.addUser(user, function(data) {
						console.log("created a new user");
						$scope.newMember = data;
						$scope.addMember();
					})
				} else {
					//user does exist
					console.log("found user");
					var boo = false;
					// search if member is already part of family
					for(var i=0; i<$scope.home.families.length; i++){
						if(data._id === $scope.home.families[i]._id){
							console.log('found member in family');
							boo = true;
						}
					}
					// if true then don't do anything
					if(!boo){;
						$scope.newMember = data;
						console.log('new family member',$scope.newMember);
						$scope.addMember();
					}
				}
				$scope.newFamily = {};
			});
		}

	}
	$scope.addMember = function() {
		console.log("client - homesController - addMember");
		var newMember = {};
		newMember.user = $scope.newMember;
		newMember.home = $scope.home;
		console.log('newMember',newMember);

		userFactory.addUserHome(newMember, function(data) {
			// refresh the 'home' page
			userFactory.getHome($routeParams, function(data) {
				console.log('refreshed');
				$scope.home = data;	
			})
		})

	}

});