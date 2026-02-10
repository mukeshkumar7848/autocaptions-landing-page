# ✅ COMPLETE INTEGRATION CHECKLIST

Use this checklist to ensure everything is set up correctly.

---

## 📦 FRONTEND (Already Done ✅)

- [x] `getpro.html` - Payment page with buttons
- [x] `payment.js` - Updated with order creation flow
- [x] License key generation function
- [x] Success modal with copy/download
- [x] Error handling
- [x] Geolocation detection
- [x] localStorage backup
- [x] Email notification message

**Status:** ✅ Frontend is 100% ready to use!

---

## 🔧 SERVER SETUP (You Need To Do)

### 1. Create Order Endpoint
- [ ] Create file: `api/razorpay/create-order.js`
- [ ] Install dependency: `npm install razorpay`
- [ ] Copy code from `QUICK_REFERENCE.md`
- [ ] Add CORS headers
- [ ] Test with curl command

**Test Command:**
```bash
curl -X POST https://limit-henna.vercel.app/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"currency":"INR","receipt":"test_001"}'
```

**Expected Response:**
```json
{
  "success": true,
  "order_id": "order_xxx",
  "amount": 100,
  "currency": "INR",
  "key_id": "rzp_live_SDwg3Ie2duu2Z3"
}
```

---

### 2. Update Webhook Handler
- [ ] Open: `api/razorpay/webhook.js`
- [ ] Add license key generation function
- [ ] Verify signature verification exists
- [ ] Add Supabase save logic
- [ ] Add Resend email logic
- [ ] Add error logging

**Reference:** See `SERVER_WEBHOOK_SETUP.md` for complete code

---

### 3. Environment Variables
- [ ] Set in Vercel Dashboard

```bash
RAZORPAY_KEY_ID=rzp_live_SDwg3Ie2duu2Z3
RAZORPAY_KEY_SECRET=mOlvChjtDZBMBYLAVeEC7zy7
RAZORPAY_WEBHOOK_SECRET=<get_from_razorpay_dashboard>

SUPABASE_URL=<your_supabase_url>
SUPABASE_SERVICE_KEY=<your_supabase_service_key>

RESEND_API_KEY=<your_resend_api_key>
```

**How to set:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable
5. Deploy again: `vercel --prod`

---

### 4. Install Dependencies
- [ ] Run in your server directory:

```bash
npm install razorpay @supabase/supabase-js resend
```

---

## 🌐 RAZORPAY CONFIGURATION

### 1. Webhook Setup
- [ ] Go to: https://dashboard.razorpay.com/app/webhooks
- [ ] Click "Create Webhook"
- [ ] Enter URL: `https://limit-henna.vercel.app/api/razorpay/webhook`
- [ ] Select events: ✅ `payment.captured`
- [ ] Set active: ✅ On
- [ ] Copy webhook secret
- [ ] Add secret to Vercel env vars as `RAZORPAY_WEBHOOK_SECRET`

### 2. API Keys Verification
- [ ] Go to: https://dashboard.razorpay.com/app/keys
- [ ] Verify you're using LIVE keys (not test keys)
- [ ] Confirm Key ID: `rzp_live_SDwg3Ie2duu2Z3`

---

## 💾 SUPABASE SETUP

### 1. Database Table
- [ ] Table name: `licenses`
- [ ] Schema created (see below)

**Schema:**
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

### 2. Service Key
- [ ] Go to: Supabase Project → Settings → API
- [ ] Copy `service_role` key (NOT anon key)
- [ ] Add to Vercel as `SUPABASE_SERVICE_KEY`

---

## 📧 RESEND EMAIL SETUP

### 1. Domain Verification
- [ ] Go to: https://resend.com/domains
- [ ] Add domain: `notifications.mukeshfx.com`
- [ ] Add DNS records to your domain provider:
  - SPF record
  - DKIM record
  - DMARC record
- [ ] Wait for verification (can take 24-48 hours)

### 2. API Key
- [ ] Go to: https://resend.com/api-keys
- [ ] Create new API key
- [ ] Copy key
- [ ] Add to Vercel as `RESEND_API_KEY`

### 3. Test Email
- [ ] Send test email from Resend dashboard
- [ ] Verify it arrives in inbox (not spam)

---

## 🧪 TESTING

### Test 1: Order Creation
```bash
curl -X POST https://limit-henna.vercel.app/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"currency":"INR","receipt":"test_001"}'
```

**Expected:** `{ "success": true, "order_id": "order_xxx", ... }`

- [ ] Returns success
- [ ] order_id is present
- [ ] No errors in Vercel logs

---

