require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const createAdmin = require("./utils/createAdmin");

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI).then(async () => {
  await createAdmin();
  app.listen(PORT, () => console.log("Server running on port", PORT));
});
