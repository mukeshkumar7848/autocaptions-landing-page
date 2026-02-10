# 🎯 COMPLETE SETUP - Quick Reference

## ✅ What's Done (Frontend)

Your payment page is **100% ready**! The frontend will:

1. ✅ Detect Indian users (Razorpay) vs International (Gumroad)
2. ✅ Create order on your server before payment
3. ✅ Open Razorpay checkout modal
4. ✅ Generate license key immediately after payment
5. ✅ Show beautiful modal with license key
6. ✅ Allow copy & download license
7. ✅ Store backup in localStorage
8. ✅ Show email notification message

---

## 🔧 What You Need (Backend)

### Create This File: `api/razorpay/create-order.js`

```javascript
const Razorpay = require('razorpay');

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const { amount, currency, receipt, notes } = req.body;

    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    });

    console.log('Order created:', order.id);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

### Update Your Webhook: `api/razorpay/webhook.js`

**Add at the beginning** (after signature verification):

```javascript
// Extract payment data
const event = req.body.event;

if (event === 'payment.captured') {
  const paymentData = req.body.payload.payment.entity;
  
  const paymentId = paymentData.id;
  const orderId = paymentData.order_id;
  const email = paymentData.email;
  const contact = paymentData.contact;
  const amount = paymentData.amount;
  
  // Generate license key
  function generateLicenseKey() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let key = 'ACPRO';
    for (let i = 0; i < 5; i++) {
      key += '-';
      for (let j = 0; j < 5; j++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return key;
  }
  
  const licenseKey = generateLicenseKey();
  
  // Save to Supabase (your existing code)
  // Send email via Resend (your existing code)
}
```

---

## 🔑 Environment Variables (Vercel)

```bash
# Razorpay
RAZORPAY_KEY_ID=rzp_live_SDwg3Ie2duu2Z3
RAZORPAY_KEY_SECRET=mOlvChjtDZBMBYLAVeEC7zy7
RAZORPAY_WEBHOOK_SECRET=<get_from_razorpay_dashboard>

# Supabase
SUPABASE_URL=<your_url>
SUPABASE_SERVICE_KEY=<your_key>

# Resend
RESEND_API_KEY=<your_key>
```

---

## 📦 Install Dependencies (Server)

```bash
npm install razorpay @supabase/supabase-js resend
```

---

## 🌐 Razorpay Webhook Configuration

1. Go to: https://dashboard.razorpay.com/app/webhooks
2. Click "Create Webhook"
3. URL: `https://limit-henna.vercel.app/api/razorpay/webhook`
4. Events: Select `payment.captured`
5. Secret: Copy and add to Vercel env vars as `RAZORPAY_WEBHOOK_SECRET`
6. Active: ✅ On

---

## 🧪 Test Commands

### 1. Test Order Creation:
```bash
curl -X POST https://limit-henna.vercel.app/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"currency":"INR","receipt":"test_001"}'
```

**Expected:**
```json
{
  "success": true,
  "order_id": "order_xxx",
  "amount": 100,
  "currency": "INR",
  "key_id": "rzp_live_SDwg3Ie2duu2Z3"
}
```

### 2. Test Payment (Browser):
1. Open: `file:///path/to/webpage/getpro.html`
2. Click "Get Pro Now"
3. Use test card: `4111 1111 1111 1111`
4. CVV: `123`, Expiry: Any future date
5. Complete payment

### 3. Check Results:
```bash
# Vercel logs
vercel logs --follow

# Or in Vercel dashboard
https://vercel.com/dashboard → Your Project → Logs
```

---

## ✅ Verification Checklist

After test payment, verify:

- [ ] Order created (check console logs)
- [ ] Razorpay modal opened
- [ ] Payment succeeded
- [ ] License modal appeared
- [ ] License key is in format: `ACPRO-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX`
- [ ] Copy button works
- [ ] Download button works
- [ ] Email received (check inbox + spam)
- [ ] Supabase has new record
- [ ] Vercel logs show success

---

## 🐛 Troubleshooting

### Order Creation Fails
```
Error: "Failed to create order"
```
**Fix:** 
- Check `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Vercel
- Verify they're live keys (not test keys)
- Check Vercel deployment logs

### Payment Works but No Email
```
License shows but email not received
```
**Fix:**
- Check Razorpay webhook is configured
- Verify webhook secret in Vercel env vars
- Check Vercel logs for webhook errors
- Verify Resend API key and domain

### "Missing Razorpay signature"
```
Webhook returns 400 error
```
**Fix:**
- This means Razorpay webhook is not set up
- Or webhook secret doesn't match
- Configure webhook in Razorpay dashboard

---

## 📊 How Payment Flow Works

```
┌──────────────────────────────────────────────────────┐
│ USER CLICKS "GET PRO NOW"                            │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ STEP 1: Frontend → Server                            │
│ POST /api/razorpay/create-order                      │
│ Body: { amount: 100, currency: "INR" }              │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ STEP 2: Server Creates Order                         │
│ Razorpay SDK: razorpay.orders.create()              │
│ Returns: { order_id, amount, currency }             │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ STEP 3: Frontend Opens Razorpay Modal               │
│ User enters card details and pays                   │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ STEP 4: Payment Success                              │
│ Frontend generates license key                       │
│ Shows modal with license                            │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ STEP 5: Razorpay → Your Webhook (Automatic)         │
│ POST /api/razorpay/webhook                          │
│ Razorpay sends payment data + signature             │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ STEP 6: Server Processes Webhook                    │
│ - Verify signature                                   │
│ - Generate license                                   │
│ - Save to Supabase                                  │
│ - Send email via Resend                             │
└──────────────────────────────────────────────────────┘
```

---

## 💰 Change Price

When ready to go live with actual price:

**File:** `payment.js` (Line 8)
```javascript
// Current (testing)
amount: 100, // ₹1

// Change to actual price
amount: 99900, // ₹999 (price in paise)
```

---

## 📧 Email Template (Resend)

Your webhook should send:

**From:** `Auto Captions Pro <noreply@notifications.mukeshfx.com>`  
**To:** Customer's email from payment  
**Subject:** `🎉 Your Auto Captions Pro License Key`

**Body:** HTML email with:
- Welcome message
- License key (large, bold, copyable)
- Activation instructions
- Payment details
- Support link

See `SERVER_WEBHOOK_SETUP.md` for complete HTML template.

---

## 🎯 Success Criteria

Your system is working when:

1. ✅ Click "Get Pro" → Order created
2. ✅ Razorpay modal opens
3. ✅ Payment succeeds
4. ✅ License modal appears immediately
5. ✅ Email arrives within 30 seconds
6. ✅ Supabase shows new license record
7. ✅ License can be copied/downloaded
8. ✅ User redirected to Instagram

---

## 📁 Files Reference

```
Frontend (Ready ✅):
├── getpro.html          → Main payment page
├── payment.js           → Updated with order creation
└── payment-old-backup.js → Your previous version

Server (You need to create):
├── api/razorpay/create-order.js  → NEW (create this)
└── api/razorpay/webhook.js       → UPDATE (add license generation)

Documentation:
├── SERVER_WEBHOOK_SETUP.md       → Complete server code
├── PAYMENT_UPDATE_SUMMARY.md     → What changed
└── QUICK_REFERENCE.md            → This file
```

---

## 🚀 Next Steps

1. **Create** `api/razorpay/create-order.js` (copy code above)
2. **Update** your webhook with license generation
3. **Set** environment variables in Vercel
4. **Configure** webhook in Razorpay dashboard
5. **Test** with ₹1 payment
6. **Verify** email delivery
7. **Go live** with actual price

---

## 💡 Pro Tips

1. **Test thoroughly** with ₹1 before changing price
2. **Check Vercel logs** after every test payment
3. **Verify email domain** in Resend dashboard
4. **Monitor first 10 payments** closely
5. **Keep webhook secret** secure (never commit to git)

---

## 📞 Support Resources

- **Razorpay Docs:** https://razorpay.com/docs/api/
- **Vercel Logs:** `vercel logs` or dashboard
- **Supabase Dashboard:** Check `licenses` table
- **Resend Dashboard:** Check email delivery status
- **Razorpay Dashboard:** Check payments & webhooks

---

**You're almost done! Just need to create the order endpoint and test. Good luck! 🚀**
