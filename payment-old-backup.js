// ================================================
// RAZORPAY PAYMENT INTEGRATION
// Auto-detects user location and shows appropriate payment method
// ================================================

const RAZORPAY_CONFIG = {
  keyId: 'rzp_live_SDwg3Ie2duu2Z3',
  amount: 100, // Amount in paise (₹1 = 100 paise)
  currency: 'INR',
  name: 'Auto Captions Pro',
  description: 'Lifetime Pro License',
  image: '../client/assets/logo.png',
  successUrl: 'https://www.instagram.com/mukeshfx',
  webhookUrl: 'https://limit-henna.vercel.app/api/razorpay/webhook',
  createOrderUrl: 'https://limit-henna.vercel.app/api/razorpay/create-order',
  licenseApiUrl: 'https://limit-henna.vercel.app/api/razorpay/generate-license'
};

const GUMROAD_URL = 'https://mukeshfx.gumroad.com/l/Autocaptionspro';
let userCountry = null;
let isIndianUser = false;
let userEmail = '';
let userContact = '';

// ================================================
// LICENSE KEY GENERATION (Client-side fallback)
// ================================================
function generateLicenseKey() {
  // Format: ACPRO-XXXXX-XXXXX-XXXXX-XXXXX
  const segments = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
  
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 5; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  
  return 'ACPRO-' + segments.join('-');
}

// ================================================
// DETECT USER LOCATION
// ================================================
async function detectUserLocation() {
  try {
    // Try multiple geolocation services for reliability
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    userCountry = data.country_code;
    isIndianUser = (userCountry === 'IN');
    
    console.log('Detected country:', userCountry, '| Is Indian user:', isIndianUser);
    updatePaymentUI();
  } catch (error) {
    console.warn('Geolocation failed, falling back to Gumroad:', error);
    // Fallback: Show both options or default to Gumroad
    isIndianUser = false;
    updatePaymentUI();
  }
}

// ================================================
// UPDATE UI BASED ON LOCATION
// ================================================
function updatePaymentUI() {
  const regionInfo = document.getElementById('paymentRegionInfo');
  
  if (isIndianUser) {
    if (regionInfo) {
      regionInfo.innerHTML = '🇮🇳 Indian users: Special INR pricing available!';
      regionInfo.style.color = '#00D88A';
      regionInfo.style.fontWeight = '600';
    }
  } else {
    if (regionInfo) {
      regionInfo.innerHTML = '🌍 International payment via Gumroad';
      regionInfo.style.opacity = '0.7';
    }
  }
}

// ================================================
// RAZORPAY PAYMENT HANDLER
// ================================================
function initiateRazorpayPayment() {
  // Create order options
  const options = {
    key: RAZORPAY_CONFIG.keyId,
    amount: RAZORPAY_CONFIG.amount,
    currency: RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.name,
    description: RAZORPAY_CONFIG.description,
    image: RAZORPAY_CONFIG.image,
    
    // Handler for successful payment
    handler: function(response) {
      handlePaymentSuccess(response);
    },
    
    // Prefill customer details (optional)
    prefill: {
      name: '',
      email: '',
      contact: ''
    },
    
    // Theme customization
    theme: {
      color: '#667eea'
    },
    
    // Modal settings
    modal: {
      ondismiss: function() {
        console.log('Payment modal closed');
      },
      escape: true,
      backdropclose: true,
      // Capture customer data before payment
      confirm_close: false
    },
    
    // Retry settings
    retry: {
      enabled: true,
      max_count: 3
    },
    
    // Capture customer data
    callback_url: null,
    redirect: false
  };

  // Create Razorpay instance and open checkout
  const rzp = new Razorpay(options);
  
  // Handle payment failure
  rzp.on('payment.failed', function(response) {
    handlePaymentFailure(response);
  });
  
  // Open Razorpay checkout modal
  rzp.open();
}

// ================================================
// PAYMENT SUCCESS HANDLER
// ================================================
async function handlePaymentSuccess(response) {
  console.log('Payment successful:', response);
  
  // Generate license key
  const licenseKey = generateLicenseKey();
  
  // Get payment details from Razorpay
  let customerEmail = '';
  let customerContact = '';
  
  try {
    // Try to get customer details from Razorpay response
    // Note: In production, you should fetch this from your backend
    customerEmail = userEmail || '';
    customerContact = userContact || '';
  } catch (error) {
    console.warn('Could not extract customer details:', error);
  }
  
  // Send payment details and license to webhook
  try {
    const webhookData = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      event: 'payment.captured',
      license_key: licenseKey,
      customer_email: customerEmail,
      customer_contact: customerContact,
      amount: RAZORPAY_CONFIG.amount,
      currency: RAZORPAY_CONFIG.currency,
      product: 'Auto Captions Pro - Lifetime License',
      timestamp: new Date().toISOString()
    };
    
    console.log('Sending to webhook:', webhookData);
    
    await fetch(RAZORPAY_CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });
    
    console.log('Webhook notification sent successfully');
  } catch (error) {
    console.warn('Webhook notification failed:', error);
  }
  
  // Store license key in localStorage as backup
  localStorage.setItem('ac_pro_license_' + response.razorpay_payment_id, licenseKey);
  
  // Show success modal with license key
  showPaymentSuccessModal({
    paymentId: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,
    signature: response.razorpay_signature,
    licenseKey: licenseKey,
    customerEmail: customerEmail
  });
}

