const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const User = require("../src/models/User");

let mongoServer;
let userAccessToken;
let userRefreshToken;
let adminAccessToken;
let createdUserId;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_access_secret";
  process.env.JWT_EXPIRES_IN = "15m";
  process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
  process.env.JWT_REFRESH_EXPIRES_IN = "7d";

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  // keep DB between tests only if needed; otherwise clean each time
});

describe("Auth Service", () => {
  it("should register a new attendee user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        role: "attendee"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("test@example.com");
    expect(res.body.data.user.role).toBe("attendee");
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();

    userAccessToken = res.body.data.accessToken;
    userRefreshToken = res.body.data.refreshToken;
    createdUserId = res.body.data.user.id;
  });

  it("should not register a duplicate user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456",
        role: "attendee"
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should login user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();

    userAccessToken = res.body.data.accessToken;
    userRefreshToken = res.body.data.refreshToken;
  });

  it("should reject invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should get profile with valid access token", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${userAccessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("test@example.com");
  });

  it("should validate token successfully", async () => {
    const res = await request(app)
      .get("/api/auth/validate")
      .set("Authorization", `Bearer ${userAccessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("test@example.com");
  });

  it("should refresh token successfully", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .send({
        refreshToken: userRefreshToken
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();

    userAccessToken = res.body.data.accessToken;
    userRefreshToken = res.body.data.refreshToken;
  });

  it("should update own profile", async () => {
    const res = await request(app)
      .patch("/api/auth/profile")
      .set("Authorization", `Bearer ${userAccessToken}`)
      .send({
        name: "Updated User"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated User");
  });

  it("should create an admin user directly in DB for admin route testing", async () => {
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "hashed-password-placeholder",
      role: "admin"
    });

    adminAccessToken = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    expect(adminAccessToken).toBeDefined();
  });

  it("should allow admin to get all users", async () => {
    const res = await request(app)
      .get("/api/auth/users")
      .set("Authorization", `Bearer ${adminAccessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should forbid normal user from accessing admin route", async () => {
    const res = await request(app)
      .get("/api/auth/users")
      .set("Authorization", `Bearer ${userAccessToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should allow admin to update user role", async () => {
    const res = await request(app)
      .patch(`/api/auth/users/${createdUserId}/role`)
      .set("Authorization", `Bearer ${adminAccessToken}`)
      .send({
        role: "organizer"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe("organizer");
  });

  it("should logout successfully", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .send({
        refreshToken: userRefreshToken
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});