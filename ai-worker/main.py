import json
import time

from dotenv import load_dotenv

from services.redis_service import connect_redis, update_job_status


# Load environment variables
load_dotenv()


def process_job(job_id, data, cache):
    print(f"ðŸŽ¬ Starting processing for job {job_id}")
    try:
        # story = data.get('story', '')

        # --- Mock Pipeline Execution ---

        # 1. Scene Generation
        update_job_status(cache, job_id, 'generating_scenes', 10)
        print("ðŸ“ Generating scenes from story...")
        time.sleep(2)

        # 2. Image Generation
        update_job_status(cache, job_id, 'generating_images', 30)
        print("ðŸŽ¨ Generating images for scenes...")
        time.sleep(2)

        # 3. Video Generation
        update_job_status(cache, job_id, 'generating_video', 50)
        print("ðŸŽ¥ Automating images to video clips...")
        time.sleep(2)

        # 4. Narration
        update_job_status(cache, job_id, 'generating_narration', 70)
        print("ðŸŽ™ï¸ Generating AI voice narration...")
        time.sleep(2)

        # 5. Stitching
        update_job_status(cache, job_id, 'stitching', 85)
        print("âœ‚ï¸ Stitching clips and syncing audio...")
        time.sleep(2)

        # 6. Uploading
        update_job_status(cache, job_id, 'uploading', 95)
        print("â˜ï¸ Uploading final video to S3...")
        time.sleep(2)

        # 7. Complete
        mock_video_url = "https://www.w3schools.com/html/mov_bbb.mp4"
        update_job_status(cache, job_id, 'completed', 100, result_url=mock_video_url)
        print(f"âœ… Job {job_id} completed successfully! URL: {mock_video_url}")

    except Exception as e:
        print(f"âŒ Error processing job {job_id}: {str(e)}")
        update_job_status(cache, job_id, 'failed', error_message=str(e))


def worker_loop():
    cache = connect_redis()
    print("ðŸš€ Eigon AI Worker started. Listening for jobs...")

    queue_name = "bull:video-generation"

    while True:
        try:
            msg = cache.blpop(f"{queue_name}:wait", timeout=5)
            if msg:
                job_id = msg[1].decode('utf-8')
                job_hash_key = f"{queue_name}:{job_id}"

                job_data_raw = cache.hget(job_hash_key, 'data')
                if job_data_raw:
                    job_data = json.loads(job_data_raw)
                    process_job(job_data.get('jobId'), job_data, cache)

                    cache.srem(f"{queue_name}:active", job_id)
                    cache.zadd(f"{queue_name}:completed", {job_id: int(time.time() * 1000)})

        except Exception as e:
            print(f"Worker loop error: {e}")
            time.sleep(1)


if __name__ == "__main__":
    worker_loop()
