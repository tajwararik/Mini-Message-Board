const express = require("express");
const path = require("node:path");
const db = require("./db/queries.js");

const PORT = process.env.PORT || 8000;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetPath = path.join(__dirname, "public");

app.use(express.static(assetPath));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const messages = await db.getMessages();

    res.render("index", {
      title: "Mini Message Board",
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong.");
  }
});

app.get("/new", (req, res) => {
  res.render("form");
});

app.post("/new", async (req, res) => {
  const { messageUser, messageText } = req.body;

  await db.insertMessage(messageUser, messageText);

  res.redirect("/");
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

app.listen(PORT, () => console.log(`Connected on port: ${PORT}`));
