<template>
  <div class="rewards-table-wrap">
    <!-- Toolbar -->
    <div class="rewards-toolbar">
      <button
        class="os-btn os-btn--secondary"
        @click="exportRewardsAsPdf"
        :disabled="noRewards"
        data-testid="pdfExport"
      >
        PDF export
      </button>
      <button
        class="os-btn os-btn--secondary"
        @click="exportRewardsAsKoinlyCsv"
        :disabled="noRewards"
        data-testid="koinlyExport"
      >
        CSV export
      </button>
    </div>

    <div class="os-table-wrap">
      <table class="os-table">
        <thead>
          <tr>
            <th style="text-align:left">Date</th>
            <th style="text-align:right">Reward ({{ rewardToken }})</th>
            <th style="text-align:right">Price ({{ rewards?.currency }})</th>
            <th style="text-align:right">Value ({{ rewards?.currency }})</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rows.length === 0">
            <td colspan="4" class="os-table__empty">No rewards found</td>
          </tr>
          <tr v-for="(row, i) in paginatedRows" :key="i">
            <td class="os-table__mono">{{ row.isoDate }}</td>
            <td class="os-table__mono os-table__right">{{ formatCryptoAmount(row.amount) }}</td>
            <td class="os-table__mono os-table__right">{{ formatCurrencyWithoutSymbol(row.price) }}</td>
            <td class="os-table__mono os-table__right">{{ formatCurrencyWithoutSymbol(row.fiatValue) }}</td>
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
import { computed, onMounted, onUnmounted, Ref, ref } from 'vue';
import {
  formatCurrencyWithoutSymbol,
  formatCryptoAmount,
} from '../../../../shared-module/util/number-formatters';
import { useTaxableEventStore } from '../../../store/taxable-events.store';
import { RewardDto, Rewards } from '../../../../shared-module/model/rewards';
import { stakingExportKoinlyCsv } from '../../../../shared-module/service/staking-export-koinly-csv';
import { Subscription } from 'rxjs';

const rewardsStore = useTaxableEventStore();
const rewards: Ref<Rewards | undefined> = ref(undefined);
const page = ref(1);
const rowsPerPage = 10;

let subscription: Subscription;

onMounted(() => {
  subscription = rewardsStore.stakingRewards$.subscribe(async (r) => {
    rewards.value = r;
    page.value = 1;
  });
});

onUnmounted(() => {
  if (subscription) subscription.unsubscribe();
});

const noRewards = computed(() => !rewards.value || rewards.value.values.length === 0);
const rewardToken = computed(() => rewards.value?.token);

const rows = computed(() => {
  return [...(rewards.value?.values ?? [])].sort(
    (a: RewardDto, b: RewardDto) =>
      new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
  );
});

const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / rowsPerPage)));

const paginatedRows = computed(() =>
  rows.value.slice((page.value - 1) * rowsPerPage, page.value * rowsPerPage)
);

function exportRewardsAsKoinlyCsv() {
  if (!rewards.value) return;
  stakingExportKoinlyCsv(rewards.value);
}

async function exportRewardsAsPdf() {
  if (!rewards.value) return;
  const { stakingExportPdf } = await import(
    '../../../../shared-module/service/staking-export-pdf'
  );
  stakingExportPdf(rewards.value);
}
</script>

<style scoped>
.rewards-table-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  font-family: var(--font-sans);
}

.rewards-toolbar {
  display: flex;
  gap: var(--sp-2);
}

.os-table-wrap {
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
}
.os-table {
  width: 100%;
  border-collapse: collapse;
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
  padding: 0 var(--sp-4);
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
.os-table td {
  font-size: var(--fs-base);
  color: var(--ink);
  padding: 0 var(--sp-4);
  height: 36px;
  vertical-align: middle;
}
.os-table__mono {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--ink-70);
}
.os-table__right { text-align: right; }
.os-table__empty {
  text-align: center;
  color: var(--ink-30);
  font-size: var(--fs-base);
  padding: var(--sp-8) !important;
}

/* Pagination */
.os-pagination {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}
.os-pagination__info {
  font-size: var(--fs-sm);
  color: var(--ink-50);
}

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
.os-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.os-btn--secondary {
  background: var(--canvas);
  border-color: var(--border-strong);
  color: var(--ink);
}
.os-btn--secondary:hover:not(:disabled) { background: var(--mist); border-color: var(--ink-50); }
.os-btn--ghost { color: var(--ink-70); background: transparent; border: none; }
.os-btn--ghost:hover:not(:disabled) { background: var(--mist); }
.os-btn--sm { height: 28px; padding: 0 var(--sp-2); }
</style>
