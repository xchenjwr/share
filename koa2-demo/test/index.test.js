const supertest = require("supertest");
const { expect } = require("chai");
const path = require("path");

const app = require("../app/app");
const request = supertest(app.listen(3001));
require("../app/models"); //执行models下的文件,将模型挂载
const account = (Date.parse(new Date()) / 1000).toString();
let blogid = 349;
let commentid = 15;
let token;
let deletepath = [];
let filepath = [];
let addpath = [];
describe("# 注册测试", () => {
  it("正常测试", (done) => {
    request
      .post("/api/register")
      .send({ account: account, password: "456", repassword: "456" })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equal(true);
        expect(res.body.msg).to.equal("注册成功");
        done();
      });
  });
  it("密码不一致测试", (done) => {
    request
      .post("/api/register")
      .send({ account: "123", password: "456", repassword: "4566" })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equal(false);
        expect(res.body.msg).to.equal("两次密码输入不一致");
        done();
      });
  });
  it("账号重复测试", (done) => {
    request
      .post("/api/register")
      .send({ account: "123", password: "456", repassword: "456" })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equal(false);
        expect(res.body.msg).to.equal("注册失败,账号重复");
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .post("/api/register")
      .send()
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.equal(400);
        done();
      });
  });
});
describe("# 登录测试", () => {
  it("正常测试", (done) => {
    request
      .post("/api/login")
      .send({ account, password: "456" })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.msg).to.equal("登录成功");
        token = res.body.data;
        done();
      });
  });
  it("账号不存在测试", (done) => {
    request
      .post("/api/login")
      .send({ account: "12", password: "456" })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equal(false);
        expect(res.body.msg).to.equal("账号不存在");
        done();
      });
  });
  it("错密码测试", (done) => {
    request
      .post("/api/login")
      .send({ account: "123", password: "45" })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equal(false);
        expect(res.body.msg).to.equal("账号或密码错误");
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .post("/api/login")
      .send()
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.equal(400);
        done();
      });
  });
});
describe("# token测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data.id).to.be.an("number");
        done();
      });
  });
  it("不带token测试", (done) => {
    request
      .get("/api")

      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(403);
        done();
      });
  });
  it("错token测试", (done) => {
    request
      .get("/api")
      .set("Authorization", `Bearer 1`)

      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(403);
        done();
      });
  });
});
describe("# 分享测试", () => {
  it("正常测试begin+", (done) => {
    request
      .post("/api/blog/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("type", "upload")
      .attach("file", path.join(__dirname, "../app/public/default.jpeg"))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        filepath = [...filepath, ...res.body.data];
        expect(res.body.msg).to.equals("上传成功");
        done();
      });
  });
  it("正常测试续1+", (done) => {
    request
      .post("/api/blog/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("type", "upload")
      .attach("file", path.join(__dirname, "../app/public/default.jpeg"))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        filepath = [...filepath, ...res.body.data];
        expect(res.body.msg).to.equals("上传成功");
        done();
      });
  });
  it("正常测试续2+", (done) => {
    request
      .post("/api/blog/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("type", "upload")
      .attach("file", path.join(__dirname, "../app/public/default.jpeg"))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        filepath = [...filepath, ...res.body.data];
        expect(res.body.msg).to.equals("上传成功");
        done();
      });
  });
  it("正常测试续3-", (done) => {
    deletepath = [];
    deletepath.push(filepath[filepath.length - 2]);
    request
      .post("/api/blog/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("type", "delete")
      .field("deletepath", deletepath)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("删除成功");
        for (let i = filepath.length - 2; i < filepath.length; i++) {
          filepath[i] = filepath[i + 1];
        }
        filepath.pop();
        done();
      });
  });
  it("正常测试end", (done) => {
    request
      .post("/api/blog/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("type", "submit")
      .field("content", "test123")
      .field("filepath", filepath)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("发表成功");
        done();
      });
  });
  it("内容超出测试", (done) => {
    request
      .post("/api/blog/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("type", "submit")
      .field(
        "content",
        `我的邻居李阿姨是四川人，因为那场大地震失去自己的儿女，成了一个失去儿女的孤独阿姨。李阿姨虽然失去自己的儿女，但是周围的孩子对她都很尊重，因此她把周围的孩子当做自己的孩子来疼爱。
      记得那一天下午，天突然下起了鹅毛般的大雪。放学时候，每个同学都冻得缩成一团，等待父母来送衣物。一些同学的父母来得早送衣物给他的儿女早就回家了，而我只好在教室里焦急的等待妈妈送衣物给我。这是李阿姨正好下班，她看见我冻成这个样子，马上把身上唯一能取暖的大衣脱了，往我身上盖，全身发抖的说：“快把这件大衣穿上，要么就会冻病了，快穿。”阿姨你不冷吗？”我哆嗦的问。阿姨想用手取暖的说：“我不冷，阿姨的身体比你强壮，冻一会没什么问题。”“难道阿姨真的不冷吗？不是的，李阿姨看见我冷，仿佛就看见自己的儿女也在冷，就自由的想把自己身上的大衣脱下来给我穿。当时，她每发抖一下，我的心有一种说不出的感谢。当我走到家里，李阿姨已经冻得像一块冰一样，但她还是装作没事的样子说：“我没事，你放心回家吧。”听到这句话，我感动的快要流泪。
      第二天，我才知道李阿姨生病了，我知道李阿姨是因为我才生病的，我经过这次才真正了解李阿姨真的很爱每个孩子。虽然这次我没有去探望李阿姨（在这场大雪中，我也生病了）但是我永远不会忘记。每当下雪时走在路上，我的头里就会浮现李阿姨送我回家的情景。
      `
      )
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.equal(400);
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .post("/api/blog/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("type", "submit")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.equal(400);
        done();
      });
  });
});
describe("# 更新分享测试", () => {
  it("正常测试begin+", (done) => {
    addpath = [];
    deletepath = [];
    request
      .post("/api/blog/updata")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", blogid)
      .field("type", "upload")
      .attach("file", path.join(__dirname, "../app/public/default.jpeg"))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        filepath = [...filepath, ...res.body.data];
        addpath = [...addpath, ...res.body.data];
        expect(res.body.msg).to.equals("上传成功");
        done();
      });
  });
  it("正常测试续1+-", (done) => {
    request
      .post("/api/blog/updata")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", blogid)
      .field("type", "upload")
      .attach("file", path.join(__dirname, "../app/public/default.jpeg"))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        filepath = [...filepath, ...res.body.data];
        addpath = [...addpath, ...res.body.data];
        deletepath.push(filepath[filepath.length - 3]);
        for (let i = filepath.length - 3; i < filepath.length; i++) {
          filepath[i] = filepath[i + 1];
        }
        filepath.pop();
        expect(res.body.msg).to.equals("上传成功");
        done();
      });
  });
  it("正常测试end", (done) => {
    request
      .post("/api/blog/updata")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", blogid)
      .field("type", "submit")
      .field("content", "再次updata123")
      .field("filepath", filepath)
      .field("deletepath", deletepath)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("更新成功");
        done();
      });
  });
  it("取消更新测试begin+", (done) => {
    addpath = [];
    deletepath = [];
    request
      .post("/api/blog/updata")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", blogid)
      .field("type", "upload")
      .attach("file", path.join(__dirname, "../app/public/default.jpeg"))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        filepath = [...filepath, ...res.body.data];
        addpath = [...addpath, ...res.body.data];
        expect(res.body.msg).to.equals("上传成功");
        done();
      });
  });
  it("取消更新测试续1+", (done) => {
    request
      .post("/api/blog/updata")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", blogid)
      .field("type", "upload")
      .attach("file", path.join(__dirname, "../app/public/default.jpeg"))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        filepath = [...filepath, ...res.body.data];
        addpath = [...addpath, ...res.body.data];
        expect(res.body.msg).to.equals("上传成功");
        done();
      });
  });
  it("取消更新测试续2+-", (done) => {
    request
      .post("/api/blog/updata")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", blogid)
      .field("type", "upload")
      .attach("file", path.join(__dirname, "../app/public/default.jpeg"))
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        filepath = [...filepath, ...res.body.data];
        addpath = [...addpath, ...res.body.data];
        deletepath.push(filepath[filepath.length - 3]);
        for (let i = filepath.length - 3; i < filepath.length; i++) {
          filepath[i] = filepath[i + 1];
        }
        filepath.pop();
        expect(res.body.msg).to.equals("上传成功");
        done();
      });
  });
  it("取消更新常测试end", (done) => {
    request
      .post("/api/blog/updata")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", blogid)
      .field("type", "clsfile")
      .field("content", "updata123")
      .field("deletepath", addpath)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("清除成功");
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .post("/api/blog/updata")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(400);
        done();
      });
  });
});
describe("# 移除分享测试", () => {
  it("正常测试", (done) => {
    request
      .post("/api/blog/remove")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", blogid + 1)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("删除成功");
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .post("/api/blog/remove")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(400);
        done();
      });
  });
});
describe("# 搜索用户测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api/user/search")
      .query({ keyword: "用户", page: 1, num: 10 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        if (res.body.data.length != 0) {
          expect(res.body.data[0]).to.be.an("number");
        }
        done();
      });
  });
  it("空参数测试", (done) => {
    request.get("/api/user/search").end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.code).to.be.equal(400);
      done();
    });
  });
});
describe("# 搜索分享测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api/blog/search")
      .query({ keyword: "test", type: "hot", page: 1, num: 10 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        if (res.body.data.length != 0) {
          expect(res.body.data[0]).to.be.an("number");
        }
        done();
      });
  });
  it("空参数测试", (done) => {
    request.get("/api/blog/search").end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.code).to.be.equal(200);
      expect(res.body.data).to.be.an("array");
      if (res.body.data.length != 0) {
        expect(res.body.data[0]).to.be.an("number");
      }
      done();
    });
  });
});
describe("# 获取分享详情测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api/blog/getData")
      .query({ blogid: 298 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data.id).to.be.an("number");
        done();
      });
  });
  it("空参数测试", (done) => {
    request.get("/api/blog/getData").end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.code).to.be.equal(400);
      done();
    });
  });
});
describe("# 获取用户详情测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api/user/getData")
      .query({ userid: 119 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("object");
        done();
      });
  });
  it("空参数测试", (done) => {
    request.get("/api/blog/getData").end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.code).to.be.equal(400);
      done();
    });
  });
});
describe("# 更新用户信息测试", () => {
  it("更新头像", (done) => {
    request
      .post("/api/user/updata")
      .set("Authorization", `Bearer ${token}`)
      .field("key", "headimg")
      .attach("file", path.join(__dirname, "../app/public/default.jpeg"))
      .field("value", "")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.equal(true);
        done();
      });
  });
  it("更新用户名", (done) => {
    request
      .post("/api/user/updata")
      .set("Authorization", `Bearer ${token}`)
      .field("key", "username")
      .field("value", "用户" + account)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.equal(true);
        done();
      });
  });
  it("更改性别", (done) => {
    request
      .post("/api/user/updata")
      .set("Authorization", `Bearer ${token}`)
      .field("key", "sex")
      .field("value", "")
      .end((err, res) => {
        console.log(res.body);
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.equal(true);
        done();
      });
  });
  it("更改年龄", (done) => {
    request
      .post("/api/user/updata")
      .set("Authorization", `Bearer ${token}`)
      .field("key", "age")
      .field("value", 26)
      .end((err, res) => {
        console.log(res.body);
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.equal(true);
        done();
      });
  });
});
describe("# 获取用户分享测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api/blog/getUserBlog")
      .query({ userid: 119, page: 1, num: 10 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        if (res.body.data.length != 0) {
          expect(res.body.data[0]).to.be.an("number");
        }
        done();
      });
  });
  it("空参数测试", (done) => {
    request.get("/api/blog/getUserBlog").end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.code).to.be.equal(400);
      done();
    });
  });
});
describe("# 获取用户分享测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api/blog/getUserBlog")
      .query({ userid: 119, page: 1, num: 10 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        if (res.body.data.length != 0) {
          expect(res.body.data[0]).to.be.an("number");
        }
        done();
      });
  });
  it("空参数测试", (done) => {
    request.get("/api/blog/getUserBlog").end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.code).to.be.equal(400);
      done();
    });
  });
});
describe("# 是否点赞文章测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api/blog/islike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .query({ blogid: blogid + 1 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(false);
        expect(res.body.msg).to.equals("未点赞");
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .get("/api/blog/islike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(400);
        done();
      });
  });
});
describe("# 点赞文章测试", () => {
  it("正常测试", (done) => {
    request
      .post("/api/blog/togglelike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", 298)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("点赞成功");
        done();
      });
  });
  it("正常测试", (done) => {
    request
      .post("/api/blog/togglelike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", 298)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("取消点赞成功");
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .post("/api/blog/togglelike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(400);
        done();
      });
  });
});
describe("# 评论文章测试", () => {
  it("正常测试", (done) => {
    request
      .post("/api/comment/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", 298)
      .field("content", "testcomment123")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("评论成功");
        done();
      });
  });
  it("空内容测试", (done) => {
    request
      .post("/api/comment/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("blogid", 298)
      .field("content", "")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(400);
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .post("/api/comment/edit")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(400);
        done();
      });
  });
});
describe("# 是否点赞评论测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api/comment/isclike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .query({ commentid })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(false);
        expect(res.body.msg).to.equals("未点赞");
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .get("/api/comment/isclike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(400);
        done();
      });
  });
});
describe("# 点赞评论测试", () => {
  it("正常测试", (done) => {
    request
      .post("/api/comment/toggleclike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("commentid", commentid)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("点赞成功");
        done();
      });
  });
  it("正常测试", (done) => {
    request
      .post("/api/comment/toggleclike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .field("commentid", commentid)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.equals(true);
        expect(res.body.msg).to.equals("取消点赞成功");
        done();
      });
  });
  it("空参数测试", (done) => {
    request
      .post("/api/comment/toggleclike")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(400);
        done();
      });
  });
});
describe("# 获取评论测试", () => {
  it("正常测试", (done) => {
    request
      .get("/api/comment/getData")
      .query({ blogid: 298, page: 1, num: 10 })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.data).to.be.an("array");
        if (res.body.data.length != 0) {
          expect(res.body.data[0]).to.be.an("number");
        }
        done();
      });
  });
  it("空参数测试", (done) => {
    request.get("/api/comment/getData").end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.code).to.be.equal(200);
      expect(res.body.data).to.be.an("array");
      if (res.body.data.length != 0) {
        expect(res.body.data[0]).to.be.an("number");
      }
      done();
    });
  });
});
