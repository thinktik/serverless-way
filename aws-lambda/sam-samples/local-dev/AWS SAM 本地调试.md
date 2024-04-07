# AWS SAM 本地调试

# 开发、部署和Debug

**环境准备**
所以我们在使用SAM的时候，需要安装如下的工具

* AWS CLI: [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* SAM
  CLI: [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* 具体语言相关的SDK，比如[Python 3 installed](https://www.python.org/downloads/)
* Docker(
  可选，建议安装): [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

**本地构建**

`--use-container`可选，加上后会在本地启动docker容器模拟AWS Lamdba的真实的运行环境，这样构建时避免由于操作系统或CPU架构差异导致的AWS
Lambda依赖不兼容问题。

构建时sam会自动安装依赖并把构建结果保存在`.aws-sam`文件夹中

[lambda-runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)是基于Amazon
Linux的，并可以由用户选择运行在`arm64`或者`x86_64`架构的CPU上。 如果我们本地电脑是 `windows on x86_64`
或者 `macOS on x86_64/arm64`,有时会遇到aws lambda环境和本地环境不一致导致的兼容性问题。比如在`windows on x86_64`
上进行python3依赖安装时，可能有部分c/c++编写的python依赖在Amazon Linux运行不佳或者无法运行。这时`--use-container`
能非常方便的避免此类问题。

```bash
sam build --use-container
```

**部署到AWS**

`--guided`可选，加上后会给你提供部署引导，提示你输入一些自定义的配置参数

```bash
sam deploy --guided
```

使用`--guided`选项部署时，会在命令框提示用户指定一些部署相关的参数：

* **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region,
  and a good starting point would be something matching your project name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual
  review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for
  the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required
  permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value
  for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must
  explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the
  project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your
  application.

当你部署完成后，会得到一个API Gateway Endpoint URL，也就是本项目的可访问的url，我们就可以直接访问这个url触发云端lamdba运行并得到lambda的输出

**本地模拟测试**

我们可以使用 `sam local invoke`
来进行本地调用，详情请看[SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

本地调用`HelloWorldFunction`函数，函数实际上时docker模拟运行的。sam通过传入event.json模拟实际的api-gateway事件，aws
lambda事件是一个json格式的文档可以用于触发aws lambda运行。

```bash
sam local invoke HelloWorldFunction --event events/event.json
```

直接本地模拟启动api-gateway并获得可访问的url，用于模拟http请求

```bash
hello-world$ sam local start-api
```

访问本地的api-gateway并触发lambda本地运行

```bash
hello-world$ curl http://localhost:3000/
```

**本地模拟测试**

测试脚本集中保存在`test`文件夹中

```bash
# 安装依赖
hello-world$ pip install -r tests/requirements.txt --user
# 单元测试
hello-world$ python -m pytest tests/unit -v
# 集成测试:需要我们先完成deploy项目到aws上后才能进行
# 环境变量AWS_SAM_STACK_NAME设置为我们前面指定的Stack Name，然后进行集成测试
AWS_SAM_STACK_NAME="hello-world" python -m pytest tests/integration -v
```

**本地查看log**

我们可以使用`sam logs`来在本地查看云端日志

比如我们看`HelloWorldFunction`
的运行日志，详情请看[SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

```bash
sam logs -n HelloWorldFunction --stack-name "hello-world" --tail
```

**删除项目**

我们可以`--stack-name `指定要删除的项目

```bash
sam delete --stack-name "hello-world"
```

或者直接在项目根目录执行

```bash
sam delete
```

# Resources

[AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
收录了大量的公开的可复用的serverless项目，大家可以参考和使用。

# 适用于各种IDE的AWS Toolkit插件

如果你喜欢使用某种IDE编写/测试代码，那么你可以使用AWS Toolkit来帮助你进行AWS项目开发(包括但是不限于AWS Lambda)，AWS
Toolkit是开源的插件，它可以和AWS SAM CLI结合帮助你快速创建SAM项目并提供非常友好的AWS Lambda Debug功能。

下面是各种IDE上有关AWS Toolkit的官方文档

* [CLion](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [GoLand](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [WebStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [Rider](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PhpStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PyCharm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [RubyMine](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [DataGrip](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
* [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

以VS
Code和Pycharm为例，我们可以按[AWS SAM 本地调试[AWS Lambda教程-AWS SAM系列]](https://juejin.cn/post/7259687894696198203)
进行debug和开发。