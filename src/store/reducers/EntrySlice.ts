import { CaseReducer, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { DBObjectType } from "../../FilesToDistribute/types";

const initialState: Array<DBObjectType> = [];

const EntriesSlice = createSlice({
    name: "EntriesSlice",
    initialState,
    reducers:{
        setEntries: (state: Array<DBObjectType>, action: PayloadAction<Array<DBObjectType>>) =>{
            const newEntries = action.payload;
            return [...newEntries];
        }
    }
})


export const {setEntries}  = EntriesSlice.actions;
export default EntriesSlice.reducer;