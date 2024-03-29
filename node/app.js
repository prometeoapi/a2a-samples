const express = require('express')
const axios = require('axios')
const https = require('https')
const app = express()
const port = 3000

var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

const WIDGET_ID = process.env.WIDGET_ID;
const URL_PAYMENTS = process.env.URL_PAYMENTS || "https://payment.prometeoapi.net/api/v1/payment-intent/"
const PROMETEO_API_KEY = process.env.PROMETEO_API_KEY

const createIntent = (amount, currency, concept, external_id) => {

  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const options = {
    method: 'POST',
    url: URL_PAYMENTS,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-API-Key': PROMETEO_API_KEY
    },
    data: {
      product_type: 'widget',
      product_id: WIDGET_ID,
      currency: currency,
      amount: amount,
      concept: concept,
      external_id: external_id
    },
    httpsAgent: agent
  };

  return axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data.intent_id;
    })
    .catch(function (error) {
      console.error(error);
    });
}

app.get('/', (req, res) => {
  createIntent("100.0", "USD", "Prometeo Test", "Pago 12345").then(
    (intent) => {
      console.log(intent);
      res.render('index', { widgetID: WIDGET_ID, paymentIntentID: intent});
    }
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


