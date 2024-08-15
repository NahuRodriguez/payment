import React, { useState } from 'react';
import './PaymentForm.css';

function PaymentForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`Pago generado exitosamente.`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <label>Nombre y Apellido:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>
      <div>
        <label>Monto:</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="input-field"
          required
          min="1" // Validación de monto minimo
        />
      </div>
      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Procesando...' : 'Generar Pago'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default PaymentForm;
