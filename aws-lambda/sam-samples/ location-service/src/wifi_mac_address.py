r"""
This lambda function is used to get the wifi location from the wifi mac address.
"""
import boto3

# Create an IoT Wireless client
client = boto3.client('iotwireless')


def lambda_handler(event, context):
    # get the wifi info from the event
    wifi_info = event["queryStringParameters"]
    # get the position estimate
    response = client.get_position_estimate(
        WiFiAccessPoints=[
            {
                'MacAddress': wifi_info["MacAddress"],
                'Rss': int(wifi_info["Rss"])
            },
        ],
    )
    # get the position estimate
    wifi_location = response["GeoJsonPayload"].read().decode('utf-8')
    # return the position estimate
    return {
        "statusCode": 200,
        "body": wifi_location,
    }
