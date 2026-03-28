import os

import boto3
from botocore.exceptions import ClientError


def upload_to_s3(file_path, bucket=None, object_name=None):
    if object_name is None:
        object_name = os.path.basename(file_path)

    s3_client = boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_REGION', 'us-east-1')
    )

    try:
        s3_client.upload_file(file_path, bucket, object_name)
    except ClientError as e:
        print(f"S3 Upload Error: {e}")
        return False
    return True
