const express = require("express");
const path = require("node:path");
const db = require("./db/queries.js");

const PORT = 8000;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  console.log(await db.getMessages());
  res.render("index", {
    title: "Mini Messageboard",
    messages: await db.getMessages(),
  });
});

app.get("/message/:id", async (req, res) => {
  const messages = await db.getMessages();
  const id = parseInt(req.params.id);
  const message = messages[id];

  if (!message) {
    return res.status(404).send("Message not found");
  }

  res.render("message", { title: "Message Details", message });
});

app.get("/new", (req, res) => {
  res.render("form");
});

app.post("/new", async (req, res) => {
  const { messageUser, messageText } = req.body;

  await db.insertMessage(messageUser, messageText);

  res.redirect("/");
});

app.listen(PORT, () => console.log(`Connected on port: ${PORT}`));
