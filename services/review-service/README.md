Review Service
==============

Project structure
-----------------

src/
- config/db.js          MongoDB connection
- models/Review.js      Mongoose model for reviews
- controllers/reviewController.js  Request handlers
- routes/reviewRoutes.js           Express routes
- services/bookingService.js       Helper for talking to Booking Service
- server.js                         Service entry point

API endpoints
-------------

Base URL: `/api/reviews`

- `POST /`  
  Create a new review.  
  Body:
  - `userId` (string, required)
  - `bookingId` (string, required)
  - `rating` (number 1-5, required)
  - `comment` (string, optional)

- `GET /`  
  Get all reviews.

- `DELETE /:id`  
  Delete a review by its id.

Environment variables
---------------------

- `MONGO_URI` – MongoDB connection string for the Review Service.
- `PORT` – Port to run the service on (default `5004`).
- `BOOKING_SERVICE_URL` – (optional) Base URL of the Booking Service, default `http://localhost:5002/api/bookings`.

Running the service
-------------------

From this folder:

```bash
npm install
npm run dev
```

