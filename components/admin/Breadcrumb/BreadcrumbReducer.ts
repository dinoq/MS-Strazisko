import { createSlice } from "@reduxjs/toolkit";

export interface BreadcrumbState{
    items: Array<any>
}

const initialState: BreadcrumbState = {
    items: []
}

const breadcrumbSlice = createSlice({
    name: "BreadcrumbSlice",
    initialState,
    reducers: {
        addItemToBreadcrumb(state, action){
            state.items.push(action.payload);
            console.log('stateeee: ', state.items);
        },
        selectBreadcrumbItem(state, action){
            console.log('action: ', action);
            console.log('action2: ', action.payload);
            console.log('action3: ', action.payload.index);

        }
    }
})

export const { addItemToBreadcrumb, selectBreadcrumbItem} = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;