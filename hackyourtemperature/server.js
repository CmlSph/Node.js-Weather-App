const express = require("express");
const exphbs = require("express-handlebars");
const axios = require("axios");

const API_KEY = require("./sources/keys.json").API_KEY;

const app = express();
const port = 3000;

app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({ defaultLayout: false }));

app.use(express.json()); //for parsing json in request body
app.use(express.urlencoded({ extended: true })); // for form data

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/weather", (req, res) => {
  const city = req.body.cityName;
  if (!city) {
    res.render("index", {
      weatherText: `You didn't provide a city.`,
    });
    return;
  }
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
    .then((response) => {
      const temp = response.data.main.temp;
      res.render("index", {
        weatherText: `The temperature in ${city} is ${temp}°C!`,
      });
    })
    .catch((error) => {
      console.error(error.response.status);
      res.render("index", { weatherText: "City is not found!" });
    });
});

app.listen(port);
