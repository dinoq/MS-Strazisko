import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { DBObject } from "../../helpers/types";

const initialState=[];

const EntriesSlice = createSlice({
    name: "EntriesSlice",
    initialState,
    reducers:{
        setEntries: (state, action: PayloadAction<Array<DBObject>>)=>{
            const newEntries = action.payload;
            return newEntries;
        }
    }
})


export const {setEntries} = EntriesSlice.actions;
export default EntriesSlice.reducer;