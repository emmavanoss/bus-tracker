import { Hono } from "hono";
import { db } from "./db/db";
import { usersTable } from "./db/schema";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { DatabaseError } from "pg";

const app = new Hono();

app.get("/", (c) => c.text("OK"));
app.post("/register", async (c) => {
  const { username, password } = await c.req.json();
  const passwordHash = await Bun.password.hash(password);
  try {
    await db.insert(usersTable).values({ username, passwordHash });
    c.status(201);
    return c.text(`User created: ${username}`);
  } catch (err) {
    if (
      err instanceof DrizzleQueryError &&
      err.cause instanceof DatabaseError &&
      err.cause.code === "23505"
    ) {
      c.status(409);
      return c.text(`User already exists: ${username}`);
    } else {
      throw err;
    }
  }
});

export default app;
