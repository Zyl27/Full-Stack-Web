import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const CurrentYear = new Date().getFullYear();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("cover.ejs", { footerYear: CurrentYear });
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
