import { YearFormat } from "./types"

export const formatYear = (year: string, format: YearFormat): string => {
    if(year == null){
        return "";
    }
    
    switch(format){
        case YearFormat.SLASH:
            return year.replace("_", "/") || "";
        case YearFormat.UNDERSCORE:
            return year.replace("/", "_") || "";
    }
}