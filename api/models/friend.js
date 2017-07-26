'use strict';
module.exports = function(sequelize, DataTypes) {
  var friend = sequelize.define('friend', {
    friendName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  });
  friend.associate =  function(models) {
      friend.belongsTo(models.user,{sourceKey:"userId"});
  }
  return friend;
};
