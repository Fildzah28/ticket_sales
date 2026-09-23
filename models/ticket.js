'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, { foreignKey: 'userID'});
      this.belongsTo(models.event, { foreignKey: 'eventID'});
      this.belongsTo(models.seat, { foreignKey: 'seatID'});
      this.belongsTo(models.diskon, { foreignKey: 'diskonID'});
    }
  }
  ticket.init({
    ticketID: {
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
       type: DataTypes.INTEGER
    },
    eventID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    seatID: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    diskonID: DataTypes.INTEGER,
    bookedDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ticket',
  });
  return ticket;
};