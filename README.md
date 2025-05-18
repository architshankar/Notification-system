# Notification System

A notification system that sends email, SMS, and in-app notifications to users.

## Features

- REST API for sending and retrieving notifications
- Support for email, SMS, and in-app notifications
- Uses Kafka as a message queue for processing notifications
- Includes retry mechanism for failed notifications

## Technologies Used

- Node.js with Express
- MongoDB for storage
- Apache Kafka for message queuing
- Docker for containerization

## Setup and Installation

### Prerequisites

- Docker and Docker Compose
- Git

### Installation Steps

1. Clone the repository:
git clone https://github.com/yourusername/notification-system.git
cd notification-system


2. Create a `.env` file in the root directory with the following variables:


PORT=3000
MONGO_URI=mongodb://mongo:27017/notification-system

KAFKA_BROKERS=kafka:9092


EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASS=

<!-- nodemailer has been used to send emails sms were not configured in the projects -->

SMS_API_KEY=


3. Build and run the application using Docker Compose:
docker-compose up -d


4. The API will be available at http://localhost:3000

## Start the mongoDb in terminal 

use notification-system

### insert data in mongoDb

db.users.insertOne({name : "Your-name" , email : "your-email@gmail.com" , phone : "3937273777" , device-token :"test-token"})

### Check users in database 

 db.users.find().pretty()

### Check notifications in database 

db.notification.find({type : "your-type"}).pretty()  

your-type = [IN_APP , SMS , EMAIL]


## API Documentation

### Send a Notification

**Endpoint:** POST /notifications

**Request Body:**
{
"userId": "user-id",
"type": "EMAIL",
"title": "Notification Title",
"content": "Notification content goes here."
}


**Response:**
{
"message": "Notification queued for delivery",
"notificationId": "notification-id"
}


### Get User Notifications

**Endpoint:** GET /users/:id/notifications

**Response:**
[
{
"_id": "notification-id",
"userId": "user-id",
"type": "EMAIL",
"title": "Notification Title",
"content": "Notification content goes here.",
"status": "SENT",
"retryCount": 0,
"createdAt": "2023-05-19T12:34:56.789Z"
}
]



## Assumptions

1. Users are pre-registered in the system
2. For email notifications, a valid SMTP service is configured
3. For SMS notifications, integration with a third-party SMS provider would be required in production
4. In-app notifications would be delivered via a WebSocket or push notification service in a real implementation


