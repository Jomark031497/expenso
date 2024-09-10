import { after, before, describe, it } from "node:test";
import { createApp } from "../../app.js";
import type { AddressInfo } from "node:net";
import { closeDbConnection, db } from "../../db/dbInstance.js";
import { faker } from "@faker-js/faker";
import type { NewUser, User } from "./users.schema.js";
import { users } from "./users.schema.js";
import { Argon2id } from "oslo/password";
import assert from "node:assert";
import { and, eq } from "drizzle-orm";

describe("users routes", () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://localhost:${port}`;

  const adminUserCredentials = {
    username: faker.internet.userName(),
    password: faker.internet.password({ length: 6 }),
    email: faker.internet.email(),
  };

  const newUserCredentials = {
    username: faker.internet.userName(),
    password: faker.internet.password({ length: 6 }),
    email: faker.internet.email(),
  };

  let adminCookie: string;
  let newUserCookie: string;
  let newUserId: string;
  let adminUserId: string;

  const createTestUser = async (payload: NewUser) => {
    const hashedPassword = await new Argon2id().hash(payload.password);

    const [user] = await db
      .insert(users)
      .values({
        ...payload,
        password: hashedPassword,
      })
      .returning();
    if (!user) throw new Error("user create failed");
    return user;
  };

  const loginTestUser = async (payload: Pick<User, "username" | "password">) => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("user login failed");

    return response.headers.get("set-cookie") as string;
  };

  before(async () => {
    const adminUser = await createTestUser({
      ...adminUserCredentials,
      role: "admin",
    });

    adminUserId = adminUser.id;

    adminCookie = await loginTestUser({
      username: adminUserCredentials.username,
      password: adminUserCredentials.password,
    });
  });

  after(async () => {
    server.close();
    await db.delete(users).where(and(eq(users.id, adminUserId), eq(users.id, newUserId)));
    await closeDbConnection();
  });

  describe("POST /api/users", () => {
    const url = new URL("/api/users", baseUrl);

    it("creates a user when logged as admin", async () => {
      assert.ok(adminCookie);

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(newUserCredentials),
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie,
        },
      });

      assert.strictEqual(response.status, 201);

      const data = (await response.json()) as User;

      assert.strictEqual(data.username, newUserCredentials.username);
      assert.strictEqual(data.email, newUserCredentials.email);
      assert.strictEqual(data.password, undefined);
      assert.strictEqual(data.role, "user");

      newUserId = data.id;
    });

    it("returns an 403 error when non-admin user tries to create a new user", async () => {
      newUserCookie = await loginTestUser({
        username: newUserCredentials.username,
        password: newUserCredentials.password,
      });

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username: faker.internet.userName(),
          password: faker.internet.password({ length: 6 }),
          email: faker.internet.email(),
        }),
        headers: {
          "Content-Type": "application/json",
          Cookie: newUserCookie,
        },
      });

      assert.strictEqual(response.status, 403);
    });
  });

  describe("GET /api/users", () => {
    const url = new URL("/api/users", baseUrl);

    it("returns all users when admin is authenticated", async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Cookie: adminCookie,
        },
      });

      assert.strictEqual(response.status, 200);

      const data = (await response.json()) as User[];

      assert(Array.isArray(data));
      assert(data.length > 0);
      data.forEach((user) => {
        assert.strictEqual(user.password, undefined);
      });
    });

    it("returns 403 when non-admin user tries to get all users", async () => {
      const response = await fetch(new URL("/api/users", baseUrl), {
        headers: { Cookie: newUserCookie },
      });

      assert.strictEqual(response.status, 403);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return 403 when accessing a user unauthenticated", async () => {
      const response = await fetch(new URL(`/api/users/${newUserId}`, baseUrl), {
        method: "GET",
      });

      assert.strictEqual(response.status, 401);
    });

    it("should return a single user by id", async () => {
      const response = await fetch(new URL(`/api/users/${newUserId}`, baseUrl), {
        method: "GET",
        headers: {
          Cookie: newUserCookie,
        },
      });

      assert.strictEqual(response.status, 200);
      const data = (await response.json()) as User;

      assert.strictEqual(data.username, newUserCredentials.username);
      assert.strictEqual(data.password, undefined);
      assert.strictEqual(data.email, newUserCredentials.email);
    });

    it("should return 404 for non-existent user ID", async () => {
      const response = await fetch(new URL("/api/users/nonoexistento", baseUrl), {
        headers: { Cookie: newUserCookie },
      });

      assert.strictEqual(response.status, 404);
    });
  });

  describe("PATCH /api/users/:id", async () => {
    it("returns a 403 when authenticated user updates a different user id", async () => {
      const newUserToUpdate = await createTestUser({
        username: faker.internet.userName(),
        password: faker.internet.password({ length: 6 }),
        email: faker.internet.email(),
      });
      const response = await fetch(new URL(`/api/users/${newUserToUpdate.id}`, baseUrl), {
        method: "PATCH",
        body: JSON.stringify(newUserToUpdate),
        headers: {
          "Content-Type": "application/json",
          Cookie: newUserCookie,
        },
      });
      assert.strictEqual(response.status, 403);
    });

    it("updates user when authenticated user updates itself", async () => {
      const updatedFullName = faker.person.fullName();

      const response = await fetch(new URL(`/api/users/${newUserId}`, baseUrl), {
        method: "PATCH",
        body: JSON.stringify({
          fullName: updatedFullName,
        }),
        headers: {
          "Content-Type": "application/json",
          Cookie: newUserCookie,
        },
      });

      assert.strictEqual(response.status, 200);

      const data = (await response.json()) as User;

      assert.strictEqual(data.fullName, updatedFullName);
      assert.strictEqual(data.username, newUserCredentials.username);
      assert.strictEqual(data.password, undefined);
      assert.strictEqual(data.email, newUserCredentials.email);
    });

    it("should update any user when authenticated as admin", async () => {
      const updateData = {
        fullName: faker.person.fullName(),
      };

      const response = await fetch(new URL(`/api/users/${newUserId}`, baseUrl), {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
          Cookie: adminCookie,
        },
      });

      assert.strictEqual(response.status, 200);
      const data = (await response.json()) as User;
      assert.strictEqual(data.fullName, updateData.fullName);
    });

    it("should return 403 when trying to update other user as non-admin", async () => {
      const updateData = {
        fullName: faker.person.fullName(),
      };

      const testUserCredentials = {
        username: faker.internet.userName(),
        password: faker.internet.password({ length: 6 }),
        email: faker.internet.email(),
      };

      await createTestUser(testUserCredentials);

      const newUserCookie = await loginTestUser({
        username: testUserCredentials.username,
        password: testUserCredentials.password,
      });

      const response = await fetch(new URL(`/api/users/${newUserId}`, baseUrl), {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
          Cookie: newUserCookie,
        },
      });

      assert.strictEqual(response.status, 403);
    });
  });

  describe("DELETE /api/users/:id", () => {
    const testUserCredentialsToDelete = {
      username: faker.internet.userName(),
      password: faker.internet.password({ length: 6 }),
      email: faker.internet.email(),
    };

    it("should delete user when authenticated as that user", async () => {
      const userToDelete = await createTestUser(testUserCredentialsToDelete);
      const deleteUserCookie = await loginTestUser(testUserCredentialsToDelete);

      const response = await fetch(new URL(`/api/users/${userToDelete.id}`, baseUrl), {
        method: "DELETE",
        headers: { Cookie: deleteUserCookie },
      });

      assert.strictEqual(response.status, 204);
    });

    it("should delete any user when authenticated as admin", async () => {
      const userToDelete = await createTestUser(testUserCredentialsToDelete);

      const response = await fetch(new URL(`/api/users/${userToDelete.id}`, baseUrl), {
        method: "DELETE",
        headers: { Cookie: adminCookie },
      });

      assert.strictEqual(response.status, 204);
    });

    it("should return 403 when trying to delete other user as non-admin", async () => {
      const userToDelete = await createTestUser(testUserCredentialsToDelete);
      const response = await fetch(new URL(`/api/users/${userToDelete.id}`, baseUrl), {
        method: "DELETE",
        headers: { Cookie: newUserCookie },
      });

      assert.strictEqual(response.status, 403);
    });
  });
});
