const eventEmitter = require('./eventEmitter');
const notificationEvents = require('./notificationEvents');
const Notification = require('../models/Notification'); // Adjust according to your models
const notificationListener = () => {
    eventEmitter.on(notificationEvents.REQUEST_ACCEPTED, async (data) => {
        const { userId, note, username, email } = data;
      
        try {
          // Create a notification for the accepted request
          await Notification.create({
            user_id: userId,
            message: `Your request has been accepted. Note: ${note}`,
            status: 'unread', // Default status
          });
        } catch (error) {
          console.error('Error creating notification for accepted request:', error);
        }
      });
      
      eventEmitter.on(notificationEvents.REQUEST_REJECTED, async (data) => {
        const { userId, note, username, email } = data;
      
        try {
          // Create a notification for the rejected request
          await Notification.create({
            user_id: userId,
            message: `Your request has been rejected. Note: ${note}`,
            status: 'unread', // Default status
          });
        } catch (error) {
          console.error('Error creating notification for rejected request:', error);
        }
      });
  };

  module.exports = notificationListener;
