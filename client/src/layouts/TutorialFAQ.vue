<template>
  <q-layout view="hHh lpR fFf" class="os-layout">
    <AppHeader />
    <q-page-container class="os-page-container">
      <q-page class="os-page">
        <div class="os-rail">

          <!-- Tutorial videos -->
          <section class="os-section">
            <span class="eyebrow">Getting started</span>
            <div class="tutorial-card">
              <div class="tutorial-card__title">Getting started tutorial</div>
              <div class="tutorial-card__video">
                <iframe
                  src="/tutorial.html"
                  frameborder="0"
                  allowfullscreen
                  title="PolkaTax Tutorial"
                ></iframe>
              </div>
            </div>
            <div class="tutorial-card" style="margin-top: var(--sp-4)">
              <div class="tutorial-card__title">Koinly import tutorial</div>
              <div class="tutorial-card__video">
                <iframe
                  src="/koinly-import-tutorial.html"
                  frameborder="0"
                  allowfullscreen
                  title="Koinly Import Tutorial"
                ></iframe>
              </div>
            </div>
          </section>

          <!-- FAQ -->
          <section class="os-section">
            <span class="eyebrow">Frequently asked questions</span>
            <div class="faq-list">
              <div
                v-for="(item, index) in faqItems"
                :key="index"
                class="faq-item"
                :class="{ 'faq-item--open': openIndex === index }"
              >
                <button class="faq-item__trigger" @click="toggle(index)">
                  <span class="faq-item__question">{{ item.question }}</span>
                  <svg
                    class="faq-item__chevron"
                    width="16" height="16"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div v-if="openIndex === index" class="faq-item__answer">
                  {{ item.answer }}
                </div>
              </div>
            </div>
          </section>

        </div>
      </q-page>
    </q-page-container>
    <AppFooter />
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import AppFooter from '../shared-module/components/app-footer/AppFooter.vue';
import AppHeader from '../shared-module/components/app-header/AppHeader.vue';
import { useSharedStore } from '../shared-module/store/shared.store';
import { Subscription } from 'rxjs';

const supportedChains: Ref<string[]> = ref([]);
const store = useSharedStore();
const openIndex = ref<number | null>(null);

let chainsSubscription: Subscription;

onMounted(() => {
  chainsSubscription = store.subscanChains$.subscribe((c) => {
    supportedChains.value = c.chains
      .filter((x) => !x.excluded)
      .map((x) => x.label)
      .sort((a, b) => (a.toUpperCase() > b.toUpperCase() ? 1 : -1));
  });
});

onBeforeUnmount(() => {
  chainsSubscription.unsubscribe();
});

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index;
}

const faqItems = computed(() => [
  {
    question: 'How do I connect my wallet?',
    answer:
      'Click the Connect Wallet button on the home page. You do not need to link your wallet directly — alternatively, copy your wallet address from your wallet app or extension and paste it into the input field.',
  },
  {
    question: 'Which chains are supported?',
    answer:
      'We currently support the following chains: ' +
      supportedChains.value.join(', ') +
      '. EVM transactions (such as Moonbeam) are not analysed.',
  },
  {
    question: 'Does PolkaTax support both substrate and EVM transactions?',
    answer:
      'No. PolkaTax exclusively analyses and exports substrate transactions.',
  },
  {
    question: 'How do I export my transaction data?',
    answer:
      'In the Wallets overview, select the wallet you want to export data from. This opens the list of connected blockchains. Click the export icon next to a chain.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'PolkaTax only accesses publicly available blockchain data and stores it in a secure database. No personal or sensitive information is ever transmitted to external servers.',
  },
  {
    question: 'Can I use PolkaTax for multiple accounts?',
    answer:
      'Yes. You can connect multiple wallets and manage their data seamlessly from a single dashboard. PolkaTax will automatically recognize that all connected wallets belong to you.',
  },
  {
    question: 'What kind of data is shown or exported?',
    answer:
      'The application currently displays and exports staking rewards, transfers, swaps, liquid token minting, and more from multiple Substrate-based chains.',
  },
  {
    question: 'Can I export specific parts of my data?',
    answer:
      'Yes. The Staking Rewards tab lets you export staking data only. In the Taxable Events tab, you can filter exports by asset movement type and token.',
  },
  {
    question: 'Why do some tokens show a cost basis of $0 in Koinly?',
    answer:
      'PolkaTax currently only exports data starting from beginning of 2024. This means tokens you acquired before that year are not included in the CSV, and tax software like Koinly may assume you received them for $0, which inflates reported gains. To fix this, create a deposit in Koinly for each token you already held at the start of the year.',
  },
  {
    question: 'Why is the data not always up to date?',
    answer:
      'To maintain data accuracy, PolkaTax synchronizes information up to a recent point in the past (for example, about one month ago). This delay allows the system to correctly handle new blockchain features or special events before processing the latest data.',
  },
  {
    question: 'Why does Koinly sometimes show errors or incorrect prices for certain tokens?',
    answer:
      'Koinly maintains its own database of recognized tokens. If a token is new, less common, or not in Koinly\'s list, it may show an error or be missing. To fix this, create or edit the token in Koinly under Settings > Manage Coins > Add Coin.',
  },
  {
    question: 'What about tokens that have no exchange rate, like LP tokens?',
    answer:
      'Some tokens, such as LP tokens, do not have a direct market price. PolkaTax provides the option to exclude such tokens entirely from your export. However, excluding tokens may affect your tax reporting, so use this feature with caution.',
  },
]);
</script>

<style scoped>
.os-layout { background: var(--paper) !important; }
.os-page-container { background: var(--paper); }
.os-page { background: var(--paper); }

.os-rail {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-6) var(--sp-12);
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.os-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

/* Tutorial cards */
.tutorial-card {
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4);
}
.tutorial-card__title {
  font-size: var(--fs-base);
  font-weight: var(--fw-semi);
  color: var(--ink);
  margin-bottom: var(--sp-3);
}
.tutorial-card__video {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
}
.tutorial-card__video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* FAQ accordion */
.faq-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
}
.faq-item {
  border-bottom: 1px solid var(--border);
}
.faq-item:last-child { border-bottom: none; }

.faq-item__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-5);
  background: var(--canvas);
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  text-align: left;
  transition: background var(--dur) var(--ease);
}
.faq-item__trigger:hover { background: var(--mist); }
.faq-item--open .faq-item__trigger { background: var(--blue-50); }

.faq-item__question {
  font-size: var(--fs-base);
  font-weight: var(--fw-medium);
  color: var(--ink);
  letter-spacing: var(--tr-snug);
  line-height: var(--lh-normal);
}
.faq-item__chevron {
  flex-shrink: 0;
  color: var(--ink-50);
  transition: transform var(--dur) var(--ease);
}
.faq-item--open .faq-item__chevron { transform: rotate(180deg); }

.faq-item__answer {
  padding: var(--sp-4) var(--sp-5);
  font-size: var(--fs-base);
  color: var(--ink-50);
  line-height: var(--lh-relaxed);
  background: var(--canvas);
  border-top: 1px solid var(--border);
}
</style>
