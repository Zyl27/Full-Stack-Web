import express from "express";
import env from "dotenv";
import { createClient } from "@supabase/supabase-js";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 3000;
env.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60, // 1 min
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("cover.ejs");
});

app.get("/cover", (req, res) => {
  res.render("cover.ejs");
});

app.get("/register", (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  res.render("register.ejs", { accountCheck: message });
});

app.post("/register", async (req, res) => {
  const name = req.body.username;
  const email = req.body.useremail;
  const password = req.body.password;

  const { data, error: acError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (acError) {
    req.session.message =
      "Invalid email or password or email has been registered. Please try again or login.";
    return res.redirect("/register");
  }

  const userId = data.user.id;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    user_name: name,
  });

  if (profileError) {
    console.log(profileError);
  }

  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/home", (req, res) => {
  res.render("home.ejs");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
