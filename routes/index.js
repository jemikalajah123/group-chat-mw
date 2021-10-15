const express = require('express')
const auth = require('../middleware/auth')
const AuthController = require('../controllers/AuthController')
const ChannelController = require('../controllers/ChannelController')
const MessageController = require('../controllers/MessageController')
const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Backyard'
    });
})

router.post('/auth/registerUser', AuthController.createUser )
router.post('/auth/loginUser', AuthController.loginUser )

//catgory
router.post('/channels', auth, ChannelController.createChannel)
router.put('/channels/:id', auth,  ChannelController.updateChannel)
router.get('/channels', auth, ChannelController.getChannels )
router.get('/channels/:id', auth, ChannelController.getChannel)
router.get('/channel/search', auth, ChannelController.searchChannel)

//Message
router.post('/messages', auth, MessageController.sendMessage )
router.get('/messages', auth, MessageController.getMessages )
router.get('/messages/channel/:id', auth, MessageController.getMessageByChannelId )
router.get('/messages/:id', auth, MessageController.getMessage)



module.exports = router;