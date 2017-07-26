'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    userName: DataTypes.STRING
  });
  user.associate =  function(models) {
      user.hasOne(models.friend,{targetKey:"userId"});
  }
  return user;
};
