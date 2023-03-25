"use strict";

const Router = require("koa-router");
const jwtMiddleware = require("../middlewares/jwt");
const verifiy = require("../middlewares/verifiy");
const controllers = require("../controllers");
const router = new Router();

router.prefix("/api");
router.use(jwtMiddleware);
router.use(verifiy);
router.get("/", controllers.user.index);

router.post("/blog/edit", controllers.blog.edit);
router.post("/blog/remove", controllers.blog.remove);
router.post("/blog/updata", controllers.blog.updata);
router.get("/blog/islike", controllers.blog.islike);
router.post("/blog/togglelike", controllers.blog.togglelike);
router.get("/blog/getLikeBlog", controllers.blog.getLikeBlog);

router.post("/comment/edit", controllers.blog.comment);
router.post("/comment/toggleclike", controllers.blog.toggleclike);

router.post("/user/updata", controllers.user.updata);
router.get("/user/isfan", controllers.user.isfan);
router.post("/user/togglefollow", controllers.user.togglefollow);
module.exports = router;
