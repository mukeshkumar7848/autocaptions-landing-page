// ================================================
// RAZORPAY WEBHOOK HANDLER (Backend - Vercel/Node.js)
// Deploy this to: https://limit-henna.vercel.app/api/razorpay/webhook
// ================================================

/**
 * This webhook receives payment notifications from Razorpay
 * and processes license key generation and delivery
 */

const crypto = require('crypto');

// Configuration
const RAZORPAY_KEY_SECRET = 'mOlvChjtDZBMBYLAVeEC7zy7'; // Your Razorpay secret key

// Email service configuration (use your preferred email service)
// Examples: SendGrid, Mailgun, AWS SES, Resend, etc.
const EMAIL_SERVICE = {
  enabled: true, // Set to false to disable email sending during testing
  from: 'noreply@autocaptionspro.com',
  support: 'support@autocaptionspro.com'
};

/**
 * Main webhook handler
 */
module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    console.log('Webhook received:', {
      timestamp: new Date().toISOString(),
      body: req.body,
      headers: req.headers
    });

    const paymentData = req.body;

    // Extract payment details
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      license_key,
      customer_email,
      customer_contact,
      amount,
      currency,
      product,
      event
    } = paymentData;

    // Validate required fields
    if (!razorpay_payment_id || !license_key) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment data'
      });
    }

    // Optional: Verify Razorpay signature if order_id is present
    // This ensures the payment is legitimate
    if (razorpay_order_id && razorpay_signature) {
      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        console.error('Invalid payment signature');
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }
    }

    // Store license in database
    const storedLicense = await storeLicenseInDatabase({
      license_key,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      email: customer_email,
      contact: customer_contact,
      amount,
      currency,
      product,
      status: 'active',
      created_at: new Date().toISOString()
    });

    console.log('License stored:', storedLicense);

    // Send email to customer if email is provided
    if (customer_email && EMAIL_SERVICE.enabled) {
      await sendLicenseEmail({
        email: customer_email,
        license_key,
        payment_id: razorpay_payment_id,
        amount,
        currency
      });

      console.log('License email sent to:', customer_email);
    }

    // Send notification to admin
    await sendAdminNotification({
      license_key,
      payment_id: razorpay_payment_id,
      email: customer_email,
      amount,
      currency
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      license_key,
      payment_id: razorpay_payment_id
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Verify Razorpay payment signature
 */
function verifyRazorpaySignature(orderId, paymentId, signature) {
  try {
    const text = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Store license in database
 * Replace this with your actual database logic
 */
async function storeLicenseInDatabase(licenseData) {
  // TODO: Implement your database storage logic
  // Examples: MongoDB, PostgreSQL, Firebase, Supabase, etc.
  
  console.log('Storing license:', licenseData);
  
  // Example with a hypothetical database:
  /*
  const db = await connectToDatabase();
  const result = await db.collection('licenses').insertOne(licenseData);
  return result;
  */
  
  // For now, just return the data
  return licenseData;
}

/**
 * Send license key email to customer
 */
async function sendLicenseEmail({ email, license_key, payment_id, amount, currency }) {
  // TODO: Implement your email sending logic
  // Examples: SendGrid, Mailgun, Resend, AWS SES, etc.
  
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px 20px; text-align: center; color: white; }
        .content { padding: 40px 30px; }
        .license-box { background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .license-key { background: white; color: #667eea; padding: 15px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; letter-spacing: 1px; }
        .instructions { background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Auto Captions Pro!</h1>
          <p>Your payment was successful</p>
        </div>
        
        <div class="content">
          <p>Hi there! 👋</p>
          <p>Thank you for purchasing Auto Captions Pro! Your license key is ready.</p>
          
          <div class="license-box">
            <p style="color: white; margin-bottom: 15px; font-weight: 600;">🔑 Your License Key</p>
            <div class="license-key">${license_key}</div>
          </div>
          
          <div class="instructions">
            <h3 style="margin-top: 0;">📝 Activation Instructions:</h3>
            <ol style="line-height: 2;">
              <li>Download Auto Captions Pro extension</li>
              <li>Open Adobe After Effects</li>
              <li>Go to Window → Extensions → Auto Captions Pro</li>
              <li>Click "Activate License"</li>
              <li>Paste your license key above</li>
              <li>Enjoy unlimited pro features! 🚀</li>
            </ol>
          </div>
          
          <p><strong>Payment Details:</strong></p>
          <ul style="line-height: 2; color: #666;">
            <li>Payment ID: ${payment_id}</li>
            <li>Amount: ${amount/100} ${currency}</li>
            <li>Date: ${new Date().toLocaleString()}</li>
          </ul>
          
          <center>
            <a href="https://www.instagram.com/mukeshfx" class="btn">Download Extension</a>
          </center>
        </div>
        
        <div class="footer">
          <p><strong>Need Help?</strong></p>
          <p>Contact support: ${EMAIL_SERVICE.support}</p>
          <p>© ${new Date().getFullYear()} Auto Captions Pro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Example using SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  await sgMail.send({
    to: email,
    from: EMAIL_SERVICE.from,
    subject: '🎉 Your Auto Captions Pro License Key',
    html: emailHTML
  });
  */
  
  // Example using Resend:
  /*
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: EMAIL_SERVICE.from,
    to: email,
    subject: '🎉 Your Auto Captions Pro License Key',
    html: emailHTML
  });
  */
  
  console.log('Email would be sent to:', email);
  return true;
}

/**
 * Send notification to admin
 */
async function sendAdminNotification(data) {
  // TODO: Send notification to admin (email, Slack, Discord, etc.)
  console.log('Admin notification:', data);
  return true;
}

/**
 * Example: Validate license key (for your After Effects extension)
 * This endpoint can be called by your extension to verify licenses
 */
async function validateLicenseKey(licenseKey) {
  // TODO: Check if license exists in database and is active
  /*
  const db = await connectToDatabase();
  const license = await db.collection('licenses').findOne({ 
    license_key: licenseKey,
    status: 'active'
  });
  
  return {
    valid: !!license,
    license: license || null
  };
  */
  
  return {
    valid: true,
    license: { license_key: licenseKey, status: 'active' }
  };
}

// Export validation function for separate endpoint
module.exports.validateLicenseKey = validateLicenseKey;
