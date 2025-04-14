import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../../FilesToDistribute/types";

// Used throughout app instead of plain 'useSelector'
export default useSelector as TypedUseSelectorHook<RootState>;