import {APIGatewayProxyHandlerV2, Handler} from "aws-lambda";
import * as console from "console";

export const handler: Handler = async (event: APIGatewayProxyHandlerV2) => {
    console.log("getApiInfo started.")

    return {
        "callApis": [
            {"A": "A1"},
            {"B": "B1"},
            {"C": "C1"},
            {"D": "D1"},
            {"E": "E1"},
        ]
    };
};