<template>
  <div class="te-wrap">
    <!-- Toolbar -->
    <div class="te-toolbar">
      <div class="te-toolbar__left">
        <div class="te-toolbar__title">Taxable events</div>
        <div class="te-toolbar__actions">
          <button class="os-btn os-btn--secondary" data-testid="csvExport" @click="csvExport">
            Export CSV
          </button>
          <button class="os-btn os-btn--secondary" data-testid="koinlyExport" @click="koinlyExport">
            Koinly export
          </button>
        </div>
      </div>
      <div class="te-toolbar__right desktop-only">
        <EventTypeFilter />
        <TokenFilter />
        <AlwaysHideTokensFilter />
      </div>
    </div>

    <!-- Table -->
    <div class="os-table-wrap">
      <table class="os-table">
        <thead>
          <tr>
            <th style="text-align:center; width:44px">
              Excluded
            </th>
            <th style="text-align:left">Date</th>
            <th style="text-align:left">Type</th>
            <th style="text-align:left">Transaction / Block</th>
            <th style="text-align:right">Received</th>
            <th style="text-align:right">Sent</th>
            <th style="text-align:right">Fees</th>
            <th style="text-align:left">From / To</th>
            <th style="text-align:left">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rows.length === 0">
            <td colspan="9" class="os-table__empty">No taxable events found</td>
          </tr>
          <tr
            v-for="row in paginatedRows"
            :key="row.id"
            :class="{ 'os-table__row--excluded': isExcluded(row) }"
          >
            <td style="text-align:center">
              <label class="os-toggle">
                <input
                  type="checkbox"
                  :checked="isExcluded(row)"
                  @change="toggleExclude(row)"
                />
                <span class="os-toggle__track"></span>
              </label>
            </td>
            <td class="os-table__mono">{{ row.isoDate }}</td>
            <td>
              <span v-if="row.label">{{ row.label }}<span v-if="row.isTransferToSelf && row.label === 'XCM transfer'"> to self</span></span>
              <span v-if="row.xcmDescription" class="te-xcm-desc">({{ row.xcmDescription }})</span>
            </td>
            <td class="os-table__mono">
              <a v-if="row.extrinsic_index" :href="getSubScanTxLink(row.extrinsic_index)" target="_blank" class="os-link">{{ row.extrinsic_index }}</a>
              <a v-else-if="row.block" :href="getSubScanBlockLink(row.block)" target="_blank" class="os-link">{{ row.block }}</a>
            </td>
            <td class="os-table__mono os-table__right">
              <div v-for="(item, idx) in row.tokensReceived" :key="idx">{{ item }}</div>
            </td>
            <td class="os-table__mono os-table__right">
              <div v-for="(item, idx) in row.tokensSent" :key="idx">{{ item }}</div>
            </td>
            <td class="os-table__mono os-table__right">
              <div v-for="(item, idx) in row.fees" :key="idx">{{ item }}</div>
            </td>
            <td class="os-table__mono">
              <div v-for="(item, idx) in row.addresses" :key="idx">
                <a :href="getSubscanAddressLink(item)" target="_blank" class="os-link">
                  {{ row.addressNames[item] || item.substring(0, 5) + '…' }}
                </a>
              </div>
            </td>
            <td class="os-table__muted">{{ row.callModuleDescription }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="os-pagination">
      <button class="os-btn os-btn--ghost os-btn--sm" :disabled="page === 1" @click="page--">← Prev</button>
      <span class="os-pagination__info">{{ page }} / {{ totalPages }}</span>
      <button class="os-btn os-btn--ghost os-btn--sm" :disabled="page === totalPages" @click="page++">Next →</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import TokenFilter from './token-filter/TokenFilter.vue';
import EventTypeFilter from './event-type-filter/EventTypeFilter.vue';
import { computed, onMounted, onUnmounted, Ref, ref } from 'vue';
import { useTaxableEventStore } from '../../store/taxable-events.store';
import { TaxData } from '../../../shared-module/model/tax-data';
import { TaxableEvent } from '../../../shared-module/model/taxable-event';
import { formatCryptoAmount } from '../../../shared-module/util/number-formatters';
import { useSharedStore } from '../../../shared-module/store/shared.store';
import { exportKoinlyCsv } from '../../../shared-module/service/export-koinly-csv';
import AlwaysHideTokensFilter from './always-hide-tokens-filter/AlwaysHideTokensFilter.vue';
import { Subscription } from 'rxjs';
import { exportDefaultCsv } from '../../../shared-module/service/default-csv-export';

const store = useTaxableEventStore();
const taxData: Ref<TaxData | undefined> = ref(undefined);
const tokenFilter: Ref<{ name: string; value: boolean }[]> = ref([]);
const excludedEntries: Ref<TaxableEvent[]> = ref([]);
const chains: Ref<{ domain: string; label: string }[] | undefined> = ref(undefined);
const page = ref(1);
const rowsPerPage = 10;

let taxDataSubscription: Subscription;
let walletSubscription: Subscription;
let tokenFilterSubscription: Subscription;
let blockchainsSubscription: Subscription;

const userWallets: Ref<string[]> = ref([]);

onMounted(() => {
  taxDataSubscription = store.visibleTaxData$.subscribe(async (data) => {
    taxData.value = data;
    page.value = 1;
  });
  walletSubscription = useSharedStore().walletsAddresses$.subscribe(async (wallets) => {
    userWallets.value = wallets;
  });
  tokenFilterSubscription = store.tokenFilter$.subscribe(async (data) => {
    tokenFilter.value = data;
  });
  blockchainsSubscription = useSharedStore().subscanChains$.subscribe((subscanChains) => {
    chains.value = subscanChains.chains;
  });
});

onUnmounted(() => {
  taxDataSubscription.unsubscribe();
  tokenFilterSubscription.unsubscribe();
  walletSubscription.unsubscribe();
  blockchainsSubscription.unsubscribe();
});

function isExcluded(row: any) {
  return excludedEntries.value.some((e) => e.id === row.id);
}

function toggleExclude(row: any) {
  if (isExcluded(row)) {
    excludedEntries.value = excludedEntries.value.filter((e) => e.id !== row.id);
  } else {
    const entry = taxData.value?.values.find((e) => e.id === row.id);
    if (entry) excludedEntries.value = [...excludedEntries.value, entry];
  }
  store.setExcludedEntries(excludedEntries.value);
}

function koinlyExport() { exportKoinlyCsv(getDataForExport()); }
function csvExport() { exportDefaultCsv(getDataForExport()); }

function getDataForExport() {
  const excludedIds = excludedEntries.value.map((e) => e.id).filter((id) => !!id);
  const values = taxData.value!.values.filter((e) => !excludedIds.includes(e.id!));
  return { ...taxData.value!, values };
}

const rows = computed(() => {
  const flattened: any[] = [];
  taxData.value?.values.forEach((data: TaxableEvent) => {
    flattened.push({
      block: data.block,
      timestamp: data.timestamp,
      isoDate: data.isoDate,
      hash: data.hash,
      tokensSent: data.transfers.filter((t) => t.amount < 0).map((t) => `${formatCryptoAmount(-t.amount)} ${t.symbol}`),
      tokensReceived: data.transfers.filter((t) => t.amount > 0).map((t) => `${formatCryptoAmount(t.amount)} ${t.symbol}`),
      label: data.label,
      xcmDescription: xcmChainDescription(data),
      callModuleDescription: [data.callModule ?? '', data.callModuleFunction ?? ''].filter((t) => !!t).join('-'),
      extrinsic_index: data.extrinsic_index,
      addresses: [...new Set(data.transfers.flatMap((t) => [t.to, t.from]).filter((a) => !!a))],
      addressNames: data.transfers.reduce((curr, next) => {
        curr[next.to] = next.toAddressName;
        curr[next.from] = next.fromAddressName;
        return curr;
      }, {} as any),
      fees: [
        data.feeUsed ?? 0 > 0 ? `${formatCryptoAmount(data.feeUsed ?? 0)} ${data.feeTokenSymbol}` : undefined,
        data.xcmFeeTokenSymbol ? `(XCM) ${formatCryptoAmount(data.xcmFee ?? 0)} ${data.xcmFeeTokenSymbol}` : undefined,
      ].filter((value) => !!value),
      id: data.id,
      isTransferToSelf: isTransferToSelf(data),
    });
  });
  return flattened.sort((a, b) => b.timestamp - a.timestamp);
});

const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / rowsPerPage)));
const paginatedRows = computed(() =>
  rows.value.slice((page.value - 1) * rowsPerPage, page.value * rowsPerPage)
);

