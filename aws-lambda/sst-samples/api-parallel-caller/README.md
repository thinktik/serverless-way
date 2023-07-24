# api-parallel-caller

使用[AWS Step Function](https://aws.amazon.com/cn/step-functions/)编排[AWS Lambda](https://aws.amazon.com/cn/lambda/)
进行简单的API压测

压测流程图如下：
![](./docs/stepfunctions_graph.svg)

分为以下3个主要的步骤：

1. getApiInfo获取被压测的API信息，将带压测的API列表传入下一步
2. callApiParallel获取待压测的API清单，然后使用step function的`Map`方式，并行的执行压测。全部压测任务完成后进入下一步
3. statisticCalledResults对压测的数据进行汇总统计

# reference

- [Using the SST framework to set up a state machine with AWS Step Functions](https://blog.theodo.com/2023/02/state-machine-sst/)
- [sst](https://sst.dev/)