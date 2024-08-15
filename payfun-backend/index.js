require('dotenv').config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/payment", async (req, res) => {
  // ID de transacción aleatorio para simplificar el proceso pero deberia ser secuencial
  const TRANSACTION_ID = Math.floor(Math.random() * 1000000) + 1;

  const { name, email, amount } = req.body;
  if (!name || !email || !amount) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  const paymentData = {
    description: "descripciòn de la orden de pago",
    amount: amount,
    currency_id: "ARS",
    external_transaction_id: TRANSACTION_ID,
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

    // Enviar solo los datos necesarios al frontend
    const { id, status, payment_url } = response.data;
    res.status(200).json({
      message: "Orden de pago generada con éxito",
      orderId: id,
      status: status,
      paymentUrl: payment_url,
    });
  } catch (error) {
    console.error("Error al generar la orden de pago:", error.response?.data || error.message);
    
    // Manejo de diferentes tipos de errores
    if (error.response) {
      // Errores provenientes de la API de PayFun
      res.status(error.response.status).json({
        error: error.response.data.error || "Error desconocido en la API de PayFun",
      });
    } else if (error.request) {
      // Errores en la solicitud
      res.status(400).json({ error: "Error en la solicitud a la API de PayFun" });
    } else {
      // Otros errores, como errores internos del servidor
      res.status(500).json({ error: "Error al generar la orden de pago" });
    }
  }
});

app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});
