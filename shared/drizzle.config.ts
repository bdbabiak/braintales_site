import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

// Parse the connection string to extract components
const url = new URL(connectionString.replace('mysql://', 'http://'));
const [username, password] = url.username && url.password 
  ? [url.username, url.password]
  : url.username.split(':');

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: username,
    password: password,
    database: url.pathname.slice(1),
    ssl: {
      rejectUnauthorized: true
    }
  },
});
