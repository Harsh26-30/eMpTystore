.mp-gap {
    margin-top: 20px;
}

.mp-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 20px;
}

.mp-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.mp-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
}

.mp-amount {
    font-size: 1.25rem;
    color: var(--green-700);
}

.mp-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mp-details > div {
    display: grid;
    grid-template-columns: 8.5rem 1fr;
    gap: 12px;
}

.mp-details dt {
    color: var(--muted);
}

.mp-details dd {
    min-width: 0;
    overflow-wrap: anywhere;
}

.mp-details a {
    color: var(--green-700);
    font-weight: 600;
}

.mp-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 14px;
    border-top: 1px solid var(--line);
}

.mp-actions .btn {
    flex: 1 1 110px;
}
