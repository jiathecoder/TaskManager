// First add the following two lines at the top of the chores controller so that we can access our model through var Chore
// need to require mongoose to be able to run mongoose.model()
var mongoose = require('mongoose');
var Chore = mongoose.model('Chore');
// First add the following two lines at the top of the chores controller so that we can access our model through var Chore
// need to require mongoose to be able to run mongoose.model()
// this is our chores.js file located at /server/controllers/chores.js
// note the immediate function and the object that is returned
module.exports = (function() {
  return {
    addChore: function(req, res) {
      var chore = new Chore({name:req.body.name , password: req.body.password});
      chore.save(function(err) {
        if(err) {
          console.log("ERROR WARNING");
          res.json(err);
        } else {
          console.log("Successfully added a new chore!");
          res.json(true);
        }
      })
    }
  }
})();