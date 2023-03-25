const joi = require("joi");
const rules = [
  {
    path: "/api",
    schema: joi.object({}),
  },
  {
    path: "/api/login",
    schema: joi.object({
      code: joi.string().required(),
    }),
  },
  {
    path: "/api/user/search",
    schema: joi.object({
      keyword: joi.string().min(1).max(50).required(),
      page: joi.number().integer().min(1).required(),
      num: joi.number().integer().min(1).max(20).required(),
    }),
  },
  {
    path: "/api/user/getData",
    schema: joi.object({
      userid: joi.number().integer().required(),
    }),
  },
  {
    path: "/api/blog/search",
    schema: joi.object({
      keyword: joi.string().min(0).max(50).required(),
      type: joi.string().valid("hot", "time").required(),
      page: joi.number().integer().min(1).required(),
      num: joi.number().integer().min(1).max(20).required(),
    }),
  },
  {
    path: "/api/blog/edit",
    schema: joi.object({
      type: joi.string().valid("upload", "delete", "submit").required(),
      content: joi.string().max(500).allow(""),
      deletepath: joi
        .alternatives()
        .try(joi.string(), joi.array().min(1).max(9)),
      filepath: joi.alternatives().try(joi.string(), joi.array().min(1).max(9)),
    }),
  },
  {
    path: "/api/blog/updata",
    schema: joi.object({
      blogid: joi.number().integer().required(),
      type: joi.string().valid("upload", "clsfile", "submit").required(),
      content: joi.string().max(500).allow(""),
      deletepath: joi
        .alternatives()
        .try(joi.string(), joi.array().min(1).max(9)),
      filepath: joi.alternatives().try(joi.string(), joi.array().min(1).max(9)),
    }),
  },
  {
    path: "/api/blog/remove",
    schema: joi.object({
      blogid: joi.number().integer().required(),
    }),
  },
  {
    path: "/api/blog/getData",
    schema: joi.object({
      blogid: joi.number().integer().required(),
    }),
  },
  {
    path: "/api/blog/getData",
    schema: joi.object({
      blogid: joi.number().integer().required(),
    }),
  },
  {
    path: "/api/user/updata",
    schema: joi.object({
      key: joi.string().valid("headimg", "username", "sex", "age").required(),
      value: joi.required(),
    }),
  },
  {
    path: "/api/blog/getUserBlog",
    schema: joi.object({
      userid: joi.number().required(),
      page: joi.number().integer().min(1).required(),
      num: joi.number().integer().min(1).max(20).required(),
    }),
  },
  {
    path: "/api/blog/islike",
    schema: joi.object({
      blogid: joi.number().required(),
    }),
  },
  {
    path: "/api/blog/togglelike",
    schema: joi.object({
      blogid: joi.number().required(),
    }),
  },
  {
    path: "/api/comment/edit",
    schema: joi.object({
      blogid: joi.number().required(),
      content: joi.string().min(1),
    }),
  },
  {
    path: "/api/comment/toggleclike",
    schema: joi.object({
      commentid: joi.number().required(),
    }),
  },
  {
    path: "/api/comment/getData",
    schema: joi.object({
      blogid: joi.number().required(),
      page: joi.number().integer().min(1).required(),
      num: joi.number().integer().min(1).max(20).required(),
    }),
  },
  {
    path: "/api/blog/getLikeBlog",
    schema: joi.object({
      page: joi.number().integer().min(1).required(),
      num: joi.number().integer().min(1).max(20).required(),
    }),
  },
  {
    path: "/api/user/isfan",
    schema: joi.object({
      useredid: joi.number().required(),
    }),
  },
  {
    path: "/api/user/togglefollow",
    schema: joi.object({
      useredid: joi.number().required(),
    }),
  },
  {
    path: "/api/user/getList",
    schema: joi.object({
      type: joi.string().valid("fan", "follow").required(),
      userid: joi.number().required(),
      page: joi.number().integer().min(1).required(),
      num: joi.number().integer().min(1).max(20).required(),
    }),
  },
];
module.exports = async (ctx, next) => {
  let data;
  if (ctx.request.method == "GET") {
    data = ctx.request.query;
  } else if (ctx.request.method == "POST") {
    if (ctx.request.body == undefined) {
      data = {};
    } else {
      data = ctx.request.body;
    }
  }
  let schema;
  let result = rules.some((item) => {
    if (item.path == ctx.request.path) {
      schema = item.schema;
      return true;
    }
  });
  try {
    if (!result) {
      throw { code: 404, message: "不存在的接口" };
    }
    await schema.validateAsync(data);
  } catch (err) {
    throw { code: 400, message: err.message };
  }
  await next();
};
