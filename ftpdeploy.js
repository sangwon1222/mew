const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
// console.log(__dirname);
const config = {
  user: "sangwon",
  password: "789456",
  host: "210.223.45.236",
  port: 21,
  forcePasv: true,
  localRoot: __dirname + "/dist",
  remoteRoot: "/dist/mew",
  include: ["**/*"],
  exclude: [
    "fonts/**/*",
    "node_modules/**/*",
    ".git",
    ".idea",
    "tmp/*",
    "build/*",
    "DBconfig.*",
  ],
};

ftpDeploy.deploy(config, function(err) {
  if (err) console.error(err);
  else console.log("finished");
});

ftpDeploy.on("uploading", function(data) {
  data.totalFileCount;
  data.transferredFileCount;
  data.percentComplete;
  data.filename;
});

ftpDeploy.on("uploaded", function(data) {
  console.log(data);
});
