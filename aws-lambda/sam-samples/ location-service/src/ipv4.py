r"""
This module provides a function to get the geolocation of an IP address.
"""
import boto3

# Create an IoT Wireless client
client = boto3.client('iotwireless')


def lambda_handler(event, context):
    # get ip address from path parameter
    ipv4_address = event["pathParameters"]["ipv4-address"]
    # get the position estimate by the ip address
    response = client.get_position_estimate(
        Ip={
            'IpAddress': ipv4_address
        },
    )
    # get the geojson payload from the response
    ipv4_location = response["GeoJsonPayload"].read().decode('utf-8')
    # return the geojson payload
    return {
        "statusCode": 200,
        "body": ipv4_location,
    }
