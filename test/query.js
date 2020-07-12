const quote = require("../src/module/quote");
const md5 = require("md5");

quote.initialize(true, "remote");

const sourceId = "10";
const email = "rmercer33@gmail.com";
const userId = md5(email);

quote.query(userId, sourceId)
  .then((list) => {
    console.log("query: ", list);
  })
  .catch((err) => {
    console.error(`queryerror: ${err}`);
  });

