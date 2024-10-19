const Notification = require('../models/Notification'); // Adjust the path as necessary

const getNotificationsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']], // Order by creation date
    });

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
      const notification = await Notification.findByPk(id);

      if (!notification) {
          return res.status(404).json({ message: 'Notification not found' });
      }

      // Mark the notification as read
      notification.read_at = new Date(); // Set the current time
      await notification.save();

      res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getNotificationsByUserId,markNotificationAsRead
};
