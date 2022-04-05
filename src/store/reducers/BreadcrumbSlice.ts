import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BreadcrumbItemDef, BreadcrumbState } from "../../helpers/types";

const initialState: BreadcrumbState = {
    items: []
}

const breadcrumbSlice = createSlice({
    name: "BreadcrumbSlice",
    initialState,
    reducers: {
        addItemToBreadcrumb(state: BreadcrumbState, action: PayloadAction<BreadcrumbItemDef>){
            if(state.items.length == 1 && !state.items[0].text.length){
                //state.items.splice(0, 1);
            }
            state.items.push(action.payload);
        },
        selectBreadcrumbItem(state: BreadcrumbState, action: PayloadAction<number>){
            state.items.splice(action.payload);
        }
    }
})

export const { addItemToBreadcrumb, selectBreadcrumbItem} = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;