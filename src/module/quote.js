/*eslint no-console: "warn"*/
/*eslint no-unused-vars: "warn"*/

/*
 * Quote
 *
 */
const AWS = require("aws-sdk");

let table = "quotes";
let dbInitialized = false;
let db;

function initDB(dev = false, endpoint = "local") {

  // --------- DEVELOPMENT ONLY ------------------
  if (dev) {
    var local = "http://localhost:8000";
    var remote = "https://dynamodb.us-east-1.amazonaws.com";

    var awsConfig = {
      region: "us-east-1"
    };

    if (endpoint === "remote") {
      awsConfig.endpoint = remote;
    }
    else {
      awsConfig.endpoint = local;
    }

    AWS.config.update(awsConfig);
  }
  // --------- DEVELOPMENT ONLY ------------------

  if (!dbInitialized) {
    db = new AWS.DynamoDB.DocumentClient();
    dbInitialized = true;
  }
}

function formatResult(q) {
  let [, aid] = q.quoteId.split(":");
  return {
    quote: q.quote,
    citation: q.citation,
    url: `${q.url}?as=${q.pid}:${aid}:${q.userId}`
  };
}

/*
 * insert or update quote
 *
 */
function addQuote(parms) {

  return new Promise((resolve, reject) => {

    let putParams = {
      TableName: table,
      Item: {
        "userId": parms.userId,
        "quoteId": parms.quoteId,
        "quote": parms.quote,
        "pid": parms.pid,
        "url": parms.url,
        "citation": parms.citation
      }
    };

    db.put(putParams, function(err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

/*
 * get a quote by userId and quoteId
 *
 * returns data for display
 */
function getQuote(userId, quoteId) {
  return new Promise((resolve, reject) => {

    //query parms
    let getParams = {
      TableName: table,
      Key: {
        "userId": userId,
        "quoteId": quoteId
      }
    };

    db.get(getParams, function(err, data) {
      if (err) {
        reject(err.message);
      }
      else {
        let quote = formatResult(data.Item); 
        resolve(quote);
      }
    });
  });
}

/* get quote data by userId and quoteId
 * - return data in database w/o modification
 */
function getQuoteData(userId, quoteId) {
  return new Promise((resolve, reject) => {

    //query parms
    let getParams = {
      TableName: table,
      Key: {
        "userId": userId,
        "quoteId": quoteId
      }
    };

    db.get(getParams, function(err, data) {
      if (err) {
        reject(err.message);
      }
      else {
        resolve(data.Item);
      }
    });
  });
}

function deleteQuote(userId, quoteId) {
  return new Promise((resolve, reject) => {

    //query parms
    let getParams = {
      TableName: table,
      Key: {
        "userId": userId,
        "quoteId": quoteId
      }
    };

    db.delete(getParams, function(err, data) {
      if (err) {
        reject(err.message);
      }
      else {
        resolve(data);
      }
    });
  });
}

function getIds(userId, key) {
  return new Promise((resolve, reject) => {

    //query parms
    let queryParams = {
      TableName: table,
      ProjectionExpression: "quoteId",
      KeyConditionExpression: "userId = :address AND begins_with ( quoteId, :sid )",
      ExpressionAttributeValues: {
        ":address": userId,
        ":sid": key
      }
    };

    db.query(queryParams, function(err, data) {
      if (err) {
        reject(err);
      }
      else {
        let keyArray = data.Items.map(i => i.quoteId);
        resolve(keyArray);
      }
    });
  });
}

/*
 * Query quotes table by:
 *  userId: md5 hash of user email address
 *  key: usually the first 2 characters of the quoteId to limit quotes to a given source (WOM, RAJ, etc)
 *
 *  Returns
 *    an array of quotes or
 *    empty array if none were found
 */
function query(userId, key) {
  return new Promise((resolve, reject) => {

    //query parms
    let queryParams = {
      TableName: table,
      KeyConditionExpression: "userId = :address AND begins_with ( quoteId, :sid )",
      ExpressionAttributeValues: {
        ":address": userId,
        ":sid": key
      }
    };

    db.query(queryParams, function(err, data) {
      if (err) {
        reject(err);
      }
      else {
        //https://localhost/t/wom/woh/l01/?as=p54:1582683264281:05399539cca9ac38db6db36f5c770ff1
        let quotes = data.Items.map(formatResult); 
        resolve(quotes);
      }
    });
  });
}

module.exports = {
  initialize: function(dev, endpoint) {
    initDB(dev, endpoint);
  },
  addQuote: addQuote,
  getQuote: getQuote,
  getQuoteData: getQuoteData,
  deleteQuote: deleteQuote,
  getIds: getIds,
  query: query
};


