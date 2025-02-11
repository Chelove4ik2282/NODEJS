const fs = require("fs");
const inquirer = require("inquirer").default;
const path = "./books.json";
 
const readBooks = () => {
  try {
    const data = fs.readFileSync(path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};
 
const writeBooks = (books) => {
  fs.writeFileSync(path, JSON.stringify(books, null, 2), "utf-8");
}; 
const addBook = async () => {
  const books = readBooks();
  const { title, author, year, genre } = await inquirer.prompt([
    { type: "input", name: "title", message: "Name:" },
    { type: "input", name: "author", message: "Author:" },
    { type: "input", name: "year", message: "Realise:" },
    { type: "input", name: "genre", message: "genre:" },
  ]);

  const newBook = {
    id: books.length + 1,
    title,
    author,
    year: parseInt(year, 10),
    genre,
  };

  books.push(newBook);
  writeBooks(books);
  console.log("added.");
}; 
const listBooks = () => {
  const books = readBooks();
  if (books.length === 0) {
    console.log("empty.");
  } else {
    books.forEach((book) => {
      console.log(`ID: ${book.id} | ${book.title} (${book.author})`);
    });
  }
};
 
const deleteBook = async () => {
  const books = readBooks();
  if (books.length === 0) return console.log("empty");

  const { id } = await inquirer.prompt([
    { type: "input", name: "id", message: "Id:" },
  ]);

  const newBooks = books.filter((book) => book.id !== parseInt(id, 10));

  if (newBooks.length === books.length) {
    console.log("cannot find a book with this id.");
  } else {
    writeBooks(newBooks);
    console.log("was deleted.");
  }
};

const editBook = async () => {
  const books = readBooks();
  if (books.length === 0) return console.log("empty");

  const { id } = await inquirer.prompt([
    { type: "input", name: "id", message: "ID:" },
  ]);

  const bookIndex = books.findIndex((book) => book.id === parseInt(id, 10));
  if (bookIndex === -1) return console.log("cannot find a book with this id.");

  const { title, author, year, genre } = await inquirer.prompt([
    { type: "input", name: "title", message: "New name:", default: books[bookIndex].title },
    { type: "input", name: "author", message: "new author:", default: books[bookIndex].author },
    { type: "input", name: "year", message: "realise:", default: books[bookIndex].year },
    { type: "input", name: "genre", message: "new genre:", default: books[bookIndex].genre },
  ]);

  books[bookIndex] = { ...books[bookIndex], title, author, year: parseInt(year, 10), genre };
  writeBooks(books);
  console.log("updated.");
};
 
const mainMenu = async () => {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "select:",
        choices: [
          "add a book",
          "all books",
          "edit a book",
          "deelete a book",
          "exit",
        ],
      },
    ]);

    if (action === "add a book") await addBook();
    else if (action === "all books") listBooks();
    else if (action === "edit a book") await editBook();
    else if (action === "deelete a book") await deleteBook();
    else if (action === "exit") {
      console.log("exit.");
      process.exit();
    }
  }
};
 
mainMenu();