const xcmChainDescription = (data: TaxableEvent) => {
  if (data.label !== 'XCM transfer' || data.transfers.length === 0) return undefined;
  if (data.transfers[0].fromChain === taxData.value?.chain) {
    return data.transfers[0].toChain ? '↑' + getLabelForBlockchain(data.transfers[0].toChain) : undefined;
  } else {
    return data.transfers[0].fromChain ? '↓' + getLabelForBlockchain(data.transfers[0].fromChain) : undefined;
  }
};

function getLabelForBlockchain(domain?: string) {
  if (!domain) return domain;
  return !chains.value ? domain : chains.value.find((c) => c.domain === domain)?.label ?? domain;
}

const isTransferToSelf = (data: TaxableEvent) => {
  return data.transfers.every((t) =>
    t.from && t.to && userWallets.value.includes(t.from) && userWallets.value.includes(t.to)
  );
};

function getSubScanTxLink(extrinsic_index: string) {
  if (!extrinsic_index || !taxData.value) return undefined;
  return `https://${taxData.value.chain}.subscan.io/extrinsic/${extrinsic_index}`;
}

function getSubScanBlockLink(block: string) {
  if (!block || !taxData.value) return undefined;
  return `https://${taxData.value.chain}.subscan.io/block/${block}`;
}

