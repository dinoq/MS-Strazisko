export type AlbumInfo = {
    name: string,
    title: string,
    date: Date,
    photos: Array<string>,
} // TODO patří to sem??


export type OperationResult<E = string, M = string> = 
 | { ok: true, msg?: M }
 | { ok: false, error: E }


export type ServerResponseType = "information" | "warning" | "error"
 
export type ServerResponse = {
    message: string,
    type: ServerResponseType,
    data?: any
}