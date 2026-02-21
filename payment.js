// ================================================
// AUTO CAPTIONS GENERATOR PRO - PAYMENT SYSTEM
// Razorpay Integration with Order Creation & Email
// ================================================

// ================================================
// CONFIGURATION
// ================================================

// Load admin-configurable prices from localStorage (set via admin.html)
function getAdminPrices() {
  try {
    const saved = localStorage.getItem('acp_admin_prices');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return { usd: 49, inr: 999 };
}

// Load admin-configurable settings (download link, etc.) from localStorage
function getAdminSettings() {
  try {
    const saved = localStorage.getItem('acp_admin_settings');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return { downloadUrl: 'https://mukeshfx.com' }; // default download link
}

const RAZORPAY_CONFIG = {
  keyId: null, // Will be fetched from server
  get amount() { return getAdminPrices().inr * 100; }, // paise
  currency: 'INR',
  name: 'Auto Captions Generator Pro',
  description: 'Lifetime Pro License',
  image: '../client/assets/logo.png',
  successUrl: 'https://www.instagram.com/mukeshfx',
  createOrderUrl: 'https://limit-henna.vercel.app/api/razorpay/create-order',
  webhookUrl: 'https://limit-henna.vercel.app/api/razorpay/webhook'
};

// ================================================
// GLOBAL VARIABLES
// ================================================
let isIndianUser = false;
let userCountry = '';
let collectedEmail = ''; // Store email for payment

// ================================================
// EMAIL COLLECTION HELPER
// ================================================
function collectEmailForPayment() {
  return new Promise((resolve, reject) => {
    const modal = document.createElement('div');
    modal.className = 'payment-modal-overlay';
    modal.style.opacity = '1';
    modal.innerHTML = `
      <div class="payment-modal" style="transform: translateY(0) scale(1);">
        <h2 style="color: #667eea; margin-bottom: 10px;">📧 Enter Your Email</h2>
        <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
          We'll send your license key to this email address
        </p>
        
        <input 
          type="email" 
          id="emailInput" 
          placeholder="your@email.com"
          required
          style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; margin-bottom: 20px;"
        />
        
        <div style="display: flex; gap: 10px;">
          <button onclick="document.getElementById('emailModalCancel').click()" 
                  style="flex: 1; background: #f0f0f0; color: #666; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Cancel
          </button>
          <button id="emailModalContinue" 
                  style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Continue to Payment
          </button>
        </div>
        <button id="emailModalCancel" style="display: none;"></button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const emailInput = document.getElementById('emailInput');
    const continueBtn = document.getElementById('emailModalContinue');
    const cancelBtn = document.getElementById('emailModalCancel');
    
    emailInput.focus();
    
    continueBtn.onclick = () => {
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        emailInput.style.borderColor = 'red';
        emailInput.placeholder = 'Please enter a valid email';
        return;
      }
      modal.remove();
      resolve(email);
    };
    
    cancelBtn.onclick = () => {
      modal.remove();
      reject(new Error('Email collection cancelled'));
    };
    
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        continueBtn.click();
      }
    });
  });
}

// ================================================
// LICENSE KEY GENERATION
// ================================================
function generateLicenseKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
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

// ================================================
// DETECT USER LOCATION
// ================================================
async function detectUserLocation() {
  try {
    console.log('🌍 Detecting user location...');
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    userCountry = data.country_code;
    isIndianUser = (userCountry === 'IN');
    
    console.log('✅ Detected country:', userCountry, '| Is Indian user:', isIndianUser);
    updatePaymentUI();
  } catch (error) {
    console.warn('❌ Primary geolocation failed, trying fallback...', error);
    
    // Try fallback geolocation service
    try {
      const fallbackResponse = await fetch('https://api.country.is/');
      const fallbackData = await fallbackResponse.json();
      userCountry = fallbackData.country;
      isIndianUser = (userCountry === 'IN');
      
      console.log('✅ Fallback detected country:', userCountry, '| Is Indian user:', isIndianUser);
      updatePaymentUI();
    } catch (fallbackError) {
      console.error('❌ All geolocation services failed');
      
      // Default to international (Gumroad) for safety
      // User can manually switch if they're from India
      isIndianUser = false;
      userCountry = 'UNKNOWN';
      
      console.log('⚠️ Defaulting to Gumroad (international payment)');
      updatePaymentUI();
    }
  }
}

// ================================================
// UPDATE UI BASED ON LOCATION
// ================================================
function updatePaymentUI() {
  const prices = getAdminPrices();

  // Update price amounts in DOM (in case admin changed them)
  const inrEl = document.getElementById('inr-amount');
  const usdEl = document.getElementById('usd-amount');
  if (inrEl) inrEl.textContent = prices.inr.toLocaleString('en-IN');
  if (usdEl) usdEl.textContent = prices.usd;

  // Show correct price card & tab
  const indiaCard  = document.getElementById('price-india');
  const intlCard   = document.getElementById('price-intl');
  const tabIndia   = document.getElementById('tab-india');
  const tabIntl    = document.getElementById('tab-intl');

  if (indiaCard && intlCard) {
    if (isIndianUser) {
      indiaCard.style.display = 'block';
      intlCard.style.display  = 'none';
      if (tabIndia) tabIndia.classList.add('active');
      if (tabIntl)  tabIntl.classList.remove('active');
    } else {
      indiaCard.style.display = 'none';
      intlCard.style.display  = 'block';
      if (tabIntl)  tabIntl.classList.add('active');
      if (tabIndia) tabIndia.classList.remove('active');
    }
  }

  // Update CTA button text
  const btnText      = document.getElementById('getProBtnText');
  const finalBtnText = document.getElementById('finalCtaBtnText');
  const upgradeBtn   = document.getElementById('upgradeProBtn');

  if (isIndianUser) {
    const label = `Get Pro — ₹${prices.inr.toLocaleString('en-IN')}`;
    if (btnText)      btnText.textContent      = label;
    if (finalBtnText) finalBtnText.textContent  = label + ' →';
    if (upgradeBtn)   upgradeBtn.textContent    = label;
  } else {
    const label = `Get Pro — $${prices.usd}`;
    if (btnText)      btnText.textContent      = label;
    if (finalBtnText) finalBtnText.textContent  = label + ' →';
    if (upgradeBtn)   upgradeBtn.textContent    = label;
  }

  // Legacy paymentRegionInfo support
  const regionInfo = document.getElementById('paymentRegionInfo');
  if (regionInfo && regionInfo.style.display !== 'none') {
    regionInfo.innerHTML = isIndianUser
      ? `<span style="color:#00D88A;font-weight:600;">🇮🇳 Indian price: ₹${prices.inr.toLocaleString('en-IN')} via Razorpay</span>`
      : `<span style="color:#667eea;font-weight:600;">🌍 International price: $${prices.usd} via Gumroad</span>`;
  }
}

// ================================================
// MANUAL REGION SWITCH (called from region tabs)
// ================================================
window.manualSwitchRegion = function(region) {
  isIndianUser = (region === 'india');
  userCountry  = isIndianUser ? 'IN' : 'INTL';
  console.log('💱 Manually switched to:', region);
  updatePaymentUI();
};

// ================================================
// MANUAL PAYMENT METHOD SWITCHES (legacy)
// ================================================
window.switchToRazorpay = function() {
  isIndianUser = true;
  userCountry  = 'IN';
  updatePaymentUI();
};

window.switchToGumroad = function() {
  isIndianUser = false;
  userCountry  = 'INTL';
  updatePaymentUI();
};

// ================================================
// RAZORPAY PAYMENT HANDLER (with Order Creation)
// ================================================
async function initiateRazorpayPayment() {
  try {
    console.log('🚀 Initiating payment flow...');
    
    // Collect email first (to ensure we have it for license delivery)
    let userEmail;
    try {
      userEmail = await collectEmailForPayment();
      console.log('📧 User email collected:', userEmail);
      collectedEmail = userEmail; // Store globally
    } catch (error) {
      console.log('User cancelled email input');
      return; // User cancelled
    }
    
    // Step 1: Create order on server (license key will be generated there)
    const orderResponse = await fetch(RAZORPAY_CONFIG.createOrderUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: RAZORPAY_CONFIG.amount,  // dynamic from admin prices
        currency: RAZORPAY_CONFIG.currency,
        receipt: `receipt_${Date.now()}`,
        email: userEmail, // Send email so server can include it in order notes
        notes: {
          product: 'Auto Captions Generator Pro',
          type: 'lifetime_license'
        }
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }

    const orderData = await orderResponse.json();
    console.log('📦 Order created:', orderData);
    console.log('🔑 License key from server:', orderData.license_key);
    console.log('🔍 Full orderData keys:', Object.keys(orderData));
    console.log('🔍 orderData stringified:', JSON.stringify(orderData, null, 2));

    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order');
    }
    
    // Store the license key from server (not generating on frontend anymore)
    const serverLicenseKey = orderData.license_key;
    
    if (!serverLicenseKey) {
      console.error('❌ Server did not return license key!');
      console.error('📋 OrderData received:', orderData);
    }

    // Step 2: Open Razorpay checkout with the order
    const options = {
      key: orderData.key_id || RAZORPAY_CONFIG.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: RAZORPAY_CONFIG.name,
      description: RAZORPAY_CONFIG.description,
      order_id: orderData.order_id,
      image: RAZORPAY_CONFIG.image,
      
      // Handler for successful payment
      handler: function(response) {
        console.log('✅ Payment successful:', response);
        // Pass email to handler
        response.email = userEmail;
        handlePaymentSuccess(response, orderData);
      },
      
      // Prefill customer details with the email they provided
      prefill: {
        name: '',
        email: userEmail,
        contact: ''
      },
      
      // Make fields readonly
      readonly: {
        email: true, // Lock email since we already collected it
        contact: false,
        name: false
      },
      
      // Theme customization
      theme: {
        color: '#667eea'
      },
      
      // Modal settings
      modal: {
        ondismiss: function() {
          console.log('❌ Payment cancelled by user');
        },
        escape: true,
        backdropclose: true,
        confirm_close: false
      },
      
      // Retry settings
      retry: {
        enabled: true,
        max_count: 3
      }
    };

    // Create Razorpay instance
    const razorpay = new Razorpay(options);
    
    // Handle payment failure
    razorpay.on('payment.failed', function(response) {
      console.error('❌ Payment failed:', response.error);
      handlePaymentFailure(response);
    });

    // Open Razorpay checkout modal
    razorpay.open();

  } catch (error) {
    console.error('❌ Error creating order:', error);
    alert('❌ Error: ' + error.message + '\n\nPlease check:\n1. Your internet connection\n2. Server is running\n3. Contact support if issue persists');
  }
}

// ================================================
// PAYMENT SUCCESS HANDLER
// ================================================
async function handlePaymentSuccess(response, orderData) {
  console.log('✅ Processing payment success...');
  console.log('📦 Razorpay Response:', response);
  console.log('📦 OrderData received:', orderData);
  
  // Use license key from server (generated during order creation)
  let licenseKey = orderData.license_key;
  
  // Fallback: If server didn't provide license key, generate one (shouldn't happen)
  if (!licenseKey) {
    console.warn('⚠️ Server did not provide license key, generating fallback');
    licenseKey = generateLicenseKey();
  }
  
  console.log('🔑 Using server-generated license:', licenseKey);
  
  // Extract email and contact from Razorpay response or use collected email
  const customerEmail = response.email || collectedEmail || '';
  const customerContact = response.contact || '';
  
  console.log('📧 Customer email:', customerEmail);
  console.log('📱 Customer contact:', customerContact);
  
  // Store license locally first (backup)
  try {
    const paymentRecord = {
      licenseKey: licenseKey,
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      email: customerEmail,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('ac_pro_license_' + response.razorpay_payment_id, licenseKey);
    localStorage.setItem('ac_pro_payment_' + response.razorpay_payment_id, JSON.stringify(paymentRecord));
    
    console.log('💾 License saved to localStorage');
  } catch (error) {
    console.error('⚠️ Failed to save to localStorage:', error);
  }
  
  // Razorpay will automatically call our webhook with signature verification
  // No need to call it from frontend - this eliminates CORS issues
  console.log('📧 Email will be sent automatically via Razorpay webhook');
  console.log('💡 Make sure webhook is configured at: https://dashboard.razorpay.com/app/webhooks');
  console.log('📍 Webhook URL: https://limit-henna.vercel.app/api/razorpay/webhook');
  console.log('� License key that will be emailed:', licenseKey);
  
  // Show success modal with license key immediately
  showPaymentSuccessModal({
    paymentId: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,
    signature: response.razorpay_signature,
    licenseKey: licenseKey,
    email: customerEmail
  });
}

// ================================================
// PAYMENT FAILURE HANDLER
// ================================================
function handlePaymentFailure(response) {
  console.error('❌ Payment failed:', response);
  
  const errorMessage = response.error ? 
    `${response.error.description || 'Payment failed'}\n\nReason: ${response.error.reason || 'Unknown'}` : 
    'Payment was unsuccessful. Please try again.';
  
  alert('❌ Payment Failed!\n\n' + errorMessage + '\n\nPlease try again or contact support.');
}

// ================================================
// SUCCESS MODAL
// ================================================
function showPaymentSuccessModal(paymentData) {
  // Remove existing modal if any
  const existingModal = document.getElementById('licenseModal');
  if (existingModal) existingModal.remove();

  // Inject modal styles once
  if (!document.getElementById('licenseModalStyles')) {
    const style = document.createElement('style');
    style.id = 'licenseModalStyles';
    style.textContent = `
      #licenseModal {
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(10,10,26,0.75);
        backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
        animation: lmFadeIn .22s ease;
      }
      @keyframes lmFadeIn { from { opacity:0 } to { opacity:1 } }
      @keyframes lmSlideUp { from { opacity:0; transform:translateY(24px) scale(.96) } to { opacity:1; transform:translateY(0) scale(1) } }

      .lm-card {
        background: #fff;
        border-radius: 20px;
        width: 100%; max-width: 460px;
        box-shadow: 0 32px 80px rgba(0,0,0,.22);
        animation: lmSlideUp .28s cubic-bezier(.16,1,.3,1);
        overflow: hidden;
      }

      /* ── Top success banner ── */
      .lm-banner {
        background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
        padding: 22px 24px 18px;
        display: flex; align-items: center; gap: 14px;
      }
      .lm-check {
        width: 44px; height: 44px; flex-shrink: 0;
        background: rgba(255,255,255,.18);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
      }
      .lm-banner h2 {
        margin: 0; font-size: 18px; font-weight: 700; color: #fff; line-height: 1.25;
      }
      .lm-banner p {
        margin: 2px 0 0; font-size: 12.5px; color: rgba(255,255,255,.78);
      }

      /* ── Body ── */
      .lm-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }

      /* license key box */
      .lm-key-box {
        background: linear-gradient(135deg,#667eea,#764ba2);
        border-radius: 14px; padding: 14px 16px;
      }
      .lm-key-label {
        font-size: 11.5px; color: rgba(255,255,255,.8); font-weight: 600;
        text-transform: uppercase; letter-spacing: .6px; margin-bottom: 8px;
      }
      .lm-key-input-wrap {
        background: rgba(255,255,255,.96);
        border-radius: 9px; padding: 10px 12px; margin-bottom: 10px;
        cursor: pointer;
      }
      .lm-key-input {
        width: 100%; font-family: 'Courier New', monospace;
        font-size: 13.5px; font-weight: 700; text-align: center;
        color: #667eea; letter-spacing: 1.5px;
        background: transparent; border: none; outline: none;
        cursor: pointer;
      }
      .lm-key-actions { display: flex; gap: 8px; }
      .lm-btn-copy, .lm-btn-dl {
        flex: 1; padding: 9px 0; border-radius: 8px;
        font-size: 13px; font-weight: 600; cursor: pointer;
        border: none; transition: all .15s;
      }
      .lm-btn-copy {
        background: #fff; color: #667eea;
      }
      .lm-btn-copy:hover { background: #f0f0fb; }
      .lm-btn-dl {
        background: rgba(255,255,255,.18); color: #fff;
        border: 1.5px solid rgba(255,255,255,.6);
      }
      .lm-btn-dl:hover { background: rgba(255,255,255,.28); }

      /* info rows */
      .lm-info {
        background: #f7f8fc; border-radius: 12px; padding: 11px 14px;
        font-size: 12.5px; display: flex; flex-direction: column; gap: 5px;
      }
      .lm-info-row { display: flex; justify-content: space-between; align-items: center; }
      .lm-info-label { color: #888; }
      .lm-info-val { color: #222; font-family: monospace; font-size: 11.5px; font-weight: 600; }

      /* email notice */
      .lm-email-notice {
        background: #fffbeb; border: 1px solid #fde68a;
        border-radius: 10px; padding: 10px 13px;
        font-size: 12px; color: #92400e; line-height: 1.5;
        display: flex; gap: 8px; align-items: flex-start;
      }

      /* steps */
      .lm-steps {
        background: #eff6ff; border-radius: 12px; padding: 11px 14px;
      }
      .lm-steps-title {
        font-size: 12px; font-weight: 700; color: #1d4ed8;
        margin-bottom: 7px; text-transform: uppercase; letter-spacing: .5px;
      }
      .lm-steps ol {
        margin: 0; padding-left: 16px;
        font-size: 12px; color: #1e40af; line-height: 1.7;
      }

      /* CTA */
      .lm-cta {
        background: linear-gradient(135deg,#667eea,#764ba2);
        color: #fff; border: none; border-radius: 12px;
        padding: 13px; width: 100%; font-size: 15px; font-weight: 700;
        cursor: pointer; transition: opacity .15s; letter-spacing: .3px;
      }
      .lm-cta:hover { opacity: .9; }

      .lm-footer {
        text-align: center; font-size: 11px; color: #aaa; padding-bottom: 4px;
      }
    `;
    document.head.appendChild(style);
  }

  const modal = document.createElement('div');
  modal.id = 'licenseModal';
  modal.innerHTML = `
    <div class="lm-card">

      <!-- Banner -->
      <div class="lm-banner">
        <div class="lm-check">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
          </svg>
        </div>
        <div>
          <h2>Payment Successful! 🎉</h2>
          <p>Thank you for upgrading to Auto Captions Generator Pro</p>
        </div>
      </div>

      <!-- Body -->
      <div class="lm-body">

        <!-- License key -->
        <div class="lm-key-box">
          <div class="lm-key-label">🔑 Your License Key</div>
          <div class="lm-key-input-wrap" onclick="document.getElementById('licenseKeyDisplay').select()">
            <input type="text" id="licenseKeyDisplay" value="${paymentData.licenseKey}"
                   readonly class="lm-key-input">
          </div>
          <div class="lm-key-actions">
            <button class="lm-btn-copy" id="lmCopyBtn" onclick="copyLicenseKey('${paymentData.licenseKey}')">📋 Copy Key</button>
            <button class="lm-btn-dl" id="lmDlBtn" onclick="downloadLicenseKey('${paymentData.licenseKey}', '${paymentData.paymentId}')">💾 Download</button>
          </div>
        </div>

        <!-- Payment info + email side by side -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="lm-info">
            <div class="lm-info-row">
              <span class="lm-info-label">Payment ID</span>
            </div>
            <div class="lm-info-val" style="word-break:break-all;">${paymentData.paymentId}</div>
            <div style="margin-top:6px" class="lm-info-row">
              <span class="lm-info-label">Order ID</span>
            </div>
            <div class="lm-info-val" style="word-break:break-all;">${paymentData.orderId}</div>
          </div>
          <div class="lm-email-notice">
            <span style="font-size:16px;line-height:1">📧</span>
            <span>License key sent to your email. Check inbox &amp; spam.</span>
          </div>
        </div>

        <!-- How to activate -->
        <div class="lm-steps">
          <div class="lm-steps-title">📝 How to Activate</div>
          <ol>
            <li>Open Adobe After Effects</li>
            <li>Window → Extensions → Auto Captions Generator Pro</li>
            <li>Click <strong>"Activate License"</strong> &amp; paste your key</li>
          </ol>
        </div>

        <!-- CTA -->
        <button class="lm-cta" onclick="proceedToDownload()">
          ⬇️ Continue to Download →
        </button>

        <div class="lm-footer">Need help? Contact support with your Payment ID</div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// ================================================
// COPY LICENSE KEY
// ================================================
function copyLicenseKey(licenseKey) {
  // Try modern clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(licenseKey).then(() => {
      showCopyFeedback('Copied to clipboard! ✓');
    }).catch(() => {
      fallbackCopy(licenseKey);
    });
  } else {
    fallbackCopy(licenseKey);
  }
}

function fallbackCopy(licenseKey) {
  const input = document.getElementById('licenseKeyDisplay');
  input.select();
  input.setSelectionRange(0, 99999); // For mobile
  
  try {
    document.execCommand('copy');
    showCopyFeedback('Copied to clipboard! ✓');
  } catch (err) {
    showCopyFeedback('Please manually copy the key');
  }
}

function showCopyFeedback(message) {
  const button = document.getElementById('lmCopyBtn');
  if (!button) return;
  const originalText = button.textContent;
  button.textContent = message;
  button.style.background = '#00D88A';
  button.style.color = 'white';
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = 'white';
    button.style.color = '#667eea';
  }, 2000);
}

// ================================================
// DOWNLOAD LICENSE KEY
// ================================================
function downloadLicenseKey(licenseKey, paymentId) {
  const content = `
╔══════════════════════════════════════════════╗
║     AUTO CAPTIONS GENERATOR PRO - LICENSE KEY          ║
╚══════════════════════════════════════════════╝

LICENSE KEY:
${licenseKey}

PAYMENT DETAILS:
Payment ID: ${paymentId}
Date: ${new Date().toLocaleString()}

ACTIVATION INSTRUCTIONS:
1. Open Adobe After Effects
2. Go to Window → Extensions → Auto Captions Generator Pro
3. Click "Activate License"
4. Paste your license key and click "Activate"

IMPORTANT NOTES:
• Keep this license key safe
• This is a lifetime license with free updates
• For support, contact us with your Payment ID
• Visit: https://mukeshfx.com for documentation

Thank you for choosing Auto Captions Generator Pro! 🎉
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AutoCaptionsGenerator-Pro-License-${paymentId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  // Visual feedback
  const button = document.getElementById('lmDlBtn');
  if (button) {
    const originalText = button.textContent;
    button.textContent = '✓ Downloaded';
    button.style.background = '#00D88A';
    button.style.borderColor = '#00D88A';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = 'rgba(255,255,255,0.18)';
      button.style.borderColor = 'rgba(255,255,255,0.6)';
    }, 2000);
  }
}

// ================================================
// PROCEED TO DOWNLOAD
// ================================================
function proceedToDownload() {
  const settings = getAdminSettings();
  const url = (settings.downloadUrl && settings.downloadUrl.trim()) || RAZORPAY_CONFIG.successUrl;
  window.location.href = url;
}

// ================================================
// BUTTON CLICK HANDLERS
// ================================================
function handleGetProClick() {
  console.log('🎯 Get Pro button clicked');
  console.log('📍 User location:', userCountry);
  console.log('🇮🇳 Is Indian user:', isIndianUser);
  
  if (isIndianUser) {
    console.log('💳 Opening Razorpay payment (₹999)');
    initiateRazorpayPayment();
  } else {
    console.log('🌍 Redirecting to Gumroad ($49)');
    // Redirect to Gumroad for international users
    window.open('https://mukeshfx.gumroad.com/l/Autocaptionspro', '_blank');
  }
}

// ================================================
// INITIALIZE ON PAGE LOAD
// ================================================
document.addEventListener('DOMContentLoaded', function() {
  // Detect user location
  detectUserLocation();
  
  // Attach click handlers to all "Get Pro" buttons
  const getProButtons = [
    document.getElementById('getProBtn'),
    document.getElementById('upgradeProBtn'),
    document.getElementById('finalCtaBtn')
  ];
  
  getProButtons.forEach(button => {
    if (button) {
      button.addEventListener('click', handleGetProClick);
    }
  });
  
  console.log('💳 Payment system initialized');
  console.log('🔧 Razorpay Key:', RAZORPAY_CONFIG.keyId);
  console.log('💰 Amount:', RAZORPAY_CONFIG.amount, 'paise (₹' + (RAZORPAY_CONFIG.amount/100) + ')');
});

// ================================================
// MODAL STYLES (injected dynamically)
// ================================================
const style = document.createElement('style');
style.textContent = `
  .payment-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 20px;
    backdrop-filter: blur(5px);
  }

  .payment-modal {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transform: translateY(30px) scale(0.9);
    transition: transform 0.3s ease;
    max-height: 90vh;
    overflow-y: auto;
  }

  .payment-modal-icon.success {
    text-align: center;
    animation: successPulse 0.6s ease;
  }

  @keyframes successPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 768px) {
    .payment-modal {
      padding: 30px 20px;
      max-height: 95vh;
    }
  }
`;
document.head.appendChild(style);
