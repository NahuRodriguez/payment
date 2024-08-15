require('dotenv').config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/payment", async (req, res) => {
  const { name, email, amount } = req.body;

  const paymentData = {
    description: "descripciòn de la orden de pago",
    amount: amount,
    currency_id: "ARS",
    external_transaction_id: '0001',
    notification_url: "www.payfun.com.ar/notifications",
    payer: {
      name: name,
      email: email,
      identification: {
        type: "DNI_ARG",
        number: "99999999",
        country: "ARG",
      },
    },
    source: {
      type: "payfun-panel",
      id: "000001",
      name: "direct-op",
    },
  };

  try {
    const response = await axios.post(
      "https://checkouts.payfun.com.ar/v2/single_payment",
      paymentData,
      {
        headers: {
          "x-api-key": process.env.API_KEY,
          "x-access-token": process.env.ACCESS_TOKEN,
          "Content-Type": "application/json",
          "cache-control": "no-cache",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error al generar la orden de pago:", error);
    res.status(500).json({ error: "Error al generar la orden de pago" });
  }
});

app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});
