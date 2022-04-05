export const getYears = () => {
    let years: Array<string> = [];
    let actualYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
        years.push((actualYear - i) + "/" + (actualYear + 1 - i));
    }
    return years;
}

export const getEmptyValues = () => {
    return [];
}