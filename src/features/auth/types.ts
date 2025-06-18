import { OperationResult } from "@features/data/lib/types";

export type jwtAlbumToken = {
    data: string[]
}

export type AlbumLoginError = "wrong-pwd" | "non-existent-album";
export type AlbumLoginResult = OperationResult<AlbumLoginError>;