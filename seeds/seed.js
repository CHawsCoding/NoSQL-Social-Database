const user = require("../models/user");
const thought = require("../models/thought");

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
];

const seedDatabase = async () => {
  await user.deleteMany({});
  await thought.deleteMany({});

  const users = await user.insertMany(userSeed);
  const thoughts = await thought.insertMany(thoughtSeed);

  // Associate thoughts with users
  for (let thought of thoughts) {
    const user = users.find((user) => user.username === thought.username);
    user.thoughts.push(thought._id);
    await user.save();
  }

  console.log("all done!");
  process.exit(0);
};

seedDatabase();
