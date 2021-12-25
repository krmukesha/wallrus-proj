import { useContext } from "react";
import { PermissionsContext } from "../../contexts";

export default function useDispatch(context = PermissionsContext) {
  const { dispatch } = useContext(context);
  return dispatch;
}
