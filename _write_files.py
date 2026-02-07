#!/usr/bin/env python3
"""Write clean webpage files - run once and delete."""
import os

BASE = "/Users/mukesh/Coding Stuffs/Development/Autocaption New Version/webpage"

# ===================== INDEX.HTML =====================
html = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Auto Captions Pro &mdash; Auto Captions for After Effects</title>
  <meta name="description" content="Create animated captions directly inside After Effects. No plugins. No cloud. No limits." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- NAVBAR -->
  <nav class="navbar" id="navbar">
    <div class="container nav-container">
      <a href="#" class="nav-logo">
        <img src="../client/assets/logo.png" alt="Auto Captions Pro" class="nav-logo-img" />
        <span class="nav-logo-text">Auto Captions PRO</span>
      </a>
      <ul class="nav-links" id="navLinks">
        <li><a href="#features">Features</a></li>
        <li><a href="#workflow">Workflow</a></li>
        <li><a href="#demo">Demo</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
      <a href="#pricing" class="btn btn-primary btn-sm nav-cta">Buy Now</a>
      <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero" id="hero">
    <div class="hero-bg-glow"></div>
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="hero-badge">After Effects Extension</div>
        <h1 class="hero-title">Auto Captions for<br/>After Effects &mdash;<br/><span class="gradient-text">Fast, Accurate, Fully Offline</span></h1>
        <p class="hero-subtitle">Create animated captions directly inside After Effects.<br/>No plugins. No cloud. No limits.</p>
        <div class="hero-ctas">
          <a href="#pricing" class="btn btn-primary btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Buy &amp; Download
          </a>
          <a href="#demo" class="btn btn-outline btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Watch Demo
          </a>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-num">100%</span><span class="stat-label">Offline</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">One-Time</span><span class="stat-label">Purchase</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">Mac &amp; Win</span><span class="stat-label">Compatible</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="screenshot-window">
          <div class="window-bar">
            <div class="window-dots"><span></span><span></span><span></span></div>
            <span class="window-title">Auto Captions Pro</span>
          </div>
          <div class="screenshot-body">
            <div class="mock-card">
              <div class="mock-title">Caption Settings</div>
              <div class="mock-row"><span class="mock-label">Count By</span><span class="mock-value">Characters</span></div>
              <div class="mock-row"><span class="mock-label">Max Characters</span><span class="mock-value">32</span></div>
              <div class="mock-row"><span class="mock-label">Line Mode</span><span class="mock-value">Smart (Auto-break)</span></div>
            </div>
            <div class="mock-card">
              <div class="mock-title">AI Settings</div>
              <div class="mock-row"><span class="mock-label">Language</span><span class="mock-value">Auto-detect</span></div>
              <div class="mock-row"><span class="mock-label">Model Size</span><span class="mock-value">Small (Fast) &#9889;</span></div>
              <div class="mock-row"><span class="mock-label">Position</span><span class="mock-value">Center</span></div>
            </div>
            <div class="mock-card">
              <div class="mock-title">Options</div>
              <div class="mock-checks">
                <label><span class="ck"></span> Batch Mode <em class="pro-sm">Pro</em></label>
                <label><span class="ck on"></span> Single Layer</label>
                <label><span class="ck"></span> Translate to EN</label>
                <label><span class="ck on"></span> Background Box</label>
              </div>
            </div>
            <div class="mock-card">
              <div class="mock-title">Animations</div>
              <div class="mock-anim-grid">
                <span class="atile active">Fade</span>
                <span class="atile">Bounce</span>
                <span class="atile">Blur</span>
                <span class="atile">Slide</span>
                <span class="atile">Char</span>
                <span class="atile">Blink</span>
              </div>
            </div>
            <div class="mock-gen-btn">Generate Captions</div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-scroll">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
      <span>Scroll to explore</span>
    </div>
  </section>

  <!-- TRUST STRIP -->
  <section class="trust-strip">
    <div class="container">
      <div class="trust-row">
        <div class="trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          After Effects 2022+
        </div>
        <div class="trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          macOS &amp; Windows
        </div>
        <div class="trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          100% Offline Processing
        </div>
        <div class="trust-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Pay Once. Use Forever.
        </div>
      </div>
    </div>
  </section>

  <!-- WHAT IS -->
  <section class="section" id="what-is">
    <div class="container">
      <div class="section-label">About</div>
      <h2 class="section-title">What Is Auto Captions?</h2>
      <p class="section-desc">Auto Captions is an After Effects extension for editors who want fast, professional subtitles without leaving AE. Powered by local speech-to-text AI, it generates perfectly timed captions with beautiful animations &mdash; all on your machine.</p>
      <div class="highlights-grid">
        <div class="highlight-card">
          <div class="highlight-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </div>
          <div><strong>No external apps</strong><p>Everything runs inside After Effects</p></div>
        </div>
        <div class="highlight-card">
          <div class="highlight-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div><strong>No subscriptions</strong><p>One-time purchase, lifetime access</p></div>
        </div>
        <div class="highlight-card">
          <div class="highlight-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div><strong>Built for real workflows</strong><p>Designed by editors, for editors</p></div>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="section alt" id="features">
    <div class="container">
      <div class="section-label">Capabilities</div>
      <h2 class="section-title">Core Features</h2>
      <p class="section-subtitle">Everything you need to create professional captions, built right into After Effects.</p>
      <div class="features-grid">
        <div class="fcard"><div class="fcard-icon">&#127919;</div><h3>Automatic Speech-to-Text</h3><p>Offline AI transcription with Small (Fast) and Medium (Accurate) models. No internet needed, ever.</p></div>
        <div class="fcard"><div class="fcard-icon">&#127916;</div><h3>6 Animation Presets</h3><p>Fade, Bounce, Blur Fade Up, Slide, Character Fade, and Blink &mdash; with directional control for each.</p></div>
        <div class="fcard"><div class="fcard-icon">&#127758;</div><h3>20+ Languages</h3><p>English, Hinglish, Spanish, French, Japanese, Korean, Arabic, Hindi, and many more with auto-detect.</p></div>
        <div class="fcard"><div class="fcard-icon">&#9999;&#65039;</div><h3>Full Caption Control</h3><p>Max characters/words, duration, gap threshold, line mode (Smart, Single, Double), position &amp; font size.</p></div>
        <div class="fcard"><div class="fcard-icon">&#128230;</div><h3>Background Box</h3><p>Add rounded background behind captions with full color, opacity, roundness, and padding control.</p></div>
        <div class="fcard"><div class="fcard-icon">&#9889;</div><h3>Batch Mode <span class="pro-tag">Pro</span></h3><p>Process all video layers at once. Single Layer mode puts all captions on one text layer.</p></div>
        <div class="fcard"><div class="fcard-icon">&#128260;</div><h3>Translate to English</h3><p>Transcribe any language and automatically translate captions to English in one step.</p></div>
        <div class="fcard"><div class="fcard-icon">&#128194;</div><h3>SRT Export &amp; History</h3><p>Auto-export SRT files, view past transcriptions, re-import, edit, and copy captions anytime.</p></div>
        <div class="fcard"><div class="fcard-icon">&#128257;</div><h3>Fully Editable in AE</h3><p>Captions are native AE text layers. Edit text, timing, and styles like any other layer.</p></div>
        <div class="fcard"><div class="fcard-icon">&#129529;</div><h3>Smart Cleanup</h3><p>Fill silence gaps automatically and clean up temp files after processing. Set it and forget it.</p></div>
        <div class="fcard"><div class="fcard-icon">&#128207;</div><h3>Smart Line Breaking</h3><p>Count by characters or words. Smart auto-break, single line, or double line modes.</p></div>
        <div class="fcard"><div class="fcard-icon">&#128421;&#65039;</div><h3>Native AE Panel</h3><p>Clean, compact panel designed for After Effects. Full control without leaving AE.</p></div>
      </div>
    </div>
  </section>

  <!-- WORKFLOW -->
  <section class="section" id="workflow">
    <div class="container">
      <div class="section-label">How It Works</div>
      <h2 class="section-title">Built for Editors</h2>
      <p class="section-subtitle">From import to final edit in four simple steps.</p>
      <div class="steps-row">
        <div class="step-card"><div class="step-num">01</div><h3>Import Your Video</h3><p>Drop your video into After Effects and create a composition as usual.</p></div>
        <div class="step-arrow">&rarr;</div>
        <div class="step-card"><div class="step-num">02</div><h3>Configure &amp; Generate</h3><p>Set language, model size, caption settings, and click Generate Captions.</p></div>
        <div class="step-arrow">&rarr;</div>
        <div class="step-card"><div class="step-num">03</div><h3>Choose Animation</h3><p>Pick from 6 animation presets with directional controls. Add background boxes.</p></div>
        <div class="step-arrow">&rarr;</div>
        <div class="step-card"><div class="step-num">04</div><h3>Edit Like Normal</h3><p>Captions are native text layers. Tweak timing, text, and styles like any other layer.</p></div>
      </div>
    </div>
  </section>

  <!-- DEMO -->
  <section class="section alt" id="demo">
    <div class="container">
      <div class="section-label">See It In Action</div>
      <h2 class="section-title">Watch How It Works</h2>
      <p class="section-subtitle">From audio to animated subtitles in seconds.</p>
      <div class="video-wrap">
        <div class="video-box" id="videoPlaceholder">
          <div class="play-btn">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <p>Click to play demo video</p>
        </div>
      </div>
    </div>
  </section>

  <!-- UI PREVIEW -->
  <section class="section" id="ui-preview">
    <div class="container">
      <div class="section-label">Interface</div>
      <h2 class="section-title">Modern, Clean UI</h2>
      <p class="section-subtitle">Clean, compact panel designed to stay out of your way.</p>
      <div class="ui-grid">
        <div class="ui-card">
          <div class="ui-card-top">
            <div class="mp"><div class="mp-head">Caption Settings</div>
              <div class="mock-row"><span class="mock-label">Count By</span><span class="mock-value">Characters</span></div>
              <div class="mock-row"><span class="mock-label">Max Characters</span><span class="mock-value">32</span></div>
              <div class="mock-row"><span class="mock-label">Max Duration</span><span class="mock-value">3.0s</span></div>
              <div class="mock-row"><span class="mock-label">Gap Threshold</span><span class="mock-value">2 fr</span></div>
              <div class="mock-row"><span class="mock-label">Line Mode</span><span class="mock-value">Smart</span></div>
            </div>
          </div>
          <h4>Caption Settings Panel</h4>
          <p>Full control over character limits, duration, gap threshold, and line breaking modes.</p>
        </div>
        <div class="ui-card">
          <div class="ui-card-top">
            <div class="mp"><div class="mp-head">Animations</div>
              <div class="tile-grid">
                <div class="mtile active"><span>&#8599;</span><span>Fade</span></div>
                <div class="mtile"><span>&#11014;</span><span>Bounce</span></div>
                <div class="mtile"><span>&#9673;</span><span>Blur</span></div>
                <div class="mtile"><span>&#8594;</span><span>Slide</span></div>
                <div class="mtile"><span>Ab</span><span>Char</span></div>
                <div class="mtile"><span>&#9680;</span><span>Blink</span></div>
              </div>
              <div class="dir-row"><span class="dir">&uarr;</span><span class="dir">&darr;</span><span class="dir">&larr;</span><span class="dir">&rarr;</span><span class="dir-t">Simple</span></div>
            </div>
          </div>
          <h4>Animation Presets</h4>
          <p>6 built-in presets with directional controls and word/character options.</p>
        </div>
        <div class="ui-card">
          <div class="ui-card-top">
            <div class="mp"><div class="mp-head">AI &amp; Options</div>
              <div class="mock-row"><span class="mock-label">Language</span><span class="mock-value">Auto-detect</span></div>
              <div class="mock-row"><span class="mock-label">Model</span><span class="mock-value">Small &#9889;</span></div>
              <div class="mock-checks-sm">
                <label><span class="ck on"></span>Batch <em class="pro-sm">Pro</em></label>
                <label><span class="ck"></span>Single Layer</label>
                <label><span class="ck"></span>Translate EN</label>
                <label><span class="ck on"></span>BG Box &#9881;</label>
              </div>
            </div>
          </div>
          <h4>AI Settings &amp; Options</h4>
          <p>Language, model size, Batch Mode, Single Layer, Translation, and Background Box.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- PRICING -->
  <section class="section alt" id="pricing">
    <div class="container">
      <div class="section-label">Pricing</div>
      <h2 class="section-title">Simple, Honest Pricing</h2>
      <p class="section-subtitle">No subscriptions. No hidden fees. Pay once, use forever.</p>
      <div class="price-card">
        <div class="price-badge">Most Popular</div>
        <h3>Auto Captions Pro</h3>
        <div class="price-amount"><span class="dollar">$</span><span class="amount">49</span><span class="period">one-time</span></div>
        <ul class="price-list">
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>One-time purchase &mdash; no subscription</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Lifetime updates included</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Works on macOS &amp; Windows</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>100% offline processing</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>6 animation presets + directional control</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Batch Mode &amp; Translate to English</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>20+ languages with auto-detect</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>SRT export &amp; caption history</li>
        </ul>
        <a href="https://mukeshfx.gumroad.com/l/Autocaptionspro" target="_blank" rel="noopener" class="btn btn-primary btn-lg btn-full">Buy on Gumroad</a>
        <div class="price-notes">ZXP file included &middot; No subscription &middot; No login required</div>
      </div>
    </div>
  </section>

  <!-- DOWNLOAD -->
  <section class="section" id="download">
    <div class="container">
      <div class="section-label">Get Started</div>
      <h2 class="section-title">Download &amp; Install</h2>
      <div class="dl-grid">
        <div class="dl-left">
          <div class="os-badge"><span id="osIcon">&#128187;</span><span id="osText">Download for Your OS</span></div>
          <a href="https://mukeshfx.gumroad.com/l/Autocaptionspro" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Now
          </a>
        </div>
        <div class="dl-right">
          <h3>Installation Steps</h3>
          <div class="inst-step"><span class="inst-n">1</span><div><strong>Download the ZXP file</strong><p>After purchase, download the extension file from Gumroad.</p></div></div>
          <div class="inst-step"><span class="inst-n">2</span><div><strong>Install via ZXP Installer</strong><p>Use <a href="https://aescripts.com/learn/zxp-installer/" target="_blank">ZXP Installer</a> (free) to install the extension.</p></div></div>
          <div class="inst-step"><span class="inst-n">3</span><div><strong>Open in After Effects</strong><p>Go to <code>Window &rarr; Extensions &rarr; Auto Captions Pro</code></p></div></div>
          <div class="inst-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Supports After Effects 2022 and later
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section alt" id="faq">
    <div class="container">
      <div class="section-label">Questions</div>
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list">
        <div class="faq-item"><button class="faq-q"><span>Is it completely offline?</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><p>Yes! Auto Captions runs 100% on your local machine. No audio is ever sent to the cloud. Your content stays private and processing works without an internet connection.</p></div></div>
        <div class="faq-item"><button class="faq-q"><span>Does it work on Windows &amp; Mac?</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><p>Yes, Auto Captions Pro works on both macOS and Windows.</p></div></div>
        <div class="faq-item"><button class="faq-q"><span>Which After Effects versions are supported?</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><p>After Effects 2022 and later (version 22.0+). We recommend using the latest version.</p></div></div>
        <div class="faq-item"><button class="faq-q"><span>Can I edit captions after generating?</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><p>Absolutely! Captions are native AE text layers. You can also view/edit past transcriptions from the History panel.</p></div></div>
        <div class="faq-item"><button class="faq-q"><span>Is this a subscription?</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><p>No! One-time purchase. Lifetime access including future updates. No recurring fees, no login required.</p></div></div>
        <div class="faq-item"><button class="faq-q"><span>Does it require internet to work?</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><p>No. Speech-to-text runs locally. Once installed, you never need internet to generate captions.</p></div></div>
        <div class="faq-item"><button class="faq-q"><span>What languages are supported?</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><p>20+ languages: English, Hinglish, Spanish, French, German, Portuguese, Italian, Japanese, Korean, Chinese, Russian, Dutch, Turkish, Polish, Ukrainian, Arabic, Hindi, Thai, Vietnamese, Indonesian &mdash; with auto-detect.</p></div></div>
      </div>
    </div>
  </section>

  <!-- ROADMAP -->
  <section class="section" id="roadmap">
    <div class="container">
      <div class="roadmap-flex">
        <div class="roadmap-left">
          <div class="section-label" style="text-align:left">What&rsquo;s Next</div>
          <h2 class="section-title" style="text-align:left">Auto Captions Is Just the Beginning</h2>
          <p>We&rsquo;re building a suite of powerful After Effects tools designed for editors. Auto Captions is the first &mdash; more are on the way.</p>
          <div class="roadmap-items">
            <div class="rm-item"><span class="rm-dot active"></span><div><strong>Auto Captions Pro</strong><span class="rm-tag released">Released</span></div></div>
            <div class="rm-item"><span class="rm-dot"></span><div><strong>More AE Editing Tools</strong><span class="rm-tag upcoming">Coming Soon</span></div></div>
            <div class="rm-item"><span class="rm-dot"></span><div><strong>Advanced AI Features</strong><span class="rm-tag upcoming">In Development</span></div></div>
          </div>
        </div>
        <div class="roadmap-right"><div class="rocket">&#128640;</div></div>
      </div>
    </div>
  </section>

  <!-- SUPPORT -->
  <section class="section alt" id="support">
    <div class="container">
      <div class="section-label">Help</div>
      <h2 class="section-title">Support &amp; Contact</h2>
      <p class="section-subtitle">Need help? We&rsquo;re here for you.</p>
      <div class="support-grid">
        <div class="sup-card">
          <div class="sup-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
          <h4>Email Support</h4><p>Reach out for questions or issues.</p>
          <a href="mailto:support@autocaptions.pro">support@autocaptions.pro</a>
        </div>
        <div class="sup-card">
          <div class="sup-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg></div>
          <h4>Gumroad Support</h4><p>Use Gumroad&rsquo;s built-in support.</p>
          <a href="https://mukeshfx.gumroad.com/l/Autocaptionspro" target="_blank">Contact on Gumroad</a>
        </div>
        <div class="sup-card">
          <div class="sup-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
          <h4>Report a Bug</h4><p>Found something wrong? Let us know.</p>
          <a href="mailto:bugs@autocaptions.pro">Report Bug</a>
        </div>
        <div class="sup-card">
          <div class="sup-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
          <h4>Feature Request</h4><p>Have an idea? We&rsquo;d love to hear it.</p>
          <a href="mailto:features@autocaptions.pro">Submit Request</a>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="#" class="nav-logo"><img src="../client/assets/logo.png" alt="Auto Captions Pro" class="nav-logo-img" /></a>
          <p>Professional auto captions for After Effects. Fast, offline, and beautifully animated.</p>
          <div class="social-row">
            <a href="https://www.youtube.com/channel/UCy7KFDmtn2ziZLxH3L_ImYQ" target="_blank" aria-label="YouTube"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/></svg></a>
            <a href="https://www.instagram.com/mukesh.fx_/" target="_blank" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a href="https://x.com/mukesh_fx" target="_blank" aria-label="X"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          </div>
        </div>
        <div class="footer-cols">
          <div class="fcol"><h5>Product</h5><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#download">Download</a><a href="#demo">Demo</a></div>
          <div class="fcol"><h5>Support</h5><a href="#faq">FAQ</a><a href="#support">Contact</a><a href="mailto:bugs@autocaptions.pro">Report Bug</a><a href="mailto:features@autocaptions.pro">Feature Request</a></div>
          <div class="fcol"><h5>Legal</h5><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="https://mukeshfx.gumroad.com/l/Autocaptionspro" target="_blank">Gumroad</a></div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span id="currentYear"></span> Auto Captions Pro. All rights reserved.</p>
        <p class="credit">Made with &#10084;&#65039; by <strong>Mukeshfx</strong></p>
        <p class="disclaimer">Not affiliated with Adobe Inc.</p>
      </div>
    </div>
  </footer>

  <button class="btt" id="backToTop" aria-label="Back to top">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
  </button>

  <script src="script.js"></script>
