# local-dev

显式的创建并设置AWS API-Gateway，然后让多个Lambda来复用这个API-Gateway

## 复用api-gateway

详情请看[template.yaml](./template.yaml)

前面的多个例子中，我们看到每次创建一个新的项目，部署的时候都会自动产生一个全新的api-gateway，这会造成api-gateway资源的混乱。

为了集中复用api-gateway你需要进行下面2个操作

1. 在[template.yaml](./template.yaml)创建`AWS::Serverless::Api`资源
2. 在[template.yaml](./template.yaml)为多个lambda设置api-gateway的引用

**AWS SAM不足之处**
api-gateway不能在多个AWS SAM间进行共享，如果你需要多个lambda共享api-gateway资源，那么你需要把这些lambda都编写到同一个sam项目中
[AWS SAM EventSource:API](https://docs.amazonaws.cn/en_us/serverless-application-model/latest/developerguide/sam-property-function-api.html)
> This cannot reference an AWS::Serverless::Api resource defined in another template.

如果你使用[serverless framework](https://www.serverless.com/)，那么多个serverless framework项目间是可以共享的。

# reference

- [AWS SAM 本地调试[AWS Lambda教程-AWS SAM系列]](https://juejin.cn/post/7259687894696198203)
- [AWS SAM项目结构和自定义配置[AWS Lambda教程-AWS SAM系列] ](https://juejin.cn/post/7260024054065938490)
- [AWS SAM Doc](https://docs.aws.amazon.com/serverless-application-model/index.html)