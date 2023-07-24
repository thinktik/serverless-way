r"""
This lambda function is used to get the location estimate from the device's MQTT message.
"""
import boto3

# Create an IoT Wireless client
client = boto3.client('iotwireless')


def lambda_handler(event, context):
    # get the position estimate by the event
    response = client.get_position_estimate(**event)
    # get the geojson payload from the response
    location = response["GeoJsonPayload"].read().decode('utf-8')
    # return the geojson payload
    return {
        "statusCode": 200,
        "body": location,
    }
