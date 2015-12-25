'use strict';

var _  = require('lodash');

exports.attributes = function(attr){
  var template = {
    loc_email: {
      type: 'email',
      unique: true
    },
    loc_password: {
      type: 'STRING',
      minLength: 8
    },
    resetToken: {
      model: 'resetToken'
    }
  };

  if(attr.loc_username){
    delete(template.loc_email);
  }

  _.merge(template, attr);
  _.merge(attr, template);
};

/**
 * used to hash the password
 * @param  {object}   values
 * @param  {Function} cb
 */
exports.beforeCreate = function(values){
	console.log("before create:",values)
    if(!_.isUndefined(values.loc_password) && values.loc_password.indexOf("$")!=0){
    var bcrypt = require('bcrypt');
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(values.loc_password, salt);
    values.loc_password = hash;
    console.log("salt: ",salt)
    console.log(values)
  }
};

/**
 * used to update the password hash if user is trying to update password
 * @param  {object}   values
 * @param  {Function} cb
 */
exports.beforeUpdate = function(values){
  if(!_.isUndefined(values.loc_password) && values.loc_password !== null && values.loc_password.indexOf("$")!=0 ){
    var bcrypt = require('bcrypt');
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(values.loc_password, salt);
    values.loc_password = hash;
  }
};
