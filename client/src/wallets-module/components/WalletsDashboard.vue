<template>
  <q-page class="os-page q-px-sm q-mx-auto content">

    <!-- Empty state -->
    <div v-if="!wallets || wallets.length === 0" class="os-empty-state">
      <div class="os-card os-empty-state__card">
        <div class="os-empty-state__title">No wallet connected</div>
        <p class="os-empty-state__sub">Connect your wallet or paste a wallet address to start.</p>
        <div class="os-empty-state__actions">
          <button class="os-btn os-btn--primary" data-testid="submit" @click="showWalletSelectionDialog = true">
            Connect wallet
          </button>
          <span class="os-empty-state__or">or</span>
          <address-input v-model="store.address" @enter-pressed="startSyncing" />
          <button
            class="os-btn os-btn--secondary"
            data-testid="submit"
            @click="startSyncing"
            :disabled="isDisabled"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- Wallets table -->
    <div v-if="wallets && wallets.length > 0" class="os-section">
      <div class="os-table-wrap">
        <table class="os-table" data-testid="wallet-data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Wallet</th>
              <th>Blockchains with tx found</th>
              <th>Blockchains evaluated</th>
              <th>Currency</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in wallets"
              :key="row.wallet + row.currency"
              :class="{ 'os-table__row--clickable': row.walletsWithTxFound || row.hasErrors }"
              @click="navigateToJob(row)"
            >
              <td>
                <span v-if="!row.done" class="os-status-pill os-status-pill--live">
                  <span class="os-status-pill__dot"></span>Syncing
                </span>
                <span v-else class="os-status-pill os-status-pill--done">Done</span>
              </td>
              <td class="os-table__mono" data-testid="wallet-address">
                {{ row.wallet }}
                <button class="os-copy-btn" @click.stop="copyToClipboard(row.wallet)" title="Copy address">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </td>
              <td class="os-table__mono">{{ row.walletsWithTxFound }}</td>
              <td class="os-table__mono">
                {{ row.blockchainsEvaluated }}{{ row.chainsTotal > 1 ? ' / ' + row.chainsTotal : '' }}
              </td>
              <td class="os-table__mono">{{ row.currency }}</td>
              <td>
                <button class="os-btn os-btn--ghost os-btn--sm" @click.stop="confirmDelete(row)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: var(--sp-4)">
        <button class="os-btn os-btn--secondary" @click="showAddWalletDialog = true">
          + Add wallet
        </button>
      </div>
    </div>

    <add-wallet
      v-model:show-dialog="showAddWalletDialog"
      @show-wallet-selection-dialog="showWalletSelectionDialog = true"
      @add-wallet="startSyncing"
    />
    <wallet-selection v-model:show-dialog="showWalletSelectionDialog" />
  </q-page>
</template>

<script setup lang="ts">
import AddressInput from '../../shared-module/components/address-input/AddressInput.vue';
import { computed, onMounted, onUnmounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSharedStore } from '../../shared-module/store/shared.store';
import { isValidAddress } from '../../shared-module/util/is-valid-address';
import AddWallet from './add-wallet/AddWallet.vue';
import WalletSelection from './wallet-selection/WalletSelection.vue';
import { useQuasar } from 'quasar';
import { JobResult } from '../../shared-module/model/job-result';
import { showMaxWalletsReachedNotif } from '../../shared-module/store/helper/show-max-wallets-reached-notif';
import { Subscription } from 'rxjs';

const $q = useQuasar();
const store = useSharedStore();
const router = useRouter();

const wallets: Ref<WalletRow[] | undefined> = ref(undefined);
const walletAddresses: Ref<string[]> = ref([]);
const showWalletSelectionDialog = ref(false);
const showAddWalletDialog = ref(false);

let walletAddressesSub: Subscription;
let jobsSubscription: Subscription;

onMounted(() => {
  walletAddressesSub = store.walletsAddresses$.subscribe((addresses: string[]) => {
    walletAddresses.value = addresses;
  });
  jobsSubscription = store.jobs$.subscribe((jobs: JobResult[]) => {
    const r: any[] = [];
    jobs.forEach((j) => {
      const existing = r.find((r) => r.wallet === j.wallet && r.currency === j.currency);
      if (!existing) {
        r.push({
          wallet: j.wallet,
          currency: j.currency,
          done: j.status === 'done' || j.status === 'error',
          walletsWithTxFound: j.data?.values?.length ?? 0 > 0 ? 1 : 0,
          blockchainsEvaluated: j.status === 'done' || j.status === 'error' ? 1 : 0,
          chainsTotal: jobs.filter((job) => job.wallet === j.wallet).length,
          syncFromDate: j.syncFromDate,
          syncUntilDate: j.syncUntilDate,
          hasErrors: j.error ?? false,
        });
      } else {
        existing.done = existing.done && (j.status === 'done' || j.status === 'error');
        if (j.status === 'done' || j.status === 'error') existing.blockchainsEvaluated += 1;
        existing.hasErrors = existing.hasErrors || (j.error ?? false);
        existing.walletsWithTxFound =
          existing.walletsWithTxFound + (j.data?.values?.length ?? 0 > 0 ? 1 : 0);
      }
    });
    wallets.value = r;
  });
});

