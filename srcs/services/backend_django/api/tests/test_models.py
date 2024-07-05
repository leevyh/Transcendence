# api/tests/test_models.py

from django.test import TestCase
from api.models import YourModel

class YourModelTestCase(TestCase):

    def test_something(self):
        # Créer des données de test
        YourModel.objects.create(field1='value1', field2='value2')

        # Vérifier les assertions
        self.assertEqual(YourModel.objects.count(), 1)