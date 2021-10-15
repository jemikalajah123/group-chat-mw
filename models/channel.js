const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  members: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    uname: {
      type: String,
    },
    avatar: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Channel = mongoose.model("channel", ChannelSchema);

module.exports = Channel;
