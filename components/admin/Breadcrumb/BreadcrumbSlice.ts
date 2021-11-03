import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const breadcrumbSlice = createSlice({
    name: "BreadcrumbSlice",
    initialState,
    reducers: {
        addItemToBreadcrumb(state, action){

        },
        selectBreadcrumbItem(state, action){

        }
    }
})

export const { addItemToBreadcrumb, selectBreadcrumbItem: select} = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;