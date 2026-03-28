def generate_scenes(story, num_scenes=5):
    """
    Calls LLM (OpenAI/Claude) to break the story into a sequence of scenes.
    """
    print(f"Generating {num_scenes} scenes for story...")
    # Mock return
    return [
        {"scene_number": 1, "description": "Establishing shot of a dark forest", "narration": "Once upon a time..."},
        {"scene_number": 2, "description": "Close up of hero walking", "narration": "Our hero began his journey."}
    ]
