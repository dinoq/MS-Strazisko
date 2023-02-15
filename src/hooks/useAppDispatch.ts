import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

// Used throughout app instead of plain 'useDispatch'
export default () => useDispatch<AppDispatch>() 