// ================================================
// PAYMENT FAILURE HANDLER
// ================================================
function handlePaymentFailure(response) {
  console.error('Payment failed:', response);
  
  const errorMessage = response.error ? 
    `${response.error.description || 'Payment failed'}` : 
    'Payment was unsuccessful. Please try again.';
  
  showPaymentFailureModal(errorMessage);
}

// ================================================
// PAYMENT SUCCESS MODAL
// ================================================
function showPaymentSuccessModal(paymentData) {
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
                 style="width: 100%; border: none; background: transparent; text-align: center; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #667eea; outline: none; cursor: text;">
        </div>
        <button onclick="copyLicenseKey('${paymentData.licenseKey}')" 
                style="background: white; color: #667eea; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; transition: all 0.3s ease;">
          📋 Copy License Key
        </button>
      </div>
      
      <!-- Instructions -->
      <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left; border-left: 4px solid #667eea;">
        <p style="font-size: 14px; color: #333; margin: 5px 0;"><strong>📝 Next Steps:</strong></p>
        <ol style="font-size: 13px; color: #555; margin: 10px 0 5px 20px; padding-left: 10px; line-height: 1.8;">
          <li>Copy your license key above</li>
          <li>Download Auto Captions Pro extension</li>
          <li>Open After Effects and activate using this key</li>
          <li>Enjoy unlimited pro features! 🚀</li>
        </ol>
      </div>
      
      <!-- Payment Details -->
      <details style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left; cursor: pointer;">
        <summary style="font-size: 14px; font-weight: 600; color: #666; cursor: pointer;">Payment Details</summary>
        <div style="margin-top: 10px; font-size: 13px; color: #888; line-height: 1.8;">
          <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${paymentData.paymentId}</p>
          ${paymentData.customerEmail ? `<p style="margin: 5px 0;"><strong>Email:</strong> ${paymentData.customerEmail}</p>` : ''}
        </div>
      </details>
      
      <!-- Action Buttons -->
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button onclick="downloadLicenseKey('${paymentData.licenseKey}', '${paymentData.paymentId}')" 
                class="btn-secondary" 
                style="flex: 1; padding: 12px; border: 2px solid #667eea; background: white; color: #667eea; border-radius: 8px; font-weight: 600; cursor: pointer;">
          💾 Save as File
        </button>
        <button onclick="proceedToDownload()" 
                class="btn-primary" 
                style="flex: 1; padding: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
          Continue →
        </button>
      </div>
      
      <p style="font-size: 12px; color: #888; margin-top: 15px;">
        💌 License key has been sent to your email (if provided)
      </p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add animation
  setTimeout(() => modal.classList.add('show'), 10);
  
  // Prevent closing by clicking outside or ESC (force user to copy license)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      e.preventDefault();
      // Flash the license key section to draw attention
      const licenseSection = modal.querySelector('[style*="linear-gradient"]');
      if (licenseSection) {
        licenseSection.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
          licenseSection.style.animation = '';
        }, 500);
      }
    }
  });
}

// Copy license key function
window.copyLicenseKey = function(licenseKey) {
  const input = document.getElementById('licenseKeyDisplay');
  if (input) {
    input.select();
    input.setSelectionRange(0, 99999); // For mobile
  }
  
  navigator.clipboard.writeText(licenseKey).then(() => {
    // Show success feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Copied!';
    btn.style.background = '#00D88A';
    btn.style.color = 'white';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = 'white';
      btn.style.color = '#667eea';
    }, 2000);
  }).catch(err => {
    alert('Failed to copy. Please select and copy manually: ' + licenseKey);
  });
};

// Download license key as text file
window.downloadLicenseKey = function(licenseKey, paymentId) {
  const content = `
AUTO CAPTIONS PRO - LICENSE KEY
================================

License Key: ${licenseKey}
Payment ID: ${paymentId}
Date: ${new Date().toLocaleString()}
Product: Auto Captions Pro - Lifetime License

ACTIVATION INSTRUCTIONS:
1. Download and install Auto Captions Pro extension
2. Open Adobe After Effects
3. Go to Window > Extensions > Auto Captions Pro
4. Click "Activate License"
5. Paste the license key above
6. Enjoy unlimited pro features!

Support: https://www.instagram.com/mukeshfx
Documentation: https://autocaptionspro.com

================================
Keep this file safe for future reference.
`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AutoCaptionsPro-License-${paymentId.substring(0, 8)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  // Show feedback
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '✓ Downloaded!';
  setTimeout(() => {
    btn.innerHTML = originalText;
  }, 2000);
};

// Proceed to Instagram
window.proceedToDownload = function() {
  const modal = document.getElementById('licenseModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
      window.location.href = RAZORPAY_CONFIG.successUrl;
    }, 300);
  }
};

