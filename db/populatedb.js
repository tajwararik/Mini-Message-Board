const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username VARCHAR(255),
   message VARCHAR(255),
   added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS messages ALTER COLUMN username SET NOT NULL;

ALTER TABLE IF EXISTS messages ALTER COLUMN message SET NOT NULL;

INSERT INTO messages (username, message)
VALUES
   ('Amando', 'Hi there!'),
   ('Charles', 'Hello World!');
`;

async function main() {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
}

main();
