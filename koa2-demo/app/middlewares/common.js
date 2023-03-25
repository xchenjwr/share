"use strict";

const config = require("../../config");
const services = require("../services");
const helper = require("../extends/helper");

module.exports = async (ctx, next) => {
  ctx.config = config;
  ctx.services = services;
  ctx.helper = helper;
  await next();
};
