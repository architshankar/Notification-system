const { producer } = require('../config/kafka');
const Notification = require('../models/notification');
const User = require('../models/user');

// Send notification
exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, title, content } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create notification record
    const notification = new Notification({
      userId,
      type,
      title,
      content,
      status: 'PENDING'
    });
    await notification.save();

    // Send to Kafka queue
    await producer.send({
      topic: 'notifications',
      messages: [
        { 
          key: type, 
          value: JSON.stringify({ 
            id: notification._id.toString(),
            userId, 
            type, 
            title, 
            content,
            userEmail: user.email,
            userPhone: user.phone,
            deviceToken: user.deviceToken 
          }) 
        }
      ]
    });

    res.status(201).json({ 
      message: 'Notification queued for delivery',
      notificationId: notification._id
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch notifications
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};
