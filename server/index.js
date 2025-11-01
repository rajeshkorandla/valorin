const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const clientSubmissions = [];
const quoteRequests = [];

app.get('/', (req, res) => {
  res.json({ message: 'Insurance Services API is running' });
});

app.post('/api/client-info', (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, state, zipCode } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }
    
    const clientData = {
      id: Date.now().toString(),
      ...req.body,
      submittedAt: new Date().toISOString()
    };
    
    clientSubmissions.push(clientData);
    
    res.status(201).json({
      success: true,
      message: 'Client information submitted successfully',
      data: clientData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting client information',
      error: error.message
    });
  }
});

app.post('/api/quote-request', (req, res) => {
  try {
    const { fullName, email, phone, insuranceType } = req.body;
    
    if (!fullName || !email || !phone || !insuranceType) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }
    
    const validInsuranceTypes = ['health', 'auto', 'life', 'property', 'business'];
    if (!validInsuranceTypes.includes(insuranceType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid insurance type'
      });
    }
    
    const quoteData = {
      id: Date.now().toString(),
      ...req.body,
      submittedAt: new Date().toISOString()
    };
    
    quoteRequests.push(quoteData);
    
    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: quoteData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting quote request',
      error: error.message
    });
  }
});

app.get('/api/submissions', (req, res) => {
  res.json({
    success: true,
    data: {
      clientSubmissions,
      quoteRequests
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Insurance Services API running on port ${PORT}`);
});
