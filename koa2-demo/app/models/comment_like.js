"use strict";

const MySequelize = require("../../lib/sequelize");
const { DataTypes } = require("sequelize");

const CommentLike = MySequelize.define(
  "comment_like",
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
        fields: ["userid", "commentid"],
      },
    ],
  }
);
module.exports = CommentLike;
