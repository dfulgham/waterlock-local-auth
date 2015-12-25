'use strict';
var _ = require('lodash');
var authConfig = require('./waterlock-local-auth').authConfig;

/**
 * TODO these can be refactored later
 * @type {Object}
 */

module.exports = function(Auth, engine){
  var def = Auth.definition;

  if(!_.isUndefined(def.loc_email)){
    return generateScope('loc_email', engine);
  }else if(typeof def.loc_username !== 'undefined'){
    return generateScope('loc_username', engine);
  }else{
    var error = new Error('Auth model must have either an loc_email or loc_username attribute');
    throw error;
  }
};

function generateScope(scopeKey, engine){
  return {
    type: scopeKey,
    engine: engine,

    registerUserAuthObject: function(attributes, req, cb) {
      var self = this;
      var attr = {
        loc_password: attributes.loc_password
      };
      attr[scopeKey] = attributes[scopeKey];

      var criteria = {};
      criteria[scopeKey] = attr[scopeKey];

      this.engine.findAuth(criteria, function(err, user) {
        if (user) {
          cb();
        }
        self.engine.findOrCreateAuth(criteria, attr, cb);
      });

    },
    getUserAuthObject: function(attributes, req, cb){
      var attr = {loc_password: attributes.loc_password};
      attr[scopeKey] = attributes[scopeKey];

      var criteria = {};
      criteria[scopeKey] = attr[scopeKey];

      if(authConfig.createOnNotFound){
        this.engine.findOrCreateAuth(criteria, attr, cb);
      }else{
        this.engine.findAuth(criteria, cb);
      }
    }
  };
}
