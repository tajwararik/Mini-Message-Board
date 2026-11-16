const express = require("express");
const path = require("node:path");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("./db/queries.js");

const PORT = process.env.PORT || 8000;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetPath = path.join(__dirname, "public");

app.use(express.static(assetPath));
app.use(express.urlencoded({ extended: true }));

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Name can not be empty.")
    .isAlpha()
    .withMessage("Name must only contain alphabet letters."),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message can not be empty.")
    .isLength({ max: 200 })
    .withMessage("Message cannot exceed 200 characters")
    .escape(),
];

function formattedDate(messages) {
  return messages.map((message) => ({
    ...message,
    added: message.added.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
  }));
}

app.get("/", async (req, res) => {
  try {
    const messages = await db.getMessages();

    const formattedMessage = formattedDate(messages);

    res.render("index", {
      title: "Mini Message Board",
      messages: formattedMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render("index", {
      title: "Mini Message Board",
      messages: [],
      error: "Something went wrong. Try again later.",
    });
  }
});

app.get("/new", (req, res) => {
  res.render("form", { title: "Create new message" });
});

app.post("/new", validateUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("form", {
      title: "Create user",
      errors: errors.array(),
    });
  }

  const { username, message } = matchedData(req);
  await db.createMessage(username, message);

  res.redirect("/");
});

app.get("/message/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const messages = await db.getMessagesByUsername(username);

    const formattedMessage = formattedDate(messages);

    res.render("userMessages", {
      username,
      title: `${username}'s messages`,
      messages: formattedMessage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).render("userMessages", {
      username: undefined,
      title: `${username}' messages`,
      messages: [],
      error: "Something went wrong. Try again later.",
    });
  }
});

app.post("/message/:username/delete/:id", async (req, res) => {
  const { username, id } = req.params;

  try {
    await db.deleteMessage(id, username);

    res.redirect(`/message/${username}`);
  } catch (error) {
    console.log(error);
    res.status(500).render("userMessages", {
      username: undefined,
      title: `${username}' messages`,
      messages: [],
      error: "Failed to delete message. Try again later.",
    });
  }
});

app.listen(PORT, () => console.log(`Connected on port: ${PORT}`));
