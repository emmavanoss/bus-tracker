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

  it("Should return 409 if a user tries to register twice", async () => {
    const req = new Request("http://localhost/register", {
      method: "POST",
      body: JSON.stringify({
        username: "test-user",
        password: "test-password",
      }),
    });
    const clonedReq = req.clone();
    const res1 = await app.fetch(req);
    expect(res1.status).toBe(201);

    const res2 = await app.fetch(clonedReq as Request);
    expect(res2.status).toBe(409);
  });
});
