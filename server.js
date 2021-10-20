const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const config = require("config");

const appController = require("./controllers/appController");
const isAuth = require("./middleware/is-auth");
const connectDB = require("./config/db");
const mongoURI = config.get("mongoURI");

const app = express();

connectDB();

// const MongoURI =
//   "mongodb+srv://AyanPan:PFSA6X5lFswJloE3@test-cluster1.10mqm.mongodb.net/sessions?retryWrites=true&w=majority";

// mongoose
//   .connect(MongoURI, {
//     useNewUrlParser: true,
//   })
//   .then((res) => console.log("MongoDB Connected!"));

const store = new MongoDBSession({
  uri: mongoURI,
  collection: "mySessions",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "key that will sign cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// app.get("/", (req, res) => {
//   console.log(req.session);
//   req.session.isAuth = true;
//   console.log(req.session);
//   console.log(req.session.id);
//   res.send("Hello Sessions Tut");
// });

//=================== Routes
// Landing Page
app.get("/", appController.landing_page);

// Login Page
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

// Register Page
app.get("/register", appController.register_get);
app.post("/register", appController.register_post);

// Dashboard Page
app.get("/dashboard", isAuth, appController.dashboard_get);

// Logout
app.post("/logout", appController.logout_post);

app.listen(5000, console.log(`Server running on http://localhost:5000`));
