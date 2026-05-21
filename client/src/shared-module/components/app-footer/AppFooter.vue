<template>
  <footer class="os-footer">
    <div class="os-footer__inner">
      <div class="os-footer__brand desktop-only">
        <span class="os-footer__brand-stack">
          <span class="os-footer__eyebrow">PALA LABS</span>
          <span class="os-footer__name">Polkadot Tax Tool</span>
        </span>
        <p class="os-footer__tagline">The easiest way to handle your Substrate chain tax reporting.</p>
      </div>
      <div v-for="(group, g) in footerLinks" :key="g" class="os-footer__col">
        <div class="os-footer__group-title eyebrow">{{ group.title }}</div>
        <div v-for="link in group.links" :key="link.label" class="os-footer__link-wrap">
          <router-link v-if="link.routerLink" :to="link.routerLink" class="os-footer__link">{{ link.label }}</router-link>
          <a v-if="link.link" :href="link.link" class="os-footer__link" target="_blank" rel="noopener">{{ link.label }}</a>
        </div>
      </div>
    </div>
    <div class="os-footer__bottom">
      &copy; 2026 Polkadot Tax Tool &middot; developed by
      <a href="https://pala-labs.com" class="os-footer__link" target="_blank" rel="noopener">Pala Labs</a>.
      Crypto currency quotes provided by
      <a href="https://coingecko.com" class="os-footer__link" target="_blank" rel="noopener">coingecko.com</a>.
    </div>
  </footer>
</template>

<script setup lang="ts">
const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Tutorial & FAQ', routerLink: '/tutorial-faq', link: undefined },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'GitHub', routerLink: undefined, link: 'https://github.com/Pala-Labs/polkadot-tax-app' },
    ],
  },
];
</script>

<style scoped>
.os-footer {
  background: var(--canvas);
  border-top: 1px solid var(--border);
  font-family: var(--font-sans);
}
.os-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6);
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--sp-8);
}
@media (max-width: 768px) {
  .os-footer__inner { grid-template-columns: 1fr 1fr; }
}
.os-footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.os-footer__brand-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.os-footer__eyebrow {
  font-size: 9px;
  font-weight: var(--fw-semi);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-50);
}
.os-footer__name {
  font-size: var(--fs-base);
  font-weight: var(--fw-semi);
  color: var(--ink);
}
.os-footer__tagline {
  font-size: var(--fs-sm);
  color: var(--ink-50);
  margin: 0;
  line-height: var(--lh-normal);
}
.os-footer__col { display: flex; flex-direction: column; gap: var(--sp-2); }
.os-footer__group-title { margin-bottom: var(--sp-1); }
.os-footer__link-wrap { display: flex; }
.os-footer__link {
  font-size: var(--fs-sm);
  color: var(--ink-50);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.os-footer__link:hover {
  color: var(--blue-500);
  border-bottom-color: var(--blue-500);
}
.os-footer__bottom {
  border-top: 1px solid var(--border);
  text-align: center;
  padding: var(--sp-4) var(--sp-6);
  font-size: var(--fs-sm);
  color: var(--ink-50);
}
</style>
