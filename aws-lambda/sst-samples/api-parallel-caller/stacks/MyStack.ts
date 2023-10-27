import {Api, Function, StackContext} from "sst/constructs";
import {LambdaInvoke} from "aws-cdk-lib/aws-stepfunctions-tasks";
import {Chain, JsonPath, Map, StateMachine} from "aws-cdk-lib/aws-stepfunctions";

export function MyStack({stack}: StackContext) {
    // Step Function的第二个任务，用于模拟获取压测任务的参数
    const getApiInfo = new LambdaInvoke(stack, "getApiInfo", {
        lambdaFunction: new Function(stack, "getApiInfo-func", {
            handler: "packages/functions/src/getApiInfo.handler",
        }),
    });

    // Step Function的第三个任务，用于模拟执行压测任务
    const callApiParallel = new LambdaInvoke(stack, "callApiParallel", {
        lambdaFunction: new Function(stack, "callApiParallel-func", {
            handler: "packages/functions/src/callApiParallel.handler",
        }),
    });

    // Step Function的第四个任务，用于模拟执行压测任务完成后的数据统计
    const statisticCalledResults = new LambdaInvoke(stack, "statisticCalledResults", {
        lambdaFunction: new Function(stack, "statisticCalledResults-func", {
            handler: "packages/functions/src/statisticCalledResults.handler",
        }),
    });

    // Step Function管理，创建一个Map状态机并行执行的任务，最大并发50
    const map = new Map(stack, "MapCompute", {
        maxConcurrency: 50,
        inputPath: JsonPath.stringAt('$.Payload'),
        itemsPath: JsonPath.stringAt('$.callApis')
    });

    // 创建一个step function的state链，串联前面的map任务和最后的统计任务
    const stateDefinition = Chain.start(getApiInfo)
        .next(map.iterator(callApiParallel))
        .next(statisticCalledResults);

    // 用stateDefinition定义Step function的逻辑
    const stateMachine = new StateMachine(stack, "ApiParallelCallerStepMachine", {
        definition: stateDefinition,
    });

    // Step Function的第一个任务，用于指示Step Function开始运行，当用户访问/start-machine时触发整个step function的启动
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

    // To grant the permission to our route to start our state machine
    api.attachPermissionsToRoute("GET /start-machine", [
        [stateMachine, "grantStartExecution"],
    ]);

    //To show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });
}