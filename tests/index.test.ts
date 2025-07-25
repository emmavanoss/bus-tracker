import { describe, expect, it } from "bun:test";
import app from "../src/index.ts";

describe("Server", () => {
  it("Should return 200", async () => {
    const req = new Request("http://localhost/");
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
});
