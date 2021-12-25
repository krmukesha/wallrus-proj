import { useContext } from "react";
import { TouchScreenJoystickContext } from "../context";

export default function useDispatch(context = TouchScreenJoystickContext) {
  const { dispatch } = useContext(context);
  return dispatch;
}
