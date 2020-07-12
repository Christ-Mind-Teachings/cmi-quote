const quote = require("../src/module/quote");
const md5 = require("md5");

quote.initialize(true, "remote");
const email = "rmercer33@gmail.com";

const parms = {
  userId: md5(email),
  quoteId: "10401000.055:1582683264281",
  pid: "p54",
  quote: "Now is the time for all good men to come to the aid of their party",
  url: "/t/wom/woh/",
  citation: "Unknown"
};

quote.addQuote(parms)
  .then((list) => {
    console.log("addQuote: ", list);
  })
  .catch((err) => {
    console.error(`queryerror: ${err}`);
  });

