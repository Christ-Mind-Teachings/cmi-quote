const quote = require("../src/module/quote");
const md5 = require("md5");

quote.initialize(true, "remote");

const email = "rmercer33@gmail.com";
const userId = md5(email);
const quoteId = "10401000.055:1582683264281";

quote.getQuote(userId, quoteId)
  .then((list) => {
    console.log("query: ", list);
  })
  .catch((err) => {
    console.error(`queryerror: ${err}`);
  });