</body>
</html>
'''

with open(os.path.join(BASE, "index.html"), "w") as f:
    f.write(html)
print("index.html written:", len(html), "bytes")

# ===================== STYLE.CSS =====================
css = r'''/* ===================================================
   AUTO CAPTIONS PRO — Landing Page Styles
   Theme: #232323 / #2E2E2E / #3a3a3a / #0d8eff
   =================================================== */

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg-page: #1a1a1f;
  --bg-1: #232323;
  --bg-2: #2E2E2E;
  --bg-3: #3a3a3a;
  --text-1: #dcdcdc;
  --text-2: #9e9e9e;
  --text-3: #707070;
  --accent: #0d8eff;
  --accent-h: #0078d4;
  --green: #4caf50;
  --red: #f44336;
  --border: #454545;
  --border-s: rgba(255,255,255,0.04);
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 16px;
  --r-xl: 20px;
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --max-w: 1140px;
  --ease: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

html { scroll-behavior: smooth; scroll-padding-top: 80px; }

body {
  font-family: var(--font);
  background: var(--bg-page);
  color: var(--text-1);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

a { color: var(--accent); text-decoration: none; transition: color var(--ease); }
a:hover { color: var(--accent-h); }
img { max-width: 100%; display: block; }
.container { max-width: var(--max-w); margin: 0 auto; padding: 0 24px; }

/* ---- BUTTONS ---- */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font); font-weight: 600; font-size: 0.95rem;
  padding: 12px 28px; border-radius: var(--r-sm); border: none;
  cursor: pointer; transition: all var(--ease); text-decoration: none;
  white-space: nowrap;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: var(--accent-h); color: #fff; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(13,142,255,0.25); }
