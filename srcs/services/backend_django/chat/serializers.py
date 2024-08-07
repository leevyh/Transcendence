from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
	date = serializers.DateTimeField(read_only=True)
	class Meta:
		model = Message
		fields = ['user_id', 'room_name', 'message', 'date']