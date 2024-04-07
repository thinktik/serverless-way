import json


def lambda_handler(event, context):
    # 错误的代码，用于演示金丝雀发布的回滚
    # a = 1/0

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello canary v1",
        }),
    }
