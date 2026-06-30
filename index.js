import express from "express";
import env from "dotenv";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 3000;
env.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

const CurrentYear = new Date().getFullYear();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("cover.ejs", { footerYear: CurrentYear });

  try {
    let { data: User, error } = await supabase.from("User").select("*");
  } catch (err) {
    console.log(err);
  }
});

app.get("/cover", (req, res) => {
  res.render("cover.ejs", { footerYear: CurrentYear });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", { footerYear: CurrentYear });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { footerYear: CurrentYear });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
