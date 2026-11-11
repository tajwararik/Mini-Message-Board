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

app.get("/", async (req, res) => {
  try {
    const messages = await db.getMessages();

    res.render("index", {
      title: "Mini Message Board",
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render("index", {
      title: "Mini Message Board",
      error: "Something went wrong.",
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
