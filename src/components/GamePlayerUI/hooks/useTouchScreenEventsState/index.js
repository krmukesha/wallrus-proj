import { useContext } from "react";
import APIContext from "../useTouchScreenController/context";

export default function useUserState() {
  const { state } = useContext(APIContext);
  return state.events;
}
