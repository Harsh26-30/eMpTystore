.ld-wrap {
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 24px 16px;
  background: var(--bg);
  font-family: var(--font-body);
}

.ld-inline {
  min-height: 60vh;
}

.ld-mark {
  position: relative;
  width: 112px;
  height: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ld-ring {
  position: absolute;
  inset: 0;
  border: 4px solid var(--green-100);
  border-top-color: var(--green-700);
  border-radius: 50%;
  animation: ld-spin 0.9s linear infinite;
}

.ld-logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
  background: var(--surface);
  border-radius: var(--radius-md);
}

.ld-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--muted);
}

@keyframes ld-spin {
  to {
    transform: rotate(360deg);
  }
}
