// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const MouseButton = {
  MainButton: 0, // Left button.
  AuxiliaryButton: 1, // Wheel button.
  SecondaryButton: 2, // Right button.
  FourthButton: 3, // Browser Back button.
  FifthButton: 4, // Browser Forward button.
};

// https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/ontouchstart
// https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event
const registerTouchEvents = ({
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  domElement,
  preventDefault,
}) => {
  // const self = this;

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
  console.log(domElement);

  domElement.ontouchstart = function (e) {
    // Assign a unique identifier to each touch.
    for (let touch of e.changedTouches) {
      rememberTouch(touch);
    }
    // self.emitTouchData(MessageType.TouchStart, e.changedTouches, fingerIds);
    onTouchStart &&
      onTouchStart(
        e.changedTouches,
        fingerIds,
        domElement.offsetLeft,
        domElement.offsetTop,
      );
    preventDefault && e.preventDefault();
  };

  domElement.ontouchend = function (e) {
    // self.emitTouchData(MessageType.TouchEnd, e.changedTouches, fingerIds);
    onTouchEnd && onTouchEnd(e.changedTouches, fingerIds);
    // Re-cycle unique identifiers previously assigned to each touch.
    for (let touch of e.changedTouches) {
      forgetTouch(touch);
    }
    preventDefault && e.preventDefault();
  };

  domElement.ontouchmove = function (e) {
    // self.emitTouchData(MessageType.TouchMove, e.touches, fingerIds);
    onTouchMove && onTouchMove(e.changedTouches, fingerIds);
    preventDefault && e.preventDefault();
  };
};

// Souris analogique à écran tactile
const registerFakeMouseEvents = ({
  onFakeTouchStart,
  onFakeTouchEnd,
  onFakeTouchMove,
  domElement,
  preventDefault,
}) => {
  // const self = this;

  let finger = undefined;

  const boundingRect = domElement.getBoundingClientRect();

  domElement.ontouchstart = function (e) {
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
      domElement.onmouseenter(e);
      // self.emitMouseDown(MouseButton.MainButton, finger.x, finger.y);
      onFakeTouchStart &&
        onFakeTouchStart(MouseButton.MainButton, finger.x, finger.y);
    }
    preventDefault && e.preventDefault();
  };

  domElement.ontouchend = function (e) {
    for (let touch of e.changedTouches) {
      if (touch.identifier === finger.id) {
        let x = touch.clientX - boundingRect.left;
        let y = touch.clientY - boundingRect.top;
        // self.emitMouseUp(MouseButton.MainButton, x, y);
        onFakeTouchEnd && onFakeTouchEnd(MouseButton.MainButton, x, y);
        // Hack: Manual mouse leave event.
        domElement.onmouseleave(e);
        finger = undefined;
        break;
      }
    }
    preventDefault && e.preventDefault();
  };

  domElement.ontouchmove = function (e) {
    for (let touch of e.touches) {
      if (touch.identifier === finger.id) {
        let x = touch.clientX - boundingRect.left;
        let y = touch.clientY - boundingRect.top;
        // self.emitMouseMove(x, y, x - finger.x, y - finger.y);
        onFakeTouchMove && onFakeTouchMove(x, y, x - finger.x, y - finger.y);
        finger.x = x;
        finger.y = y;
        break;
      }
    }
    preventDefault && e.preventDefault();
  };
};

const registerMouseEnterAndLeaveEvents = ({
  onMouseEnter,
  onMouseLeave,
  domElement,
}) => {
  // if (
  //   Object.hasOwnProperty.apply(domElement, ["onmouseenter"]) &&
  //   Object.hasOwnProperty.apply(domElement, ["onmouseleave"])
  // ) {
  // }
  domElement.onmouseenter = (e) => {
    // let Data = new DataView(new ArrayBuffer(1));
    // Data.setUint8(0, MessageType.MouseEnter);
    // self.dc.send(Data.buffer);
    onMouseEnter(e);
  };

  domElement.onmouseleave = (e) => {
    // let Data = new DataView(new ArrayBuffer(1));
    // Data.setUint8(0, MessageType.MouseLeave);
    // if (self.dc.readyState === "open") self.dc.send(Data.buffer);
    onMouseLeave(e);
  };
};

const registerMouseHoverEvents = ({
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onContextMenu,
  onMouseWheel,
  domElement,
  preventDefault,
}) => {
  registerMouseEnterAndLeaveEvents({
    onMouseEnter,
    onMouseLeave,
    domElement,
  });
  // const self = this;

  // self.preventDefault = false;

  // domElement.onmousemove = (e) => {
  //   self.emitMouseMove(e.offsetX, e.offsetY, e.movementX, e.movementY);
  //   if (preventDefault) e.preventDefault();
  // };
  domElement.onmousemove = (e) => {
    preventDefault && e.preventDefault();
    onMouseMove(e);
  };

  // domElement.onmousedown = (e) => {
  //   self.emitMouseDown(e.button, e.offsetX, e.offsetY);
  //   if (preventDefault) e.preventDefault();
  // };
  domElement.onmousedown = (e) => {
    preventDefault && e.preventDefault();
    onMouseDown(e);
  };

  // domElement.onmouseup = (e) => {
  //   self.emitMouseUp(e.button, e.offsetX, e.offsetY);
  //   if (preventDefault) e.preventDefault();
  // };
  domElement.onmouseup = (e) => {
    preventDefault && e.preventDefault();
    onMouseUp(e);
  };

  // When the context menu is shown then it is safest to release the button
  // which was pressed when the event happened. This will guarantee we will
  // get at least one mouse up corresponding to a mouse down event. Otherwise
  // the mouse can get stuck.
  // https://github.com/facebook/react/issues/5531
  // domElement.oncontextmenu = (e) => {
  //   self.emitMouseUp(e.button, e.offsetX, e.offsetY);
  //   if (preventDefault) e.preventDefault();
  // };
  domElement.oncontextmenu = (e) => {
    preventDefault && e.preventDefault();
    onContextMenu(e);
  };

  // domElement.onmousewheel = (e) => {
  //   self.emitMouseWheel(e.wheelDelta, e.offsetX, e.offsetY);
  //   if (preventDefault) e.preventDefault();
  // };
  domElement.onmousewheel = (e) => {
    preventDefault && e.preventDefault();
    onMouseWheel(e);
  };
};

export {
  registerTouchEvents,
  registerFakeMouseEvents,
  registerMouseHoverEvents,
};
