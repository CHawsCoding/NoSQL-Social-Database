const mongoose = require("mongoose");
const user = require("../models/user");
const thought = require("../models/thought");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/nosql-social-db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

const userSeed = [
  {
    username: "lernantino",
    email: "lernantino@gmail.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "amiko",
    email: "amiko@gmail.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "jane_doe",
    email: "jane.doe@gmail.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "john_doe",
    email: "john.doe@gmail.com",
    thoughts: [],
    friends: [],
  },
];

const thoughtSeed = [
  {
    thoughtText: "Here's a cool thought...",
    username: "lernantino",
    reactions: [],
  },
  {
    thoughtText: "Wow, what a thought!",
    username: "amiko",
    reactions: [],
  },
  {
    thoughtText: "It's a sunny day!",
    username: "jane_doe",
    reactions: [],
  },
  {
    thoughtText: "I love coding.",
    username: "john_doe",
    reactions: [],
  },
];

const seedDatabase = async () => {
  await user.deleteMany({});
  await thought.deleteMany({});

  const users = await user.insertMany(userSeed);

  // Update thoughtSeed with userId before inserting
  for (let tht of thoughtSeed) {
    const associatedUser = users.find((u) => u.username === tht.username);
    tht.userId = associatedUser._id;
  }

  const thoughts = await thought.insertMany(thoughtSeed);

  // Associate thoughts and friends with users
  for (let usr of users) {
    // Associate thoughts with user
    const userThoughts = thoughts.filter(
      (tht) => tht.username === usr.username
    );
    usr.thoughts = userThoughts.map((tht) => tht._id);

    // Associate friends with user (for this example, we'll just add the other user as a friend)
    const friend = users.find((u) => u.username !== usr.username);
    usr.friends.push(friend._id);

    await usr.save();
  }

  console.log("all done!");
  process.exit(0);
};

seedDatabase();
