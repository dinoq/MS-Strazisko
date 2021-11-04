import { createSlice } from "@reduxjs/toolkit";
import { BreadcrumbState } from "../../../types";

const initialState: BreadcrumbState = {
    items: []
}

const breadcrumbSlice = createSlice({
    name: "BreadcrumbSlice",
    initialState,
    reducers: {
        addItemToBreadcrumb(state, action){
            state.items.push(action.payload);
        },
        selectBreadcrumbItem(state, action){

        }
    }
})

export const { addItemToBreadcrumb, selectBreadcrumbItem} = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;