function getSubscanAddressLink(address: string) {
  if (!address || !taxData.value) return undefined;
  return `https://${taxData.value.chain}.subscan.io/account/${address}`;
}
</script>

<style scoped>
.te-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--sp-4);
  font-family: var(--font-sans);
}

.te-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-4);
  flex-wrap: wrap;
}
.te-toolbar__left {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.te-toolbar__title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semi);
  color: var(--ink);
  letter-spacing: var(--tr-snug);
}
.te-toolbar__actions {
  display: flex;
  gap: var(--sp-2);
}
.te-toolbar__right {
  display: flex;
  gap: var(--sp-2);
  align-items: center;
  flex-wrap: wrap;
}

/* Table */
.os-table-wrap {
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow-x: auto;
}
.os-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}
.os-table thead tr {
  border-bottom: 1px solid var(--border-strong);
}
.os-table th {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semi);
  letter-spacing: var(--tr-wide);
  text-transform: uppercase;
  color: var(--ink-50);
  padding: 0 var(--sp-3);
  height: 36px;
  white-space: nowrap;
  background: var(--canvas);
}
.os-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background var(--dur-fast) var(--ease);
}
.os-table tbody tr:last-child { border-bottom: none; }
.os-table tbody tr:hover td { background: var(--mist); }
.os-table__row--excluded td { opacity: 0.45; }
.os-table td {
  font-size: var(--fs-base);
  color: var(--ink);
  padding: var(--sp-2) var(--sp-3);
  vertical-align: top;
}
.os-table__mono {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--ink-70);
}
.os-table__right { text-align: right; }
.os-table__muted { color: var(--ink-50); font-size: var(--fs-sm); }
.os-table__empty {
  text-align: center;
  color: var(--ink-30);
  font-size: var(--fs-base);
  padding: var(--sp-8) !important;
}

/* XCM label */
.te-xcm-desc {
  display: block;
  font-size: var(--fs-xs);
  color: var(--ink-50);
}

/* Toggle */
.os-toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.os-toggle input { display: none; }
.os-toggle__track {
  width: 28px;
  height: 16px;
  background: var(--border-strong);
  border-radius: var(--r-pill);
  position: relative;
  transition: background var(--dur) var(--ease);
}
.os-toggle__track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  transition: transform var(--dur) var(--ease);
}
.os-toggle input:checked + .os-toggle__track {
  background: var(--blue-500);
}
.os-toggle input:checked + .os-toggle__track::after {
  transform: translateX(12px);
}

/* Links */
.os-link {
  color: var(--blue-500);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color var(--dur) var(--ease);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
}
.os-link:hover { border-bottom-color: var(--blue-500); }

/* Pagination */
.os-pagination {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.os-pagination__info { font-size: var(--fs-sm); color: var(--ink-50); }

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
  transition: background var(--dur) var(--ease);
}
.os-btn:active { transform: translateY(1px); }
.os-btn--secondary {
  background: var(--canvas);
  border-color: var(--border-strong);
  color: var(--ink);
}
.os-btn--secondary:hover { background: var(--mist); border-color: var(--ink-50); }
.os-btn--ghost { color: var(--ink-70); background: transparent; border: none; }
.os-btn--ghost:hover:not(:disabled) { background: var(--mist); }
.os-btn--sm { height: 28px; padding: 0 var(--sp-2); }
</style>
