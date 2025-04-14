export type foodDayType = {

}
export type FoodData = {
    date: string,
    meals: Array<{
        name: string,
        type: string,
        allergens: string
    }>
}