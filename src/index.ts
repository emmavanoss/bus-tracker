import { drizzle } from "drizzle-orm/bun-sql";

import { runServer } from "./server";

const db = drizzle(process.env.POSTGRES_URL!);

console.log(process.env.POSTGRES_URL)

runServer();
