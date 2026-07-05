<template>
  <q-page class="column flex-center q-pa-xl">
    <q-icon name="error_outline" size="100px" color="primary" />

    <div class="text-h3 text-weight-bold q-mt-lg">404</div>

    <div class="text-h6 text-grey-7 q-mt-sm">Page not found</div>

    <div class="text-body1 text-grey q-mt-md text-center" style="max-width: 400px">
      The page you are looking for does not exist or has been moved.
    </div>

    <q-btn
      class="q-mt-xl"
      color="primary"
      icon="dashboard"
      label="Back to dashboard"
      @click="$router.replace('/dashboard')"
    />
  </q-page>
</template>