.btn-outline { background: transparent; color: var(--text-1); border: 1px solid var(--border); }
.btn-outline:hover { border-color: var(--accent); color: var(--accent); }
.btn-sm { padding: 8px 20px; font-size: 0.85rem; }
.btn-lg { padding: 14px 32px; font-size: 1rem; }
.btn-full { width: 100%; justify-content: center; }

.pro-tag {
  background: var(--accent); color: #fff; font-size: 0.6rem;
  padding: 2px 6px; border-radius: 3px; font-weight: 700;
  vertical-align: super; letter-spacing: 0.5px; text-transform: uppercase;
}
.pro-sm {
  background: var(--accent); color: #fff; font-size: 0.5rem;
  padding: 1px 4px; border-radius: 2px; font-weight: 700; font-style: normal;
}

/* ---- SECTIONS ---- */
.section { padding: 100px 0; }
.section.alt { background: var(--bg-1); }
.section-label {
  display: block; text-align: center;
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 2px; color: var(--accent); margin-bottom: 12px;
}
.section-title {
  text-align: center;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800; color: var(--text-1);
  margin-bottom: 16px; line-height: 1.15;
}
.section-subtitle, .section-desc {
  text-align: center; font-size: 1.05rem; color: var(--text-2);
  max-width: 620px; margin: 0 auto 48px; line-height: 1.7;
}

