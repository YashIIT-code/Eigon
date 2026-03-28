import os
import redis

def connect_redis():
    host = os.getenv('REDIS_HOST', 'localhost')
    port = int(os.getenv('REDIS_PORT', 6379))
    password = os.getenv('REDIS_PASSWORD', None)
    
    r = redis.Redis(
        host=host, 
        port=port, 
        password=password, 
        decode_responses=False
    )
    print("✅ Python Worker connected to Redis")
    return r

def update_job_status(cache, job_id, status, progress, result_url=None, error_message=None):
    # This simulates updating the Job table in PostgreSQL directly via Node API
    # Or sending a pubsub message back to Node
    
    # For now, we update Redis hashes that Node.js will read
    key = f"job:{job_id}:status"
    data = {
        'status': status,
        'progress': progress
    }
    
    if result_url:
        data['outputUrl'] = result_url
    if error_message:
        data['errorMessage'] = error_message
        
    cache.hset(key, mapping=data)
    
    # Publish event for Node.js WebSocket/SSE to listen
    cache.publish('job-status-updates', f"{job_id}:{status}:{progress}")
