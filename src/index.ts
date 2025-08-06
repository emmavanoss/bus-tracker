import { Hono } from "hono";
import { db } from "./db/db";
import { usersTable } from "./db/schema";

const app = new Hono();

app.get("/", (c) => c.text("OK"));
app.post("/register", async (c) => {
  const { username, password } = await c.req.json();
  const passwordHash = await Bun.password.hash(password);
  await db.insert(usersTable).values({ username, passwordHash });

  c.status(201);
  return c.text(`User created: ${username}`);
});

export default app;
