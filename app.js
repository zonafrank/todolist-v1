const express = require("express");
const ejs = require("ejs");
const { getDate } = require("./date");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const todos = ["Buy food", "Cook food", "Eat food"];
const workTodos = [];

app.get("/", (request, response) => {
  const dateString = getDate();
  response.render("base", { listTitle: dateString, todos, page: "home" });
});

app.post("/", (request, response) => {
  const newItem = request.body["new-item"];
  if (request.body.list === "Work") {
    if (newItem) {
      workTodos.push(newItem);
    }
    response.redirect("/work");
  } else {
    if (newItem) {
      todos.push(newItem);
    }
    response.redirect("/");
  }
});

app.get("/work", (request, response) => {
  response.render("base", {
    listTitle: "Work",
    todos: workTodos,
    page: "home",
  });
});

app.get("/about", (request, response) => {
  response.render("base", { page: "about" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
