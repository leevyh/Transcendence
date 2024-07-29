from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
	timestamp = serializers.DateTimeField(read_only=True)
	class Meta:
		model = Message
		fields = ['message', 'user_id', 'timestamp', 'room_name']