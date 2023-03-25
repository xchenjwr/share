"use strict";

const MySequelize = require("../../lib/sequelize");
const { DataTypes } = require("sequelize");
const config = require("../../config");
const User = MySequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    openid: {
      type: DataTypes.STRING(28),
      allowNull: false,
    },
    headimg: {
      type: DataTypes.STRING,
      defaultValue: config.baseUrl + "default.jpeg",
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    sex: {
      type: DataTypes.ENUM("男", "女"),
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fan: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    follow: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    indexes: [
      { unique: true, fields: ["openid"] },
      { unique: true, fields: ["username"] },
    ],
  }
);

module.exports = User;
