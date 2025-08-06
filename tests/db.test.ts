import { describe, expect, it, beforeEach, afterEach, mock } from "bun:test";
import {
  createTestDb,
  destroyTestDb,
  type TestDbContext,
} from "./setup-test-db.ts";

import { db } from "../src/db/db.ts";
import { usersTable } from "../src/db/schema.ts";

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

describe("Users", () => {
  it("Should insert a new user", async () => {
    const prevUsers = await db.select().from(usersTable);

    expect(prevUsers.length).toBe(0);

    const username = "user1";
    const passwordHash = "pwd-hash";

    await db.insert(usersTable).values({ username, passwordHash });
    const newUsers = await db.select().from(usersTable);
    expect(newUsers.length).toBe(1);
    expect(newUsers[0]?.username).toBe("user1");
  });

  it("Should prevent duplicate users", async () => {
    const prevUsers = await db.select().from(usersTable);

    expect(prevUsers.length).toBe(0);

    const username = "user1";
    const passwordHash = "pwd-hash";

    await db.insert(usersTable).values({ username, passwordHash });
    const newUsers = await db.select().from(usersTable);
    expect(newUsers.length).toBe(1);

    expect(
      async () =>
        await db.insert(usersTable).values({ username, passwordHash }),
    ).toThrowError();
  });
});
