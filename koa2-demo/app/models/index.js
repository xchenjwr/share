"use strict";
const fs = require("fs");
const files = fs.readdirSync(__dirname).filter((file) => file !== "index.js");
const MySequelize = require("../../lib/sequelize");

module.exports = (() => {
  for (const file of files) {
    if (file.toLowerCase().endsWith("js")) {
      require(`./${file}`);
    }
  }
  MySequelize.models.blog.belongsTo(MySequelize.models.user, {
    foreignKey: "author",
    onDelete: "CASCADE",
  });
  MySequelize.models.like.belongsTo(MySequelize.models.user, {
    foreignKey: "userid",
    onDelete: "CASCADE",
  });
  MySequelize.models.like.belongsTo(MySequelize.models.blog, {
    foreignKey: "blogid",
    onDelete: "CASCADE",
  });
  MySequelize.models.comment.belongsTo(MySequelize.models.user, {
    foreignKey: "userid",
    onDelete: "CASCADE",
  });
  MySequelize.models.comment.belongsTo(MySequelize.models.blog, {
    foreignKey: "blogid",
    onDelete: "CASCADE",
  });
  MySequelize.models.comment_like.belongsTo(MySequelize.models.user, {
    foreignKey: "userid",
    onDelete: "CASCADE",
  });
  MySequelize.models.comment_like.belongsTo(MySequelize.models.comment, {
    foreignKey: "commentid",
    onDelete: "CASCADE",
  });
  MySequelize.models.fan.belongsTo(MySequelize.models.user, {
    foreignKey: "userid",
    onDelete: "CASCADE",
    as: "fantab",
  });
  MySequelize.models.fan.belongsTo(MySequelize.models.user, {
    foreignKey: "useredid",
    onDelete: "CASCADE",
    as: "followtab",
  });
  MySequelize.sync({ alter: true });
})();
