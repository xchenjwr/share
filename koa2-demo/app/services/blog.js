"use strict";
const { Op } = require("sequelize");
const MySequelize = require("../../lib/sequelize");

const blog = {
  async edit(author, content, filepath) {
    try {
      await MySequelize.models.blog.create({
        author,
        content,
        filepath: JSON.stringify(filepath),
        time: Date.parse(new Date()) / 1000,
      });
    } catch (err) {
      throw { code: 500, message: err.message };
    }
    return true;
  },
  async remove(author, blogid) {
    let result;
    try {
      result = await MySequelize.models.blog.findOne({
        attributes: ["filepath"],
        where: {
          id: blogid,
          author,
        },
      });
      MySequelize.models.blog.destroy({
        where: {
          id: blogid,
          author,
        },
      });
    } catch (err) {
      throw { code: 500, message: err.message };
    }
    return result;
  },
  async updata(blogid, author, content, filepath) {
    let t = await MySequelize.transaction();
    let result;
    try {
      result = await MySequelize.models.blog.findOne({
        attributes: ["filepath"],
        where: {
          id: blogid,
          author,
        },
      });
      await MySequelize.models.blog.destroy(
        {
          where: {
            id: blogid,
            author,
          },
        },
        { transaction: t }
      );
      await MySequelize.models.blog.create(
        {
          author,
          content,
          filepath: JSON.stringify(filepath),
          time: Date.parse(new Date()) / 1000,
        },
        { transaction: t }
      );
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw { code: 500, message: err.message };
    }
    return result;
  },
  async search(keyword = "", type = "hot", page = 1, num = 10) {
    let options = {
      where: {},
      order: [],
      attributes: {
        include: [],
      },
    };
    if (keyword != undefined) {
      options.where.content = {
        [Op.substring]: `%${keyword}%`,
      };
    }
    if (type == "hot") {
      options.order.push(["likes", "DESC"]);
    } else if (type == "time") {
      options.order.push(["time", "DESC"]);
    }
    options.limit = parseInt(num);
    options.offset = (page - 1) * num;
    const result = await MySequelize.models.blog.findAll({
      ...options,
      attributes: ["id"],
    });
    return result;
  },
  async getData(blogid) {
    const result = await MySequelize.models.blog.findOne({
      where: {
        id: blogid,
      },
      include: [
        {
          model: MySequelize.models.user,
          attributes: ["id", "headimg", "username"],
        },
      ],
    });
    return result;
  },
  async getUserBlog(userid, page = 1, num = 10) {
    const result = await MySequelize.models.blog.findAll({
      where: {
        author: userid,
      },
      attributes: ["id"],
      order: [["time", "DESC"]],
      limit: parseInt(num),
      offset: (page - 1) * num,
    });
    return result;
  },
  async islike(userid, blogid) {
    const result = await MySequelize.models.like.findOne({
      where: {
        userid,
        blogid,
      },
    });
    return result == null ? false : true;
  },
  async togglelike(userid, blogid) {
    let toggle = await this.islike(userid, blogid);
    if (toggle) {
      await MySequelize.transaction(async (t) => {
        await MySequelize.models.like.destroy({
          where: {
            userid,
            blogid,
          },
          transaction: t,
        });
        await MySequelize.models.blog.increment(
          { likes: -1 },
          {
            where: {
              id: blogid,
            },
            transaction: t,
          }
        );
      });
    } else {
      await MySequelize.transaction(async (t) => {
        await MySequelize.models.like.create(
          {
            userid,
            blogid,
          },
          { transaction: t }
        );
        await MySequelize.models.blog.increment(
          { likes: 1 },
          {
            where: {
              id: blogid,
            },
            transaction: t,
          }
        );
      });
    }
    return toggle;
  },
  async comment(userid, blogid, content) {
    await MySequelize.transaction(async (t) => {
      await MySequelize.models.comment.create(
        {
          userid,
          blogid,
          content,
          time: Date.parse(new Date()) / 1000,
        },
        { transaction: t }
      );
      await MySequelize.models.blog.increment(
        { comments: 1 },
        {
          where: {
            id: blogid,
          },
          transaction: t,
        }
      );
    });
  },
  async isclike(userid, commentid) {
    const result = await MySequelize.models.comment_like.findOne({
      where: {
        userid,
        commentid,
      },
    });
    return result == null ? false : true;
  },
  async toggleclike(userid, commentid) {
    let toggle = await this.isclike(userid, commentid);
    if (toggle) {
      await MySequelize.transaction(async (t) => {
        await MySequelize.models.comment_like.destroy({
          where: {
            userid,
            commentid,
          },
          transaction: t,
        });
        await MySequelize.models.comment.increment(
          { likes: -1 },
          {
            where: {
              id: commentid,
            },
            transaction: t,
          }
        );
      });
    } else {
      await MySequelize.transaction(async (t) => {
        await MySequelize.models.comment_like.create(
          {
            userid,
            commentid,
          },
          { transaction: t }
        );
        await MySequelize.models.comment.increment(
          { likes: 1 },
          {
            where: {
              id: commentid,
            },
            transaction: t,
          }
        );
      });
    }
    return toggle;
  },
  async getComment(blogid, page = 1, num = 10, userid) {
    const result = await MySequelize.models.comment.findAll({
      where: {
        blogid,
      },
      include: [
        {
          model: MySequelize.models.user,
          attributes: ["id", "headimg", "username"],
        },
      ],
      order: [["likes", "DESC"]],
      limit: parseInt(num),
      offset: (page - 1) * num,
    });
    let data = JSON.stringify(result);
    let _data = JSON.parse(data);
    _data.forEach(async (item, index) => {
      if (userid != "") {
        _data[index].islike = await this.isclike(userid, item.id);
      } else {
        _data[index].islike = false;
      }
    });

    return _data;
  },
  async getLikeBlog(userid, page = 1, num = 10) {
    const result = await MySequelize.models.like.findAll({
      where: {
        userid,
      },
      attributes: ["blogid"],
      limit: parseInt(num),
      offset: (page - 1) * num,
    });
    console.log(result);
    return result;
  },
};

module.exports = blog;
