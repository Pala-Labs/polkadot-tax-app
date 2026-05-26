<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="onCancel"
    persistent
  >
    <q-card class="os-disclaimer-card">
      <q-card-section class="os-disclaimer-header">
        <div class="os-disclaimer-eyebrow">PALA LABS</div>
        <div class="os-disclaimer-title">Welcome to the Polkadot Tax Tool</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="os-disclaimer-body">
        <!-- Product introduction -->
        <section class="os-disclaimer-section">
          <h3 class="os-disclaimer-h3">What this app does</h3>
          <p>
            The Polkadot Tax Tool helps you generate a summary of taxable events
            from your activity on the Polkadot ecosystem. Connect a
            Polkadot-compatible wallet — or simply paste one or more public
            wallet addresses — and the Tool will:
          </p>
          <ul class="os-disclaimer-list">
            <li>
              read the <strong>public on-chain history</strong> for those
              addresses across the supported networks (Polkadot, Kusama, and
              supported parachains);
            </li>
            <li>
              identify common <strong>taxable events</strong> such as staking
              rewards, transfers, and swaps;
            </li>
            <li>
              convert each event to your selected <strong>fiat currency</strong>
              using historical price data; and
            </li>
            <li>
              present the results in a dashboard you can review, filter, and
              export.
            </li>
          </ul>
          <p class="os-disclaimer-note">
            The Tool <strong>does not</strong> ask for your private keys or
            seed phrase, <strong>does not</strong> move funds, and
            <strong>does not</strong> broadcast any on-chain transactions on
            your behalf. It only reads publicly available blockchain data.
          </p>
        </section>

        <!-- Disclaimer -->
        <section class="os-disclaimer-section os-disclaimer-section--legal">
          <h3 class="os-disclaimer-h3">Before you continue, please read</h3>
          <p>
            The Polkadot Tax Tool is provided by Pala Labs for
            <strong>informational purposes only</strong>. It is
            <strong>not</strong> tax, legal, accounting, investment, or
            financial advice, and it is <strong>not</strong> a substitute for
            consultation with a qualified professional in your jurisdiction.
          </p>
          <p>
            The Tool produces estimates by reading public on-chain data. These
            estimates <strong>may be incomplete or inaccurate</strong> for
            reasons including, but not limited to: missing or delayed indexer
            data, unsupported transaction types, historical price-feed gaps,
            network reorganisations, and changes in tax rules. You are
            <strong>solely responsible</strong> for verifying any figures,
            classifying your transactions, and filing accurate tax returns in
            your jurisdiction.
          </p>
          <p>
            The Tool is provided <strong>"as is"</strong>, without warranty of
            any kind. To the maximum extent permitted by applicable law, Pala
            Labs and its contributors disclaim all liability for any loss,
            penalty, interest, or damage arising from your use of, or reliance
            on, the Tool or its output.
          </p>
          <p>
            Wallet addresses you enter are treated as
            <strong>public on-chain data</strong>. The Tool queries blockchain
            indexers and price feeds to compute results.
          </p>
          <p class="os-disclaimer-fineprint">
            By clicking <strong>"I Understand"</strong> you confirm that you
            have read, understood, and accepted this disclaimer.
          </p>
        </section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="os-disclaimer-actions">
        <label class="os-disclaimer-check">
          <input
            type="checkbox"
            v-model="acknowledged"
            data-testid="disclaimer-acknowledge"
          />
          <span>I have read and understood the disclaimer above.</span>
        </label>
        <div class="os-disclaimer-buttons">
          <button class="os-btn os-btn--ghost" @click="onCancel">
            Cancel
          </button>
          <button
            class="os-btn os-btn--primary"
            :disabled="!acknowledged"
            data-testid="disclaimer-accept"
            @click="onAccept"
          >
            I Understand
          </button>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { recordDisclaimerAcceptance } from '../../util/disclaimer-acceptance';

const props = defineProps<{
  showDialog: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:showDialog', value: boolean): void;
  (e: 'accepted'): void;
  (e: 'cancelled'): void;
}>();

const acknowledged = ref(false);

// Reset the checkbox each time the dialog is opened so a returning user has
// to re-tick it (avoids accidental acceptance from a previously-mounted state).
watch(
  () => props.showDialog,
  (open) => {
    if (open) acknowledged.value = false;
  },
);

function onAccept() {
  if (!acknowledged.value) return;
  recordDisclaimerAcceptance();
  emit('update:showDialog', false);
  emit('accepted');
}

function onCancel() {
  emit('update:showDialog', false);
  emit('cancelled');
}
</script>

<style scoped>
.os-disclaimer-card {
  max-width: 640px;
  width: 100%;
  background: var(--canvas);
  color: var(--ink);
  border-radius: var(--r-md);
}

.os-disclaimer-header {
  padding: var(--sp-5) var(--sp-6) var(--sp-4);
}
.os-disclaimer-eyebrow {
  font-size: 9px;
  font-weight: var(--fw-semi);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-50);
  margin-bottom: var(--sp-1);
}
.os-disclaimer-title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semi);
  color: var(--ink);
  letter-spacing: var(--tr-snug);
}

.os-disclaimer-body {
  padding: var(--sp-5) var(--sp-6);
  max-height: 60vh;
  overflow-y: auto;
}

.os-disclaimer-section + .os-disclaimer-section {
  margin-top: var(--sp-5);
  padding-top: var(--sp-5);
  border-top: 1px solid var(--border);
}

.os-disclaimer-h3 {
  font-size: var(--fs-base);
  font-weight: var(--fw-semi);
  color: var(--ink);
  margin: 0 0 var(--sp-3);
  letter-spacing: var(--tr-snug);
}

.os-disclaimer-section p {
  font-size: var(--fs-sm);
  line-height: 1.55;
  color: var(--ink-70);
  margin: 0 0 var(--sp-3);
}
.os-disclaimer-section p:last-child {
  margin-bottom: 0;
}

.os-disclaimer-list {
  margin: 0 0 var(--sp-3);
  padding-left: var(--sp-5);
  font-size: var(--fs-sm);
  line-height: 1.55;
  color: var(--ink-70);
}
.os-disclaimer-list li + li {
  margin-top: var(--sp-1);
}

.os-disclaimer-note {
  background: var(--mist);
  border-left: 3px solid var(--blue-500);
  padding: var(--sp-3);
  border-radius: var(--r-sm);
}

.os-disclaimer-section--legal p {
  color: var(--ink);
}

.os-disclaimer-fineprint {
  font-size: var(--fs-xs);
  color: var(--ink-50);
  margin-top: var(--sp-3);
}

.os-disclaimer-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--sp-3);
  padding: var(--sp-4) var(--sp-6);
  background: var(--canvas);
}

.os-disclaimer-check {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-2);
  font-size: var(--fs-sm);
  color: var(--ink);
  cursor: pointer;
  user-select: none;
  line-height: 1.4;
}
.os-disclaimer-check input[type='checkbox'] {
  margin-top: 3px;
  width: 14px;
  height: 14px;
  accent-color: var(--blue-500);
  cursor: pointer;
  flex-shrink: 0;
}

.os-disclaimer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-2);
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
  background: transparent;
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
.os-btn--ghost { color: var(--ink-70); }
.os-btn--ghost:hover { background: var(--mist); }
</style>
