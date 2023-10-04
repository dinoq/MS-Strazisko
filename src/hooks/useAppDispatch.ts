import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

// Used throughout app instead of plain 'useDispatch'
const useAppDispatch = () => useDispatch<AppDispatch>() 

export default useAppDispatch;