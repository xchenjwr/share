const fs = require("fs");
const path = require("path");
module.exports = {
  clsupload(filepath) {
    try {
      filepath.forEach((file) => {
        fs.unlinkSync(file);
      });
    } catch (e) {
      throw { code: 500, message: "删除文件错误" };
    }
  },
  baseTowww(config, _path) {
    let filepath = config + _path.split("public\\")[1];
    filepath = filepath.replace(/\\/, "/");
    return filepath;
  },
  wwwTobase(_path) {
    let tmp = _path.split("upload")[1];
    let filepath = path.join(__dirname, "../public/upload" + tmp);
    return filepath;
  },
  postToArray(obj) {
    return obj == undefined
      ? undefined
      : Object.prototype.toString.call(obj) === "[object Array]"
      ? obj
      : obj.split();
  },
};
