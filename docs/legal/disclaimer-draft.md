# Polkadot Tax Tool — Legal Disclaimer (DRAFT)

> **Status:** Draft for legal review. Not yet approved for production use.
> **Owner:** Pala Labs
> **Last updated:** 2026-05-26
> **Reviewer notes:** see *Open questions for legal* at the bottom.

---

## 1. Context for Reviewers

The Polkadot Tax Tool ("the Tool") is a self-service application that helps users
estimate taxable events from on-chain Polkadot ecosystem activity (staking
rewards, transfers, swaps, etc.) by reading public blockchain data for wallet
addresses the user provides.

This document drafts the legal disclaimer that will be displayed inside the
application. The current plan is:

- **Product introduction (Section 3)** is shown at the top of the dialog so
  the user understands what the Tool does before being asked to accept the
  disclaimer.
- **Short-form disclaimer (Section 4)** is shown directly below the
  introduction in a **must-accept dialog** the first time a user attempts to
  connect or add a wallet. Acceptance is recorded in the user's browser
  (`localStorage`) so the dialog is not shown again on the same device.
- **Long-form disclaimer (Section 5)** is linked from the dialog ("Read the
  full disclaimer") and from the application footer. It is intended to serve
  as a standalone reference document.
- Both texts are **jurisdiction-neutral** in this draft. Legal may wish to add
  jurisdiction-specific carve-outs (US, EU/MiCA, India/VDA, etc.) or to
  reference a separate Terms of Service / Privacy Policy.

---

## 2. Suggested Dialog UX (for reviewer awareness)

```
┌────────────────────────────────────────────────────────────┐
│  Welcome to the Polkadot Tax Tool                          │
│                                                            │
│  [ product introduction — see Section 3 ]                  │
│                                                            │
│  Before you continue, please read:                         │
│  [ short-form disclaimer text — see Section 4 ]            │
│                                                            │
│  [ ] I have read and understood the disclaimer above.      │
│                                                            │
│       [ Read the full disclaimer ]                         │
│                                                            │
│                          [ Cancel ]   [ I Understand ]     │
└────────────────────────────────────────────────────────────┘
```

- Triggered the **first time** the user attempts to connect or add a wallet
  (from either the "Connect wallet", inline "Add", or "+ Add wallet" buttons
  on the Wallets dashboard).
- The "I Understand" button is disabled until the checkbox is ticked.
- "Cancel" closes the dialog without proceeding to wallet connection.
- The acceptance flag in `localStorage` includes a **version key** so that if
  the disclaimer is materially updated, all users are re-prompted.

---

## 3. Product Introduction (shown above the disclaimer in the dialog)

> **Polkadot Tax Tool — what this app does**
>
> The Polkadot Tax Tool helps you generate a summary of taxable events from
> your activity on the Polkadot ecosystem. You connect a Polkadot-compatible
> wallet — or simply paste one or more public wallet addresses — and the
> Tool will:
>
> - read the **public on-chain history** for those addresses across the
>   supported networks (Polkadot, Kusama, and supported parachains);
> - identify common **taxable events** such as staking rewards, transfers,
>   and swaps;
> - convert each event to your selected **fiat currency** using historical
>   price data; and
> - present the results in a dashboard you can review, filter, and export.
>
> The Tool **does not** ask for your private keys or seed phrase, **does
> not** move funds, and **does not** broadcast any on-chain transactions on
> your behalf. It only reads publicly available blockchain data.

---

## 4. Short-Form Disclaimer (shown in dialog)

> **Important — please read before using the Polkadot Tax Tool**
>
> The Polkadot Tax Tool ("the Tool") is provided by Pala Labs for
> **informational purposes only**. It is **not** tax, legal, accounting,
> investment, or financial advice, and it is **not** a substitute for
> consultation with a qualified professional in your jurisdiction.
>
> The Tool produces estimates by reading public on-chain data. These estimates
> **may be incomplete or inaccurate** for reasons including, but not limited
> to: missing or delayed indexer data, unsupported transaction types,
> historical price-feed gaps, network reorganisations, and changes in tax
> rules. You are **solely responsible** for verifying any figures, classifying
> your transactions, and filing accurate tax returns in your jurisdiction.
>
> The Tool is provided **"as is"**, without warranty of any kind. To the
> maximum extent permitted by applicable law, Pala Labs and its contributors
> disclaim all liability for any loss, penalty, interest, or damage arising
> from your use of, or reliance on, the Tool or its output.
>
> Wallet addresses you enter are treated as **public on-chain data**. The Tool
> queries blockchain indexers and price feeds to compute results. See the full
> disclaimer for details on what is and is not stored.
>
> By clicking **"I Understand"** you confirm that you have read, understood,
> and accepted this disclaimer.

---

## 5. Long-Form Disclaimer (linked from dialog / footer)

### 5.1 No Professional Advice

The Polkadot Tax Tool ("the Tool", "we", "our") is operated by Pala Labs
("Pala Labs"). All content, calculations, reports, exports, and other output
produced by the Tool are provided for **general informational purposes only**.

Nothing produced by the Tool constitutes, or should be relied upon as:

- tax advice;
- legal advice;
- accounting advice;
- investment, trading, or financial advice; or
- a recommendation to take, or to refrain from taking, any action.

Cryptocurrency taxation is complex, jurisdiction-specific, and frequently
changing. You should always consult a qualified tax professional, accountant,
or legal adviser licensed in your jurisdiction before making decisions based
on output from the Tool.

### 5.2 Accuracy, Completeness & Limitations of On-Chain Data

The Tool computes results by querying public on-chain data for wallet
addresses that you provide, combined with historical price data obtained from
third-party sources. You acknowledge and accept that:

- The Tool may not support every blockchain, parachain, asset, transaction
  type, smart-contract interaction, or staking mechanism within the Polkadot
  ecosystem.
- On-chain data may be incomplete, delayed, missing, or temporarily
  unavailable due to indexer outages, archive-node gaps, chain
  reorganisations, runtime upgrades, or other technical factors outside our
  control.
- Historical fiat conversion values depend on third-party price feeds and
  may be unavailable or inaccurate for certain timestamps, illiquid assets,
  or pre-listing periods.
- Cost-basis methodology, taxable-event classification, and tax treatment of
  events such as staking rewards, airdrops, swaps, transfers between own
  wallets, and DeFi interactions vary significantly by jurisdiction. The
  Tool's classification choices may not match those required by your tax
  authority.
- Your tax position can also be affected by activity that is **not** visible
  on-chain (e.g. centralised-exchange trades, off-chain transfers, gifts,
  inheritance) which the Tool cannot see.

You are **solely responsible** for reviewing the Tool's output for accuracy
and completeness, for reconciling it against your own records, and for
making any corrections required before relying on it for tax filing or any
other purpose.

### 5.3 Your Responsibility

By using the Tool you agree that:

- You will independently verify any figures, classifications, or summaries
  produced by the Tool before relying on them.
- You are solely responsible for the timely, accurate, and complete filing
  of your tax returns and any related disclosures in your jurisdiction.
- You are solely responsible for the payment of any taxes, penalties,
  interest, or other amounts owed to any tax authority.
- You will not represent or imply to any third party (including any tax
  authority, accountant, regulator, or court) that output from the Tool has
  been reviewed, certified, audited, or endorsed by Pala Labs.

### 5.4 "As Is" Provision and No Warranty

The Tool is provided on an **"as is"** and **"as available"** basis, without
warranties of any kind, whether express, implied, statutory, or otherwise.
To the maximum extent permitted by applicable law, Pala Labs disclaims all
warranties, including (without limitation):

- warranties of merchantability, fitness for a particular purpose,
  non-infringement, and quiet enjoyment;
- warranties that the Tool will be uninterrupted, secure, error-free, free
  of harmful components, or that defects will be corrected; and
- warranties as to the accuracy, reliability, completeness, currency, or
  legality of any output of the Tool.

### 5.5 Limitation of Liability

To the maximum extent permitted by applicable law, in no event shall Pala
Labs, its affiliates, officers, employees, contractors, or contributors be
liable to you or to any third party for any direct, indirect, incidental,
special, consequential, exemplary, or punitive damages, or for any loss of
profits, revenue, data, goodwill, tax refunds, or other intangible losses
arising out of or relating to your access to, use of, or inability to use
the Tool, or to any reliance placed on its output — including, without
limitation, any tax penalties, interest, or assessments imposed on you by
any tax authority.

### 5.6 Wallet Addresses and On-Chain Data

The wallet addresses you submit to the Tool refer to **public on-chain
identifiers**. The transactions associated with those addresses are
publicly visible on the relevant blockchains and can be read by anyone
operating, or querying, the corresponding network or its indexers.

Submitting a wallet address to the Tool does **not** grant the Tool any
ability to move funds, sign transactions, or otherwise control assets held
at that address. The Tool does not request, transmit, or store private
keys, seed phrases, or signing credentials, and you should never share
those with the Tool or with anyone claiming to represent it.

For information about how the Tool collects, processes, and stores data
associated with your use of the application (including any analytics,
caching, and operational logs), please refer to the **Privacy Policy**
[link TBD].

### 5.7 Third-Party Services

The Tool relies on third-party services, including blockchain RPC
endpoints, indexers, and price-data providers. We do not control those
services and are not responsible for their availability, accuracy, terms,
or privacy practices. Use of the Tool is subject to the terms and policies
of those third parties to the extent applicable.

### 5.8 Changes to This Disclaimer

Pala Labs may update this disclaimer from time to time. Material changes
will cause you to be re-prompted to accept the updated disclaimer the next
time you use the Tool. The date at the top of this document indicates when
it was last revised. Your continued use of the Tool after such a change
constitutes acceptance of the updated disclaimer.

### 5.9 Severability

If any provision of this disclaimer is held to be unenforceable or invalid
under any applicable law, the remaining provisions shall continue in full
force and effect, and the unenforceable provision shall be interpreted to
fulfil its intended purpose to the maximum extent permitted by law.

### 5.10 Governing Law

This disclaimer is governed by and construed in accordance with the laws
of **[GOVERNING JURISDICTION — TBD by legal]**, without regard to its
conflict-of-laws provisions.

### 5.11 Contact

Questions about this disclaimer can be sent to **[CONTACT EMAIL — TBD by
legal]**.

---

## 6. Open Questions for Legal

Items below are placeholders or open decisions intended for the legal team:

1. **Operating entity name & form.** Confirm the exact legal entity to
   reference — currently "Pala Labs". If a specific operating entity (LLC,
   Pvt. Ltd., GmbH, etc.) should be named, please supply.
2. **Governing law / venue.** Section 5.10 needs a governing-law clause
   (and, if desired, a venue / arbitration clause).
3. **Jurisdiction-specific carve-outs.** Should we add explicit references
   for any of:
   - United States (IRS / Circular 230 / state-level taxes)
   - India (Income Tax Act, VDA provisions u/s 2(47A), Section 115BBH, TDS
     u/s 194S, CBDT guidance)
   - European Union (MiCA, DAC8)
   - United Kingdom (HMRC cryptoassets manual)
   - Other priority markets?
4. **Relationship to Terms of Service / Privacy Policy.** Should this
   disclaimer remain standalone, or be folded into a broader ToS document?
   Section 5.6 references a Privacy Policy that does not yet exist.
5. **Re-acceptance triggers.** We plan to re-prompt users only on
   *material* updates (tracked via a version key in `localStorage`).
   Confirm this is acceptable, or whether re-acceptance should be required
   on **every** revision.
6. **Output-document footer.** Should generated exports (CSV / PDF tax
   reports) carry an abbreviated disclaimer footer? If yes, please draft
   the language to include.
7. **Limitation-of-liability cap.** Section 5.5 currently disclaims
   liability "to the maximum extent permitted by applicable law" without a
   monetary cap. Confirm whether a cap (e.g. fees paid in the prior 12
   months, or a fixed amount) is preferred.
8. **Audience-specific warnings.** Should we warn specific user categories
   (e.g. professional tax preparers, businesses, regulated entities) that
   the Tool is intended for **individual informational use only**?

---

*End of draft.*
