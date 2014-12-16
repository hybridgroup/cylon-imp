// create a global variabled called led and assign pin9 to it
pins <- {
  "1": hardware.pin1,
  "2": hardware.pin2,
  "5": hardware.pin5,
  "7": hardware.pin7,
  "8": hardware.pin8,
  "9": hardware.pin9,
};

function digitalWrite(args) {
  pins[args.pin].configure(DIGITAL_OUT);
  pins[args.pin].write(args.value.tointeger());

  agent.send("response", { "data": null });
}

function digitalRead(args) {
  pins[args.pin].configure(DIGITAL_IN);
  local readVal = pins[args.pin].read();

  agent.send("response", { "data": readVal });
}

function analogWrite(args) {
  pins[args.pin].configure(ANALOG_OUT);
  pins[args.pin].write(args.value.tofloat());

  agent.send("response", { "data": null });
}

function analogRead(args) {
  pins[args.pin].configure(ANALOG_IN);
  local readVal = pins[args.pin].read();

  agent.send("response", { "data": readVal });
}

function pwmWrite(args) {
  local freq = 0.02;

  if ("freq" in args) {
    freq = args.freq;
  }

  pins[args.pin].configure(PWM_OUT, freq, 1);
  pins[args.pin].write(args.value.tofloat());

  agent.send("response", { "data": null });
}

function i2cWrite(args) {
  hardware.i2c89.configure(CLOCK_SPEED_400_KHZ);
  local i2c = hardware.i2c89;

  local buffer = split(args.buffer, ",");
  local binaryAddress = 0x00;
  local binaryBuffer = "";

  binaryAddress += args.address.tointeger() << 1;

  foreach(val in buffer){
    binaryBuffer += val.tointeger().tochar();
  }

  i2c.write(binaryAddress, binaryBuffer);

  agent.send("response", { "data": null });
}

function i2cRead(args) {
  hardware.i2c89.configure(CLOCK_SPEED_400_KHZ);
  local i2c = hardware.i2c89;

  local buffer = split(args.buffer, ",");
  local binaryAddress = 0x00;
  local binaryBuffer = "";
  local bytesLength = args.bytes.tointeger();

  binaryAddress += args.address.tointeger() << 1;

  foreach(val in buffer){
    binaryBuffer += val.tointeger().tochar();
  }

  //i2c.write(binaryAddress, binaryBuffer);
  local data = i2c.read(binaryAddress, binaryBuffer, bytesLength)
  local dataArray = [];

  foreach(val in data) {
    dataArray.push(val);
  }

  agent.send("response", { "data": dataArray });
}

agent.on("digitalWrite", digitalWrite);
agent.on("digitalRead", digitalRead);
agent.on("analogWrite", analogWrite);
agent.on("analogRead", analogRead);
agent.on("pwmWrite", pwmWrite);
agent.on("i2cWrite", i2cWrite);
agent.on("i2cRead", i2cRead);
