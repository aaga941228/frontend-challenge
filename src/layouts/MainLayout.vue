<script setup lang="ts">
import SidebarComponent from '@components/SidebarComponent.vue'
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <SidebarComponent />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
