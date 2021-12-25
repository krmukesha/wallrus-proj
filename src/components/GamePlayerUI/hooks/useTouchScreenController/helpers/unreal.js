// Must be kept in sync with JavaScriptKeyCodeToFKey C++ array.
// special keycodes different from KeyboardEvent.keyCode
const SpecialKeyCodes = {
  Backspace: 8,
  ShiftLeft: 16,
  ControlLeft: 17,
  AltLeft: 18,
  ShiftRight: 253,
  ControlRight: 254,
  AltRight: 255,
};

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const MouseButton = {
  MainButton: 0, // Left button.
  AuxiliaryButton: 1, // Wheel button.
  SecondaryButton: 2, // Right button.
  FourthButton: 3, // Browser Back button.
  FifthButton: 4, // Browser Forward button.
};

// Must be kept in sync with PixelStreamingProtocol::EToUE4Msg C++ enum.
const MessageType = {
  /*
   * Control Messages. Range = 0..49.
   */
  IFrameRequest: 0,
  RequestQualityControl: 1,
  MaxFpsRequest: 2,
  AverageBitrateRequest: 3,
  StartStreaming: 4,
  StopStreaming: 5,

  /*
   * Input Messages. Range = 50..89.
   */

  // Generic Input Messages. Range = 50..59.
  UIInteraction: 50,
  Command: 51,

  // Keyboard Input Message. Range = 60..69.
  KeyDown: 60,
  KeyUp: 61,
  KeyPress: 62,

  // Mouse Input Messages. Range = 70..79.
  MouseEnter: 70,
  MouseLeave: 71,
  MouseDown: 72,
  MouseUp: 73,
  MouseMove: 74,
  MouseWheel: 75,

  // Touch Input Messages. Range = 80..89.
  TouchStart: 80,
  TouchEnd: 81,
  TouchMove: 82,
};

function registerKeyboardEvents(self) {
  // const self = this;

  self.onkeydown = function (e) {
    if (self.preventDefault) e.preventDefault();
    self.dc.send(
      new Uint8Array([
        MessageType.KeyDown,
        SpecialKeyCodes[e.code] || e.keyCode,
        e.repeat,
      ]).buffer,
    );
    //  e.stopPropagation
  };

  self.onkeyup = function (e) {
    if (self.preventDefault) e.preventDefault();
    self.dc.send(
      new Uint8Array([MessageType.KeyUp, SpecialKeyCodes[e.code] || e.keyCode])
        .buffer,
    );
  };

  self.onkeypress = function (e) {
    if (self.preventDefault) e.preventDefault();
    let data = new DataView(new ArrayBuffer(3));
    data.setUint8(0, MessageType.KeyPress);
    data.setUint16(1, SpecialKeyCodes[e.code] || e.keyCode, true);
    self.dc.send(data.buffer);
  };
}

function registerTouchEvents() {
  const self = this;

  // We need to assign a unique identifier to each finger.
  // We do this by mapping each Touch object to the identifier.
  let fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  let fingerIds = {};

  function rememberTouch(touch) {
    let finger = fingers.pop();
    if (finger === undefined) {
      console.info("exhausted touch indentifiers");
    }
    fingerIds[touch.identifier] = finger;
  }

  function forgetTouch(touch) {
    fingers.push(fingerIds[touch.identifier]);
    delete fingerIds[touch.identifier];
  }

  self.video.ontouchstart = function (e) {
    // Assign a unique identifier to each touch.
    for (let touch of e.changedTouches) {
      rememberTouch(touch);
    }
    self.emitTouchData(MessageType.TouchStart, e.changedTouches, fingerIds);
    if (self.preventDefault) e.preventDefault();
  };

  self.video.ontouchend = function (e) {
    self.emitTouchData(MessageType.TouchEnd, e.changedTouches, fingerIds);
    // Re-cycle unique identifiers previously assigned to each touch.
    for (let touch of e.changedTouches) {
      forgetTouch(touch);
    }
    if (self.preventDefault) e.preventDefault();
  };

  self.video.ontouchmove = function (e) {
    self.emitTouchData(MessageType.TouchMove, e.touches, fingerIds);
    if (self.preventDefault) e.preventDefault();
  };
}

