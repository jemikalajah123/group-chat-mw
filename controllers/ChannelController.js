const Validator = require("validatorjs");
const Channel = require("../models/channel");
const User = require("../models/user");
const { log } = require("../logger");
const Message = require("../models/message");



const createChannel = async (req, res) => {
  try {

    const rules = {
      name: "required|string"
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: "failed",
        message: "Validation Errors",
        errors: validation.errors.all(),
      });
    }

    const {
      name,
      description
    } = req.body;

    const checkName = await Channel.findOne({
      name: name.toLowerCase(),
    });

    if (checkName !== null) {
      return res.status(422).json({
        responseCode: "03",
        status: "failed",
        message: `Channel already exists`,
      });
    }
    const channel = new Channel({
      name: name.toLowerCase(),
      description,
      user: req.user._id,
    });
  
    await channel.save();


    const { _id} = channel;

    const newMessage = new Message({
      channel: _id,
    });

    await newMessage.save();

    const user = await User.findById(req.user._id).select('-password');
    const addTochannel = await Channel.findById(_id);

    const newMember = {
      uname: user.fullName,
      avatar: user.avatar,
      user: req.user._id
    };

    addTochannel.members.unshift(newMember);

    await addTochannel.save();

    const { isActive } = channel;

    const channelData = {
      _id,
      description,
      name,
      isActive,
      members: newMember
    };

    return res.status(201).json({
      responseCode: "00",
      status: "success",
      message: "Channel Successfully Created",
      data: channelData,
    });
  } catch (error) {
    await log("Channel error", error, "default");
    return res.status(500).json({
      status: "failed",
      message: error.nessage,
    });
  }
};

const updateChannel = async (req, res) => {
  try {
    const rules = {
      name: "string",
      description: "string",
      isActive: "boolean",
    };

    const validation = new Validator(req.body, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: "failed",
        message: "Validation Errors",
        errors: validation.errors.all(),
      });
    }

    const {
      body: {
        name,
        description,
        isActive
      },
      params: { id },
    } = req;

    await Channel.findByIdAndUpdate(id, {
      name,
      description,
      isActive
    });

    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "Channel Successfully Updated",
    });
  } catch (error) {
    await log("Create user error", error, "default");
    return res.status(500).json({
      status: "failed",
      message: "An error Occurred Please Try again",
    });
  }
};

const getChannels = async (req, res) => {
  try {
    const { page, limit, } = req.body;

    const options = {
      page: Number(page) || 1,
      limit: limit || 50,
      sort: { createdAt: "desc" },
    };

    const channels = await Channel.find();

    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "channels Retrieved",
      data: channels,
    });
  } catch (error) {
    await log("get channels error", error, "default");
    return res.status(500).json({
      responseCode: "99",
      status: "failed",
      message: "exception",
    });
  }
};

const getChannel = async (req, res) => {
  try {
    
    const { id } = req.params;

    var channel = await Channel.findOne({_id:id}).populate('user', ['fullName', 'avatar'])
    const channelMemeber = channel.members.filter(item => item.user == req.user._id);
    if(channelMemeber.length === 0){
      const user = await User.findById(req.user._id).select('-password');
      const newMember = {
        uname: user.fullName,
        avatar: user.avatar,
        user: req.user._id
      };

      channel.members.unshift(newMember);
      await channel.save();
 
      var channel = await Channel.findById(id).populate('user', ['fullName', 'avatar']);
    }
    
    return res.status(200).json({
      responseCode: "00",
      status: "success",
      message: "Channel Retrieved",
      data: channel
    });
  } catch (error) {
    await log("Get Channel Error", error, "default");
    return res.status(500).json({
      status: "failed",
      message: "exception",
    });
  }
};

const searchChannel = async (req, res) => {
  const { string } = req.query;
  
  const channels = await Channel.find();
  const channel = await channels.filter((item) => item.name.includes(string.toLowerCase()));

  return res.status(201).json({
    responseCode: "00",
    status: "success",
    message: `Channel Retrieved`,
    data: channel,
  });
};


module.exports = {
    createChannel,
    updateChannel,
    searchChannel,
    getChannels,
    getChannel
};