# 🔗 Server Webhook Setup Guide

This guide explains what your webhook server needs to do to handle payments and send license emails.

## 📍 Your Server URLs

- **Webhook URL**: `https://limit-henna.vercel.app/api/razorpay/webhook`
- **Create Order URL**: `https://limit-henna.vercel.app/api/razorpay/create-order`

---

## 🛠️ API Endpoint 1: Create Order

### Endpoint
`POST /api/razorpay/create-order`

### What It Does
Creates a Razorpay order before payment (required for new Razorpay API)

### Request Body
```json
{
  "amount": 100,
  "currency": "INR",
  "receipt": "receipt_1234567890",
  "notes": {
    "product": "Auto Captions Pro",
    "type": "lifetime_license"
  }
}
```

### Your Server Should:

1. **Create Razorpay Order**:
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_live_SDwg3Ie2duu2Z3',
  key_secret: 'mOlvChjtDZBMBYLAVeEC7zy7'
});

const order = await razorpay.orders.create({
  amount: req.body.amount,
  currency: req.body.currency,
  receipt: req.body.receipt,
  notes: req.body.notes
});
```

2. **Return Response**:
```json
{
  "success": true,
  "order_id": "order_xxx",
  "amount": 100,
  "currency": "INR",
  "key_id": "rzp_live_SDwg3Ie2duu2Z3"
}
```

### Sample Server Code (Node.js)
```javascript
// api/razorpay/create-order.js
const Razorpay = require('razorpay');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const { amount, currency, receipt, notes } = req.body;

    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes
    });

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

---

## 🛠️ API Endpoint 2: Webhook Handler

### Endpoint
`POST /api/razorpay/webhook`

### What It Does
Receives payment notifications from Razorpay and sends license email

### How Razorpay Webhook Works

**Razorpay automatically calls your webhook when:**
- Payment is captured
- Payment fails
- Refund is processed

**Webhook Data from Razorpay:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxx",
        "order_id": "order_xxx",
        "amount": 100,
        "currency": "INR",
        "email": "customer@example.com",
        "contact": "9876543210",
        "status": "captured"
      }
    }
  }
}
```

### Your Server Should:

1. **Verify Razorpay Signature** (IMPORTANT for security):
```javascript
const crypto = require('crypto');

const webhookSecret = 'your_webhook_secret_from_razorpay';
const signature = req.headers['x-razorpay-signature'];
const body = JSON.stringify(req.body);

const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(body)
  .digest('hex');

