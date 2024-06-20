import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

//databse def
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "0048",
  port: 5432
});
//conecting to the database
db.connect();

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM info');
    const data = result.rows; // Use result.rows directly for efficiency
    res.render("index.ejs", { data });
  } catch (error) {
    console.error(error);
    res.render("error", { error }); // Handle errors gracefully
  }
});


// POST method for the addition of new data. 
app.post("/", (req, res) => {
  const bookid = req.body.bookid;
  const bookname = req.body.bookname;
  const isbn = req.body.isbn;
  const author = req.body.author;
  const dateread = req.body.dateread;
  const review = req.body.review;
  const rating = req.body.rating;

  const sql = `INSERT INTO info (book_id, isbn, book_name, author, date_read, review, ratingigive)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  db.query(sql, [bookid, isbn, bookname, author, dateread, review, rating], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error adding book information" });
    }
    console.log("1 record inserted");
    res.redirect('/');
  });
});


//Post method to delete the Book Review with the particular book_id
app.post("/delete-review", async (req, res) => {
  const reviewId = req.body.book_id;

  try {
    const sql = `DELETE FROM info WHERE book_id = $1`;
    db.query(sql, [reviewId]);

    console.log("Review deleted successfully");
    res.redirect("/"); // Or handle deletion confirmation on the frontend

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Deleting Review" });
  }
});


//Listen to the port as defined
app.listen(port, () => {
  console.log(`Server is Listening to Port ${port}`);
});

