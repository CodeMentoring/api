const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors"); // Importa la biblioteca cors

const { sequelize } = require("./connection");
const { Author, Book, Customer } = require("./models");

app.use(express.json());

// Habilita CORS para todas las rutas
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: [
        {
          model: Book,
          as: "books",
          attributes: ["id", "isbn", "name", "cantPages", "createdAt"],
        },
      ],
    });
    return res.json({ authors });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ...

app.get("/authors/:authorId", async (req, res) => {
  try {
    const authorId = req.params.authorId; // Obtiene el ID del autor de los parámetros de la URL
    const author = await Author.findByPk(authorId, {
      include: [
        {
          model: Book,
          as: "books",
          attributes: ["id", "isbn", "name", "cantPages", "createdAt"],
        },
      ],
    });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.json({ author });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/authors", async (req, res) => {
  try {
    const name = req.body?.name;
    const age = req.body?.age;

    if (!name || !age) {
      return res
        .status(400)
        .json({ message: "Bad request, name or age not found" });
    }
    const save = await Author.create({
      name,
      age,
    });
    return res.status(201).json({ author: save });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/authors/:authorId", async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const { name, age } = req.body;

    if (!name || !age) {
      return res
        .status(400)
        .json({ message: "Bad request, name or age not found" });
    }

    const author = await Author.findByPk(authorId);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Actualiza el autor con los nuevos datos
    author.name = name;
    author.age = age;
    await author.save();

    return res.json({ author });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/authors/:authorId", async (req, res) => {
  try {
    const authorId = req.params.authorId;

    const author = await Author.findByPk(authorId);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Elimina el autor
    await author.destroy();

    return res.json({ message: "Author deleted successfully" });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/customers", async (req, res) => {
  try {
    const name = req.body?.name;
    const email = req.body?.email;

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Bad request, name or email not found" });
    }
    const save = await Customer.create({
      name,
      email,
    });
    return res.status(201).json({ customer: save });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.findAll();
    return res.json({ customers });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll();
    return res.json({ books });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const isbn = req.body?.isbn;
    const name = req.body?.name;
    const cantPages = req.body?.cantPages;
    const author = req.body?.author;

    if (!name || !cantPages || !author || !isbn) {
      return res.status(400).json({
        message: "Bad request, isbn or name or cantPages or author not found",
      });
    }
    const save = await Book.create({
      isbn,
      name,
      cantPages,
      authorId: author,
    });
    return res.status(201).json({ book: save });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({ book });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const { isbn, name, cantPages, author } = req.body;

    if (!isbn || !name || !cantPages || !author) {
      return res.status(400).json({
        message: "Bad request, isbn or name or cantPages or author not found",
      });
    }

    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Actualiza el libro con los nuevos datos
    book.isbn = isbn;
    book.name = name;
    book.cantPages = cantPages;
    book.authorId = author;
    await book.save();

    return res.json({ book });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Elimina el libro
    await book.destroy();

    return res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection success");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Sync models");
    app.listen(port, () => {
      console.log(`Server listen on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Connection fail", error);
  });
