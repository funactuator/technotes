const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    username:{
      type:String,
      required:true
    },
    passowrd:{
      type:String,
      required:true
    },
    roles:[{
      type:String,
      default:'Employee'
    }],
    active:{
      type:Boolean,
      default:true
    },
  }
)

module.exports = mongoose.model('User', UserSchema);