if (signature !== expectedSignature) {
  return res.status(400).json({ error: 'Invalid signature' });
}
```

2. **Extract Payment Data**:
```javascript
const paymentData = req.body.payload.payment.entity;
const paymentId = paymentData.id;
const orderId = paymentData.order_id;
const email = paymentData.email;
const contact = paymentData.contact;
const amount = paymentData.amount;
```

3. **Generate License Key**:
```javascript
function generateLicenseKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = 5;
  const segmentLength = 5;
  
  let key = 'ACPRO';
  
  for (let i = 0; i < segments; i++) {
    key += '-';
    for (let j = 0; j < segmentLength; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return key;
}

const licenseKey = generateLicenseKey();
```

4. **Save to Supabase**:
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const { data, error } = await supabase
  .from('licenses')
  .insert({
    license_key: licenseKey,
    email: email,
    phone: contact,
    payment_id: paymentId,
    order_id: orderId,
    amount: amount / 100, // Convert paise to rupees
    currency: 'INR',
    status: 'active',
    created_at: new Date().toISOString(),
    activations: 0,
    max_activations: 1
  });
```

5. **Send Email via Resend**:
```javascript
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Auto Captions Pro <noreply@notifications.mukeshfx.com>',
  to: email,
  subject: '🎉 Your Auto Captions Pro License Key',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .license-box { background: #f8f9fa; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
        .license-key { font-family: 'Courier New', monospace; font-size: 20px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Auto Captions Pro!</h1>
          <p>Thank you for your purchase</p>
        </div>
        <div class="content">
          <h2>Your License Key</h2>
          <div class="license-box">
            <p style="margin: 0 0 10px; color: #666;">Copy this license key:</p>
            <div class="license-key">${licenseKey}</div>
          </div>
          
          <h3>📝 How to Activate:</h3>
          <ol>
            <li>Open Adobe After Effects</li>
            <li>Go to <strong>Window → Extensions → Auto Captions Pro</strong></li>
            <li>Click <strong>"Activate License"</strong></li>
            <li>Paste your license key: <code>${licenseKey}</code></li>
            <li>Click <strong>"Activate"</strong></li>
          </ol>

          <h3>📋 Payment Details:</h3>
          <ul>
            <li><strong>Payment ID:</strong> ${paymentId}</li>
            <li><strong>Order ID:</strong> ${orderId}</li>
            <li><strong>Amount:</strong> ₹${amount / 100}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
          </ul>

          <h3>💡 Important Notes:</h3>
          <ul>
            <li>✅ This is a <strong>lifetime license</strong> with free updates</li>
            <li>✅ Can be activated on <strong>1 device</strong></li>
            <li>✅ Keep this email safe for future reference</li>
            <li>✅ Contact support with your Payment ID if needed</li>
          </ul>

          <div style="text-align: center;">
            <a href="https://mukeshfx.com/support" class="button">Get Support</a>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 Auto Captions Pro. All rights reserved.</p>
          <p>Need help? Reply to this email or visit our support page.</p>
        </div>
      </div>
    </body>
    </html>
  `
});
```

6. **Return Response**:
```javascript
res.status(200).json({
  success: true,
  message: 'License generated and email sent',
  license_key: licenseKey
});
```

### Complete Webhook Server Code (Vercel/Node.js)

```javascript
// api/razorpay/webhook.js
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Step 1: Verify Razorpay signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Step 2: Extract payment data
    const event = req.body.event;
    
    if (event !== 'payment.captured') {
      return res.status(200).json({ message: 'Event ignored' });
    }

    const paymentData = req.body.payload.payment.entity;
    const paymentId = paymentData.id;
    const orderId = paymentData.order_id;
    const email = paymentData.email;
    const contact = paymentData.contact;
    const amount = paymentData.amount;

    console.log('Payment captured:', { paymentId, orderId, email });

    // Step 3: Generate license key
    function generateLicenseKey() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const segments = 5;
      const segmentLength = 5;
      let key = 'ACPRO';
      for (let i = 0; i < segments; i++) {
        key += '-';
        for (let j = 0; j < segmentLength; j++) {
          key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      return key;
    }

    const licenseKey = generateLicenseKey();
    console.log('Generated license:', licenseKey);

    // Step 4: Save to Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { error: dbError } = await supabase
      .from('licenses')
      .insert({
        license_key: licenseKey,
        email: email,
        phone: contact,
        payment_id: paymentId,
        order_id: orderId,
        amount: amount / 100,
        currency: 'INR',
        status: 'active',
        created_at: new Date().toISOString(),
        activations: 0,
        max_activations: 1
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save license');
    }

    console.log('License saved to database');

    // Step 5: Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Auto Captions Pro <noreply@notifications.mukeshfx.com>',
      to: email,
      subject: '🎉 Your Auto Captions Pro License Key',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .license-box { background: #f8f9fa; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .license-key { font-family: 'Courier New', monospace; font-size: 20px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Auto Captions Pro!</h1>
              <p>Thank you for your purchase</p>
            </div>
            <div class="content">
              <h2>Your License Key</h2>
              <div class="license-box">
                <p style="margin: 0 0 10px; color: #666;">Copy this license key:</p>
                <div class="license-key">${licenseKey}</div>
              </div>
              
              <h3>📝 How to Activate:</h3>
              <ol>
                <li>Open Adobe After Effects</li>
                <li>Go to <strong>Window → Extensions → Auto Captions Pro</strong></li>
                <li>Click <strong>"Activate License"</strong></li>
                <li>Paste your license key: <code>${licenseKey}</code></li>
                <li>Click <strong>"Activate"</strong></li>
              </ol>

              <h3>📋 Payment Details:</h3>
              <ul>
                <li><strong>Payment ID:</strong> ${paymentId}</li>
                <li><strong>Order ID:</strong> ${orderId}</li>
                <li><strong>Amount:</strong> ₹${amount / 100}</li>
                <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
              </ul>

              <h3>💡 Important Notes:</h3>
              <ul>
                <li>✅ This is a <strong>lifetime license</strong> with free updates</li>
                <li>✅ Can be activated on <strong>1 device</strong></li>
                <li>✅ Keep this email safe for future reference</li>
                <li>✅ Contact support with your Payment ID if needed</li>
              </ul>

              <div style="text-align: center;">
                <a href="https://mukeshfx.com/support" class="button">Get Support</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 Auto Captions Pro. All rights reserved.</p>
              <p>Need help? Reply to this email or visit our support page.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('Email sent successfully');

    // Step 6: Return success response
    res.status(200).json({
      success: true,
      message: 'License generated and email sent',
      license_key: licenseKey
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

---

## 🔐 Environment Variables Needed

Add these to your Vercel project:

```bash
RAZORPAY_KEY_ID=rzp_live_SDwg3Ie2duu2Z3
RAZORPAY_KEY_SECRET=mOlvChjtDZBMBYLAVeEC7zy7
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay_dashboard

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

RESEND_API_KEY=your_resend_api_key
```

---

## 📊 Supabase Database Schema

```sql
CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  license_key VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  payment_id VARCHAR(100) UNIQUE NOT NULL,
  order_id VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  activated_at TIMESTAMP,
  activations INTEGER DEFAULT 0,
  max_activations INTEGER DEFAULT 1,
  device_info JSONB
);

CREATE INDEX idx_license_key ON licenses(license_key);
CREATE INDEX idx_payment_id ON licenses(payment_id);
CREATE INDEX idx_email ON licenses(email);
```

---

## ✅ Testing Your Setup

1. **Test Create Order**:
```bash
curl -X POST https://limit-henna.vercel.app/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"currency":"INR","receipt":"test_123","notes":{}}'
```

2. **Test Webhook** (after setting up Razorpay webhook in dashboard):
   - Go to Razorpay Dashboard → Settings → Webhooks
   - Add webhook URL: `https://limit-henna.vercel.app/api/razorpay/webhook`
   - Select event: `payment.captured`
   - Make a test payment and check Vercel logs

3. **Check Logs**:
```bash
vercel logs
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase database created with schema
- [ ] Resend domain verified (`notifications.mukeshfx.com`)
- [ ] Razorpay webhook configured in dashboard
- [ ] Test payment completed successfully
- [ ] Email received after test payment
- [ ] License saved in Supabase
- [ ] Change amount from ₹1 to actual price (₹999 = 99900 paise)

---

## 🆘 Troubleshooting

**Payment works but no email:**
- Check Vercel logs for errors
- Verify Resend API key is correct
- Check email domain is verified in Resend

**License not saved to database:**
- Check Supabase URL and key
- Verify table schema matches
- Check Vercel logs for database errors

**Webhook not triggered:**
- Verify webhook URL in Razorpay dashboard
- Check webhook secret matches
- Enable webhook events in Razorpay settings

---

Need help? Check your server logs at: https://vercel.com/dashboard