/* ---- NAVBAR ---- */
.navbar {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
  background: rgba(26,26,31,0.7);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-s);
  transition: all var(--ease);
}
.navbar.scrolled { background: rgba(26,26,31,0.95); border-bottom-color: var(--border); }
.nav-container { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.nav-logo-img { height: 28px; width: auto; }
.nav-logo-text { font-weight: 700; font-size: 0.95rem; color: var(--text-1); }
.nav-links { display: flex; list-style: none; gap: 32px; }
.nav-links a { font-size: 0.88rem; font-weight: 500; color: var(--text-2); }
.nav-links a:hover { color: var(--text-1); }
.mobile-menu-btn { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.mobile-menu-btn span { width: 22px; height: 2px; background: var(--text-1); border-radius: 2px; transition: all var(--ease); }

/* ---- HERO ---- */
.hero {
  min-height: 100vh; display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 100px 0 40px; position: relative; overflow: hidden;
}
.hero-bg-glow {
  position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(13,142,255,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.hero-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 60px; align-items: center;
}
.hero-badge {
  display: inline-block; font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--accent); background: rgba(13,142,255,0.1);
  padding: 6px 14px; border-radius: 30px;
  border: 1px solid rgba(13,142,255,0.2); margin-bottom: 20px;
}
.hero-title { font-size: clamp(2rem, 4.5vw, 3.2rem); font-weight: 900; line-height: 1.1; margin-bottom: 20px; }
.gradient-text {
  background: linear-gradient(135deg, var(--accent), #4dc9f6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-subtitle { font-size: 1.15rem; color: var(--text-2); margin-bottom: 32px; line-height: 1.7; }
.hero-ctas { display: flex; gap: 14px; margin-bottom: 48px; flex-wrap: wrap; }
.hero-stats { display: flex; gap: 24px; align-items: center; }
.stat { display: flex; flex-direction: column; }
.stat-num { font-weight: 800; font-size: 1.1rem; }
.stat-label { font-size: 0.8rem; color: var(--text-3); }
.stat-divider { width: 1px; height: 30px; background: var(--border); }

/* Hero screenshot */
.hero-visual { position: relative; }
.screenshot-window {
  background: var(--bg-1); border-radius: var(--r-lg);
  border: 1px solid var(--border); overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(13,142,255,0.06);
}
.window-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; background: var(--bg-3); border-bottom: 1px solid var(--border);
}
.window-dots { display: flex; gap: 6px; }
.window-dots span { width: 10px; height: 10px; border-radius: 50%; }
.window-dots span:nth-child(1) { background: var(--red); }
.window-dots span:nth-child(2) { background: #f5a623; }
.window-dots span:nth-child(3) { background: var(--green); }
.window-title { font-size: 0.75rem; color: var(--text-3); margin-left: 8px; }
.screenshot-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }

.mock-card {
  background: var(--bg-2); border-radius: var(--r-sm);
  padding: 14px; border: 1px solid var(--border-s);
}
.mock-title {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; color: var(--text-3); margin-bottom: 10px;
}
.mock-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; }
.mock-label { font-size: 0.78rem; color: var(--text-2); }
.mock-value {
  font-size: 0.75rem; color: var(--text-1);
  background: var(--bg-3); padding: 4px 10px;
  border-radius: 4px; border: 1px solid var(--border);
}
.mock-checks { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.mock-checks label, .mock-checks-sm label {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.75rem; color: var(--text-2); cursor: default;
}
.ck {
  width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0;
  border: 1px solid var(--border); background: var(--bg-3); display: inline-block;
}
.ck.on { background: var(--accent); border-color: var(--accent); }
.mock-anim-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 6px; }
.atile {
  font-size: 0.7rem; text-align: center; padding: 6px;
  background: var(--bg-3); border-radius: 4px;
  border: 1px solid var(--border); color: var(--text-2); cursor: default;
}
.atile.active { background: rgba(13,142,255,0.15); border-color: var(--accent); color: var(--accent); }
.mock-gen-btn {
  background: var(--accent); color: #fff; text-align: center;
  padding: 10px; border-radius: var(--r-sm);
  font-size: 0.85rem; font-weight: 700;
}

.hero-scroll {
  display: flex; align-items: center; gap: 6px; justify-content: center;
  margin-top: 40px; color: var(--text-3); font-size: 0.8rem;
  animation: bob 2s ease-in-out infinite;
}
@keyframes bob {
  0%,100% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(6px); }
}

/* ---- TRUST STRIP ---- */
.trust-strip {
  background: var(--bg-1); border-top: 1px solid var(--border-s);
  border-bottom: 1px solid var(--border-s); padding: 20px 0;
}
.trust-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 40px; }
.trust-item {
  display: flex; align-items: center; gap: 8px;
  color: var(--text-2); font-size: 0.88rem; font-weight: 500;
}
.trust-item svg { color: var(--accent); flex-shrink: 0; }

