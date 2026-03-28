import os


def generate_narration(scenes):
    """
    Calls TTS API (like ElevenLabs) to generate voiceovers for each scene.
    """
    print(f"Generating voiceover for {len(scenes)} scenes...")
    api_key = os.getenv('ELEVENLABS_API_KEY')
    
    # Mock return list of local audio files
    return [
        "/tmp/voice_1.wav",
        "/tmp/voice_2.wav"
    ]
