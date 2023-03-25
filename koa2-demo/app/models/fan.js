"use strict";

const MySequelize = require("../../lib/sequelize");
const { DataTypes } = require("sequelize");

const Fan = MySequelize.define(
  "fan",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["userid", "useredid"],
      },
    ],
  }
);

module.exports = Fan;
