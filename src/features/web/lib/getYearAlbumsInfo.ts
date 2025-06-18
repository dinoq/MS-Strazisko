import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { AlbumInfo } from "@features/data/lib/types";
import { prisma } from "lib/server/prisma";
import { YearAlbumsInfo } from "../types";
import { isLoggedForYear } from "@features/auth/lib/authFunc";

export const getYearAlbumsInfo = async (
  year: string,
  limit?: number
): Promise<YearAlbumsInfo> => {

	if (!(await isLoggedForYear(year))) {
		return {
			error: {
				message: "Unathorized access",
				status: 401,
			  },
			data: []
		}
	}

  let albumsInfo: Array<AlbumInfo> = [];

  const albums = await prisma.album.findMany({
    where: {
      id_year: year,
    },
  });

  for (const album of albums) {
    const albumPhotos = (
      await prisma.privatePhoto.findMany({
        where: {
          id_album: album.id_album,
        },
        take: limit !== 0 ? limit : undefined,
      })
    ).map((photo) => album.title + "/" + photo.filename);

    while (limit && albumPhotos.length < limit) {
      albumPhotos.push("other/no-photo.jpg");
    }

    albumsInfo.push({
      name: album.name,
      title: album.title,
      date: album.date,
      photos: albumPhotos,
    });
  }

  return {
    data: albumsInfo
}
};
