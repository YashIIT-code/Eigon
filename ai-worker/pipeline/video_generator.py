import time


def generate_video_clips(image_paths):
    """
    Calls image-to-video API (Runway ML Gen-2 or similar) to animate the images.
    """
    print(f"Animating {len(image_paths)} images into video clips...")

    # Simulate processing time
    time.sleep(1)

    # Mock return video clip paths
    return [
        "/tmp/clip_1.mp4",
        "/tmp/clip_2.mp4"
    ]
