import { StateActions } from "./constanst";

const stateReducer = (state, action) => {
  switch (action.type) {
    case StateActions.START_ORIENTATION_LISTENER:
      return state;
    case StateActions.STOP_ORIENTATION_LISTENER:
      return state;
    case StateActions.START_MOTION_LISTENER:
      return state;
    case StateActions.STOP_MOTION_LISTENER:
      return state;
    case StateActions.SET_ORIENTATION_DEVICE_MODE:
      return state;
    case StateActions.SET_ORIENTATION_REFERENCE_MODE:
      return state;
    case StateActions.ENABLE_G_ACCELARATION:
      return state;
    case StateActions.DISABLE_G_ACCELARATION:
      return state;
    case StateActions.ENABLE_QUATERNIONS_COMPUTATION:
      return state;
    case StateActions.DISABLE_QUATERNIONS_COMPUTATION:
      return state;
    default:
      break;
  }
};

export default function reducer(state, action) {
  return {
    state: stateReducer(state, action),
  };
}
