const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const ejs = require("ejs");
app.set("view engine", "ejs");
app.use(express.static('public'))
require('dotenv').config();

const adminGmail = process.env.EMAIL;
const adminPassword = process.env.PASSWORD;
 
 
            // create database
const cont = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quiz-database",
});

var sql =
  "create table if not exists  questions (id int auto_increment primary key ,question varchar(255),option1 VARCHAR(255),option2 VARCHAR(255),option3 VARCHAR(255),option4 VARCHAR(255),correct_answer VARCHAR(255))";
cont.query(sql, (err, result) => {
  if (err) throw err;
});

            


            // page one or main page
app.get("/", (req, res) => {
  res.render("login");
});

            // get to student page
app.get("/userStudent", (req, res) => {
  res.render("userStudent");
});

            // page admimn login
app.get("/userAdmin", (req, res) => {
  res.render("userAdmin");
});
var pas_admin ;
var email_admin;
            // post for admin
app.post("/getToAdminPanel", (req, res) => {
   email_admin = req.body.EmailAdmin;
   pas_admin = req.body.passwordAdmin;

  if (pas_admin == adminPassword && email_admin ==adminGmail ) {
    cont.query(`select * from questions`, (err, result) => {
      if (err) throw err;
      res.render("AdminSide", { arrayDB: result });
    });
  } else res.redirect("/userAdmin");
});

            // take information of students
app.post("/getToPublic", (req, res) => {
  const { nameStudent, LastNameStudent, ID_Student } = req.body;
  cont.query(
    `insert into Students (id , name , last_name) values ( ${ID_Student}, '${nameStudent}','${LastNameStudent}')`
  );
  cont.query(`select * from questions`, (err, result) => {
    if (err) throw err;
    res.render("PublicSide", { arrayDB: result });
  });
});

            // get to admin panel
app.get("/getToAdminPanel", (req, res) => {
  if (pas_admin == adminPassword && email_admin ==adminGmail ){
  cont.query(`select * from questions`, (err, result) => {
    if (err) throw err;
    res.render("AdminSide", { arrayDB: result });
  });
}
});

            // add question
app.post("/addQuestion", (req, res) => {
  var { question, option1, option2, option3, option4, correctAnswer } =
    req.body;
  cont.query(
    `insert into questions (question,option1,option2,option3,option4,correct_answer) values ('${question}', '${option1}','${option2}','${option3}','${option4}','${correctAnswer}')`
  ),
    (err, result) => {
      if (err) throw err;
    };
  res.redirect("/getToAdminPanel");
});

            // delete question
app.post("/deleteQuestiom/:id", (req, res) => {
  const idToDelete = req.params.id;
  cont.query(`delete from questions where id = ${idToDelete}`);
  res.redirect("/getToAdminPanel");
});

            // edit questions
var arrEditQuestions = [];
app.get("/editQuesion/:id", (req, res) => {
  const questionid = parseInt(req.params.id);
  if (pas_admin == adminPassword && email_admin ==adminGmail ){
  cont.query(
    `select * from questions where id = ${questionid}`,
    (err, result) => {
      if (err) throw err;
      arrEditQuestions = result;
      res.render("editQuestion", {arrEditQuestions});
    }
  );
}
});

            // router edit question
app.post("/EditQuestion/:id", (req, res) => {
  const idEdite = req.params.id;
  const { question, option1, option2, option3, option4, correctAnswer } =
    req.body;

  cont.query(
    `update questions  set question = '${question}' , option1 = '${option1}' , option2 = '${option2}', option3 = '${option3}', option4 = '${option4}' , correct_answer = '${correctAnswer}' where id = ${idEdite} `
  );
  res.redirect("/getToAdminPanel");
});

           // route for get to public side
app.get("/getToPublic", (req, res) => {
  res.render("PublicSide", { arrayDB });
});

          //  Correct Answer
correcrArray2 = [];
app.post("/CorrectAnswer", (req, res) => {
  correcrArray2 = req.body;
  var i = 0;
  var corrct = 0;
  var incorrct = 0;
  cont.query(`select correct_answer from questions`, (err, result) => {
    if (err) throw err;
    console.log(result);

    result.forEach((element) => {
      const answer = element.correct_answer;
      console.log(answer);
      const answer2 = correcrArray2[`ANSWER${i}`];
      i++;
      console.log(answer2);
      if (answer == answer2) corrct++;
      else incorrct++;
    });
    res.render("showAnswer", { corrct, incorrct });
  });
});

 var port = 3000;
app.listen(port, () => {
  console.log("Server on port 3000");
});
 
