// This is the user.js file located at /server/models/user.js
// We want to create a file that has the schema for our users and creates a model that we can then call upon in our controller
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create our userSchema
var ChoreSchema = new mongoose.Schema({
	chore: String,
	dueDate: Date,
	completed: { type: Boolean, default: false },
	_userId: {type: Schema.Types.ObjectId, ref: 'User'},
	_userName: String,
	_home: {type: Schema.Types.ObjectId, ref: 'Home'},
	created_at: { type: Date, default: Date.now }
});
var UserSchema = new mongoose.Schema({
	name: {type:String, trim:true, required:true},
	chores: [ChoreSchema],
	_home: {type: Schema.Types.ObjectId, ref: 'Home'},
	created_at: { type: Date, default: Date.now }
});
var HomeSchema = new mongoose.Schema({
	home: String,
	chores: [ChoreSchema],
	families: [{type: Schema.Types.ObjectId, ref: 'User'}],
	created_at: { type: Date, default: Date.now }
});

UserSchema.path('name').required(true, '- cannot be blank');

// use the schema to create the model
// Note that creating a model CREATES the collection in the database (makes the collection plural)
mongoose.model('User', UserSchema);
mongoose.model('Chore', ChoreSchema);
mongoose.model('Home', HomeSchema);
// notice that we aren't exporting anything -- this is because this file will be run when we require it using our config file and then since the model is defined we'll be able to access it from our controller