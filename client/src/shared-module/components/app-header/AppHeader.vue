<template>
  <q-header class="os-header">
    <div class="os-header__inner">
      <!-- Left: logo / back + title -->
      <div class="os-header__left">
        <a v-if="!parentRoute" href="/" class="os-header__brand">
          <span class="os-header__brand-stack">
            <span class="os-header__eyebrow">PALA LABS</span>
            <span class="os-header__name">Polkadot Tax Tool</span>
          </span>
        </a>
        <template v-if="parentRoute">
          <router-link :to="parentRoute" class="os-btn os-btn--ghost os-btn--sm">
            ← Back
          </router-link>
          <span class="os-header__page-title" data-testid="title">{{ route.name }}</span>
        </template>
      </div>

      <!-- Right: nav tabs + settings -->
      <div class="os-header__right">
        <nav class="os-header__nav desktop-only">
          <router-link to="/wallets" class="os-header__nav-link">Wallets</router-link>
          <router-link to="/tutorial-faq" class="os-header__nav-link">Tutorial &amp; FAQ</router-link>
        </nav>
        <button
          class="os-btn os-btn--icon"
          aria-label="Settings"
          @click="showSettingsModal = !showSettingsModal"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
        <SettingsModal v-model:show-dialog="showSettingsModal" />
      </div>
    </div>

    <!-- Breadcrumbs row -->
    <div class="os-header__breadcrumbs" v-if="showBreadCrumbs">
      <BreadCrumbs />
    </div>
  </q-header>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import BreadCrumbs from '../bread-crumbs/BreadCrumbs.vue';
import { useRoute } from 'vue-router';
import SettingsModal from '../settings-modal/SettingsModal.vue';

const route = useRoute();

defineProps({
  showBreadCrumbs: Boolean,
});

const showSettingsModal: Ref<boolean> = ref(false);

const parentRoute = computed(() => {
  const parent = route.meta.parent;
  return typeof parent === 'function' ? parent(route) : undefined;
});
</script>

<style scoped>
.os-header {
  background: var(--canvas) !important;
  border-bottom: 1px solid var(--border);
  color: var(--ink) !important;
}
.os-header__inner {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--sp-5);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.os-header__left {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.os-header__brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  text-decoration: none;
}
.os-header__brand-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.os-header__eyebrow {
  font-size: 9px;
  font-weight: var(--fw-semi);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-50);
}
.os-header__name {
  font-size: var(--fs-base);
  font-weight: var(--fw-semi);
  color: var(--ink);
  letter-spacing: var(--tr-snug);
}
.os-header__page-title {
  font-size: var(--fs-base);
  font-weight: var(--fw-semi);
  color: var(--ink);
  letter-spacing: var(--tr-snug);
}

.os-header__right {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}
.os-header__nav {
  display: flex;
  height: 52px;
  align-items: stretch;
}
.os-header__nav-link {
  display: flex;
  align-items: center;
  padding: 0 var(--sp-3);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--ink-50);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  letter-spacing: var(--tr-snug);
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease),
              background var(--dur) var(--ease);
}
.os-header__nav-link:hover { color: var(--ink); }
.os-header__nav-link.router-link-active {
  color: var(--blue-500);
  border-bottom-color: var(--blue-500);
  background: var(--blue-50);
}

/* Buttons */
.os-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-md);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  letter-spacing: var(--tr-snug);
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ink-70);
  transition: background var(--dur) var(--ease);
}
.os-btn:active { transform: translateY(1px); }
.os-btn--ghost:hover { background: var(--mist); }
.os-btn--sm { height: 28px; padding: 0 var(--sp-2); }
.os-btn--icon {
  width: 30px;
  height: 30px;
  border: 1px solid var(--border);
  color: var(--ink-50);
}
.os-btn--icon:hover { background: var(--mist); color: var(--ink); }

.os-header__breadcrumbs {
  border-top: 1px solid var(--border);
  padding: var(--sp-2) var(--sp-5);
  max-width: 1200px;
  margin: 0 auto;
}
</style>
