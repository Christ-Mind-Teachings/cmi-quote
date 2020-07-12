/*
 * Verify required arguments are present.
 *
 * Required:
 *    userId: this is checked in calling function
 *    quote: the quote to be stored
 *    quoteId: <paraKey>:<annotationId>
 *    pid: paragraph id for quote
 *    url: relative path to page containing quote
 *    citation: where quote is from
 */
function addQuote(parms, userRequest) {

  //quote
  if (!userRequest.quote) {
    parms.message.push("Error: body.quote missing");
    parms.error = true;
  }
  else {
    parms.quote = userRequest.quote;
  }

  //key
  if (!userRequest.quoteId) {
    parms.message.push("Error: body.quoteId missing");
    parms.error = true;
  }
  else {
    parms.quoteId = userRequest.quoteId;
  }
  
  //pid
  if (!userRequest.pid) {
    parms.message.push("Error: body.pid missing");
    parms.error = true;
  }
  else {
    parms.pid = userRequest.pid;
  }
  
  //url
  if (!userRequest.url) {
    parms.message.push("Error: body.url missing");
    parms.error = true;
  }
  else {
    parms.url = userRequest.url;
  }
  
  //citation
  if (!userRequest.citation) {
    parms.message.push("Error: body.citation missing");
    parms.error = true;
  }
  else {
    parms.citation = userRequest.citation;
  }

  //indicates error in running query
  if (userRequest.error) {
    parms.error = userRequest.error;
  }

  return parms;
}

function parseRequest(requestType, request) {
  var parms = {message: []};

  //if no parms given set error indicator and return
  if (request.body === null || typeof request.body === "undefined") {
    parms.message.push("request body missing");
    parms.error = true;
    return parms;
  }

  var userRequest = request.body;

  //md5 of email address
  //=> email address for searchAudit requestType
  if (!userRequest.userId) {
    parms.message.push("Error: body.userId missing");
  }
  else {
    parms.userId = userRequest.userId;
  }

  switch(requestType) {
    case "addQuote":
      parms = addQuote(parms, userRequest);
      break;
  }

  return parms;
}

module.exports = {
  parse: parseRequest
};

