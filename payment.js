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
  webhookUrl: 'https://limit-henna.vercel.app/api/razorpay/webhook'
};

const GUMROAD_URL = 'https://mukeshfx.gumroad.com/l/Autocaptionspro';
let userCountry = null;
let isIndianUser = false;

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
      backdropclose: true
    },
    
    // Retry settings
    retry: {
      enabled: true,
      max_count: 3
    }
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
  
  // Show success message
  showPaymentSuccessModal({
    paymentId: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,
    signature: response.razorpay_signature
  });
  
  // Send payment details to webhook
  try {
    await fetch(RAZORPAY_CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        event: 'payment.captured'
      })
    });
  } catch (error) {
    console.warn('Webhook notification failed:', error);
  }
  
  // Redirect to success page after 3 seconds
  setTimeout(() => {
    window.location.href = RAZORPAY_CONFIG.successUrl;
  }, 3000);
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
  modal.innerHTML = `
    <div class="payment-modal">
      <div class="payment-modal-icon success">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00D88A" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12l3 3 5-5"/>
        </svg>
      </div>
      <h2 style="color: #0A0A1A; margin: 20px 0 10px;">Payment Successful! 🎉</h2>
      <p style="color: #666; margin-bottom: 20px;">Thank you for upgrading to Auto Captions Pro!</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left;">
        <p style="margin: 5px 0; font-size: 14px;"><strong>Payment ID:</strong> ${paymentData.paymentId}</p>
      </div>
      <p style="font-size: 14px; color: #888;">Redirecting you shortly...</p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add animation
  setTimeout(() => modal.classList.add('show'), 10);
}

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
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .payment-modal-overlay.show {
    opacity: 1;
  }
  
  .payment-modal {
    background: white;
    border-radius: 16px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    transition: transform 0.3s ease;
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
  
  @media (max-width: 768px) {
    .payment-modal {
      padding: 30px 20px;
    }
    
    .payment-modal h2 {
      font-size: 24px;
    }
  }
`;
document.head.appendChild(paymentStyles);
