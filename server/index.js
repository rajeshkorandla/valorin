const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { supabase } = require('./supabase');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.substring(7);
    
    const userSupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    const { data: { user }, error } = await userSupabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    const isAdmin = user.user_metadata?.role === 'admin' || 
                    user.app_metadata?.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
        message: 'Authentication failed'
    });
  }
};

app.get('/', (req, res) => {
  res.json({ message: 'Insurance Services API is running' });
});

app.post('/api/client-info', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, state, zipCode, dateOfBirth } = req.body;
    
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
    
    const { data, error } = await supabase
      .from('client_submissions')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          date_of_birth: dateOfBirth,
          address,
          city,
          state,
          zip_code: zipCode,
          submitted_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error submitting client information',
        error: error.message
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Client information submitted successfully',
      data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting client information',
      error: error.message
    });
  }
});

app.post('/api/quote-request', async (req, res) => {
  try {
    const { fullName, email, phone, insuranceType, coverageAmount, additionalInfo } = req.body;
    
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
    
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([
        {
          full_name: fullName,
          email,
          phone,
          insurance_type: insuranceType,
          coverage_amount: coverageAmount,
          additional_info: additionalInfo,
          submitted_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error submitting quote request',
        error: error.message
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quote request',
      error: error.message
    });
  }
});

app.get('/api/submissions', authenticateAdmin, async (req, res) => {
  try {
    const [clientsResult, quotesResult] = await Promise.all([
      supabase
        .from('client_submissions')
        .select('*')
        .order('submitted_at', { ascending: false }),
      supabase
        .from('quote_requests')
        .select('*')
        .order('submitted_at', { ascending: false })
    ]);
    
    if (clientsResult.error || quotesResult.error) {
      console.error('Supabase error:', clientsResult.error || quotesResult.error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching submissions'
      });
    }
    
    res.json({
      success: true,
      data: {
        clientSubmissions: clientsResult.data || [],
        quoteRequests: quotesResult.data || []
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
});

app.delete('/api/client-submissions/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('client_submissions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting submission',
        error: error.message
      });
    }
    
    res.json({
      success: true,
      message: 'Client submission deleted successfully'
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting submission',
      error: error.message
    });
  }
});

app.delete('/api/quote-requests/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting quote request',
        error: error.message
      });
    }
    
    res.json({
      success: true,
      message: 'Quote request deleted successfully'
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting quote request',
      error: error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Insurance Services API running on port ${PORT}`);
});
