.dod-wrap,
.dod-wrap *,
.dod-panel,
.dod-panel * {
  box-sizing: border-box;
}

.dod-wrap,
.dod-panel {
  width: 100%;
  font-family: var(--font-body);
  color: var(--ink);
}

.dod-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dod-heading {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.dod-status {
  padding: 16px;
  font-size: 1rem;
  color: var(--muted);
  text-align: center;
}

/* Empty state */

.dod-empty {
  gap: 10px;
}

.dod-video {
  width: 100%;
  max-width: 280px;
  max-height: 200px;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.dod-empty-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
}

.dod-empty-text {
  max-width: 34ch;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--muted);
}

/* Order card */
.dod-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dod-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 16px;
}

.dod-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.dod-order-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.dod-order-id {
  margin-top: 2px;
  font-size: 0.8rem;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.dod-facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.dod-fact dt {
  font-size: 0.82rem;
  color: var(--muted);
}

.dod-fact dd {
  margin: 2px 0 0;
  font-size: 1.02rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.dod-fact-wide {
  grid-column: 1 / -1;
}

.dod-items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  font-size: 0.97rem;
  background: var(--green-50);
  border-radius: var(--radius-sm);
}

.dod-help {
  font-size: 0.97rem;
  line-height: 1.45;
  color: var(--muted);
}

.dod-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Big tap targets for use outdoors */
.dod-big {
  min-height: 54px;
  font-size: 1.05rem;
}
/* Scan dialog */
.dod-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 61, 49, 0.6);
}

.dod-dialog {
  width: 100%;
  max-width: 440px;
  max-height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 18px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 60px rgba(15, 61, 49, 0.35);
}

.dod-dialog-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
}

.dod-dialog-text {
  font-size: 0.97rem;
  line-height: 1.45;
  color: var(--muted);
}

@media (min-width: 520px) {
  .dod-actions {
    flex-direction: row;
  }

  .dod-facts {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dod-video {
    display: none;
  }
}
