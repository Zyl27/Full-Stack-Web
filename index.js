import express from "express";
import dotenv from "dotenv";
import { supabaseMiddleware } from "./middleware/supabse.js";
import { requireAuth } from "./middleware/authSupabase.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

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
  let message = "";

  switch (req.query.error) {
    case "invalid_registration":
      message =
        "Unable to create your account. This email is already registered, or the information you entered is invalid. Please try again or log in.";
      break;

    case "oauth_failed":
      message =
        "Google authentication failed. Please try again. If the issue persists, create an account with your email address, then log in.";
      break;
  }

  res.render("register.ejs", { accountCheck: message });
});

app.get("/login", (req, res) => {
  let message = "";
  let messageR = "";

  switch (req.query.error) {
    case "invalid_credentials":
      message = "Login failed. Invalid email or password.";
      break;

    case "oauth_failed":
      message = "Google login failed. Please try again.";
      break;
  }

  switch (req.query.success) {
    case "registered":
      messageR = "Account created successfully <br>Please sign in";
      break;
  }

  res.render("login.ejs", { loginCheck: message, registered: messageR });
});

app.get("/home", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await req.supabase
    .from("profiles")
    .select("user_name")
    .eq("id", userId)
    .single();

  if (error) {
    console.log(error.message);
  }

  const capName =
    data.user_name[0].toUpperCase() + data.user_name.slice(1).toLowerCase();

  res.render("home.ejs", { profileName: capName });
});

app.get("/auth/google", async (req, res) => {
  const { data, error } = await req.supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.APP_URL}/auth/callback`,
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
    return res.redirect("/register?error=oauth_failed");
  }

  try {
    const { data, error } =
      await req.supabase.auth.exchangeCodeForSession(code);

    const userId = data.user.identities[0].user_id;
    const name = data.user.email;
    const { data: userData } = await req.supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!userData) {
      const { error: profileError } = await req.supabase
        .from("profiles")
        .insert({
          id: userId,
          user_name: name,
        });

      if (profileError) {
        console.log(profileError.message);
      }
    }

    res.redirect("/home");
  } catch (err) {
    console.log(err);
    return res.redirect("/register?error=oauth_failed");
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
    return res.redirect("/register?error=invalid_registration");
  }

  const userId = data.user.id;

  const { error: profileError } = await req.supabase.from("profiles").insert({
    id: userId,
    user_name: name,
  });

  if (profileError) {
    console.log(profileError.message);
  }

  res.redirect("/login?success=registered");
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
    return res.redirect("/login?error=invalid_credentials");
  }

  res.redirect("/home");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
