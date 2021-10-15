const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "channels",
    required: true,
  },
  conversation: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String,
      },
      avatar: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.plugin(mongoosePaginate);

const Message = mongoose.model("message", MessageSchema);

module.exports = Message;