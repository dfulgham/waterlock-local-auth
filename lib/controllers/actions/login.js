'use strict';
var bcrypt = require('bcrypt');

/**
 * Login action
 */
module.exports = function(req, res){

  var scope = require('../../scope')(waterlock.Auth, waterlock.engine);
  var params = req.params.all();
  console.log("login params",params)
  console.log("login scope:",scope);
  if(typeof params[scope.type] === 'undefined' || typeof params.loc_password !== 'string'){
	  console.log("failed at scope test", params[scope.type]);
    waterlock.cycle.loginFailure(req, res, null, {error: 'Invalid '+scope.type+' or password'});
  }else{
    var pass = params.loc_password;
    console.log("pass:",pass)
    scope.getUserAuthObject(params, req, function(err, user){
	    console.log("err/user:",err,user)
      if (err) {
        if (err.code === 'E_VALIDATION') {
          return res.status(400).json(err);
        } else {
          return res.serverError(err);
        }
      }
      if (user) {
	      console.log("hash pass:",bcrypt.hashSync(pass,bcrypt.genSaltSync(10)))
	      console.log("compare pass:",bcrypt.compareSync(pass, user.auth.loc_password))
        if(bcrypt.compareSync(pass, user.auth.loc_password)){
          waterlock.cycle.loginSuccess(req, res, user);
        }else{
          waterlock.cycle.loginFailure(req, res, user, {error: 'Invalid '+scope.type+' or password'});
        }
      } else {
        //TODO redirect to register
        waterlock.cycle.loginFailure(req, res, null, {error: 'user not found'});
      }
    });
  }
};
