import { AlbumInfo } from "@features/data/lib/types";

export type foodDayType = {};
export type FoodData = {
  date: string;
  meals: Array<{
    name: string;
    type: string;
    allergens: string;
  }>;
};

export type Document = {
  id_document: number;
  name: string;
  url: string;
};

export type ServerFunction = {
    error: {
        message: string,
        status: number
    }
}

export type YearAlbumsInfo = Partial<ServerFunction> & {
    data: Array<AlbumInfo>
}