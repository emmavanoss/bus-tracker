import { Hono } from "hono";

export const app = new Hono<{ Variables: Variables }>();

app.get("/", (c) => c.text("OK"));