/* ---- HIGHLIGHTS (WHAT IS) ---- */
.highlights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 900px; margin: 0 auto; }
.highlight-card {
  display: flex; gap: 16px; align-items: flex-start;
  background: var(--bg-2); padding: 24px; border-radius: var(--r-md);
  border: 1px solid var(--border-s); transition: all var(--ease);
}
.highlight-card:hover { border-color: var(--border); transform: translateY(-2px); }
.highlight-icon {
  flex-shrink: 0; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(13,142,255,0.1); border-radius: var(--r-sm); color: var(--accent);
}
.highlight-card strong { font-size: 0.95rem; }
.highlight-card p { font-size: 0.85rem; color: var(--text-3); margin-top: 4px; }

/* ---- FEATURES ---- */
.features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.fcard {
  background: var(--bg-2); border: 1px solid var(--border-s);
  border-radius: var(--r-md); padding: 28px 24px; transition: all var(--ease);
}
.fcard:hover { border-color: var(--border); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
.fcard-icon { font-size: 1.8rem; margin-bottom: 16px; }
.fcard h3 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
.fcard p { font-size: 0.85rem; color: var(--text-2); line-height: 1.6; }

/* ---- WORKFLOW ---- */
.steps-row { display: flex; align-items: stretch; justify-content: center; max-width: 960px; margin: 0 auto; }
.step-card {
  flex: 1; text-align: center; background: var(--bg-2);
  border-radius: var(--r-md); padding: 32px 20px;
  border: 1px solid var(--border-s); transition: all var(--ease);
}
.step-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.step-num { font-size: 2rem; font-weight: 900; color: var(--accent); opacity: 0.3; margin-bottom: 12px; }
.step-card:hover .step-num { opacity: 1; }
.step-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
.step-card p { font-size: 0.85rem; color: var(--text-2); }
.step-arrow {
  width: 40px; flex-shrink: 0; display: flex; align-items: center;
  justify-content: center; color: var(--text-3); font-size: 1.2rem;
}

/* ---- DEMO ---- */
.video-wrap { max-width: 800px; margin: 0 auto; }
.video-box {
  position: relative; width: 100%; aspect-ratio: 16/9;
  border-radius: var(--r-lg); overflow: hidden;
  border: 1px solid var(--border); background: var(--bg-2);
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px; cursor: pointer;
}
.video-box p { color: var(--text-2); font-weight: 500; }
.play-btn {
  width: 72px; height: 72px; display: flex; align-items: center; justify-content: center;
  background: var(--accent); border-radius: 50%; color: #fff; transition: all var(--ease);
}
.play-btn:hover { transform: scale(1.1); box-shadow: 0 0 30px rgba(13,142,255,0.4); }

/* ---- UI PREVIEW ---- */
.ui-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.ui-card {
  background: var(--bg-2); border-radius: var(--r-md);
  border: 1px solid var(--border-s); overflow: hidden; transition: all var(--ease);
}
.ui-card:hover { border-color: var(--border); transform: translateY(-3px); }
.ui-card-top { padding: 20px; background: var(--bg-1); border-bottom: 1px solid var(--border-s); }
.ui-card h4 { padding: 16px 20px 4px; font-size: 1rem; font-weight: 700; }
.ui-card p { padding: 0 20px 20px; font-size: 0.85rem; color: var(--text-2); }

.mp {
  background: var(--bg-2); border-radius: var(--r-sm);
  padding: 14px; border: 1px solid var(--border-s);
}
.mp-head {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; color: var(--accent); margin-bottom: 10px;
}
.tile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 10px; }
.mtile {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 8px 4px; background: var(--bg-3); border-radius: 4px;
  border: 1px solid var(--border); font-size: 0.68rem; color: var(--text-3); cursor: default;
}
.mtile.active { border-color: var(--accent); color: var(--accent); background: rgba(13,142,255,0.1); }
.dir-row { display: flex; gap: 4px; justify-content: center; }
.dir, .dir-t {
  font-size: 0.65rem; padding: 3px 8px; background: var(--bg-3);
  border-radius: 3px; color: var(--text-3); border: 1px solid var(--border);
}
.mock-checks-sm { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px; }
.mock-checks-sm label { font-size: 0.72rem; }

