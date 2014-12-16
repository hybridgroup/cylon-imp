// Log the URLs we need
server.log("Agent URL: " + http.agenturl());

saved_response <- null;

function requestHandler(request, response) {
  local jsonRes = {};
  try {
    // check if the user sent led as a query parameter

    if ("mode" in request.query) {
      local value = ("value" in request.query) ? request.query.value : 0;
      local pin = ("pin" in request.query) ? request.query.pin : 0;
      local address = ("address" in request.query) ? request.query.address : null;
      local buffer = ("buffer" in request.query) ? request.query.buffer : null;
      local bytes = ("bytes" in request.query) ? request.query.bytes : null;

      device.send(request.query.mode, {
        "mode": request.query.mode,
        "pin": pin,
        "value": value,
        "address": address,
        "buffer": buffer,
        "bytes": bytes
      })
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
