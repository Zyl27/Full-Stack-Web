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
      maxAge: 1000 * 60 * 5, // 5 min
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
  res.render("register.ejs", {
    accountCheck: message,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  });
});

app.get("/login", (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  res.render("login.ejs", {
    loginCheck: message,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  });
});

app.get("/home", requireLogin, async (req, res) => {
  const userId = req.session.user.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("user_name")
    .eq("id", userId);

  if (error) {
    console.log(error.message);
  }

  const capName =
    data[0].user_name[0].toUpperCase() +
    data[0].user_name.slice(1).toLowerCase();

  res.render("home.ejs", { profileName: capName });
});

app.post("/register", async (req, res) => {
  const name = req.body.username?.trim() || req.body.useremail.split("@")[0];
  const email = req.body.useremail;
  const password = req.body.password;

  const { data, error: acError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (acError) {
    console.log(acError.message);
    req.session.message =
      "Unable to create your account. This email is already registered, or the information you entered is invalid. Please try again or log in.";
    return res.redirect("/register");
  }

  const userId = data.user.id;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    user_name: name,
  });

  if (profileError) {
    console.log(profileError.message);
  }

  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const email = req.body.useremail;
  const password = req.body.password;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error.message);
    req.session.message = "Login failed. Invalid email or password.";
    return res.redirect("/login");
  }

  req.session.user = {
    id: data.user.id,
    email: data.user.email,
  };

  res.redirect("/home");
});

// authentication middleware
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
