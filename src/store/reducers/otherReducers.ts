import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OtherStates } from "../../types";

let initialState: OtherStates = {
}

const otherSlices = createSlice({
    name: "otherSlices",
    initialState,
    reducers:{
        setDBOClass(state, action: PayloadAction<string>){
            //state.DBOClass = action.payload;
        }
    }
})

//export const { setDBOClass } = otherSlices.actions;
export default otherSlices.reducer;