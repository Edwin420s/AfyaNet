import { createClient } from 'redis';
import { format } from 'date-fns';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

export const sendNotification = async (notification) => {
  try {
    // Store notification in Redis with timestamp
    const timestamp = new Date();
    const notificationKey = `notification:${notification.patient}:${timestamp.getTime()}`;
    
    await redisClient.set(
      notificationKey,
      JSON.stringify({
        ...notification,
        timestamp: timestamp.toISOString()
      })
    );

    // Publish to Redis channel for real-time updates
    await redisClient.publish(
      `notifications:${notification.patient}`,
      notificationKey
    );

    console.log(`Notification sent: ${notification.type}`);
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

export const formatNotificationMessage = (notification) => {
  const timestamp = format(new Date(notification.timestamp), 'MMM d, yyyy HH:mm');
  
  switch (notification.type) {
    case 'RECORD_ADDED':
      return `New medical record added on ${timestamp}`;
    case 'ACCESS_GRANTED':
      return `Access granted to ${notification.grantee} for ${notification.purpose}`;
    default:
      return `New notification on ${timestamp}`;
  }
};