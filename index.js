import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createSupabaseServerClient } from "./create-supabase-server.js";
import { regSupabase } from "./regular-supabase.js";
import { requireAuth } from "./middleware/authSupabase.js";

const app = express();
const PORT = process.env.PORT || 3000;
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});
dotenv.config();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("cover.ejs");
});

app.get("/cover", (req, res) => {
  res.render("cover.ejs");
});

app.get("/contact", (req, res) => {
  let message = "";

  switch (req.query.error) {
    case "empty":
      message = "Topic and content are required.";
      break;

    case "invalid_topic":
      message = "Topic is too long.";
      break;

    case "invalid_content":
      message = "Content is too long.";
      break;

    case "submission_failed":
      message = "Sorry, unable to submit feedback. Maybe try again later.";
      break;
  }

  switch (req.query.success) {
    case "submitted":
      message = "Message received. Thank you!";
      break;
  }

  res.render("contact.ejs", { feedbackCheck: message });
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
  const serverSupabase = createSupabaseServerClient(req, res);
  const userId = req.user.id;

  const { data, error } = await serverSupabase
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
  const serverSupabase = createSupabaseServerClient(req, res);
  const { data, error } = await serverSupabase.auth.signInWithOAuth({
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
  const serverSupabase = createSupabaseServerClient(req, res);
  const code = req.query.code;
  if (!code) {
    return res.redirect("/register?error=oauth_failed");
  }

  try {
    const { data, error } =
      await serverSupabase.auth.exchangeCodeForSession(code);

    const userId = data.user.identities[0].user_id;
    const name = data.user.email;
    const { data: userData } = await serverSupabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!userData) {
      const { error: profileError } = serverSupabase.from("profiles").insert({
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

// ------------------------------------ POST ------------------------------------
app.post("/register", async (req, res) => {
  const serverSupabase = createSupabaseServerClient(req, res);
  const name = req.body.username?.trim() || req.body.useremail.split("@")[0];
  const email = req.body.useremail;
  const password = req.body.password;

  const { data, error: acError } = await serverSupabase.auth.signUp({
    email: email,
    password: password,
  });

  if (acError) {
    console.log(acError.message);
    return res.redirect("/register?error=invalid_registration");
  }

  const userId = data.user.id;

  const { error: profileError } = await serverSupabase.from("profiles").insert({
    id: userId,
    user_name: name,
  });

  if (profileError) {
    console.log(profileError.message);
  }

  res.redirect("/login?success=registered");
});

app.post("/login", async (req, res) => {
  const serverSupabase = createSupabaseServerClient(req, res);
  const email = req.body.useremail;
  const password = req.body.password;

  const { data, error } = await serverSupabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error.message);
    return res.redirect("/login?error=invalid_credentials");
  }

  res.redirect("/home");
});

app.post("/contact", feedbackLimiter, async (req, res) => {
  const topic = req.body.topic?.trim();
  const content = req.body.content?.trim();

  if (!topic || !content) {
    return res.redirect("/contact?error=empty");
  }

  if (topic.length > 100) {
    return res.redirect("/contact?error=invalid_topic");
  }

  if (content.length > 5000) {
    return res.redirect("/contact?error=invalid_content");
  }

  const { error } = await regSupabase.from("feedback").insert({
    topic,
    content,
  });

  if (error) {
    console.error(error);
    return res.redirect("/contact?error=submission_failed");
  }

  res.redirect("/contact?success=submitted");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
