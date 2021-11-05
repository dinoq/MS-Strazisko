import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BreadcrumbItemDef, BreadcrumbState } from "../../../types";

const initialState: BreadcrumbState = {
    items: []
}

const breadcrumbSlice = createSlice({
    name: "BreadcrumbSlice",
    initialState,
    reducers: {
        addItemToBreadcrumb(state, action: PayloadAction<BreadcrumbItemDef>){
            state.items.push(action.payload);
        },
        selectBreadcrumbItem(state, action: PayloadAction<number>){

        }
    }
})

export const { addItemToBreadcrumb, selectBreadcrumbItem} = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;