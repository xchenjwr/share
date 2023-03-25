"use strict";
const Router = require("koa-router");
const controllers = require("../controllers");
const verifiy = require("../middlewares/verifiy");

const router = new Router();
router.prefix("/api");
router.use(verifiy);

router.post("/login", controllers.user.login);

router.get("/user/search", controllers.user.search);
router.get("/user/getData", controllers.user.getData);
router.get("/user/getList", controllers.user.getList);

router.get("/blog/search", controllers.blog.search);
router.get("/blog/getData", controllers.blog.getData);
router.get("/blog/getUserBlog", controllers.blog.getUserBlog);

router.get("/comment/getData", controllers.blog.getComment);

module.exports = router;
