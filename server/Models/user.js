const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fname: {type : String, require:true, trim:true },
    lname:  {type : String, require:true, trim:true },
    email:  {type : String, require:true, trim:true, unique:true },
    phone:  {type : String, require:true, trim:true },
    profilepic:  {type : String, trim:true },
    is_active:  { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);