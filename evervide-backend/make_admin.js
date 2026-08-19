const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const email = process.argv[2] || "admin@servease.com";
const passwordInput = process.argv[3] || "serveaseadmin";

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/evervice")
  .then(async () => {
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`User "${email}" not found. Creating a new admin account...`);
      const hashedPassword = await bcrypt.hash(passwordInput, 10);
      user = new User({
        name: "ServEase Admin",
        email,
        password: hashedPassword,
        role: "admin"
      });
      await user.save();
      console.log(`\n🎉 Success! Created new admin account:`);
      console.log(`📧 Email:    ${email}`);
      console.log(`🔑 Password: ${passwordInput}`);
      process.exit(0);
    } else {
      user.role = "admin";
      await user.save();
      console.log(`\n🎉 Success! Upgraded existing user "${email}" to admin role.`);
      process.exit(0);
    }
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
