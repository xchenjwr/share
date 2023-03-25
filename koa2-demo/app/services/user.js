"use strict";
const { Op } = require("sequelize");
const MySequelize = require("../../lib/sequelize");
const user = {
  async checkopenid(openid) {
    const result = await MySequelize.models.user.findOne({
      where: {
        openid,
      },
    });
    return result == null ? false : result.id;
  },
  async register(username, openid) {
    await MySequelize.models.user.create({
      openid,
      username,
      time: Date.parse(new Date()) / 1000,
    });
  },
  async search(keyword, page = 1, num = 10) {
    const result = await MySequelize.models.user.findAll({
      where: {
        username: {
          [Op.substring]: `%${keyword}%`,
        },
      },
      attributes: ["id", "headimg", "username"],
      order: [["fan", "DESC"]],
      limit: parseInt(num),
      offset: (page - 1) * num,
    });
    return result;
  },
  async getData(userid) {
    const result = await MySequelize.models.user.findOne({
      where: {
        id: userid,
      },
      attributes: { exclude: ["openid"] },
    });
    return result;
  },
  async updata(userid, key, value) {
    let option = {};
    switch (key) {
      case "headimg":
        option.headimg = value;
        break;
      case "username":
        option.username = value;
        break;
      case "sex":
        option.sex = value;
        break;
      case "age":
        option.age = value;
        break;
    }
    const result = await this.getData(userid);
    await MySequelize.models.user.update(option, {
      where: { id: userid },
    });
    return result;
  },
  async isfan(userid, useredid) {
    const result = await MySequelize.models.fan.findOne({
      where: {
        userid,
        useredid,
      },
    });
    return result == null ? false : true;
  },
  async togglefollow(userid, useredid) {
    let toggle = await this.isfan(userid, useredid);
    if (toggle) {
      await MySequelize.transaction(async (t) => {
        await MySequelize.models.fan.destroy({
          where: {
            userid,
            useredid,
          },
          transaction: t,
        });
        await MySequelize.models.user.increment(
          { follow: -1 },
          {
            where: {
              id: userid,
            },
            transaction: t,
          }
        );
        await MySequelize.models.user.increment(
          { fan: -1 },
          {
            where: {
              id: useredid,
            },
            transaction: t,
          }
        );
      });
    } else {
      await MySequelize.transaction(async (t) => {
        await MySequelize.models.fan.create(
          {
            userid,
            useredid,
          },
          { transaction: t }
        );
        await MySequelize.models.user.increment(
          { follow: 1 },
          {
            where: {
              id: userid,
            },
            transaction: t,
          }
        );
        await MySequelize.models.user.increment(
          { fan: 1 },
          {
            where: {
              id: useredid,
            },
            transaction: t,
          }
        );
      });
    }
    return toggle;
  },
  async getList(type, userid, page = 1, num = 10) {
    let option = {};
    let as = "";
    let attributes = [];
    if (type == "fan") {
      option.useredid = userid;
      as = "fantab";
    } else if (type == "follow") {
      option.userid = userid;
      as = "followtab";
    }
    const result = await MySequelize.models.fan.findAll({
      where: option,
      attributes,
      include: [
        {
          model: MySequelize.models.user,
          as,
          attributes: ["id", "headimg", "username"],
        },
      ],
      limit: parseInt(num),
      offset: (page - 1) * num,
    });
    return result;
  },
  async getLikeCount(userid) {
    const result = await MySequelize.models.blog.findAll({
      where: {
        author: userid,
      },
      attributes: [[MySequelize.fn("sum", MySequelize.col("likes")), "count"]],
    });
    return result;
  },
};

module.exports = user;
