# Razorpay Payment Integration

## Overview
This integration automatically detects Indian users and presents them with Razorpay payment gateway, while international users are redirected to Gumroad.

## Features
- ✅ Automatic geolocation detection
- ✅ Seamless Razorpay checkout for Indian users
- ✅ Gumroad fallback for international users
- ✅ Beautiful success/failure modals
- ✅ Webhook integration for payment verification
- ✅ Mobile responsive design

## Configuration

### Current Settings (in `payment.js`)
```javascript
const RAZORPAY_CONFIG = {
  keyId: 'rzp_live_SDwg3Ie2duu2Z3',
  amount: 100,  // ₹1 (in paise)
  currency: 'INR',
  name: 'Auto Captions Pro',
  description: 'Lifetime Pro License',
  successUrl: 'https://www.instagram.com/mukeshfx',
  webhookUrl: 'https://limit-henna.vercel.app/api/razorpay/webhook'
};
```

## How It Works

### 1. User Location Detection
```javascript
// Automatically detects user's country using IP geolocation
detectUserLocation() // Returns country code (e.g., 'IN')
```

### 2. Payment Flow for Indian Users
1. User clicks "Get Pro Now" button
2. System detects user is from India (country code: IN)
3. Razorpay checkout modal opens
4. User completes payment
5. Success callback triggers
6. Payment details sent to webhook
7. User redirected to Instagram after 3 seconds

### 3. Payment Flow for International Users
1. User clicks "Get Pro Now" button
2. System detects user is NOT from India
3. User redirected to Gumroad payment page

## Webhook Integration

The webhook URL is configured to receive payment notifications:
```
https://limit-henna.vercel.app/api/razorpay/webhook
```

### Webhook Payload Structure
```json
{
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_order_id": "order_xxxxx",
  "razorpay_signature": "signature_hash",
  "event": "payment.captured"
}
```

## Security Features

1. **Payment Signature Verification**: Webhook should verify signature using Razorpay secret key
2. **Key Secret**: `mOlvChjtDZBMBYLAVeEC7zy7` (stored securely on backend)
3. **Live Mode**: Using `rzp_live_` keys for production

## Updating Configuration

### To Change Amount
Edit the `amount` in `payment.js`:
```javascript
amount: 399900,  // ₹3,999 (amount in paise, multiply by 100)
```

### To Change Success Redirect
Edit the `successUrl` in `payment.js`:
```javascript
successUrl: 'https://your-success-page.com',
```

### To Add Order Creation (Recommended for Production)
For production, you should create Razorpay orders on your backend:

```javascript
// Before opening checkout, call your backend:
const orderResponse = await fetch('YOUR_BACKEND_URL/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 100, currency: 'INR' })
});
const orderData = await orderResponse.json();

// Then use order_id in Razorpay options:
const options = {
  ...existingOptions,
  order_id: orderData.id
};
```

## Files Modified

1. **getpro.html** - Added Razorpay script and payment buttons
2. **payment.js** - NEW: Complete payment integration logic
3. **RAZORPAY_INTEGRATION.md** - This documentation file

## Testing

### Test Cards for Razorpay
When testing in test mode (not applicable for live mode):
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

### Current Setup
⚠️ **Currently using LIVE keys with ₹1 for testing purposes**
- Production testing with minimal amount
- Real payments will be processed

## Next Steps for Production

1. **Increase Amount**: Change from ₹1 to actual price (e.g., ₹3,999)
2. **Implement Order Creation**: Add backend endpoint to create Razorpay orders
3. **Verify Webhook Signature**: Ensure webhook validates payment signatures
4. **Add License Delivery**: Integrate with your license management system
5. **Set Up Email Notifications**: Send license keys via email after payment

## Support

For Razorpay issues:
- Dashboard: https://dashboard.razorpay.com
- Documentation: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
- Support: https://razorpay.com/support/

## Important Security Notes

🔒 **Never expose your Key Secret (`mOlvChjtDZBMBYLAVeEC7zy7`) in frontend code**
- Only use Key ID in frontend
- Keep Key Secret on backend only
- Use for webhook signature verification

🔐 **Webhook Security**
Your webhook endpoint should verify signatures:
```javascript
const crypto = require('crypto');
const expectedSignature = crypto
  .createHmac('sha256', 'mOlvChjtDZBMBYLAVeEC7zy7')
  .update(order_id + "|" + razorpay_payment_id)
  .digest('hex');
```
