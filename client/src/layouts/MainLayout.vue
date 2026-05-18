<template>
  <q-layout view="hHh lpR fFf" class="os-layout">
    <AppHeader show-bread-crumbs />
    <q-page-container class="os-page-container">
      <router-view />
    </q-page-container>

    <!-- Error dialog -->
    <q-dialog v-model="showErrorDialog">
      <div class="os-dialog">
        <div class="os-dialog__body">{{ errorMsg }}</div>
        <div class="os-dialog__actions">
          <button class="os-btn os-btn--secondary" @click="showErrorDialog = false">OK</button>
        </div>
      </div>
    </q-dialog>
  </q-layout>
  <AppFooter />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useSharedStore } from '../shared-module/store/shared.store';
import { Subscription } from 'rxjs';
import AppFooter from '../shared-module/components/app-footer/AppFooter.vue';
import AppHeader from '../shared-module/components/app-header/AppHeader.vue';

const showErrorDialog = ref(false);
const errorMsg = ref('');

let subscription: Subscription;

onMounted(() => {
  subscription = useSharedStore().webSocketResponseError$.subscribe(handleError);
});

function handleError(err: any) {
  console.error(JSON.stringify(err));
  if (err.msg) {
    errorMsg.value = err.msg;
  } else {
    switch (err.code) {
      case 429:
        errorMsg.value = 'Too many requests. Please try again later.';
        break;
      case 400:
        errorMsg.value = 'The data sent to the server is invalid.';
        break;
      default:
        errorMsg.value = 'There was an error connecting to the server. Please try again later.';
    }
  }
  showErrorDialog.value = true;
}

onBeforeUnmount(() => {
  subscription?.unsubscribe();
});
</script>

<style scoped>
.os-layout { background: var(--paper) !important; }
.os-page-container { min-height: 70vh; background: var(--paper); }

.os-dialog {
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-pop);
  padding: var(--sp-6);
  min-width: 320px;
  max-width: 480px;
  font-family: var(--font-sans);
}
.os-dialog__body {
  font-size: var(--fs-base);
  color: var(--ink);
  line-height: var(--lh-normal);
  margin-bottom: var(--sp-6);
}
.os-dialog__actions {
  display: flex;
  justify-content: flex-end;
}

.os-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 var(--sp-4);
  border-radius: var(--r-md);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  letter-spacing: var(--tr-snug);
  cursor: pointer;
  border: 1px solid transparent;
  transition: background var(--dur) var(--ease);
}
.os-btn:active { transform: translateY(1px); }
.os-btn--secondary {
  background: var(--canvas);
  border-color: var(--border-strong);
  color: var(--ink);
}
.os-btn--secondary:hover { background: var(--mist); border-color: var(--ink-50); }
</style>
