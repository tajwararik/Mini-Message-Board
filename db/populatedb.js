const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   userName VARCHAR(255),
   text VARCHAR(255),
   added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (userName, text)
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
