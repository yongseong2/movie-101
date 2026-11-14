<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator
    color="#ff4d6d"
    :height="2"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <AppToaster />
  <AppConfirmDialog />
</template>
