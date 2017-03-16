myAppModule.factory('userFactory', function ($http){
      var socket = io.connect();
      var currentUser;
      var factory = {};

      factory.sendTxt = function(number, message) {
         //    $http.get("http://www.omdbapi.com/?t=salt&tomatoes=true&plot=full")
         // .success(function(response){console.log(response);});
         var data = {};
         data.number = number;
         data.message = message;
         $http.post('http://textbelt.com/text', data);
      };

      // add a getusers method to the object we defined
      factory.getCurrentUser = function(callback) {
            console.log('getCurrentUser',currentUser);
            callback(currentUser);
      }
      factory.entry = function(user, callback){
            console.log('userFactory - entry');
            $http.post('/getUser', user).success(function(data) {
                  if(!currentUser){     
                        currentUser = data;
                  }
                  console.log('user now',currentUser);
                  callback(data);
            })
      }
      factory.logout = function(callback) {
            console.log('userFactory - logout');
            currentUser = '';
            callback();
      }
      factory.addUserHome = function(user, callback) {
            $http.post('/addUserHome', user).success(function(data) {
                  callback(data);
            })

      }
      factory.addUser = function(addUser, callback){
            console.log('userFactory - addUser');
            $http.post('/addUser', addUser).success(function(data) {
                  console.log('new user created');
                  callback(data);
            })
      }
      var allHomeData = {};
      factory.allHomes = function(callback) {
            console.log('userFactory - allHomes');
            allHomeData.callback = callback;
            socket.emit('allHomes',{res:"client - get all homes"});
      }
      socket.on('allHomes', function(data) {
            $http.get('/allHomes').success(function(data) {
                  console.log('all homes',data);
                  allHomeData.callback(data);
            })    
      })

      var getHomeData = {};
      factory.getHome = function(home, callback) {
            console.log('userFactory - getHome');
            getHomeData.home = home;
            getHomeData.callback = callback;
            socket.emit('getHome',{res:"client - get  home"});
      }
      socket.on('getHome',function(data) {
            $http.post('/getHome', getHomeData.home).success(function(data) {
                  getHomeData.callback(data);
            })
      })

      factory.addHome = function(newHome, callback) {
            console.log('userFactory - addHome');
            $http.post('/addHome', newHome).success(function() {
                  callback();
            })
      }
      factory.addChore = function(newChore, callback) {
            console.log('userFactory - addChore');
            $http.post('/addChore', newChore).success(function(data) {
                  callback(data);
            })
      }
      factory.completeChore = function(data, callback) {
            console.log('userFactory - completeChore');
            $http.post('/completeChore', data).success(function(data){
                  callback(data);
            })
      }
      factory.uncompleteChore = function(data, callback) {
            console.log('userFactory - uncompleteChore');
            $http.post('/uncompleteChore', data).success(function(data){
                  callback(data);
            })
      }
      factory.moveHomeToUser = function(chore, callback) {
            console.log('userFactory - moveHomeToUser');
            $http.post('/moveHomeToUser', chore).success(function(data) {
                  callback(data);
            })
      }
      factory.moveUserToHome = function(chore, callback) {
            console.log('userFactory - moveUserToHome');
            $http.post('/moveUserToHome', chore).success(function(data) {
                        callback(data);
                  })
      }
      factory.moveUserToUser = function(chore, callback) {
            console.log('userFactory - moveUserToUser');
            $http.post('/moveUserToUser', chore).success(function(data) {
                  callback(data);
            })
      }
      factory.moveUserToTrashBin = function(chore, callback) {
            console.log('userFactory - moveUserToTrashBin');
            $http.post('/moveUserToTrashBin', chore).success(function(data) {
                  callback(data);
            })
      }
      factory.moveHomeToTrashBin = function(chore, callback) {
            console.log('userFactory - moveHomeToTrashBin');
            $http.post('/moveHomeToTrashBin', chore).success(function(data) {
                  callback(data);
            })
      }
      factory.resetAllChores = function(home, callback) {
            console.log('userFactory - resetAllChores');
            console.log(home);
            $http.post('/resetAllChores', home).success(function(data) {
                  callback(data);
            })
      }
      // most important step: return the object so it can be used by the rest of our angular code
      return factory
});