import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from .models import Room, Message

# Here we created a ChatConsumer, which inherits from WebsocketConsumer. This class is responsible for handling WebSocket connections.
# WebSocketConsumer provides a few methods that we can override to handle different events:
#     connect: This method is called when the WebSocket connection is established.
#           We added the user to the channel layer group.
#     disconnect: This method is called when the WebSocket connection is closed.
#           We removed the user from the channel layer group.
#     receive: This method is called when the WebSocket connection receives a message.
#           We parsed the data to JSON and extracted the message. Then, we forwarded the message using the group_send to chat_message.
class ChatConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None # New for authentication
        self.user_inbox = None # New for private messages
    
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.room = Room.objects.get(name=self.room_name)
        self.user = self.scope['user'] # New for authentication
        self.user_inbox = f'inbox_{self.user.username}' # New for private messages
        
        # Connection has to be accepted
        self.accept()

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        # Send the user list to the newly joined user
        self.send(json.dumps({
            'type': 'user_list',
            'users': [user.username for user in self.room.online.all()],
        }))

        if self.user.is_authenticated:
            # Create a user inbox for private messages
            async_to_sync(self.channel_layer.group_add)(
                self.user_inbox,
                self.channel_name
            )
            # Send the join event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': self.user.username,
                }
            )
            self.room.online.add(self.user)


    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

        if self.user.is_authenticated:
            # Delete the user inbox for private messages
            async_to_sync(self.channel_layer.group_discard)(
                self.user_inbox,
                self.channel_name
            )
            # Send the leave event to the room
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user': self.user.username,
                }
            )
            self.room.online.remove(self.user)
    
    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        if not self.user.is_authenticated: # New for authentication
            return
        
        # Check if the message is a private message
        if message.startswith('/pm '):
            split = message.split(' ', 2)
            target = split[1]
            target_msg = split[2]
            
            # Send the private message to the target user
            async_to_sync(self.channel_layer.group_send)(
                f'inbox_{target}',
                {
                    'type': 'private_message',
                    'user': self.user.username,
                    'message': target_msg,
                }
            )
            # Send private message delivered to the user
            self.send(json.dumps({
                'type': 'private_message_delivered',
                'target': target,
                'message': target_msg,
            }))
            return

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'user': self.user.username, # New for authentication
                'message': message
            }
        )
        Message.objects.create(user=self.user, room=self.room, content=message) # New for authentication
    
    # When using channel layer's group_send, the consumer has to have a method for every JSON message type we use.
    # In this case, type is equaled to chat_message. Thus, we added a method called chat_message.
    def chat_message(self, event):
        # Send message to WebSocket
        self.send(text_data=json.dumps(event))

# Since WebsocketConsumer is a synchronous consumer, we need to use async_to_sync to call the channel layer methods.

    def user_join(self, event):
        self.send(text_data=json.dumps(event))
    
    def user_leave(self, event):
        self.send(text_data=json.dumps(event))

    def private_message(self, event):
        self.send(text_data=json.dumps(event))

    def private_message_delivered(self, event):
        self.send(text_data=json.dumps(event))