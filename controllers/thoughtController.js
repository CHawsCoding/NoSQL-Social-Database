const { Thought, User } = require("../models");

const thoughtController = {
  async getAllThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find({}).select("-__v");
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async getThoughtById({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOne({ _id: params.id }).select(
        "-__v"
      );
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  async createThought({ body }, res) {
    try {
      const thoughtData = await Thought.create(body);
      const dbUserData = await User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id!" });
      }
      // Return the created thought data for clarity
      res.json(thoughtData);
    } catch (err) {
      console.error(err); // Log the error for clarity
      res.status(500).json(err);
    }
  },

  async updateThought({ params, body }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      );
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  async deleteThought({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndDelete({ _id: params.id });
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      const dbUserData = await User.findOneAndUpdate(
        { thoughts: params.id },
        { $pull: { thoughts: params.id } },
        { new: true }
      );
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },

  async addReaction({ params, body }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      );
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      res.json(err);
    }
  },

  async removeReaction({ params }, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );
      res.json(dbThoughtData);
    } catch (err) {
      res.json(err);
    }
  },
};

module.exports = thoughtController;
