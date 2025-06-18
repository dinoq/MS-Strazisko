import { knownMethods } from "@features/admin/lib/serverMethods";
import { nextResponse200OK, nextResponse404Warning, nextResponse500Error } from "@features/data/lib/serverResponses";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const methodName = body["methodName"] || "";
    const params: Array<any> = body["params"] || [];
    console.log('params server: ', params);
    
    if (!Array.isArray(params)) {        
        return nextResponse500Error("ERROR - params for server method '" + methodName + "' are not sended as array!");
    }
    
    // method check
    let knownMethod = knownMethods[methodName]
    if (!knownMethod || !(knownMethod.paramCount == params.length)) {
        return nextResponse500Error("ERROR - unknown server method '" + methodName + "' or bad param count!");
    }
    const res = await knownMethod.method(params);
    console.log('res: ', res);
    
    if(res.ok){
        return nextResponse200OK();
    } else if(res.error.includes("not found")) {
        return nextResponse404Warning();
    } else{        
        return nextResponse500Error(res.error);
    }

}