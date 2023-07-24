import {SSTConfig} from "sst";
import {MyStack} from "./stacks/MyStack";

export default {
    config(_input) {
        return {
            name: "api-parallel-caller",
            region: "us-east-1",
        };
    },
    stacks(app) {
        app.stack(MyStack);
    }
} satisfies SSTConfig;
