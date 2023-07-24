import {Api, Function, StackContext} from "sst/constructs";
import {LambdaInvoke} from "aws-cdk-lib/aws-stepfunctions-tasks";
import {Chain, JsonPath, Map, StateMachine} from "aws-cdk-lib/aws-stepfunctions";

export function MyStack({stack}: StackContext) {
    //The creation of the first Step Function that will use the handler located in packages/functions/src/callYoutubeAPi
    const getApiInfo = new LambdaInvoke(stack, "getApiInfo", {
        lambdaFunction: new Function(stack, "getApiInfo-func", {
            handler: "packages/functions/src/getApiInfo.handler",
        }),
    });

    const callApiParallel = new LambdaInvoke(stack, "callApiParallel", {
        lambdaFunction: new Function(stack, "callApiParallel-func", {
            handler: "packages/functions/src/callApiParallel.handler",
        }),
    });

    const statisticCalledResults = new LambdaInvoke(stack, "statisticCalledResults", {
        lambdaFunction: new Function(stack, "statisticCalledResults-func", {
            handler: "packages/functions/src/statisticCalledResults.handler",
        }),
    });


    const map = new Map(stack, "MapCompute", {
        maxConcurrency: 50,
        inputPath: JsonPath.stringAt('$.Payload'),
        itemsPath: JsonPath.stringAt('$.callApis')
    });

    //The creation of the chain of states
    const stateDefinition = Chain.start(getApiInfo)
        .next(map.iterator(callApiParallel))
        .next(statisticCalledResults);

    //The creation of the state machine
    const stateMachine = new StateMachine(stack, "ApiParallelCallerStepMachine", {
        definition: stateDefinition,
    });

    //The creation of the API with a GET route "/start-machine" that will call the handler located in packages/functions/src/startMachine
    const api = new Api(stack, "apiStartMachine", {
        routes: {
            "GET /start-machine": {
                function: {
                    handler: "packages/functions/src/startMachine.handler",
                    environment: {
                        STATE_MACHINE: stateMachine.stateMachineArn,
                    },
                },
            },
        },
    });

    //To grant the permission to our route to start our state machine
    api.attachPermissionsToRoute("GET /start-machine", [
        [stateMachine, "grantStartExecution"],
    ]);

    //To show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });
}