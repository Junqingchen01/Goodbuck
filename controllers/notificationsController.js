const { Notification } = require('../models/notification');
const { User } = require('../models/user');

// create notifications
exports.createNotification = async (req, res) => {
  try {
      const { Title, Content } = req.body;
      const UserID = req.userID;

      const user = await User.findByPk(UserID);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const newDate = new Date();
      const newNotification = await Notification.create({
          UserID,
          Title,
          Content,
          Date: newDate,
      });

      res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

// get all notifications
exports.getAllNotification = async (req, res) => {
  try {
    const UserID = req.userID;
      const user = await User.findByPk(UserID);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const notifications = await Notification.findAll({
          where: { UserID },
      });

      res.status(200).json({ message: 'User notifications retrieved successfully', notifications });
  } catch (error) {
      console.error('Error getting user notifications:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


// get notification by id
exports.getNotificationById = async (req, res) => {
    try {
      const notificationID = req.params.idnotification;
      
      const notification = await Notification.findByPk(notificationID);
  
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      res.status(200).json({ message: 'Notification retrieved successfully', notification });
    } catch (error) {
      console.error('Error getting notification by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


// delete notifications
exports.deleteAllNotification = async (req, res) => {
  try {
    const UserID = req.userID;

      const user = await User.findByPk(UserID);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      await Notification.destroy({
          where: { UserID },
      });

      res.status(200).json({ message: 'All notifications for the user deleted successfully' });
  } catch (error) {
      console.error('Error deleting all notifications:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


// delete notification by id
exports.deleteNotificationById = async (req, res) => {
  try {
    const UserID = req.userID;
      const notificationID = req.params.idnotification;

      const user = await User.findByPk(UserID);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const notification = await Notification.findOne({
          where: { UserID, NotificationID: notificationID },
      });

      if (!notification) {
          return res.status(404).json({ message: 'Notification not found' });
      }

      await notification.destroy();

      res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
      console.error('Error deleting notification by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};
