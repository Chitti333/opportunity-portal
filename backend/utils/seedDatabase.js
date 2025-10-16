require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Opportunity = require("../models/opportunity");
const usersData = require("../users.json");
const opportunitiesData = require("../opportunities.json");

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGO_URI; // e.g., "mongodb+srv://username:password@cluster.mongodb.net/dbname"

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");

    // Clear existing data
    await User.deleteMany({});
    await Opportunity.deleteMany({});

    // Hash passwords for users
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const insertedUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`Inserted ${insertedUsers.length} users`);

    // Insert opportunities
    // Optionally, we can randomly assign registered/not registered students
    const insertedOpportunities = await Opportunity.insertMany(
      opportunitiesData.map((op) => ({
        ...op,
        registeredStudents: [],
        notRegisteredStudents: [],
        ignoredStudents: [],
      }))
    );
    console.log(`Inserted ${insertedOpportunities.length} opportunities`);

    console.log("Database seeding completed!");
    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