/* ---- PRICING ---- */
.price-card {
  max-width: 520px; margin: 0 auto; background: var(--bg-2);
  border-radius: var(--r-xl); border: 2px solid rgba(13,142,255,0.3);
  padding: 48px 40px; text-align: center; position: relative;
  box-shadow: 0 24px 64px rgba(0,0,0,0.3), 0 0 60px rgba(13,142,255,0.06);
}
.price-badge {
  position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
  background: var(--accent); color: #fff; font-size: 0.75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px; padding: 6px 20px; border-radius: 30px;
}
.price-card h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 16px; }
.price-amount { display: flex; align-items: flex-start; justify-content: center; gap: 4px; margin-bottom: 32px; }
.dollar { font-size: 1.5rem; font-weight: 700; color: var(--text-3); margin-top: 8px; }
.amount { font-size: 4rem; font-weight: 900; line-height: 1; }
.period { font-size: 0.85rem; color: var(--text-3); align-self: flex-end; margin-bottom: 8px; }
.price-list { list-style: none; text-align: left; margin-bottom: 32px; }
.price-list li {
  display: flex; align-items: center; gap: 12px; padding: 8px 0;
  font-size: 0.92rem; color: var(--text-2); border-bottom: 1px solid var(--border-s);
}
.price-list li:last-child { border-bottom: none; }
.price-list svg { color: var(--green); flex-shrink: 0; }
.price-notes { margin-top: 16px; font-size: 0.78rem; color: var(--text-3); }

