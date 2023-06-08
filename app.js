//WEATHER APP
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

//Here we created our route for URL to Page.html
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/page.html");
});
// Here we will implement our API CALL to our URL
app.post("/", function(req, res) {
  const cityName = req.body.cityName;
  const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=37f29f7631f9aec93c23685b2545c3c8`;

  https.get(geocodingUrl, function(response) {
    response.on("data", function(data) {
      const geocodingData = JSON.parse(data);
      if (geocodingData.length === 0) {
        res.write(`<p>No data found for ${cityName}</p>`);
        res.send();
        return;
      }

      const latitude = geocodingData[0].lat;
      const longitude = geocodingData[0].lon;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=37f29f7631f9aec93c23685b2545c3c8&units=imperial`;

      https.get(weatherUrl, function(weatherResponse) {
        weatherResponse.on("data", function(weatherData) {
          const weatherJsonData = JSON.parse(weatherData);
          const temp = weatherJsonData.main.temp;
          const des = weatherJsonData.weather[0].description;
          const icon = weatherJsonData.weather[0].icon;
          const imageUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

          res.write(`<h1>The temp in ${cityName} is ${temp} degrees</h1>`);
          res.write(`<p>The weather description is ${des}</p>`);
          res.write(`<img src="${imageUrl}" alt="Weather Icon" />`);
          res.send();
        });
      });
    });
  });
});

app.listen(9000);