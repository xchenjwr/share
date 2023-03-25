"use strict";
const jwt = require("jsonwebtoken");
const request = require("request");
const user = {
  async index(ctx, next) {
    const userid = ctx.jwtData.userid;
    const result = await ctx.services.user.getData(userid);
    ctx.data = result;
    return next();
  },
  async login(ctx, next) {
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=wx4d2c9de2d4319a41&secret=56a2806ae7f6bcb600781aff53bcdfb0&js_code=${ctx.request.body.code}&grant_type=authorization_code`;
    let result = new Promise((resolve, reject) => {
      request(url, async (error, response, body) => {
        if (error) {
          reject(error.errmsg);
        } else {
          resolve(JSON.parse(body).openid);
        }
      });
    });
    await result
      .then(async (res) => {
        let isOld = await ctx.services.user.checkopenid(res);
        if (!isOld) {
          const username = "用户" + Date.parse(new Date()) / 1000;
          await ctx.services.user.register(username, res);
          isOld = await ctx.services.user.checkopenid(res);
        }
        const token = jwt.sign({ userid: isOld }, ctx.config.secret);
        ctx.data = token;
        ctx.msg = "登录成功";
      })
      .catch((err) => {
        ctx.logger.error(err);
        ctx.data = false;
        ctx.msg = "登录失败";
      });
    await next();
  },
  async search(ctx, next) {
    const result = await ctx.services.user.search(
      ctx.request.query.keyword,
      ctx.request.query.page,
      ctx.request.query.num
    );
    ctx.data = result;
    return next();
  },
  async getData(ctx, next) {
    let result = await ctx.services.user.getData(ctx.request.query.userid);
    let _result = await ctx.services.user.getLikeCount(result.id);
    result = JSON.parse(JSON.stringify(result));
    result.count = JSON.parse(JSON.stringify(_result))[0].count;
    ctx.data = result;
    return next();
  },
  async updata(ctx, next) {
    let value;
    if (ctx.request.body.key == "headimg") {
      value = ctx.helper.baseTowww(
        ctx.config.baseUrl,
        ctx.request.files.file.filepath
      );
    } else if (
      (ctx.request.body.key == "sex" || ctx.request.body.key == "age") &&
      ctx.request.body.value == ""
    ) {
      value = null;
    } else {
      value = ctx.request.body.value;
    }
    const result = await ctx.services.user.updata(
      ctx.jwtData.userid,
      ctx.request.body.key,
      value
    );
    if (
      ctx.request.body.key == "headimg" &&
      result.headimg.indexOf("upload") != -1
    ) {
      let delpath = [];
      delpath.push(ctx.helper.wwwTobase(result.headimg));
      ctx.helper.clsupload(delpath);
    }
    ctx.data = true;
    ctx.msg = "更新成功";
    return next();
  },
  async isfan(ctx, next) {
    const result = await ctx.services.user.isfan(
      ctx.jwtData.userid,
      ctx.request.query.useredid
    );
    ctx.data = result;
    ctx.msg = result ? "已关注" : "未关注";
    await next();
  },
  async togglefollow(ctx, next) {
    const result = await ctx.services.user.togglefollow(
      ctx.jwtData.userid,
      ctx.request.body.useredid
    );
    ctx.data = true;
    ctx.msg = result ? "取消关注成功" : "关注成功";
    await next();
  },
  async getList(ctx, next) {
    const result = await ctx.services.user.getList(
      ctx.request.query.type,
      ctx.request.query.userid,
      ctx.request.query.page,
      ctx.request.query.num
    );
    result.forEach((item, index) => {
      result[index] = item[ctx.request.query.type + "tab"];
    });
    ctx.data = result;
    ctx.msg = "获取成功";
    await next();
  },
};

module.exports = user;
