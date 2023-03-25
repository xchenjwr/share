"use strict";

const blog = {
  async edit(ctx, next) {
    let _filepath = ctx.helper.postToArray(ctx.request.body.filepath);
    let _deletepath = ctx.helper.postToArray(ctx.request.body.deletepath);
    switch (ctx.request.body.type) {
      case "upload":
        let uploadfile = [];
        for (let i in ctx.request.files) {
          uploadfile.push(
            ctx.helper.baseTowww(
              ctx.config.baseUrl,
              ctx.request.files[i].filepath
            )
          );
        }
        ctx.data = uploadfile;
        ctx.msg = "上传成功";
        break;
      case "delete":
        let deletefile = [];
        _deletepath.forEach((item) => {
          deletefile.push(ctx.helper.wwwTobase(item));
        });
        ctx.helper.clsupload(deletefile);
        ctx.data = true;
        ctx.msg = "删除成功";
        break;
      case "submit":
        if (
          (ctx.request.body == undefined ||
            ctx.request.body.content == undefined ||
            ctx.request.body.content == "") &&
          (_filepath == undefined || _filepath.length == 0)
        ) {
          throw { code: 400, message: "发表失败,文字和图片不能都为空" };
        }
        let filepath = [];
        if (ctx.request.files != undefined) {
          for (let i in ctx.request.files) {
            filepath.push(
              ctx.helper.baseTowww(
                ctx.config.baseUrl,
                ctx.request.files[i].filepath
              )
            );
          }
        } else {
          filepath = _filepath;
        }
        await ctx.services.blog.edit(
          ctx.jwtData.userid,
          ctx.request.body.content,
          filepath
        );
        ctx.data = true;
        ctx.msg = "发表成功";
        break;
    }
    await next();
  },
  async remove(ctx, next) {
    const result = await ctx.services.blog.remove(
      ctx.jwtData.userid,
      ctx.request.body.blogid
    );
    let _data = JSON.parse(result.filepath);
    let filepath = [];
    _data.forEach((item) => {
      filepath.push(ctx.helper.wwwTobase(item));
    });
    ctx.helper.clsupload(filepath);
    ctx.data = true;
    ctx.msg = "删除成功";
    return next ? next() : "";
  },
  async updata(ctx, next) {
    let _filepath = ctx.helper.postToArray(ctx.request.body.filepath);
    let _deletepath = ctx.helper.postToArray(ctx.request.body.deletepath);

    switch (ctx.request.body.type) {
      case "upload":
        let uploadfile = [];
        for (let i in ctx.request.files) {
          uploadfile.push(
            ctx.helper.baseTowww(
              ctx.config.baseUrl,
              ctx.request.files[i].filepath
            )
          );
        }
        ctx.data = uploadfile;
        ctx.msg = "上传成功";
        break;
      case "clsfile":
        let deletepath = [];
        _deletepath.forEach((_item) => {
          deletepath.push(ctx.helper.wwwTobase(_item));
        });
        ctx.helper.clsupload(deletepath);
        ctx.data = true;
        ctx.msg = "清除成功";
        break;
      case "submit":
        if (
          (ctx.request.body == undefined ||
            ctx.request.body.content == undefined ||
            ctx.request.body.content == "") &&
          (_filepath == undefined || _filepath.length == 0)
        ) {
          throw { code: 400, message: "发表失败,文字和图片不能都为空" };
        }
        await ctx.services.blog.remove(
          ctx.jwtData.userid,
          ctx.request.body.blogid
        );
        let deletefile = [];
        _deletepath.forEach((item) => {
          deletefile.push(ctx.helper.wwwTobase(item));
        });
        ctx.helper.clsupload(deletefile);
        let filepath = [];
        if (ctx.request.files != undefined) {
          for (let i in ctx.request.files) {
            filepath.push(
              ctx.helper.baseTowww(
                ctx.config.baseUrl,
                ctx.request.files[i].filepath
              )
            );
          }
        } else {
          filepath = _filepath;
        }
        await ctx.services.blog.edit(
          ctx.jwtData.userid,
          ctx.request.body.content,
          filepath
        );
        ctx.data = true;
        ctx.msg = "更新成功";
        break;
    }
    await next();
  },
  async search(ctx, next) {
    let result = await ctx.services.blog.search(
      ctx.request.query.keyword,
      ctx.request.query.type,
      ctx.request.query.page,
      ctx.request.query.num
    );
    result.forEach((item, index) => {
      result[index] = item.id;
    });
    ctx.data = result;
    return next();
  },
  async getData(ctx, next) {
    let result = await ctx.services.blog.getData(ctx.request.query.blogid);
    result.filepath = JSON.parse(result.filepath);
    ctx.data = result;
    return next();
  },
  async getUserBlog(ctx, next) {
    let result = await ctx.services.blog.getUserBlog(
      ctx.request.query.userid,
      ctx.request.query.page,
      ctx.request.query.num
    );
    result.forEach((item, index) => {
      result[index] = item.id;
    });
    ctx.data = result;
    return next();
  },
  async islike(ctx, next) {
    const result = await ctx.services.blog.islike(
      ctx.jwtData.userid,
      ctx.request.query.blogid
    );
    ctx.data = result;
    ctx.msg = result ? "已点赞" : "未点赞";
    await next();
  },
  async togglelike(ctx, next) {
    const result = await ctx.services.blog.togglelike(
      ctx.jwtData.userid,
      ctx.request.body.blogid
    );
    ctx.data = true;
    ctx.msg = result ? "取消点赞成功" : "点赞成功";
    await next();
  },
  async comment(ctx, next) {
    await ctx.services.blog.comment(
      ctx.jwtData.userid,
      ctx.request.body.blogid,
      ctx.request.body.content
    );
    ctx.data = true;
    ctx.msg = "评论成功";
    await next();
  },
  async toggleclike(ctx, next) {
    const result = await ctx.services.blog.toggleclike(
      ctx.jwtData.userid,
      ctx.request.body.commentid
    );
    ctx.data = true;
    ctx.msg = result ? "取消点赞成功" : "点赞成功";
    await next();
  },
  async getComment(ctx, next) {
    const result = await ctx.services.blog.getComment(
      ctx.request.query.blogid,
      ctx.request.query.page,
      ctx.request.query.num,
      ctx.jwtData != undefined ? ctx.jwtData.userid : ""
    );
    ctx.data = result;
    ctx.msg = "获取评论成功";
    await next();
  },
  async getLikeBlog(ctx, next) {
    const result = await ctx.services.blog.getLikeBlog(
      ctx.jwtData.userid,
      ctx.request.query.page,
      ctx.request.query.num
    );
    result.forEach((item, index) => {
      result[index] = item.blogid;
    });
    ctx.data = result;
    return next();
  },
};

module.exports = blog;
