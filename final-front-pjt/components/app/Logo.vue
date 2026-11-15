<template>
  <span class="logo">
    <svg
      class="logo__mark"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="9"
        r="4.2"
        fill="#ffd27a"
      />
      <circle
        cx="16"
        cy="7"
        r="4.6"
        fill="#ffc857"
      />
      <circle
        cx="22"
        cy="9"
        r="4.2"
        fill="#ffd27a"
      />
      <path
        d="M6 12h20l-2.4 16.2a2 2 0 0 1-2 1.8H10.4a2 2 0 0 1-2-1.8z"
        fill="#fff"
      />
      <path
        d="M10.5 12h3l.6 18h-2.6zM18 12h3l-1.1 18h-2.5z"
        fill="#ff4d6d"
      />
    </svg>
    <span class="logo__text">MOVIE<strong>101</strong></span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.logo__mark {
  width: 28px;
  height: 28px;
}

.logo__text {
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.logo__text strong {
  margin-left: 2px;
  color: var(--c-accent);
}
</style>
