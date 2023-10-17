import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BreadcrumbItemDef, BreadcrumbState } from "../../helpers/types";

const initialState: BreadcrumbState = {
    items: []
}

const slice = createSlice({
    name: "BreadcrumbSlice",
    initialState,
    reducers: {
        addItemToBreadcrumb(state: BreadcrumbState, action: PayloadAction<BreadcrumbItemDef>) {
            if (state.items.length == 1 && !state.items[0].text.length) {
                //state.items.splice(0, 1);
            }
            state.items.push(action.payload);
        },
        breadcrumbItemSelected(state: BreadcrumbState, action: PayloadAction<{index: number, items: Array<BreadcrumbItemDef>}>) {
            state.items.splice(action.payload.index);
        }
    }
})

export const { addItemToBreadcrumb, breadcrumbItemSelected } = slice.actions;
export default slice.reducer;