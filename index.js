import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { requireLogin } from "./middleware/auth.js";
import { supabaseMiddleware } from "./middleware/supabse.js";
import { requireAuth } from "./middleware/authSupabase.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(supabaseMiddleware);

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

app.get("/login", (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  res.render("login.ejs", { loginCheck: message });
});

app.get("/home", requireLogin, async (req, res) => {
  const userId = req.session.user.id;

  const { data, error } = await req.supabase
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

app.get("/auth/google", async (req, res) => {
  const { data, error } = await req.supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (error) {
    console.log(error);
  }

  res.redirect(data.url);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.redirect("/login");
  }

  try {
    const { data, error } =
      await req.supabase.auth.exchangeCodeForSession(code);

    const userId = data.user.identities[0].user_id;
    const name = data.user.email;
    const { error: profileError } = await req.supabase.from("profiles").insert({
      id: userId,
      user_name: name,
    });

    if (profileError) {
      console.log(profileError.message);
    }

    req.session.user = {
      id: userId,
      email: name,
    };

    res.redirect("/home");
  } catch (err) {
    console.log(err);
    return res.redirect("/register");
  }
});

app.post("/register", async (req, res) => {
  const name = req.body.username?.trim() || req.body.useremail.split("@")[0];
  const email = req.body.useremail;
  const password = req.body.password;

  const { data, error: acError } = await req.supabase.auth.signUp({
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

  const { error: profileError } = await req.supabase.from("profiles").insert({
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

  const { data, error } = await req.supabase.auth.signInWithPassword({
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
