<template>
  <svg class="icon-sprite" aria-hidden="true">
    <symbol id="icon-home" viewBox="0 0 24 24">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />
    </symbol>
    <symbol id="icon-paw" viewBox="0 0 24 24">
      <ellipse cx="12" cy="16.5" rx="5.2" ry="4" />
      <ellipse cx="5.7" cy="11.5" rx="2.2" ry="2.8" transform="rotate(-24 5.7 11.5)" />
      <ellipse cx="9.3" cy="7.2" rx="2.2" ry="2.8" transform="rotate(-8 9.3 7.2)" />
      <ellipse cx="14.8" cy="7.2" rx="2.2" ry="2.8" transform="rotate(8 14.8 7.2)" />
      <ellipse cx="18.4" cy="11.5" rx="2.2" ry="2.8" transform="rotate(24 18.4 11.5)" />
    </symbol>
    <symbol id="icon-article" viewBox="0 0 24 24">
      <path d="M20.2 3.8a6 6 0 0 0-8.5 0L5 10.5V19h8.5l6.7-6.7a6 6 0 0 0 0-8.5Z" />
      <path d="M16 8 2 22M8.5 15.5H15" />
    </symbol>
    <symbol id="icon-gallery" viewBox="0 0 24 24">
      <path d="m8 5 4-3 4 3" />
      <rect x="3" y="5" width="18" height="16" rx="1.5" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m4 18 5-5 4 3 3-3 5 5" />
    </symbol>
    <symbol id="icon-compass" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z" />
    </symbol>
    <symbol id="icon-help" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.6 2.6 0 1 1 3.7 2.4c-.8.4-1.2.9-1.2 1.8M12 17h.01" />
    </symbol>
    <symbol id="icon-search" viewBox="0 0 24 24">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </symbol>
    <symbol id="icon-team" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 20c.3-4 2-6 5.5-6s5.2 2 5.5 6M14 14.5c3.8-.5 5.8 1.3 6.5 4.5" />
    </symbol>
    <symbol id="icon-followers" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="3" />
      <circle cx="5.5" cy="9" r="2.3" />
      <circle cx="18.5" cy="9" r="2.3" />
      <path d="M6.5 20c.3-4 2-6 5.5-6s5.2 2 5.5 6M1.8 19c.2-3.2 1.5-4.8 4.2-4.8 1.2 0 2.2.3 3 .9M22.2 19c-.2-3.2-1.5-4.8-4.2-4.8-1.2 0-2.2.3-3 .9" />
    </symbol>
    <symbol id="icon-fan-heart" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c.3-4.2 2.2-6.2 6-6.2 2 0 3.5.6 4.5 1.8" />
      <path d="M18.2 11.8c-1.6-1.8-4.7.1-3.2 2.4l3.2 3.8 3.2-3.8c1.5-2.3-1.6-4.2-3.2-2.4Z" />
    </symbol>
    <symbol id="icon-edit" viewBox="0 0 24 24">
      <path d="m4 16-1 5 5-1L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17" />
      <path d="m14.5 7.5 3 3M12 21h9" />
    </symbol>
    <symbol id="icon-like" viewBox="0 0 24 24">
      <path d="M7 10v11H3V10h4ZM7 19h10.2a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 18.6 8H14l.7-3.1A2.4 2.4 0 0 0 12.4 2L7 10Z" />
    </symbol>
    <symbol id="icon-bell" viewBox="0 0 24 24">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
    </symbol>
    <symbol id="icon-user" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.4-5 3-7 8-7s7.6 2 8 7H4Z" />
    </symbol>
    <symbol id="icon-calendar" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 2v6M17 2v6M3 10h18M8.5 15l2 2 4-4" />
    </symbol>
    <symbol id="icon-coins" viewBox="0 0 24 24">
      <ellipse cx="10" cy="6" rx="7" ry="3" />
      <path d="M3 6v5c0 1.7 3.1 3 7 3 1.2 0 2.3-.1 3.3-.4M3 11v5c0 1.7 3.1 3 7 3 1.1 0 2.1-.1 3-.3" />
      <ellipse cx="17" cy="14" rx="4" ry="2" />
      <path d="M13 14v4c0 1.1 1.8 2 4 2s4-.9 4-2v-4" />
    </symbol>
    <symbol id="icon-logout" viewBox="0 0 24 24">
      <path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10" />
    </symbol>
    <symbol id="icon-message" viewBox="0 0 24 24">
      <path d="M12 3c-5.1 0-9 3.6-9 8.4 0 2.7 1.3 5.1 3.5 6.7V21l2.7-1.5c.9.3 1.8.5 2.8.5 5.1 0 9-3.6 9-8.4S17.1 3 12 3Z" />
      <path d="m7 14 3.5-3.7 2.4 2.1L17 9l-4.5 5-2.4-2.1L7 14Z" />
    </symbol>
    <symbol id="icon-menu" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </symbol>
    <symbol id="icon-x" viewBox="0 0 24 24">
      <path d="m5 5 14 14M19 5 5 19" />
    </symbol>
    <symbol id="icon-chevron" viewBox="0 0 24 24">
      <path d="m9 6 6 6-6 6" />
    </symbol>
    <symbol id="icon-arrow-left" viewBox="0 0 24 24">
      <path d="m15 5-7 7 7 7" />
    </symbol>
    <symbol id="icon-arrow-up" viewBox="0 0 24 24">
      <path d="m5 15 7-7 7 7" />
    </symbol>
    <symbol id="icon-megaphone" viewBox="0 0 24 24">
      <path d="m4 14 13-5v10L4 14ZM4 14v-4h3M8 16l1.5 5H13l-2-6M19 10l2-2M20 14h3M19 18l2 2" />
    </symbol>
    <symbol id="icon-send" viewBox="0 0 24 24">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </symbol>
    <symbol id="icon-food-bowl" viewBox="0 0 24 24">
      <path d="M4 11h16c0 5.2-3 8-8 8s-8-2.8-8-8Z" />
      <path d="M7 19h10M8 7h.01M12 5h.01M16 7h.01" />
    </symbol>
    <symbol id="icon-training-bone" viewBox="0 0 24 24">
      <path d="M7.2 8.8 15.3 17M16.6 5.1a2.5 2.5 0 1 1 2.3 3.8 2.5 2.5 0 1 1-3.6 3.4M7.4 18.9a2.5 2.5 0 1 1-2.3-3.8 2.5 2.5 0 1 1 3.6-3.4" />
    </symbol>
    <symbol id="icon-heart-outline" viewBox="0 0 24 24">
      <path d="M20.8 5.8c-2.3-2.5-6.2-1.7-8.8 1.1-2.6-2.8-6.5-3.6-8.8-1.1-2.4 2.6-1.2 6.5 1 8.6L12 21l7.8-6.6c2.2-2.1 3.4-6 1-8.6Z" />
    </symbol>
    <symbol id="icon-location-alert" viewBox="0 0 24 24">
      <path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z" />
      <path d="M12 6.5v4M12 14h.01" />
    </symbol>
    <symbol id="icon-medical-cross" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M9 5V3h6v2M12 9v8M8 13h8" />
    </symbol>
    <symbol id="icon-scissors" viewBox="0 0 24 24">
      <circle cx="6" cy="7" r="3" />
      <circle cx="6" cy="17" r="3" />
      <path d="m8.5 8.5 12 8.5M8.5 15.5 20.5 7" />
    </symbol>
  </svg>
</template>

<style src="../../styles/components/IconSprite.css"></style>
