require('dotenv').config();
const { createClient } = require('@libsql/client');
const fs = require('fs');

async function run() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  const sql = fs.readFileSync('../database/schema.sql', 'utf8');
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

  console.log(`Applying ${statements.length} statements...`);
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
    } catch (err) {
      console.error('Error applying statement:', stmt);
      console.error('Error:', err.message);
      break;
    }
  }
}

run();
