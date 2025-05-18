const { consumer } = require('../config/kafka');
const Notification = require('../models/notification');
const User = require('../models/user');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const { storeInAppNotification } = require('../services/inAppService');

// Max retry attempts
const MAX_RETRIES = 3;

const processNotification = async (notification) => {
  try {
    const { id, userId, type, title, content, userEmail, userPhone, deviceToken } = notification;
    let success = false;

    // Process based on notification type
    switch (type) {
      case 'EMAIL':
        success = await sendEmail(userEmail, title, content);
        break;
      case 'SMS':
        success = await sendSMS(userPhone, `${title}: ${content}`);
        break;
      case 'IN_APP':
        success = await storeInAppNotification(notification);
        break;
      default:
        console.error(`Unknown notification type: ${type}`);
        return false;
    }

    // Update notification status in database
    if (success) {
      await Notification.findByIdAndUpdate(id, { status: 'SENT' });
    } else {
      const dbNotification = await Notification.findById(id);
      
      // Check if we should retry
      if (dbNotification.retryCount < MAX_RETRIES) {
        await Notification.findByIdAndUpdate(id, { 
          retryCount: dbNotification.retryCount + 1
        });
        // Re-queue for retry (in a real implementation)
        throw new Error('Notification failed, will retry');
      } else {
        await Notification.findByIdAndUpdate(id, { status: 'FAILED' });
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error processing notification:', error);
    return false;
  }
};

// Start the Kafka consumer
const startConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'notifications', fromBeginning: true });
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const notification = JSON.parse(message.value.toString());
          console.log(`Processing notification: ${notification.id}`);
          await processNotification(notification);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });
  } catch (error) {
    console.error('Kafka consumer error:', error);
  }
};

module.exports = { startConsumer };
