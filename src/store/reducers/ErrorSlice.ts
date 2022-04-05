import { createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialState = {
    msg: ""
}

const errorSlice = createSlice({
    name: "ErrorSlice",
    initialState,
    reducers:{
        setErrorMsg(state: {msg: string}, action: PayloadAction<string>){
            state.msg = action.payload;
        }
    }
})

export const {setErrorMsg} = errorSlice.actions;
export default errorSlice.reducer;