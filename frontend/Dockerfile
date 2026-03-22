# Build static assets; runtime is nginx (production — not react-scripts start).
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
# Prefer `npm ci` once lockfile matches the npm in this image (node:20-alpine).
RUN npm install

COPY . .

# Browser calls these URLs; for docker-compose use host-published ports (override in cloud).
ARG REACT_APP_EVENT_API_URL=http://localhost:5001/api/events
ARG REACT_APP_BOOKING_API_URL=http://localhost:5002/api/bookings
ARG REACT_APP_AUTH_API_URL=http://localhost:5003/api/auth
ARG REACT_APP_REVIEW_API_URL=http://localhost:5004/api/reviews

ENV REACT_APP_EVENT_API_URL=$REACT_APP_EVENT_API_URL
ENV REACT_APP_BOOKING_API_URL=$REACT_APP_BOOKING_API_URL
ENV REACT_APP_AUTH_API_URL=$REACT_APP_AUTH_API_URL
ENV REACT_APP_REVIEW_API_URL=$REACT_APP_REVIEW_API_URL

RUN npm run build

FROM nginx:alpine AS runner

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
