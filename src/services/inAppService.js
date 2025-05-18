

const storeInAppNotification = async (notification) => {
  try {
    // Notification is already stored in the database
    // Just push the message in the frontend using websockets
    console.log(`In-app notification stored for user ${notification.userId}`);
    return true;
  } catch (error) {
    console.error('In-app notification error:', error);
    return false;
  }
};

module.exports = { storeInAppNotification };
