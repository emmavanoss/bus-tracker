import { describe, expect, it, beforeEach, afterEach, mock } from "bun:test";
import app from "../src/index.ts";
import {
  createTestDb,
  destroyTestDb,
  type TestDbContext,
} from "./setup-test-db.ts";

let context: TestDbContext;

beforeEach(async () => {
  context = await createTestDb();

  await mock.module("../src/db/db", () => ({
    db: context.db,
  }));
});

afterEach(async () => {
  await destroyTestDb(context);
});

describe("Server", () => {
  it("Should return 200", async () => {
    const req = new Request("http://localhost/");
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });

  it("Should return 201 when a new user registers", async () => {
    const req = new Request("http://localhost/register", {
      method: "POST",
      body: JSON.stringify({
        username: "test-user",
        password: "test-password",
      }),
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(201);
  });

  it.todo("Should return 409 if a user tries to register twice");
});
