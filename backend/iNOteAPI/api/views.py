from __future__ import print_function

import os
import firebase_admin
import datetime

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions

from google.cloud import texttospeech
from firebase_admin import credentials
from firebase_admin import auth
from firebase_admin import storage
from google.cloud.storage import Blob
from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools


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


# Calender api
# def calenderEvents(request):
#     SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'

#     store = file.Storage( os.path.join(settings.BASE_DIR, 'token.json') )
#     creds = store.get()
#     if not creds or creds.invalid:
#         flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
#         creds = tools.run_flow(flow, store)
#     service = build('calendar', 'v3', http=creds.authorize(Http()))

#     # Call the Calendar API
#     now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
#     print('Getting the upcoming 10 events')
#     events_result = service.events().list(calendarId='primary', timeMin=now,
#                                         maxResults=10, singleEvents=True,
#                                         orderBy='startTime').execute()
#     events = events_result.get('items', [])

#     if not events:
#         print('No upcoming events found.')
#     for event in events:
#         start = event['start'].get('dateTime', event['start'].get('date'))
#         print(start, event['summary'])

#     return Response(events)
# /Calender api




class FetchVoiceText(APIView):
    """
    Fetch speech syntehesis uri.
    * No authentication required.
    """
    # authentication_classes = (authentication.TokenAuthentication,)
    # permission_classes = (permissions.IsAdminUser,)

    def get(self, request, format=None):
        """
        Return cloud storage URL for the speech sythesized text.
        """
        message = request.GET.get('message','What can i do for you today?')
        eventId = request.GET.get('id','121')

        eventSoundUrl = getMp3FromText(message, eventId)
        if eventSoundUrl:
            res = { 
            'status': 200,
            'id': eventId,
            'url': eventSoundUrl
            }
            return Response(res)
        else:
            return Response({'status': 500})




# helper functions
def getMp3FromText(msg, eventId):
    client = texttospeech.TextToSpeechClient()
    eventFileName = 'event' + '_' + eventId + '.mp3'

    # Set the text input to be synthesized
    synthesis_input = texttospeech.types.SynthesisInput(text=msg)

    voice = texttospeech.types.VoiceSelectionParams(
    language_code='en-US',
    ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)

    # Select the type of audio file you want returned
    audio_config = texttospeech.types.AudioConfig(
    audio_encoding=texttospeech.enums.AudioEncoding.MP3)

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(synthesis_input, voice, audio_config)

    # # The response's audio_content is binary.
    blob = Blob('sounds/' + eventFileName, bucket)
    
    with open('./api/media/sounds/' + eventFileName, 'wb') as out:
    # Write the response to the output file.
        out.write(response.audio_content)
        # blob.upload_from_file(out)
        print('Audio content written to local file storage"')

    try:
        blob.upload_from_filename( os.path.join(settings.BASE_DIR, 'api/media/sounds/' + eventFileName) )
    except:
        print("Sound clip uopload failed, please try again.")
        return None

    blob.make_public()
    return  blob.public_url 




