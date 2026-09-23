'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    static associate(models) {
      // Relasi ke tabel seat
      this.hasMany(models.seat, {
        foreignKey: "eventID",
        as: "eventSeat"
      });

      // Relasi ke tabel ticket
      this.hasMany(models.ticket, {
        foreignKey: "eventID",
        as: "eventTicket"
      });

      // Relasi ke tabel diskon
      this.hasOne(models.diskon, {
        foreignKey: "eventID",
        as: "eventDiskon"
      });
    }
  }

  event.init(
    {
      eventID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      eventName: {
        type: DataTypes.STRING
      },
      eventDate: {
        type: DataTypes.DATE
      },
      venue: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.INTEGER
      },
      image: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: "event"
    }
  );

  return event;
};