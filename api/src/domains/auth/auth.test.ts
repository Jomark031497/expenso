import { after, before, describe, it } from "node:test";
import { faker } from "@faker-js/faker";
import assert from "node:assert";
import { createApp } from "../../app.js";
import { closeDbConnection } from "../../db/dbInstance.js";
import type { AddressInfo } from "node:net";
import { type User } from "../users/users.schema.js";
import { deleteUser } from "../users/users.service.js";

describe("auth routes", () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://localhost:${port}`;

  const testUser = {
    username: faker.internet.userName(),
    password: faker.internet.password({ length: 6 }),
    email: faker.internet.email(),
  };

  let loginCookie: string | null = null;
  let newUserId = "";

  before(() => {});

  after(async () => {
    server.close();
    await deleteUser(newUserId);
    await closeDbConnection();
  });

  describe("POST /api/auth/sign-up", () => {
    const url = new URL("/api/auth/sign-up", baseUrl);

    it("should create a new user and return 201 with user data", async () => {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(testUser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as User;

      assert.strictEqual(response.status, 201);
      assert.strictEqual(data.username, testUser.username);
      assert.strictEqual(data.email, testUser.email);
      assert.strictEqual(data.password, undefined);
      assert.ok(response.headers.get("set-cookie"));

      newUserId = data.id;
    });

    it("should return 400 for invalid input", async () => {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username: "tu",
          password: "123",
          email: "notemail",
        }),
      });

      assert.strictEqual(response.status, 400);
    });
  });

  describe("POST /api/auth/login", () => {
    const url = new URL("/api/auth/login", baseUrl);

    it("should log in an existing user and return 200 with user data", async () => {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username: testUser.username,
          password: testUser.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as User;

      assert.strictEqual(response.status, 200);
      assert.ok(data.id);
      assert.strictEqual(data.username, testUser.username);
      assert.strictEqual(data.email, testUser.email);
      assert.ok(response.headers.get("set-cookie"));

      loginCookie = response.headers.get("set-cookie");
    });

    it("should return 404 for invalid credentials", async () => {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username: "nonExistent",
          password: "wrongPassword",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      assert.strictEqual(response.status, 404);
    });
  });

  describe("GET /api/auth/user", () => {
    const url = new URL("/api/auth/user", baseUrl);

    it("should return authenticated user data", async () => {
      assert.ok(loginCookie, "login cookie not found");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Cookie: loginCookie,
        },
      });

      const data = (await response.json()) as User;

      assert.ok(data.id);
      assert.strictEqual(data.username, testUser.username);
      assert.strictEqual(data.password, undefined);
    });

    it("should return 403 for unauthenticated request", async () => {
      const response = await fetch(url, {
        method: "GET",
      });

      assert.strictEqual(response.status, 401);
    });
  });

  describe("DELETE /api/auth/logout", () => {
    const url = new URL("/api/auth/logout", baseUrl);

    it("should logout the user and return 200", async () => {
      assert.ok(loginCookie, "no login cookie found");

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Cookie: loginCookie,
        },
      });

      assert.strictEqual(response.status, 200);
    });
  });
});
