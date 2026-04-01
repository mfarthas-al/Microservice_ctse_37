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


## Docker Compose vs AWS hosting (important)

### Docker Compose (local)
- **Frontend URL**: `http://localhost:3000`
- **Gateway URL**: `http://localhost:8080`
- **How API calls work**:
  - The frontend may call relative URLs like `/api/auth/login`.
  - Because that goes to `localhost:3000`, the frontend container must proxy `/api/*` to the gateway.
  - This is handled in `frontend/nginx.conf` (proxy to `api-gateway`).
- **Gateway routing** (`api-gateway/nginx.conf`):
  - Local-only: use Docker service names (`user-management-service:3001`, etc.).
  - **Hybrid (local gateway + AWS backends)**: `upstream` blocks in `api-gateway/nginx.conf` point
    auth/booking to your EC2 public IPs (see `auth_upstream` / `booking_upstream`); events/reviews
    can stay on Docker service names until those services are hosted.
  - **Booking service on AWS** must also have `AUTH_SERVICE_URL` set to your auth URL (e.g.
    `http://13.201.182.152:3001`) in its environment on the server; the gateway alone does not fix that.

### AWS hosting (common setups)

#### Option A (recommended): host frontend separately (S3/CloudFront or Amplify)
- In this model, **`frontend/nginx.conf` is not used** (because you’re not running the nginx container).
- You must choose one of these:
  - **A1: Keep frontend using `/api/*`** and configure a **rewrite/proxy** at the edge:
    - CloudFront behavior (or Amplify rewrite) for path `/api/*` → forward to your gateway origin.
  - **A2: Build frontend with the gateway domain**
    - Set `REACT_APP_API_GATEWAY_URL=https://<your-gateway-domain>` at build time so the app calls
      `https://<your-gateway-domain>/api/...` directly.

#### Option B: host frontend as the nginx container on EC2/ECS
- In this model, `frontend/nginx.conf` **is used**.
- Update the proxy target depending on where the gateway is reachable from that container/host:
  - same compose/network: `proxy_pass http://api-gateway;`
  - different host/domain: `proxy_pass https://<your-gateway-domain>;`

### Quick troubleshooting
- If DevTools shows requests going to `http://localhost:3000/api/...` and returning **405**:
  - that means the request hit the frontend static server without a proxy.
- If `docker compose up` fails with port `8080` already in use:
  - stop the process/container using `8080` or change the compose port mapping for `api-gateway`.

### Frontend direct-service mode (no gateway dependency)
- Frontend now supports direct service endpoints via env variables:
  - `NEXT_PUBLIC_AUTH_SERVICE_URL`
  - `NEXT_PUBLIC_EVENT_SERVICE_URL`
  - `NEXT_PUBLIC_BOOKING_SERVICE_URL` (optional)
  - `NEXT_PUBLIC_CUSTOMER_REVIEW_SERVICE_URL` (optional)
- Current CRA builds also read fallback aliases:
  - `REACT_APP_AUTH_SERVICE_URL`
  - `REACT_APP_EVENT_SERVICE_URL`
  - `REACT_APP_BOOKING_SERVICE_URL`
  - `REACT_APP_CUSTOMER_REVIEW_SERVICE_URL`
- Optional services (booking/reviews) are automatically disabled if their URLs are missing.



