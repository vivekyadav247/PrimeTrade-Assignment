const bcrypt = require("bcrypt");
const User = require("../models/user.model");
require("dotenv").config();

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("Please define ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    return;
  }

  const exists = await User.findOne({ email: adminEmail });
  if (exists) {
    console.log("Admin already exists - skip creating admin user");
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: "System Admin",
    email: adminEmail,
    password: hashed,
    role: "admin",
  });
}

module.exports = createAdmin;
