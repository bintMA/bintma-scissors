const dotenv = require("dotenv");
const app = require("./app");
const connectionToDb = require("./config/database");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
dotenv.config();
connectionToDb();

app.listen(PORT, HOST, () => {
  console.log("server is running at port 3000");
});
