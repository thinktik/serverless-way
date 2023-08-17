import json

from utils import RESERVED_ENVS


def lambda_handler(event, context):
    print(RESERVED_ENVS.aws_execution_env)
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello world 1",
        }),
    }
