.wb-card {
  width: calc(100% - 32px);
  max-width: 560px;
  margin: 16px auto 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wb-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.wb-text {
  font-size: 1rem;
  line-height: 1.5;
}

.wb-min {
  padding: 12px 14px;
  color: var(--muted);
  background: var(--green-50);
  border-left: 4px solid var(--marigold);
  border-radius: var(--radius-sm);
}

.wb-confirm {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wb-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wb-big {
  min-height: 52px;
  font-size: 1.05rem;
}

@media (min-width: 520px) {
  .wb-actions {
    flex-direction: row;
  }
}
