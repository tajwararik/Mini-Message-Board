const pool = require("./pool.js");

async function getMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function insertMessage(messageUser, messageText) {
  await pool.query(
    "INSERT INTO messages (userName, text) VALUES ($1, $2) RETURNING *",
    [messageUser, messageText]
  );
}

module.exports = {
  getMessages,
  insertMessage,
};
