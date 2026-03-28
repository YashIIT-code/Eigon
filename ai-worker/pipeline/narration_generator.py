def generate_narration(scenes):
    """
    Calls TTS API (like ElevenLabs) to generate voiceovers for each scene.
    """
    print(f"Generating narration for {len(scenes)} scenes...")

    # Mock return list of audio file paths
    return [
        "/tmp/audio_1.mp3",
        "/tmp/audio_2.mp3"
    ]
