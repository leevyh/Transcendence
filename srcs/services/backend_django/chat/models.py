from django.db import models
from api.models import User_site as User

class Conversation(models.Model): # Bloc contenant les users de la conversation + date de création
    members = models.ManyToManyField(User, related_name='conversation')
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"

class Conversation_History(models.Model): # Bloc contenant les messages de la conversation
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='history')
    messages = models.ManyToManyField(Message, related_name='history')

    def __str__(self):
        return f"{self.conversation} history"
    
    # def add_message(self, message):
    #     self.messages.add(message)
    #     self.save()
    #     
    # def get_messages(self):
    #     return self.messages.all()
    # 
    # def clear_history(self):
    #     self.messages.clear()
    #     self.save()