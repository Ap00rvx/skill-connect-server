const User = require('../models/user.model');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific chat room
    socket.on('joinRoom', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined room: ${conversationId}`);
    });

    // Handle creating a new conversation
    socket.on('createConversation', async ({ senderId, receiverId }, callback) => {
      if (!senderId || !receiverId) {
        return callback({ status: 400, message: 'Please enter all fields' });
      }
      try {
        const newConversation = new Conversation({ members: [senderId, receiverId] });
        await newConversation.save();

        let sender = await User.findById(senderId);
        let receiver = await User.findById(receiverId);

        sender.chatRooms.push(newConversation._id);
        receiver.chatRooms.push(newConversation._id);

        await sender.save();
        await receiver.save();

        callback({
          status: 201,
          message: 'Conversation created successfully',
          conversation: newConversation,
        });

        // Notify the receiver about the new conversation
        io.to(receiverId).emit('newConversation', newConversation);
      } catch (error) {
        console.error(error);
        callback({ status: 500, message: error.message });
      }
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ conversationId, senderId, text }, callback) => {
      if (!conversationId || !senderId || !text) {
        return callback({ status: 400, message: 'Please enter all fields' });
      }
      try {
        const newMessage = new Message({ conversationId, senderId, text });
        await newMessage.save();

        // Emit the new message to all clients in the conversation room
        io.to(conversationId).emit('receiveMessage', newMessage);

        callback({ status: 201, message: 'Message sent successfully', message: newMessage });
      } catch (error) {
        console.error(error);
        callback({ status: 500, message: error.message });
      }
    });

    // Fetch all conversations for a user
    socket.on('getConversations', async (userId, callback) => {
      try {
        const conversations = await Conversation.find({ members: { $in: [userId] } });
        callback({ status: 200, conversations });
      } catch (error) {
        console.error(error);
        callback({ status: 500, message: error.message });
      }
    });

    // Fetch a specific conversation
    socket.on('getConversation', async (id, callback) => {
      try {
        const conversation = await Conversation.findById(id);
        callback({ status: 200, conversation });
      } catch (error) {
        console.error(error);
        callback({ status: 500, message: error.message });
      }
    });

    // Fetch all messages in a conversation
    socket.on('getMessages', async (conversationId, callback) => {
      try {
        const messages = await Message.find({ conversationId });
        callback({ status: 200, messages });
      } catch (error) {
        console.error(error);
        callback({ status: 500, message: error.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
