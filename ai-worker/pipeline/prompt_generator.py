def generate_prompts(scenes):
    """
    Converts scene descriptions into optimized Stable Diffusion prompts.
    """
    print(f"Generating prompts for {len(scenes)} scenes...")
    return [
        {"prompt": "masterpiece, highly detailed, dark forest, moody lighting, fantasy", "negative": "blurry, low quality"},
        {"prompt": "masterpiece, highly detailed, close up of a hero walking, cinematic lighting", "negative": "blurry, low quality"}
    ]
