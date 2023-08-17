"""
This module contains the class that holds the environment variables
that are reserved for the application.

ref: https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html
"""
import os


class ReservedEnvs:
    def __init__(self):
        self._aws_region = os.environ['AWS_REGION']
        self._aws_execution_env = os.environ['AWS_EXECUTION_ENV']

    @property
    def aws_region(self) -> str:
        return self._aws_region

    @property
    def aws_execution_env(self) -> str:
        return self._aws_execution_env
