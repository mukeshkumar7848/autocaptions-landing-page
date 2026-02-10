// ================================================
// AUTO CAPTIONS PRO - PAYMENT SYSTEM
// Razorpay Integration with Order Creation & Email
// ================================================

// ================================================
// CONFIGURATION
// ================================================
const RAZORPAY_CONFIG = {
  keyId: null, // Will be fetched from server
  amount: 999000, // Amount in paise (₹1 = 100 paise for testing)
  currency: 'INR',
  name: 'Auto Captions Pro',
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
  const regionInfo = document.getElementById('paymentRegionInfo');
  
  if (!regionInfo) return;
  
  if (isIndianUser) {
    regionInfo.innerHTML = `
      <span style="color: #00D88A; font-weight: 600;">
        🇮🇳 Indian users: Pay ₹999 via Razorpay
      </span>
      <br>
      <span style="opacity: 0.7; font-size: 12px;">
        Not in India? <a href="#" onclick="event.preventDefault(); window.switchToGumroad();" style="color: #667eea; text-decoration: underline; cursor: pointer;">Switch to International Payment ($49)</a>
      </span>
    `;
  } else {
    regionInfo.innerHTML = `
      <span style="color: #667eea; font-weight: 600;">
        🌍 International users: Pay $49 via Gumroad
      </span>
      <br>
      <span style="opacity: 0.7; font-size: 12px;">
        From India? <a href="#" onclick="event.preventDefault(); window.switchToRazorpay();" style="color: #00D88A; text-decoration: underline; cursor: pointer;">Switch to INR Payment (₹999)</a>
      </span>
    `;
  }
}

// ================================================
// MANUAL PAYMENT METHOD SWITCHES
// ================================================
window.switchToRazorpay = function() {
  if (confirm('Switch to Razorpay payment (₹999 for Indian users)?')) {
    isIndianUser = true;
    userCountry = 'IN';
    console.log('💱 Switched to Razorpay (India)');
    updatePaymentUI();
  }
};

window.switchToGumroad = function() {
  if (confirm('Switch to Gumroad payment ($49 for international users)?')) {
    isIndianUser = false;
    userCountry = 'INTL';
    console.log('💱 Switched to Gumroad (International)');
    updatePaymentUI();
  }
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
        amount: RAZORPAY_CONFIG.amount,
        currency: RAZORPAY_CONFIG.currency,
        receipt: `receipt_${Date.now()}`,
        email: userEmail, // Send email so server can include it in order notes
        notes: {
          product: 'Auto Captions Pro',
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
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.className = 'payment-modal-overlay';
  modal.id = 'licenseModal';
  modal.innerHTML = `
    <div class="payment-modal license-modal">
      <div class="payment-modal-icon success">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00D88A" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12l3 3 5-5"/>
        </svg>
      </div>
      <h2 style="color: #0A0A1A; margin: 20px 0 10px;">Payment Successful! 🎉</h2>
      <p style="color: #666; margin-bottom: 20px;">Thank you for upgrading to Auto Captions Pro!</p>
      
      <!-- License Key Section -->
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p style="color: white; font-size: 14px; margin-bottom: 10px; font-weight: 600;">🔑 Your License Key</p>
        <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <input type="text" id="licenseKeyDisplay" value="${paymentData.licenseKey}" 
                 readonly 
                 style="width: 100%; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; text-align: center; background: transparent; border: none; color: #667eea; letter-spacing: 1px;" 
                 onclick="this.select()">
        </div>
        <div style="display: flex; gap: 10px;">
          <button onclick="copyLicenseKey('${paymentData.licenseKey}')" 
                  style="flex: 1; background: white; color: #667eea; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
            📋 Copy Key
          </button>
          <button onclick="downloadLicenseKey('${paymentData.licenseKey}', '${paymentData.paymentId}')" 
                  style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 2px solid white; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
            💾 Download
          </button>
        </div>
      </div>

      <!-- Email Notification -->
      <div style="background: #FFF3CD; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFC107;">
        <p style="color: #856404; font-size: 14px; margin: 0;">
          📧 A copy has been sent to your email address.<br>
          <small style="opacity: 0.8;">Check your inbox (and spam folder) for license details.</small>
        </p>
      </div>
      
      <!-- Payment Details -->
      <div style="background: #F8F9FA; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Payment ID:</span>
          <span style="color: #0A0A1A; font-family: monospace; font-size: 12px;">${paymentData.paymentId}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #666;">Order ID:</span>
          <span style="color: #0A0A1A; font-family: monospace; font-size: 12px;">${paymentData.orderId}</span>
        </div>
      </div>

      <!-- Instructions -->
      <div style="background: #E8F4FD; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
        <p style="color: #0D47A1; font-size: 14px; font-weight: 600; margin-bottom: 8px;">📝 How to Activate:</p>
        <ol style="color: #1565C0; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Open Adobe After Effects</li>
          <li>Go to Window → Extensions → Auto Captions Pro</li>
          <li>Click "Activate License"</li>
          <li>Paste your license key and click "Activate"</li>
        </ol>
      </div>
      
      <button onclick="proceedToDownload()" class="btn-primary" style="width: 100%; margin-top: 10px;">
        Continue to Download →
      </button>
      
      <p style="margin-top: 15px; font-size: 12px; color: #999; text-align: center;">
        Need help? Contact support with your Payment ID
      </p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Animate in
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.querySelector('.payment-modal').style.transform = 'translateY(0) scale(1)';
  }, 10);
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
  const button = event.target;
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
║     AUTO CAPTIONS PRO - LICENSE KEY          ║
╚══════════════════════════════════════════════╝

LICENSE KEY:
${licenseKey}

PAYMENT DETAILS:
Payment ID: ${paymentId}
Date: ${new Date().toLocaleString()}

ACTIVATION INSTRUCTIONS:
1. Open Adobe After Effects
2. Go to Window → Extensions → Auto Captions Pro
3. Click "Activate License"
4. Paste your license key and click "Activate"

IMPORTANT NOTES:
• Keep this license key safe
• This is a lifetime license with free updates
• For support, contact us with your Payment ID
• Visit: https://mukeshfx.com for documentation

Thank you for choosing Auto Captions Pro! 🎉
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AutoCaptions-Pro-License-${paymentId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  // Visual feedback
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = '✓ Downloaded';
  button.style.background = '#00D88A';
  button.style.borderColor = '#00D88A';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = 'rgba(255,255,255,0.2)';
    button.style.borderColor = 'white';
  }, 2000);
}

// ================================================
// PROCEED TO DOWNLOAD
// ================================================
function proceedToDownload() {
  window.location.href = RAZORPAY_CONFIG.successUrl;
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
