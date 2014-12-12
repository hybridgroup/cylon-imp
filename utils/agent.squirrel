// Log the URLs we need
server.log("Agent URL: " + http.agenturl());

saved_response <- null;

function requestHandler(request, response) {
  local jsonRes = {};
  try {
    // check if the user sent led as a query parameter

    if ("mode" in request.query) {
      local value = ("value" in request.query) ? request.query.value : 0;

      device.send(request.query.mode, {
        "mode": request.query.mode,
        "pin": request.query.pin,
        "value": value
      });
    }
    // send a response back saying everything was OK.
    //response.send(200, jsonRes);
    saved_response = response;
  } catch (ex) {
    response.send(500, "Internal Server Error: " + ex);
  }
}

function responseHandler(data) {
  saved_response.send(200, http.jsonencode(data));
}

// register the HTTP handler
http.onrequest(requestHandler);

// register device response listner for digital and analog reads
device.on("response", responseHandler);

