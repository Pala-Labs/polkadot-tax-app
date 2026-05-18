<template>
  <div class="welcome-page">
    <!-- Header -->
    <header class="welcome-header">
      <div class="welcome-header__inner">
        <div class="welcome-header__brand">
          <img src="/favicon.ico" class="welcome-header__logo" alt="" />
          <span class="welcome-header__name">PolkaTax</span>
        </div>
        <nav class="welcome-header__nav">
          <router-link to="/wallets" class="welcome-header__link welcome-header__link--active">Wallets</router-link>
          <router-link to="/tutorial-faq" class="welcome-header__link">Tutorial &amp; FAQ</router-link>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <span class="eyebrow">Substrate tax reporting</span>
      <h1 class="hero__title">Simplify your substrate<br>tax reporting</h1>
      <p class="hero__sub">Fetch tax-relevant transactions from all Substrate chains.<br>Export for your tax software in one click.</p>
      <router-link to="/wallets" class="btn btn--primary" data-testid="launch-button">Launch app</router-link>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="features__grid">
        <div v-for="(f, i) in features" :key="i" class="feature-card">
          <div class="feature-card__label eyebrow">{{ f.title }}</div>
          <div class="feature-card__desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <!-- Supported chains -->
    <section class="chains">
      <span class="eyebrow" style="display:block; text-align:center; margin-bottom: var(--sp-6)">Supported chains</span>
      <div class="chains__grid">
        <div v-for="name in chains" :key="name" class="chain-card">
          <img :src="`/img/chain-logos/${name.toLowerCase()}.png`" class="chain-card__img" :alt="name" />
          <span class="chain-card__name">{{ name }}</span>
        </div>
        <div class="chain-card chain-card--more">
          <span style="font-family: var(--font-mono); font-size: var(--fs-xs); color: var(--ink-50);">+ more</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <h2 class="cta-section__title">Ready to simplify your crypto taxes?</h2>
      <p class="cta-section__sub">Use PolkaTax for accurate, compliant tax reporting.</p>
      <router-link to="/wallets" class="btn btn--primary" data-testid="launch-button2">Launch app</router-link>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from '../shared-module/components/app-footer/AppFooter.vue';

const chains = [
  'Polkadot', 'Kusama', 'Moonbeam', 'Acala', 'Astar',
  'Bifrost', 'Mythos', 'Hydration', 'Peaq', 'EnergyWebX', 'Kilt', 'Crust',
];

const features = [
  {
    title: 'Transaction tracking',
    desc: 'Automatically fetch staking rewards, payments, swaps across all connected chains.',
  },
  {
    title: 'Export reports',
    desc: 'Generate PDF/CSV for further processing or direct usage.',
  },
  {
    title: 'Tax software integration',
    desc: 'Integrates with tax software such as Koinly.',
  },
];
</script>

<style scoped>
.welcome-page {
  background: var(--paper);
  font-family: var(--font-sans);
  min-height: 100vh;
}

/* ---- Header ---- */
.welcome-header {
  background: var(--canvas);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}
.welcome-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--sp-6);
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.welcome-header__brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.welcome-header__logo {
  width: 24px;
  height: 24px;
  border-radius: var(--r-md);
}
.welcome-header__name {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semi);
  color: var(--ink);
  letter-spacing: var(--tr-snug);
}
.welcome-header__nav {
  display: flex;
  height: 52px;
  align-items: stretch;
}
.welcome-header__link {
  display: flex;
  align-items: center;
  padding: 0 var(--sp-3);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--ink-50);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  letter-spacing: var(--tr-snug);
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.welcome-header__link:hover {
  color: var(--ink);
}
.welcome-header__link--active,
.welcome-header__link.router-link-active {
  color: var(--blue-500);
  border-bottom-color: var(--blue-500);
  background: var(--blue-50);
}

/* ---- Hero ---- */
.hero {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--sp-24) var(--sp-6) var(--sp-12);
  text-align: center;
}
.hero__title {
  font-size: var(--fs-3xl);
  font-weight: var(--fw-bold);
  letter-spacing: var(--tr-tight);
  line-height: var(--lh-snug);
  color: var(--ink);
  margin: var(--sp-3) 0 var(--sp-4);
  text-wrap: balance;
}
.hero__sub {
  font-size: var(--fs-md);
  color: var(--ink-50);
  line-height: var(--lh-relaxed);
  letter-spacing: var(--tr-snug);
  margin: 0 0 var(--sp-8);
}

/* ---- Buttons ---- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 var(--sp-5);
  border-radius: var(--r-md);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  letter-spacing: var(--tr-snug);
  cursor: pointer;
  text-decoration: none;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
  border: 1px solid transparent;
}
.btn:active { transform: translateY(1px); }
.btn--primary {
  background: var(--blue-500);
  border-color: var(--blue-600);
  color: #fff;
}
.btn--primary:hover {
  background: var(--blue-600);
  border-color: var(--blue-700);
  color: #fff;
}

/* ---- Features ---- */
.features {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--sp-6) var(--sp-12);
}
.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-3);
}
@media (max-width: 768px) {
  .features__grid { grid-template-columns: 1fr; }
}
.feature-card {
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4);
}
.feature-card__label {
  margin-bottom: var(--sp-2);
}
.feature-card__desc {
  font-size: var(--fs-base);
  color: var(--ink);
  line-height: var(--lh-normal);
  letter-spacing: var(--tr-snug);
}

/* ---- Chains ---- */
.chains {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--sp-6) var(--sp-12);
}
.chains__grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  justify-content: center;
}
.chain-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-1);
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  min-width: 80px;
}
.chain-card--more {
  justify-content: center;
  background: var(--blue-50);
  border-color: var(--blue-200);
}
.chain-card__img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.chain-card__name {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semi);
  letter-spacing: var(--tr-wide);
  text-transform: uppercase;
  color: var(--ink-50);
}

/* ---- CTA section ---- */
.cta-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--sp-12) var(--sp-6);
  text-align: center;
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  margin-bottom: var(--sp-12);
}
.cta-section__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-semi);
  color: var(--ink);
  margin: 0 0 var(--sp-2);
  letter-spacing: var(--tr-tight);
}
.cta-section__sub {
  color: var(--ink-50);
  margin: 0 0 var(--sp-6);
  font-size: var(--fs-base);
}
</style>
