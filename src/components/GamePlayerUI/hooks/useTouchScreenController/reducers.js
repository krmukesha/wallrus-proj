import * as eventsActions from "./constants/eventsActions";
import * as controlActions from "./constants/controlActions";
import * as subscribersActions from "./constants/subscribersActions";

const eventsReducer = (state, action) => {
  switch (action.type) {
    case eventsActions.ON_PRESSED:
      return {
        ...state,
        isPressed: [true, action.payload.timestamp],
      };
    case eventsActions.ON_RELEASED:
      return {
        ...state,
        isPressed: [false, action.payload.timestamp],
      };
    case eventsActions.ON_DRAG_START:
      return {
        ...state,
        isDragged: [true, action.payload.timestamp],
      };
    case eventsActions.ON_DRAG_STOP:
      return {
        ...state,
        isDragged: [false, action.payload.timestamp],
      };
    case eventsActions.ON_LISTEN_START:
      return {
        ...state,
        isListening: [true, action.payload.timestamp],
      };
    case eventsActions.ON_LISTEN_STOP:
      return {
        ...state,
        isListening: [false, action.payload.timestamp],
      };
    default:
      return state;
  }
};

const controlReducer = (state, action) => {
  switch (action.type) {
    case controlActions.SET_H_LOCK:
      return {
        ...state,
        isLockedHorizontal: action.payload,
      };
    case controlActions.SET_V_LOCK:
      return {
        ...state,
        isLockedVertical: action.payload,
      };
    case controlActions.SET_O_LOCK:
      return {
        ...state,
        isOriginLocked: action.payload,
      };
    case controlActions.SET_GAIN:
      return {
        ...state,
        gainH: action.payload.h,
        gainV: action.payload.v,
      };
    case controlActions.SET_H_GAIN:
      return {
        ...state,
        gainH: action.payload,
      };
    case controlActions.SET_V_GAIN:
      return {
        ...state,
        gainV: action.payload,
      };
    case controlActions.SET_DISTANCE_BOUND:
      return {
        ...state,
        boundDistance: action.payload,
      };
    case controlActions.SET_OFFSET:
      // eslint-disable-next-line no-case-declarations
      const { offsetLeft, offsetTop } = action.payload;
      return {
        ...state,
        offsetLeft,
        offsetTop,
      };
    case controlActions.SET_SCREEN_DIMENSIONS:
      // eslint-disable-next-line no-case-declarations
      const { screenWidth, screenHeight } = action.payload;
      return {
        ...state,
        screenWidth,
        screenHeight,
        screenHalfWidth: screenWidth / 2,
        screenHalfHeight: screenHeight / 2,
      };
    default:
      return state;
  }
};

const subscribersReducer = (state, action) => {
  // console.log(
  //   "myState: ",
  //   state,
  //   Object.hasOwnProperty.call(state, "onPressed"),
  // );
  switch (action.type) {
    case subscribersActions.ADD_ON_PRESSED:
      // console.log(" ADD_ON_PRESSED payload: ", action.payload);
      return {
        ...state,
        onPressed: state.onPressed.push((data) => action.payload(data)),
      };
    case subscribersActions.REMOVE_ON_PRESSED:
      return state;
    case subscribersActions.ADD_ON_RELEASED:
      console.log("payload: ", action.payload);
      return {
        ...state,
        onReleased: state.onReleased.push(action.payload),
      };
    case subscribersActions.REMOVE_ON_RELEASED:
      return state;
    case subscribersActions.ADD_ON_DRAGGED:
      console.log("payload: ", action.payload);
      return {
        ...state,
        onDragged: state.onDragged.push(action.payload),
      };
    case subscribersActions.REMOVE_ON_DRAGGED:
      return state;
    default:
      return state;
  }
};

export default function TouchScreenJoystickReducer(state, action) {
  return {
    events: eventsReducer(state.events, action),
    control: controlReducer(state.control, action),
    subscribers: subscribersReducer(state.subscribers, action),
  };
}