// ================================================
// PAYMENT FAILURE MODAL
// ================================================
function showPaymentFailureModal(errorMessage) {
  const modal = document.createElement('div');
  modal.className = 'payment-modal-overlay';
  modal.innerHTML = `
    <div class="payment-modal">
      <div class="payment-modal-icon failure">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M15 9l-6 6M9 9l6 6"/>
        </svg>
      </div>
      <h2 style="color: #0A0A1A; margin: 20px 0 10px;">Payment Failed</h2>
      <p style="color: #666; margin-bottom: 20px;">${errorMessage}</p>
      <button class="btn-large btn-primary-large" onclick="this.closest('.payment-modal-overlay').remove()">
        Try Again
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  }, 5000);
}

// ================================================
// GUMROAD PAYMENT HANDLER
// ================================================
function initiateGumroadPayment() {
  window.open(GUMROAD_URL, '_blank', 'noopener,noreferrer');
}

// ================================================
// UNIFIED PAYMENT BUTTON HANDLER
// ================================================
function handleGetProClick(event) {
  event.preventDefault();
  
  if (isIndianUser) {
    // Indian user: Show Razorpay
    initiateRazorpayPayment();
  } else {
    // International user: Redirect to Gumroad
    initiateGumroadPayment();
  }
}

// ================================================
// INITIALIZE PAYMENT HANDLERS
// ================================================
function initializePaymentHandlers() {
  // Get all "Get Pro" buttons
  const buttons = [
    document.getElementById('getProBtn'),
    document.getElementById('upgradeProBtn'),
    document.getElementById('finalCtaBtn')
  ];
  
  buttons.forEach(button => {
    if (button) {
      button.addEventListener('click', handleGetProClick);
    }
  });
  
  console.log('Payment handlers initialized');
}

// ================================================
// INITIALIZE ON PAGE LOAD
// ================================================
document.addEventListener('DOMContentLoaded', function() {
  // Detect user location first
  detectUserLocation();
  
  // Initialize payment button handlers
  initializePaymentHandlers();
});

// ================================================
// CSS STYLES FOR PAYMENT MODALS
// ================================================
const paymentStyles = document.createElement('style');
paymentStyles.textContent = `
  .payment-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    overflow-y: auto;
    padding: 20px;
  }
  
  .payment-modal-overlay.show {
    opacity: 1;
  }
  
  .payment-modal {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 550px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    transition: transform 0.3s ease;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .payment-modal.license-modal {
    max-width: 600px;
  }
  
  .payment-modal-overlay.show .payment-modal {
    transform: scale(1);
  }
  
  .payment-modal-icon {
    margin: 0 auto 20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: scaleIn 0.5s ease-out;
  }
  
  .payment-modal-icon.success {
    background: rgba(0, 216, 138, 0.1);
  }
  
  .payment-modal-icon.failure {
    background: rgba(255, 107, 107, 0.1);
  }
  
  .payment-modal h2 {
    font-size: 28px;
    font-weight: 800;
  }
  
  .payment-modal p {
    font-size: 16px;
    line-height: 1.6;
  }
  
  /* License Key Input Styling */
  #licenseKeyDisplay {
    user-select: all;
    -webkit-user-select: all;
    -moz-user-select: all;
  }
  
  #licenseKeyDisplay:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
  
  /* Button Hover Effects */
  .payment-modal button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 94, 234, 0.3);
    transition: all 0.3s ease;
  }
  
  .payment-modal button:active {
    transform: translateY(0);
  }
  
  /* Pulse Animation for License Section */
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @keyframes scaleIn {
    0% { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  /* Details/Summary Styling */
  details summary {
    transition: color 0.3s ease;
  }
  
  details[open] summary {
    color: #667eea;
  }
  
  details summary:hover {
    color: #667eea;
  }
  
  /* Scrollbar Styling for Modal */
  .payment-modal::-webkit-scrollbar {
    width: 8px;
  }
  
  .payment-modal::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .payment-modal::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
  }
  
  .payment-modal::-webkit-scrollbar-thumb:hover {
    background: #5a4bd1;
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .payment-modal {
      padding: 30px 20px;
      max-height: 85vh;
    }
    
    .payment-modal h2 {
      font-size: 24px;
    }
    
    .payment-modal-overlay {
      padding: 10px;
    }
    
    #licenseKeyDisplay {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .payment-modal {
      padding: 25px 15px;
    }
    
    #licenseKeyDisplay {
      font-size: 12px;
    }
  }
`;
document.head.appendChild(paymentStyles);
