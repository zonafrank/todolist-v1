require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { getDate } = require("./date");
const { Todo } = require("./models/todo");
const List = require("./models/list");

mongoose
  .connect(process.env.MONGODB_URI)
  .then((responose) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (request, response) => {
  const todos = await Todo.find({});
  const dateString = getDate();
  response.render("base", { listTitle: "Today", todos, page: "home" });
});

app.post("/", async (request, response) => {
  const newItem = request.body["new-item"];
  const listName = request.body.list;

  const todo = new Todo({
    content: newItem,
    date: new Date(),
    important: false,
  });

  if (listName === "Today") {
    await todo.save();
    response.redirect("/");
  } else {
    const list = await List.findOne({ list: listName });
    list.items.push(todo);
    await list.save();
    response.redirect(`/${listName}`);
  }
});

app.get("/:pageToDisplay", async (request, response) => {
  const listToDisplay = request.params.pageToDisplay.toLowerCase();

  if (listToDisplay === "about") {
    return response.render("base", { page: "about" });
  } else {
    const list = await List.findOne({ list: listToDisplay });
    if (!list) {
      const list = new List({ list: listToDisplay, items: [] });
      await list.save();
      response.redirect(`/${listToDisplay}`);
    } else {
      response.render("base", {
        listTitle: listToDisplay,
        todos: list.items,
        page: "home",
      });
    }
  }
});

app.post("/delete", async (request, response) => {
  const id = request.body.todo;
  const currentList = request.body.currentList;

  if (currentList === "Today") {
    try {
      await Todo.findByIdAndRemove(id);
    } catch (error) {
      console.log(error);
    }
    response.redirect("/");
  } else {
    try {
      await List.findOneAndUpdate(
        { list: currentList },
        { $pull: { items: { _id: id } } }
      );
    } catch (error) {
      console.log(error);
    }

    response.redirect(`/${currentList}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
