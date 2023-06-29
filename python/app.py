import os
import requests
from flask import Flask
from flask import render_template

URL_PAYMENTS = os.environ.get("URL_PAYMENTS", "https://payment.prometeoapi.net/api/v1/payment-intent/")
WIDGET_ID = os.environ.get("WIDGET_ID")
PROMETEO_API_KEY = os.environ.get("PROMETEO_API_KEY")

app = Flask(__name__)


def create_intent(concept, currency, amount, external_id):
    payload = {
      "product_type": "widget",
      "product_id": WIDGET_ID,
      "concept": concept,
      "currency": currency,
      "amount": amount,
      "external_id": external_id
    }
    headers = {
      "accept": "application/json",
      "content-type": "application/json",
      "X-API-Key": PROMETEO_API_KEY
    }
    response = requests.post(URL_PAYMENTS, json=payload, headers=headers, verify=False)
    return response.json()["intent_id"]

@app.route("/")
def index():
    intent_id = create_intent("Prometeo Test", "PEN", 90.0, "pago 12345")
    return render_template('index.html', widget_id=WIDGET_ID, intent_id=intent_id)
