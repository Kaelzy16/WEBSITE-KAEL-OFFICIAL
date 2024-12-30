const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

// Endpoint untuk memulai pembayaran QRIS
app.post('/api/payment', async (req, res) => {
  const { productId, price, productName } = req.body;

  try {
    // Kirim permintaan ke OkeConnect untuk membuat pembayaran QRIS
    const response = await axios.post('https://api.okeconnect.com/payment', {
      amount: price,
      description: productName,
      payment_method: 'QRIS',
      callback_url: 'http://localhost:3000/api/payment/callback', // Ganti dengan URL callback asli
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_OKECONNECT_API_KEY', // Ganti dengan API key OkeConnect Anda
      }
    });

    // Kirimkan URL untuk pembayaran QRIS
    res.json({ paymentUrl: response.data.payment_url });
  } catch (error) {
    console.error('Error creating payment:', error.message);
    res.status(500).json({ error: 'Gagal memulai pembayaran' });
  }
});

// Callback untuk menangani notifikasi pembayaran
app.post('/api/payment/callback', (req, res) => {
  const { status, productId } = req.body;

  if (status === 'PAID') {
    console.log(`Pembayaran berhasil untuk produk ID: ${productId}`);
    // Kirim file atau lakukan tindakan lainnya
  }

  res.status(200).send('Callback diterima');
});

// Jalankan server
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
