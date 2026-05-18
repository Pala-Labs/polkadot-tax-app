<template>
  <div v-if="rewards" class="stat-tiles">
    <div class="stat-tile" v-if="rewards.summary">
      <div class="stat-tile__label eyebrow">Total rewards</div>
      <div class="stat-tile__value" data-testid="total-rewards">
        {{ formatCryptoAmount(rewards.summary.amount) }}
        <span class="stat-tile__unit">{{ rewards.token }}</span>
      </div>
    </div>
    <div class="stat-tile" v-if="rewards.summary">
      <div class="stat-tile__label eyebrow">Value at payout time</div>
      <div class="stat-tile__value" data-testid="value-at-payout-time">
        {{
          isNaN(rewards.summary.fiatValue || NaN)
            ? '—'
            : formatCurrency(rewards.summary.fiatValue!, rewards.currency)
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, Ref } from 'vue';
import {
  formatCurrency,
  formatCryptoAmount,
} from '../../../../shared-module/util/number-formatters';
import { useTaxableEventStore } from '../../../store/taxable-events.store';
import { Rewards } from '../../../../shared-module/model/rewards';
import { Subscription } from 'rxjs';

const store = useTaxableEventStore();
const rewards: Ref<Rewards | undefined> = ref(undefined);

let subscription: Subscription;

onMounted(() => {
  subscription = store.stakingRewards$.subscribe((data) => {
    rewards.value = data;
  });
});

onBeforeUnmount(() => {
  subscription.unsubscribe();
});
</script>

<style scoped>
.stat-tiles {
  display: flex;
  gap: var(--sp-4);
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: var(--sp-6);
}
.stat-tile {
  background: var(--canvas);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4) var(--sp-6);
  min-width: 180px;
  text-align: left;
}
.stat-tile__label {
  margin-bottom: var(--sp-2);
}
.stat-tile__value {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: var(--tr-tight);
  color: var(--ink);
  font-family: var(--font-mono);
  line-height: 1;
}
.stat-tile__unit {
  font-size: var(--fs-base);
  font-weight: var(--fw-medium);
  color: var(--ink-50);
  margin-left: var(--sp-1);
}
</style>