// 触屏模拟鼠标
function registerFakeMouseEvents() {
  const self = this;

  let finger = undefined;

  const boundingRect = self.video.getBoundingClientRect();

  self.video.ontouchstart = function (e) {
    if (finger === undefined) {
      let firstTouch = e.changedTouches[0];
      finger = {
        id: firstTouch.identifier,
        x: firstTouch.clientX - boundingRect.left,
        y: firstTouch.clientY - boundingRect.top,
      };
      // Hack: Mouse events require an enter and leave so we just
      // enter and leave manually with each touch as this event
      // is not fired with a touch device.
      self.video.onmouseenter(e);
      self.emitMouseDown(MouseButton.MainButton, finger.x, finger.y);
    }
    if (self.preventDefault) e.preventDefault();
  };

  self.video.ontouchend = function (e) {
    for (let touch of e.changedTouches) {
      if (touch.identifier === finger.id) {
        let x = touch.clientX - boundingRect.left;
        let y = touch.clientY - boundingRect.top;
        self.emitMouseUp(MouseButton.MainButton, x, y);
        // Hack: Manual mouse leave event.
        self.video.onmouseleave(e);
        finger = undefined;
        break;
      }
    }
    if (self.preventDefault) e.preventDefault();
  };

  self.video.ontouchmove = function (e) {
    for (let touch of e.touches) {
      if (touch.identifier === finger.id) {
        let x = touch.clientX - boundingRect.left;
        let y = touch.clientY - boundingRect.top;
        self.emitMouseMove(x, y, x - finger.x, y - finger.y);
        finger.x = x;
        finger.y = y;
        break;
      }
    }
    if (self.preventDefault) e.preventDefault();
  };
}

function registerMouseHoverEvents() {
  this.registerMouseEnterAndLeaveEvents();
  const self = this;

  self.preventDefault = false;

  self.video.onmousemove = (e) => {
    self.emitMouseMove(e.offsetX, e.offsetY, e.movementX, e.movementY);
    if (self.preventDefault) e.preventDefault();
  };

  self.video.onmousedown = (e) => {
    self.emitMouseDown(e.button, e.offsetX, e.offsetY);
    if (self.preventDefault) e.preventDefault();
  };

  self.video.onmouseup = (e) => {
    self.emitMouseUp(e.button, e.offsetX, e.offsetY);
    if (self.preventDefault) e.preventDefault();
  };

  // When the context menu is shown then it is safest to release the button
  // which was pressed when the event happened. This will guarantee we will
  // get at least one mouse up corresponding to a mouse down event. Otherwise
  // the mouse can get stuck.
  // https://github.com/facebook/react/issues/5531
  self.video.oncontextmenu = (e) => {
    self.emitMouseUp(e.button, e.offsetX, e.offsetY);
    if (self.preventDefault) e.preventDefault();
  };

  self.video.onmousewheel = (e) => {
    self.emitMouseWheel(e.wheelDelta, e.offsetX, e.offsetY);
    if (self.preventDefault) e.preventDefault();
  };
}

function registerMouseLockEvents() {
  this.registerMouseEnterAndLeaveEvents();
  const self = this;

  self.preventDefault = true;
  console.info("mouse locked in, ESC to exit");

  const { clientWidth, clientHeight } = self.video;
  let x = clientWidth / 2;
  let y = clientHeight / 2;

  function updatePosition(e) {
    x += e.movementX;
    y += e.movementY;
    if (x > clientWidth) {
      x -= clientWidth;
    } else if (x < 0) {
      x += clientWidth;
    }
    if (y > clientHeight) {
      y -= clientHeight;
    } else if (y < 0) {
      y += clientHeight;
    }
  }

  self.video.onmousemove = (e) => {
    updatePosition(e);
    self.emitMouseMove(x, y, e.movementX, e.movementY);
  };

  self.video.onmousedown = function (e) {
    self.emitMouseDown(e.button, x, y);
  };

  self.video.onmouseup = function (e) {
    self.emitMouseUp(e.button, x, y);
  };

  self.video.onmousewheel = function (e) {
    self.emitMouseWheel(e.wheelDelta, x, y);
  };
}

function registerMouseEnterAndLeaveEvents() {
  const self = this;

  self.video.onmouseenter = function () {
    let Data = new DataView(new ArrayBuffer(1));
    Data.setUint8(0, MessageType.MouseEnter);
    self.dc.send(Data.buffer);
  };

  self.video.onmouseleave = function () {
    let Data = new DataView(new ArrayBuffer(1));
    Data.setUint8(0, MessageType.MouseLeave);
    if (self.dc.readyState === "open") self.dc.send(Data.buffer);
  };
}

