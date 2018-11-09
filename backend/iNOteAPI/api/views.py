import os
import firebase_admin

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions

from google.cloud import texttospeech
from firebase_admin import credentials
from firebase_admin import auth
from firebase_admin import storage
from google.cloud.storage import Blob


from events import settings

# GCP settings
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=os.path.join(settings.BASE_DIR, 'gkey.json')
cred = credentials.Certificate(os.path.join(settings.BASE_DIR, 'gfire.json'))
fire_admin = firebase_admin.initialize_app(cred,{
    'storageBucket': 'inote-222016.appspot.com'
})
bucket = storage.bucket()


# Env
BLOB_ROOT = 'sounds/'
SOUNDS_STORAGE_LOCAL = os.path.join(settings.BASE_DIR, 'api/media/sounds/')



class FetchVoiceText(APIView):
    """
    Fetch speech syntehesis uri.
    * No authentication required.
    """
    # authentication_classes = (authentication.TokenAuthentication,)
    # permission_classes = (permissions.IsAdminUser,)

    def get(self, request, format=None):
        """
        Return cloud storage URL for the sythesized text.
        """
        print(request.GET.get('message',''))

        res = { 
            'status': 200,
            'id': 1,
            'url': "https://firebasestorage.googleapis.com/v0/b/inote-222016.appspot.com/o/sounds%2Fevent?alt=media&token=c27d3c79-47e1-42c5-a2f2-778f6ea605bc"
        }
        return Response(res)




# Create your views here.
def index(request):
    client = texttospeech.TextToSpeechClient()

# Set the text input to be synthesized
    synthesis_input = texttospeech.types.SynthesisInput(text="Hello, World!")

# Build the voice request, select the language code ("en-US") and the ssml
# voice gender ("neutral")
    voice = texttospeech.types.VoiceSelectionParams(
    language_code='en-US',
    ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)

# Select the type of audio file you want returned
    audio_config = texttospeech.types.AudioConfig(
    audio_encoding=texttospeech.enums.AudioEncoding.MP3)

# Perform the text-to-speech request on the text input with the selected
# voice parameters and audio file type
    response = client.synthesize_speech(synthesis_input, voice, audio_config)
    print(type(response))
    context={
        "gSpeech": response.audio_content
    }

# # The response's audio_content is binary.
    blob = Blob('sounds/event', bucket)
    
    with open('./api/media/sounds/output.mp3', 'wb') as out:
    # Write the response to the output file.
        out.write(response.audio_content)
        # blob.upload_from_file(out)
        print('Audio content written to file "output.mp3"')

    # blob.upload_from_string(response.audio_content)

    # with open('./api/media/sounds/output.mp3', 'rb') as sound:
    #     blob.upload_from_file(sound)
    #     print('Audio content written to file cloud storage')

    #  Save file to firebase storage
    # blob = bucket.blob()
    blob.upload_from_filename( os.path.join(settings.BASE_DIR, 'api/media/sounds/output.mp3') )
    print(  blob.public_url  )

    return render(request, 'index.html', context)




