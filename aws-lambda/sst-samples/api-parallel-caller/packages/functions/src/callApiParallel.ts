import {Handler} from "aws-lambda";
import * as console from "console";

export const handler: Handler = async (event) => {
    console.log("callApiParallel started.")
    return {
        statusCode: 200,
        body: "callApiParallel executed.",
    };
};