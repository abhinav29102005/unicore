require('dotenv').config();
const { createClient } = require('@libsql/client');

async function run() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  for (const row of res.rows) {
    await client.execute(`DROP TABLE IF EXISTS ${row.name}`);
    console.log(`Dropped ${row.name}`);
  }
  console.log('All tables dropped.');
}
run();
