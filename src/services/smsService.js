
const sendSMS = async (to, message) => {
  try {
    // Simulate sending SMS
    console.log(`SMS sent to ${to}: ${message}`);
    
    return true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
};

module.exports = { sendSMS };
