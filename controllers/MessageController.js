const Validator = require("validatorjs");
const Message = require("../models/message");
const User = require("../models/user");
const { log } = require("../logger");

const getMessageByChannelId = async (req, res) => {
  try{
    const message = await Message.findOne({'channel': req.params.id}).exec();
    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "Message Retrieved",
      data: message.conversation
    });
} catch (error) {
  await log("Get Message Error", error, "default");
  return res.status(500).json({
    status: "failed",
    message: "exception",
  });
}
}

const sendMessage = async (req, res) => {
  
  try {
    const rules = {
      text: "required|string"
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: "failed",
        message: "Validation Errors",
        errors: validation.errors.all(),
      });
    }
    const user = await User.findById(req.user._id).select('-password');

    const message = await Message.findOne({'channel': req.body.channel}).exec();
    const newConversation = {
      text: req.body.text,
      name: user.fullName,
      avatar: user.avatar,
      user: req.user._id
    };

    message.conversation.unshift(newConversation);

    await message.save();

    const newmessage = await Message.findOne({'channel': req.body.channel}).exec();;

    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "Message Successfully Sent",
      data: newmessage.conversation
    });

  } catch (error) {
    await log("Create user error", error, "default");
    return res.status(500).json({
      status: "failed",
      message: "An error Occurred Please Try again",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { page, limit, } = req.body;

    const options = {
      page: Number(page) || 1,
      limit: limit || 50,
      sort: { createdAt: "desc" },
    };

    const messages = await Message.paginate(options);

    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "Messages Retrieved",
      data: messages,
    });
  } catch (error) {
    await log("get Messages error", error, "default");
    return res.status(500).json({
      responseCode: "99",
      status: "failed",
      message: "exception",
    });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Message.findById(id);

    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "Message Retrieved",
      data: messages
    });
  } catch (error) {
    await log("Get Message Error", error, "default");
    return res.status(500).json({
      status: "failed",
      message: "exception",
    });
  }
};


module.exports = {
    sendMessage,
    getMessageByChannelId,
    getMessages,
    getMessage
};