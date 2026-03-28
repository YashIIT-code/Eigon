import os
import boto3
from botocore.exceptions import ClientError

def upload_to_s3(file_path, bucket=None, object_name=None):
    if object_name is None:
        object_name = os.path.basename(file_path)

    if bucket is None:
        bucket = os.getenv('AWS_S3_BUCKET', 'eigon-media')
        
    client = boto3.client('s3', 
        region_name=os.getenv('AWS_REGION', 'us-east-1'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )

    try:
        client.upload_file(file_path, bucket, object_name, ExtraArgs={'ACL': 'public-read'})
        url = f"https://{bucket}.s3.{os.getenv('AWS_REGION', 'us-east-1')}.amazonaws.com/{object_name}"
        return url
    except ClientError as e:
        print(f"S3 Upload Error: {e}")
        return None