onUnmounted(() => {
  jobsSubscription.unsubscribe();
  walletAddressesSub.unsubscribe();
});

interface WalletRow {
  wallet: string;
  currency: string;
  done: boolean;
  walletsWithTxFound: boolean;
  blockchainsEvaluated: number;
  chainsTotal: number;
  syncFromDate: number;
  syncUntilDate: number;
  hasErrors: boolean;
}

async function startSyncing() {
  if (!isDisabled.value) {
    const tooManyWallets = await store.sync();
    if (tooManyWallets) {
      showMaxWalletsReachedNotif($q);
    } else {
      store.address = '';
    }
  }
}

const isDisabled = computed(() => !isValidAddress(store.address?.trim()));

function navigateToJob(row: WalletRow) {
  if (row.walletsWithTxFound || row.hasErrors) {
    router.push(`/wallets/${row.wallet}/${row.currency}`);
  }
}

function confirmDelete(job: WalletRow) {
  $q.dialog({
    title: 'Do you want to remove this wallet and its data?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    store.removeWallet(job);
  });
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  $q.notify({ position: 'top', timeout: 750, message: 'Wallet address copied!' });
}
</script>

<style scoped>
.os-page { background: var(--paper); padding: var(--sp-6) var(--sp-5); }

/* Empty state */
.os-empty-state {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: var(--sp-12);
}
.os-empty-state__card {
  max-width: 520px;
  width: 100%;
}
.os-empty-state__title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semi);
  color: var(--ink);
  margin-bottom: var(--sp-2);
}
.os-empty-state__sub {
  font-size: var(--fs-base);
  color: var(--ink-50);
  margin: 0 0 var(--sp-5);
}
.os-empty-state__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sp-2);
}
.os-empty-state__or {
  font-size: var(--fs-sm);
  color: var(--ink-30);
}

/* Card */
.os-card {
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-6);
}

/* Table */
.os-section { margin-top: var(--sp-4); }
.os-table-wrap {
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
}
.os-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-sans);
}
.os-table thead tr {
  background: var(--canvas);
  border-bottom: 1px solid var(--border-strong);
}
.os-table th {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semi);
  letter-spacing: var(--tr-wide);
  text-transform: uppercase;
  color: var(--ink-50);
  text-align: left;
  padding: 0 var(--sp-4);
  height: 36px;
  white-space: nowrap;
}
.os-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background var(--dur-fast) var(--ease);
}
.os-table tbody tr:last-child { border-bottom: none; }
.os-table tbody tr:hover td { background: var(--mist); }
.os-table__row--clickable { cursor: pointer; }
.os-table td {
  font-size: var(--fs-base);
  color: var(--ink);
  padding: 0 var(--sp-4);
  height: 40px;
  vertical-align: middle;
}
.os-table__mono {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--ink-70);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Status pills */
.os-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: var(--r-pill);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semi);
  padding: 2px 8px;
}
.os-status-pill--live {
  background: var(--blue-50);
  color: var(--blue-700);
}
.os-status-pill__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--blue-500);
  animation: pulse 1.5s ease infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.os-status-pill--done {
  background: var(--mist);
  color: var(--ink-70);
}

/* Copy button */
.os-copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-30);
  padding: 2px;
  margin-left: var(--sp-1);
  border-radius: var(--r-sm);
  vertical-align: middle;
  transition: color var(--dur) var(--ease);
}
.os-copy-btn:hover { color: var(--blue-500); }

/* Buttons */
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
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.os-btn:active { transform: translateY(1px); }
.os-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.os-btn--primary {
  background: var(--blue-500);
  border-color: var(--blue-600);
  color: #fff;
}
.os-btn--primary:hover:not(:disabled) { background: var(--blue-600); }
.os-btn--secondary {
  background: var(--canvas);
  border-color: var(--border-strong);
  color: var(--ink);
}
.os-btn--secondary:hover { background: var(--mist); border-color: var(--ink-50); }
.os-btn--ghost { color: var(--ink-70); }
.os-btn--ghost:hover { background: var(--mist); }
.os-btn--sm { height: 28px; padding: 0 var(--sp-2); }
</style>
