const pool = require("./pool.js");

async function getMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function createMessage(username, message) {
  await pool.query("INSERT INTO messages (username, message) VALUES ($1, $2)", [
    username,
    message,
  ]);
}

async function getMessagesByUsername(username) {
  const { rows } = await pool.query(
    "SELECT * FROM messages WHERE username = $1",
    [username],
  );

  return rows;
}

module.exports = {
  getMessages,
  createMessage,
  getMessagesByUsername,
};
