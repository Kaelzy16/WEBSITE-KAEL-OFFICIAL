const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Endpoint untuk menghasilkan QRIS
app.post('/generate-qris', async (req, res) => {
  const { amount, order_id } = req.body;

  try {
    // Kirim permintaan ke OkeConnect API untuk generate QRIS
    const response = await axios.post('https://api.okeconnect.com/generate-qris', {
      amount: amount,
      order_id: order_id
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_OKECONNECT_API_KEY'
      }
    });

    // Mengirimkan URL QRIS yang didapatkan dari OkeConnect
    res.json({
      status: 'success',
      qris_url: response.data.qris_url
    });
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: 'Gagal menghasilkan QRIS' });
  }
});

// Endpoint untuk mengecek status pembayaran
app.get('/check-payment-status', async (req, res) => {
  const { order_id } = req.query;

  try {
    const response = await axios.get(`https://api.okeconnect.com/check-payment-status`, {
      params: { order_id: order_id },
      headers: {
        'Authorization': 'Bearer 660184317351393382185708OKCT8A16C7953A9F99296894CD77272AFD57'
      }
    });

    res.json({
      status: response.data.status
    });
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: 'Gagal memeriksa status pembayaran' });
  }
});

// Endpoint untuk mengirim file setelah pembayaran berhasil
app.post('/send-file', async (req, res) => {
  const { order_id } = req.body;

  try {
    // Kirim file setelah status pembayaran berhasil
    // Misalnya mengirim file PDF atau dokumen ke pengguna
    console.log(`Mengirim file untuk order_id: ${order_id}`);
    
    // Simulasikan pengiriman file
    res.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: 'Gagal mengirim file' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
