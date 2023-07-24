import {Handler} from "aws-lambda";
import * as console from "console";

export const handler: Handler = async (event) => {
    console.log("statisticCalledResults started.")
    return {
        statusCode: 200,
        body: "statisticCalledResults executed.",
    };
};