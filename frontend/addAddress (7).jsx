/* Top bar shared by every signed-in page */

.hd,
.hd *,
.hd *::before,
.hd *::after {
  box-sizing: border-box;
}

.hd {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: var(--green-900);
  color: #fff;
  font-family: var(--font-body);
}

.hd-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
}

.hd-logo {
  flex: none;
  width: 76px;
  padding: 5px 7px;
  background: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.hd-logo img {
  display: block;
  width: 100%;
  height: auto;
}

.hd-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.hd-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 56px;
  min-height: 48px;
  padding: 4px 8px;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  color: #fff;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.hd-btn img {
  display: block;
  width: 24px;
  height: 24px;
}

.hd-btn:hover,
.hd-switch:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* Open / closed and on-service switches */
.hd-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 4px 10px;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.hd-track {
  flex: none;
  width: 40px;
  height: 22px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #6C8179;
  border-radius: 999px;
  transition: background-color 0.15s;
}

.hd-knob {
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.15s;
}

.hd-switch[aria-checked="true"] .hd-track {
  background: var(--marigold);
}

.hd-switch[aria-checked="true"] .hd-knob {
  transform: translateX(18px);
}

/* Seller sections */
.hd-tabs {
  display: flex;
  gap: 4px;
  padding: 0 12px;
  overflow-x: auto;
}

.hd-tab {
  flex: 1 0 auto;
  min-height: 44px;
  padding: 0 14px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  color: #B5CCC2;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
}

.hd-tab:hover {
  color: #fff;
}

.hd-tab[aria-selected="true"] {
  color: #fff;
  border-bottom-color: var(--marigold);
}

@media (max-width: 400px) {
  .hd-switch-label {
    max-width: 5.5rem;
    line-height: 1.15;
  }
}

@media (min-width: 760px) {
  .hd-bar {
    padding: 10px 28px;
  }

  .hd-logo {
    width: 92px;
  }

  .hd-tabs {
    padding: 0 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hd-track,
  .hd-knob {
    transition: none;
  }
}
