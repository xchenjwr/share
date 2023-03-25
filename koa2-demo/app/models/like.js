"use strict";

const MySequelize = require("../../lib/sequelize");
const { DataTypes } = require("sequelize");

const Like = MySequelize.define(
  "like",
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
        fields: ["userid", "blogid"],
      },
    ],
  }
);

module.exports = Like;
