// First add the following two lines at the top of the users controller so that we can access our model through var User
// need to require mongoose to be able to run mongoose.model()
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Chore = mongoose.model('Chore');
var Home = mongoose.model('Home');
// var Catagory = mongoose.model('Catagory');
// First add the following two lines at the top of the users controller so that we can access our model through var User
// need to require mongoose to be able to run mongoose.model()
// this is our users.js file located at /server/controllers/users.js
// note the immediate function and the object that is returned
module.exports = (function() {
  return {
    addUser: function(req, res) {
      var user = new User({name:req.body.name.toUpperCase()});
      user.save(function(err) {
        if(err) {
          console.log("ERROR WARNING");
          res.json(err);
        } else {
          console.log("Successfully added a new user!");
          res.json(user);
        }
      })
    },
    getUsers: function(req, res) {
  		User.find({}, function(err, results) {
         if(err) {
           console.log(err);
           res.json(false);
         } else {
           res.json(results);
         }
     })
    },
    getOneUser: function(req, res) {
      User.findOne({name: req.body.name.toUpperCase()}, function(err, user) {
         if(err) {
           console.log(err);
           res.json(err);
         } else {
          console.log(user);
           res.json(user);
         }
     })
    },
    addUserHome: function(req, res) {
      console.log(req.body);
      //find the user
      User.findOne({_id:req.body.user._id}, function(err, user) {
        console.log('user', user);
        //if user already has a home, find it.
        if(user._home) {
          console.log('search');
          Home.findOne({_id:user._home}, function(err, home2) {

            //move all user's chores back to old home
            for(var i=0; i<user.chores.length; i++){
              home2.chores.push(user.chores[i]);
            }
            // blank out user's chore list
            user.chores = [];

            //delete user's old home
            console.log('home2',home2);
            console.log('userId', req.body.user._id);
            var idx = home2.families.indexOf(req.body.user._id);
            console.log('idx', idx);
            home2.families.splice(idx,1);
            console.log('home2 updated',home2);
            home2.save(function(err) {
              if(err) {
                console.log('save fail :(');
              } else {
                console.log("original home deleted");
              }
            })
          })
        }

        user._home = req.body.home._id;
        //find the home
        Home.findOne({_id:req.body.home._id}, function(err, home) {  
          home.families.push(req.body.user._id);
          console.log('home', home);
          //save home and user info
          home.save(function(err) {
            user.save(function(err) {
              if(err) {
                console.log('error', err);
                res.json(false);
              } else {
                console.log('success');
                res.json(true);
              }
            })
          })
        })

      })
    },
    allHomes: function(req, res) {
      console.log(req.body);
      Home.find({}, function(err, homes) {
        if(err) {
          console.log('error', err);
          res.json(err);
        } else {
          console.log('Found all homes');
          res.json(homes);
        }
      })

    },
    getHome: function(req, res) {
      console.log(req.body);
      Home.findOne({_id:req.body.id}).populate('families').exec(function(err, home) {

        console.log(home);
        if(err) {
          console.log('error');
          res.json(false);
        } else {
          console.log('found home');
          res.json(home);
        }

      })

    },
    addHome: function(req, res) {
      // console.log(req.body);
      var home = new Home({});
      home.home = req.body.name.toUpperCase();
      console.log(home);
      home.save(function(err) {
        if(err) {
          console.log('error', err);
          res.json(false);
        } else {
          console.log('Successfully added a home');
          res.json(true);
        }
      })
    },
    addChore: function(req, res) {
      console.log(req.body);
      Home.findOne({_id: req.body.home.id}, function(err, home) {
        var chore = new Chore({_home:req.body.home.id, chore:req.body.name.toUpperCase()});
        home.chores.push(chore);
        console.log('home',home);
        home.save(function(err) {
          if(err) {
            console.log("Error - did not add chore");
            res.json(err);
          } else {
            console.log("Successfully added a new chore!");
            res.json(chore);
          }
        })
      })
    },
    completeChore: function(req, res){
      console.log(req.body);
      User.findOneAndUpdate(
        {"_id":req.body.user_id, "chores._id":req.body.chore_id}, 
        {$set: {"chores.$.completed":true}},
        function(err, user) {
          if(err) {
            console.log('error');
            res.json(false);
          } else {
            console.log('chore completed');
            res.json(true);
          }
      })
    },
    uncompleteChore: function(req, res){
      console.log(req.body);
      User.findOneAndUpdate(
        {"_id":req.body.user_id, "chores._id":req.body.chore_id}, 
        {$set: {"chores.$.completed":false}},
        function(err, user) {
          if(err) {
            console.log('error');
            res.json(false);
          } else {
            console.log('chore completed');
            res.json(true);
          }
      })
    },
    
    moveHomeToUser: function(req, res) {
      console.log(req.body);
      Home.findOne({_id:req.body.moveFrom._id}, function(err, home) {
        console.log(home);
        User.findOne({_id: req.body.moveTo._id}, function(err, user){
          console.log(user);

          //return index of chore in home
          function idxOf (arr, item) {
            for(var i=0; i<arr.length; i++){
              if(arr[i]._id == item._id){
                return i;
              }
            }
          }
          var idx = idxOf(home.chores, req.body.item);
          console.log('index', idx);

          // remove chore from home
          home.chores.splice(idx, 1);

          // add chore to user
          console.log(req.body.item);
          user.chores.push(req.body.item);
          console.log(user);

          home.save(function(err){
            user.save(function(err) {
              if(err) {
                console.log('error', err);
                res.json(false);
              } else {
                console.log('successfully updated chore move changes');
                res.json(true);
              }
            })
          })
        })
        
      })
    },
    moveUserToHome: function(req, res) {
      console.log(req.body);
      Home.findOne({_id:req.body.moveTo._id}, function(err, home) {
        console.log(home);
        User.findOne({_id: req.body.moveFrom._id}, function(err, user){
          console.log(user);

          //return index of chore in user
          function idxOf (arr, item) {
            for(var i=0; i<arr.length; i++){
              if(arr[i]._id == item._id){
                return i;
              }
            }
          }
          var idx = idxOf(user.chores, req.body.item);
          console.log('index', idx);

          // remove chore from user
          user.chores.splice(idx, 1);

          // add chore to home
          console.log(req.body.item);
          home.chores.push(req.body.item);
          console.log(home);

          home.save(function(err){
            user.save(function(err) {
              if(err) {
                console.log('error', err);
                res.json(false);
              } else {
                console.log('successfully updated chore move changes');
                res.json(true);
              }
            })
          })
        }) 
      })
    },
    moveUserToUser: function(req, res) {
      console.log(req.body);
      User.findOne({_id:req.body.moveTo._id}, function(err, user2) {
        console.log(user2);
        User.findOne({_id: req.body.moveFrom._id}, function(err, user1){
          console.log(user1);

          function idxOf (arr, item) {
            for(var i=0; i<arr.length; i++){
              if(arr[i]._id == item._id){
                return i;
              }
            }
          }
          //return index of chore in user1
          var idx = idxOf(user1.chores, req.body.item);
          console.log('index', idx);

          // remove chore from user1
          user1.chores.splice(idx, 1);

          // add chore to user2
          console.log(req.body.item);
          user2.chores.push(req.body.item);
          console.log(user2);

          user1.save(function(err){
            user2.save(function(err) {
              if(err) {
                console.log('error', err);
                res.json(false);
              } else {
                console.log('successfully updated chore move changes');
                res.json(true);
              }
            })
          })
        }) 
      })
    },
    moveUserToTrashBin: function(req, res) {
      console.log(req.body);
      User.findOne({_id:req.body.moveFrom._id}, function(err, user) {
        console.log('user',user);
        function idxOf (arr, item) {
          console.log(arr);
          console.log(item);
            for(var i=0; i<arr.length; i++){
              if(arr[i]._id == item._id){
                return i;
              }
            }
        }
        //return index of chore in user
        var idx = idxOf(user.chores, req.body.item);
        console.log('index', idx);
        // remove chore from user
        user.chores.splice(idx, 1);
        // save user changes
        user.save(function(err) {
          if(err){
            console.log('error');
            res.json(false);
          } else {
            console.log('trashed');
            res.json(true);
          }
        })
      })
    },
    moveHomeToTrashBin: function(req, res) {
      console.log(req.body);
      Home.findOne({_id:req.body.moveFrom._id}, function(err, home) {
        console.log('home',home);
        function idxOf (arr, item) {
          console.log(arr);
          console.log(item);
            for(var i=0; i<arr.length; i++){
              if(arr[i]._id == item._id){
                return i;
              }
            }
        }
        //return index of chore in home
        var idx = idxOf(home.chores, req.body.item);
        console.log('index', idx);
        // remove chore from home
        home.chores.splice(idx, 1);
        // save home changes
        home.save(function(err) {
          if(err){
            console.log('error');
            res.json(false);
          } else {
            console.log('trashed');
            res.json(true);
          }
        })
      })
    }
  }
})();