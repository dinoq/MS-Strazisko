import { NextResponse } from "next/server";
import { ServerResponse, ServerResponseType } from "./types";

const getServerResponse = (message: string, type: ServerResponseType, data?: any): ServerResponse => {
    return {
        message,
        type,
        data
    }
}

const nextResponse = (message: string, error: number, type: ServerResponseType, data?: any) => {
    const resp: ServerResponse = getServerResponse(message, type, data);
    return NextResponse.json(
        resp,
        { status: error }
    );
}

export const nextResponse400Error = (message: string) => {
    return nextResponse(message, 400, "error");
}

export const nextResponse401Error = (message: string) => {
    return nextResponse(message, 401, "error");
}

export const nextResponse404Error = (message: string) => {
    return nextResponse(message, 404, "error");
}

export const nextResponse404Warning = () => {
    return nextResponse("resource not found", 404, "warning");
}

export const nextResponse500Error = (message: string) => {
    return nextResponse(message, 500, "error");
}

export const nextResponse200OK = (message: string = "OK", data?: any) => {
    return nextResponse(message, 200, "information", data);
}

export const nextResponse200Warning = (message: string = "OK") => {
    return nextResponse(message, 200, "warning");
}