### Test 2: Full Payment Flow
1. [ ] Open `getpro.html` in browser
2. [ ] Click "Get Pro Now" button
3. [ ] Razorpay modal opens
4. [ ] Enter test card details:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/28`
   - Name: `Test User`
   - Email: `your@email.com`
   - Phone: `9876543210`
5. [ ] Click "Pay ₹1"
6. [ ] Payment succeeds
7. [ ] License modal appears
8. [ ] License key format: `ACPRO-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX`
9. [ ] Can copy license key
10. [ ] Can download license key
11. [ ] Click "Continue to Download"
12. [ ] Redirects to Instagram

---

### Test 3: Backend Verification
- [ ] Check Vercel logs: `vercel logs --follow`
- [ ] Webhook received and processed
- [ ] No errors in logs
- [ ] Check Supabase: `licenses` table has new row
- [ ] Check email: Received within 30 seconds
- [ ] Email contains license key
- [ ] Email has activation instructions

---

### Test 4: Razorpay Dashboard
- [ ] Go to: https://dashboard.razorpay.com/app/payments
- [ ] See test payment of ₹1
- [ ] Status: `captured`
- [ ] Click on payment
- [ ] Webhook delivery shown
- [ ] Webhook status: `200 OK`

---

## 🐛 TROUBLESHOOTING

### Issue: Order creation fails
**Symptoms:** Alert shows "Failed to create order"

**Check:**
- [ ] Vercel environment variables set correctly
- [ ] Razorpay keys are LIVE keys (not test)
- [ ] `api/razorpay/create-order.js` file exists
- [ ] CORS headers added to endpoint
- [ ] Vercel logs for specific error

**Fix:** Check Vercel logs → See actual error → Fix accordingly

---

### Issue: Payment works but no email
**Symptoms:** License shows but email not received

**Check:**
- [ ] Razorpay webhook is configured
- [ ] Webhook URL is correct
- [ ] Webhook secret matches Vercel env var
- [ ] Resend API key is valid
- [ ] Domain `notifications.mukeshfx.com` is verified
- [ ] Check spam folder

**Fix:** 
1. Check Razorpay dashboard → Webhooks → See delivery logs
2. Check Vercel logs → See webhook processing
3. Check Resend dashboard → See email delivery status

---

### Issue: "Missing Razorpay signature"
**Symptoms:** Webhook returns 400 error

**Check:**
- [ ] Webhook configured in Razorpay dashboard
- [ ] Webhook secret matches
- [ ] Signature verification code exists

**Fix:**
1. Go to Razorpay → Settings → Webhooks
2. Verify URL is correct
3. Copy webhook secret
4. Update Vercel env var
5. Redeploy: `vercel --prod`

---

### Issue: License not in Supabase
**Symptoms:** Payment works, email sent, but no database record

**Check:**
- [ ] Supabase URL correct
- [ ] Supabase service key correct (not anon key)
- [ ] Table `licenses` exists
- [ ] Schema matches
- [ ] Vercel logs for database errors

**Fix:** Check Vercel logs for specific Supabase error

---

## 💰 GO LIVE

When ready for production:

### 1. Update Price
- [ ] Open `payment.js`
- [ ] Line 8: Change `amount: 100` to `amount: 99900` (for ₹999)
- [ ] Save and commit

### 2. Update Email Template
- [ ] Update amount in email template
- [ ] Change "₹1" references to "₹999"

### 3. Final Tests
- [ ] Test with actual price (₹999)
- [ ] Verify email shows correct amount
- [ ] Verify Supabase shows correct amount
- [ ] Test license activation in After Effects

### 4. Monitor
- [ ] Watch first 10 transactions
- [ ] Check Vercel logs
- [ ] Check Supabase records
- [ ] Check email delivery
- [ ] Check for customer support requests

---

## 📊 MONITORING

### Daily Checks
- [ ] Razorpay dashboard → See payments
- [ ] Supabase → Check new licenses
- [ ] Resend → Check email delivery rate
- [ ] Vercel logs → Check for errors

### Weekly Reports
- [ ] Total payments
- [ ] Total licenses issued
- [ ] Email delivery rate
- [ ] Activation rate
- [ ] Support requests

---

## 🎯 SUCCESS CRITERIA

Your integration is successful when:

- [x] Order creation API works
- [x] Razorpay checkout opens
- [x] Payment is processed
- [x] License key appears in modal
- [x] Email is sent and received
- [x] License is saved in Supabase
- [x] Copy button works
- [x] Download button works
- [x] Redirect to Instagram works
- [x] No errors in logs
- [x] Webhook shows 200 OK in Razorpay

---

## 📞 SUPPORT RESOURCES

- **Razorpay Docs:** https://razorpay.com/docs/
- **Razorpay Support:** https://razorpay.com/support/
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Resend Docs:** https://resend.com/docs

---

## 📁 DOCUMENTATION FILES

All documentation in `webpage/` directory:

- `QUICK_REFERENCE.md` - Quick setup guide
- `SERVER_WEBHOOK_SETUP.md` - Complete server code
- `PAYMENT_UPDATE_SUMMARY.md` - What changed
- `PAYMENT_FLOW_DIAGRAM.txt` - Visual flow diagram
- `INTEGRATION_CHECKLIST.md` - This file

---

## ✨ FINAL STEPS

1. [ ] Complete all items in this checklist
2. [ ] Test payment with ₹1
3. [ ] Verify all systems working
4. [ ] Update to actual price (₹999)
5. [ ] Launch! 🚀

---

**Need Help?** Check Vercel logs first: `vercel logs --follow`

**Still Stuck?** Review `SERVER_WEBHOOK_SETUP.md` for complete code examples.

**Good Luck! 🎉**
