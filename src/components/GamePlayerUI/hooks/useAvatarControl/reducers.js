import { avatarControlActions } from "./constants";

const configurationsReducer = (state, action) => {
  switch (action.type) {
    case avatarControlActions.SET_MOTION_ADAPTER:
      return {
        ...state,
        motionAdapter: action.payload,
      };
    case avatarControlActions.SET_ORIENTATION_ADAPTER:
      return {
        ...state,
        motionAdapter: action.payload,
      };

    default:
      break;
  }
};

export default function avatarControlReducer(state, action) {
  return {
    state: configurationsReducer(state.configurations, action),
  };
}