function emitMouseMove(x, y, deltaX, deltaY) {
  let coord = this.normalizeAndQuantizeUnsigned(x, y);
  deltaX = (deltaX * 65536) / this.video.clientWidth;
  deltaY = (deltaY * 65536) / this.video.clientHeight;
  let Data = new DataView(new ArrayBuffer(9));
  Data.setUint8(0, MessageType.MouseMove);
  Data.setUint16(1, coord.x, true);
  Data.setUint16(3, coord.y, true);
  Data.setInt16(5, deltaX, true);
  Data.setInt16(7, deltaY, true);
  this.dc.send(Data.buffer);
}

function emitMouseDown(button, x, y) {
  let coord = this.normalizeAndQuantizeUnsigned(x, y);
  let Data = new DataView(new ArrayBuffer(6));
  Data.setUint8(0, MessageType.MouseDown);
  Data.setUint8(1, button);
  Data.setUint16(2, coord.x, true);
  Data.setUint16(4, coord.y, true);
  this.dc.send(Data.buffer);
}

function emitMouseUp(button, x, y) {
  let coord = this.normalizeAndQuantizeUnsigned(x, y);
  let Data = new DataView(new ArrayBuffer(6));
  Data.setUint8(0, MessageType.MouseUp);
  Data.setUint8(1, button);
  Data.setUint16(2, coord.x, true);
  Data.setUint16(4, coord.y, true);
  this.dc.send(Data.buffer);
}

function emitMouseWheel(delta, x, y) {
  let coord = this.normalizeAndQuantizeUnsigned(x, y);
  let Data = new DataView(new ArrayBuffer(7));
  Data.setUint8(0, MessageType.MouseWheel);
  Data.setInt16(1, delta, true);
  Data.setUint16(3, coord.x, true);
  Data.setUint16(5, coord.y, true);
  this.dc.send(Data.buffer);
}

function emitTouchData(type, touches, fingerIds) {
  let data = new DataView(new ArrayBuffer(2 + 6 * touches.length));
  data.setUint8(0, type);
  data.setUint8(1, touches.length);
  let byte = 2;
  for (let touch of touches) {
    let x = touch.clientX - this.video.offsetLeft;
    let y = touch.clientY - this.video.offsetTop;

    let coord = this.normalizeAndQuantizeUnsigned(x, y);
    data.setUint16(byte, coord.x, true);
    byte += 2;
    data.setUint16(byte, coord.y, true);
    byte += 2;
    data.setUint8(byte, fingerIds[touch.identifier], true);
    byte += 1;
    data.setUint8(byte, 255 * touch.force, true); // force is between 0.0 and 1.0 so quantize into byte.
    byte += 1;
  }
  this.dc.send(data.buffer);
}

function emitDescriptor(descriptor, messageType = MessageType.UIInteraction) {
  // Convert the dscriptor object into a JSON string.
  let descriptorAsString = JSON.stringify(descriptor);

  // Add the UTF-16 JSON string to the array byte buffer, going two bytes at
  // a time.
  let data = new DataView(
    new ArrayBuffer(1 + 2 + 2 * descriptorAsString.length),
  );
  let byteIdx = 0;
  data.setUint8(byteIdx, messageType);
  byteIdx++;
  data.setUint16(byteIdx, descriptorAsString.length, true);
  byteIdx += 2;
  for (let char of descriptorAsString) {
    // charCodeAt() is UTF-16, codePointAt() is Unicode.
    data.setUint16(byteIdx, char.charCodeAt(0), true);
    byteIdx += 2;
  }
  this.dc.send(data.buffer);
}

function normalizeAndQuantizeUnsigned(x, y) {
  let normalizedX = x / this.video.clientWidth;
  let normalizedY = y / this.video.clientHeight;
  if (
    normalizedX < 0.0 ||
    normalizedX > 1.0 ||
    normalizedY < 0.0 ||
    normalizedY > 1.0
  ) {
    return {
      inRange: false,
      x: 65535,
      y: 65535,
    };
  } else {
    return {
      inRange: true,
      x: normalizedX * 65536,
      y: normalizedY * 65536,
    };
  }
}

export {
  registerKeyboardEvents,
  registerTouchEvents,
  registerFakeMouseEvents,
  registerMouseHoverEvents,
  registerMouseLockEvents,
  registerMouseEnterAndLeaveEvents,
  emitMouseMove,
  emitMouseDown,
  emitMouseUp,
  emitMouseWheel,
  emitTouchData,
  emitDescriptor,
  normalizeAndQuantizeUnsigned,
};
