/*eslint no-console: "warn"*/

var ApiBuilder = require("claudia-api-builder");
var api = new ApiBuilder();
var db = require("./module/quote");

module.exports = api;

api.post("/request", function(request) {
  return request;
});

//create or update a quote
api.post("/quote", function(request) {
  var handleRequest = require("./module/handleRequest");

  var parms = handleRequest.parse("addQuote", request);

  var result = {
    message: "OK"
  };

  if (parms.error) {
    result.message = parms.message;
    return result;
  }

  db.initialize(false);

  return db.addQuote(parms)
    .then((response) => {
      result.response = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

/*
 * Get quote by 
 *  userId: md5 hash of user email address
 *  quoteId: compound key '<page key>:<annotationId>'
 *
 *  Returns data for display
 */
api.get("/quote/{userId}/{quoteId}", function(request) {
  let userId = request.pathParams.userId;
  let quoteId = request.pathParams.quoteId;

  var result = {
    message: "OK"
  };

  db.initialize(false);

  return db.getQuote(userId, quoteId)
    .then((response) => {
      result.quote = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

/*
 * Get quote data by 
 *  userId: md5 hash of user email address
 *  quoteId: compound key '<page key>:<annotationId>'
 *
 *  Returns data from database without modification.
 */
api.get("/quotedata/{userId}/{quoteId}", function(request) {
  let userId = request.pathParams.userId;
  let quoteId = request.pathParams.quoteId;

  var result = {
    message: "OK"
  };

  db.initialize(false);

  return db.getQuoteData(userId, quoteId)
    .then((response) => {
      result.quote = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

/*
 * Query quote table by
 *  userId: md5 hash of user email address
 *  key: first 2 characters of quoteId to limit quotes to a given source
 *       - first 4 chars to limit to a given sourcen and book
 *
 * Returns: {
 *    message: "OK",
 *    count: number of quotes returned
 *    quote: array of quotes
 * }
 */
api.get("/query/{userId}/{key}", function(request) {
  let userId = request.pathParams.userId;
  let key = request.pathParams.key;

  var result = {
    message: "OK"
  };

  db.initialize(false);

  return db.query(userId, key)
    .then((response) => {
      result.count = response.length;
      result.quotes = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

//get quoteIds for userId that begin with key
api.get("/getKeys/{userId}/{key}", function(request) {
  let userId = request.pathParams.userId;
  let key = request.pathParams.key;

  var result = {
    message: "OK"
  };

  db.initialize(false);

  return db.getIds(userId, key)
    .then((response) => {
      result.response = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

//delete quote
api.delete("/quote/{userId}/{quoteId}", function(request) {
  let userId = request.pathParams.userId;
  let quoteId = request.pathParams.quoteId;

  var result = {
    message: "OK"
  };

  db.initialize(false);

  return db.deleteQuote(userId, quoteId)
    .then((response) => {
      result.response = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

