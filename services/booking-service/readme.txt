Microservice_ctse_37
│
├── services
│   │
│   ├── user-service
│   │
│   ├── event-service
│   │
│   ├── booking-service   ← YOUR PART
│   │   │
│   │   ├── src
│   │   │   ├── config
│   │   │   │      db.js
│   │   │   │
│   │   │   ├── models
│   │   │   │      Booking.js
│   │   │   │
│   │   │   ├── controllers
│   │   │   │      bookingController.js
│   │   │   │
│   │   │   ├── routes
│   │   │   │      bookingRoutes.js
│   │   │   │
│   │   │   ├── services
│   │   │   │      eventService.js
│   │   │   │
│   │   │   └── server.js
│   │   │
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── review-service
│
├── frontend
│
├── architecture
│   └── architecture-diagram.png
│
└── README.md


                React Frontend
                       |
                       |
                API Gateway (optional)
                       |
 ------------------------------------------------
 |            |            |            |
User Service  Event Service  Booking Service  Review Service
     |             |              |             |
  MongoDB       MongoDB        MongoDB        MongoDB



  Booking Service → Event Service
Booking Service → User Service
Review Service → Booking Service



User books event

Frontend
   ↓
Booking Service
   ↓
Check Event Service
   ↓
Save booking in DB