/* ---- DOWNLOAD ---- */
.dl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; max-width: 900px; margin: 0 auto; }
.dl-left { display: flex; flex-direction: column; align-items: center; gap: 20px; padding-top: 20px; }
.os-badge { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; font-weight: 600; }
.dl-right { display: flex; flex-direction: column; gap: 16px; }
.dl-right h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
.inst-step { display: flex; gap: 14px; align-items: flex-start; }
.inst-n {
  flex-shrink: 0; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(13,142,255,0.1); color: var(--accent);
  border-radius: 50%; font-size: 0.85rem; font-weight: 700;
}
.inst-step strong { font-size: 0.95rem; }
.inst-step p { font-size: 0.85rem; color: var(--text-2); margin-top: 2px; }
.inst-step code {
  font-size: 0.82rem; background: var(--bg-3);
  padding: 2px 8px; border-radius: 4px; color: var(--accent);
}
.inst-note {
  display: flex; align-items: center; gap: 8px; margin-top: 12px;
  padding: 12px 16px; background: var(--bg-2); border-radius: var(--r-sm);
  border: 1px solid var(--border-s); font-size: 0.85rem; color: var(--text-2);
}
.inst-note svg { color: var(--accent); flex-shrink: 0; }

/* ---- FAQ ---- */
.faq-list { max-width: 720px; margin: 0 auto; }
.faq-item { border-bottom: 1px solid var(--border-s); }
.faq-q {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 20px 0; background: none; border: none; cursor: pointer;
  font-family: var(--font); font-size: 1rem; font-weight: 600;
  color: var(--text-1); text-align: left;
}
.faq-q svg { flex-shrink: 0; color: var(--text-3); transition: transform var(--ease); }
.faq-item.open .faq-q svg { transform: rotate(180deg); }
.faq-a { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
.faq-item.open .faq-a { max-height: 300px; }
.faq-a p { padding-bottom: 20px; font-size: 0.92rem; color: var(--text-2); line-height: 1.7; }

/* ---- ROADMAP ---- */
.roadmap-flex { display: flex; gap: 60px; align-items: center; max-width: 900px; margin: 0 auto; }
.roadmap-left { flex: 1; }
.roadmap-left > p { color: var(--text-2); margin: 16px 0 32px; }
.roadmap-items { display: flex; flex-direction: column; gap: 16px; }
.rm-item { display: flex; align-items: center; gap: 14px; }
.rm-dot {
  width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
  background: var(--bg-3); border: 2px solid var(--border);
}
.rm-dot.active { background: var(--accent); border-color: var(--accent); }
.rm-item strong { font-size: 0.95rem; }
.rm-tag {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; margin-left: 10px; padding: 2px 8px; border-radius: 3px;
}
.rm-tag.released { background: rgba(76,175,80,0.15); color: var(--green); }
.rm-tag.upcoming { background: rgba(13,142,255,0.1); color: var(--accent); }
.roadmap-right {
  flex-shrink: 0; width: 200px; height: 200px;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-2); border-radius: 50%; border: 1px solid var(--border-s);
}
.rocket { font-size: 4rem; }

