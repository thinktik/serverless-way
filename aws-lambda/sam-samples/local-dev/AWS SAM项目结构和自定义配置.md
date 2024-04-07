本文基于[github sam-samples](https://github.com/thinktik/serverless-way/tree/main/aws-lambda/sam-samples)进行分析，帮助大家理解AWS
SAM的项目结构。

# 项目结构

```
    .  
    ├── README.md 项目的说明文件  
    ├── __init__.py  
    ├── events 项目的event样例，用于模拟触发lambda运行的event  
    │   └── event.json  
    ├── hello_world 项目的代码文件夹(可以认为是src根目录，本文件夹名称可以自定义，文件夹内可以自己加子文件夹来分类不同类型的代码，这个和平常开发一样)  
    │   ├── __init__.py  
    │   ├── app.py 项目的lambda代码文件(视具体语言而定)  
    │   └── requirements.txt 项目的依赖清单(视具体语言而定)  
    ├── samconfig.toml project-level级别的AWS SAM Cli配置，用于给sam cli预定义的参数，避免用户反复输入参数。一般一次性修改好就行  
    ├── template.yaml 项目配置，用于管理aws lambda和aws正常运行所需的其他相关的aws资源。一般我们加一些lambda函数或者调整函数配置就会在这里进行修改  
    └── tests 测试文件目录，保存测试相关的代码和配置；用于单元测试、集成测试  
    ├── __init__.py  
    ├── integration  
    │   ├── __init__.py  
    │   └── test_api_gateway.py  
    ├── requirements.txt  
    └── unit  
    ├── __init__.py  
    └── test_handler.py  
```

# 重要的配置文件

## samconfig.toml

[samconfig.toml](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html)
默认位于项目的根目录，用于预先设置好sam cli参数，这样我们在使用sam cli命令进行构建或者部署时就可以做到自定义或者避免重复输入。

详细的配置规范和sam cli参数可以参考：

- [AWS SAM CLI configuration file](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html#serverless-sam-cli-config-using)
- [AWS SAM CLI command reference](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-command-reference.html)

例如如果我们想让sam在build时使用docker环境里面进行，并要求sam在deploy时使用具体的S3桶和桶内的路径，我们可以这样设置

因为sam build使用容器的命令为`sam build --use-container`,所以toml文件里面我们在`[default.build.parameters]`
补充参数`use_container = true`. 在samconfig.toml中无论是command的值还是parameter的键，遇到`-`需要替换为`_`.

[Configuration file basics](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html#serverless-sam-cli-config-basics):

> When referencing an AWS SAM CLI command, replace spaces ( ) and hyphens (–) with underscores (_)

> When specifying keys, use the long-form command option name and replace hyphens (–) with underscores (_)
> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db7591d44e614f2e86fb3363d52c539b~tplv-k3u1fbpfcp-zoom-1.image)

## template.yaml

`template.yaml`实际上时SAM对 `AWS CloudFormation Template`
的针对性的简化，它专为SAM管理lambda而设计。在sam进行build和deploy的时候，实际上会先将`template.yaml`
翻译为`AWS CloudFormation Template`,然后通过AWS CloudFormation进行部署。

`template.yaml`
需要符合[AWS SAM specification](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification.html)
，它扩展了[AWS CloudFormation Template Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html)

比如本项目中下图的配置描述了一个lambda函数：使用`api-gateway`接收一个http get请求，请求的路径为`/hello`
；当请求到达`api-gateway`后产生一个`event`，触发`HelloWorldFunction`函数的执行，`HelloWorldFunction`
是一个运行在`Amazon Linux 2023` `x86_64`环境中的`python3.12`程序，传入的`event`会被`hello_world`文件夹下的`app.py`
脚本接收，`app.py`里面的`lambda_handler`是处理函数的入口。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63b181ffd7e64c81afbb8cdd5215c818~tplv-k3u1fbpfcp-zoom-1.image)