/* ---- SUPPORT ---- */
.support-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.sup-card {
  background: var(--bg-2); border-radius: var(--r-md); padding: 28px 24px;
  border: 1px solid var(--border-s); text-align: center; transition: all var(--ease);
}
.sup-card:hover { border-color: var(--border); transform: translateY(-2px); }
.sup-icon { margin-bottom: 16px; color: var(--accent); }
.sup-card h4 { font-size: 1rem; font-weight: 700; margin-bottom: 8px; }
.sup-card p { font-size: 0.85rem; color: var(--text-2); margin-bottom: 12px; }
.sup-card a { font-size: 0.85rem; font-weight: 600; }

/* ---- FOOTER ---- */
.footer { background: var(--bg-1); border-top: 1px solid var(--border); padding: 60px 0 24px; }
.footer-top { display: grid; grid-template-columns: 1fr 2fr; gap: 60px; margin-bottom: 48px; }
.footer-brand p { color: var(--text-2); font-size: 0.88rem; margin-top: 12px; line-height: 1.6; }
.social-row { display: flex; gap: 12px; margin-top: 16px; }
.social-row a {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  background: var(--bg-3); border-radius: var(--r-sm); color: var(--text-3); transition: all var(--ease);
}
.social-row a:hover { color: var(--accent); background: rgba(13,142,255,0.1); }
.footer-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.fcol h5 {
  font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; color: var(--text-3); margin-bottom: 16px;
}
.fcol a { display: block; font-size: 0.88rem; color: var(--text-2); padding: 4px 0; }
.fcol a:hover { color: var(--text-1); }
.footer-bottom {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  padding-top: 24px; border-top: 1px solid var(--border-s);
  font-size: 0.82rem; color: var(--text-3);
}
.credit { color: var(--text-2); }
.credit strong { color: var(--accent); }
.disclaimer { font-style: italic; }

/* ---- BACK TO TOP ---- */
.btt {
  position: fixed; bottom: 30px; right: 30px;
  width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;
  background: var(--accent); color: #fff; border: none; border-radius: var(--r-sm);
  cursor: pointer; opacity: 0; visibility: hidden; transform: translateY(10px);
  transition: all var(--ease); z-index: 999;
}
.btt.visible { opacity: 1; visibility: visible; transform: translateY(0); }
.btt:hover { background: var(--accent-h); }

/* ---- SCROLL REVEAL ---- */
.reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ---- RESPONSIVE ---- */
@media (max-width: 1024px) {
  .features-grid { grid-template-columns: repeat(3, 1fr); }
  .support-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; text-align: center; }
  .hero-ctas { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-visual { max-width: 500px; margin: 0 auto; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .ui-grid { grid-template-columns: 1fr; }
  .steps-row { flex-direction: column; }
  .step-arrow { transform: rotate(90deg); height: 30px; width: auto; }
  .dl-grid { grid-template-columns: 1fr; }
  .highlights-grid { grid-template-columns: 1fr; }
  .roadmap-flex { flex-direction: column; text-align: center; }
  .footer-top { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .section { padding: 72px 0; }
  .nav-links, .nav-cta { display: none; }
  .mobile-menu-btn { display: flex; }
  .features-grid { grid-template-columns: 1fr; }
  .support-grid { grid-template-columns: 1fr; }
  .price-card { padding: 40px 24px; }
  .amount { font-size: 3rem; }
  .footer-cols { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; text-align: center; }
}
.nav-links.mobile-open {
  display: flex; flex-direction: column;
  position: absolute; top: 64px; left: 0; right: 0;
  background: rgba(26,26,31,0.98); backdrop-filter: blur(16px);
  padding: 24px; gap: 16px; border-bottom: 1px solid var(--border);
}
'''

with open(os.path.join(BASE, "style.css"), "w") as f:
    f.write(css)
print("style.css written:", len(css), "bytes")
