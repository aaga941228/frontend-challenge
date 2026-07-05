<template>
  <q-page class="column flex-center q-pa-lg bg-grey-1 text-center">
    <div class="column flex-center style-container" style="max-width: 480px; width: 100%">
      <div
        class="q-pa-lg q-mb-md bg-blue-1 text-primary flex flex-center shadow-1 animate-pop"
        style="border-radius: 50%; width: 140px; height: 140px"
      >
        <q-icon name="explore_off" size="72px" />
      </div>

      <div
        class="text-h2 text-weight-bolder text-grey-9 tracking-tight"
        style="letter-spacing: -1px"
      >
        404
      </div>

      <div class="text-h6 text-weight-bold text-grey-8 q-mt-sm">Page Not Found</div>

      <div class="text-body2 text-grey-6 q-mt-sm q-px-md leading-relaxed">
        The page you are looking for does not exist, has been moved, or you might not have
        permission to view it.
      </div>

      <q-btn
        class="q-mt-xl q-px-lg q-py-sm text-weight-bold shadow-1"
        color="primary"
        icon="dashboard"
        label="Back to Dashboard"
        no-caps
        unelevated
        style="border-radius: 8px"
        @click="$router.replace('/dashboard')"
      />
    </div>
  </q-page>
</template>

<style scoped>
.tracking-tight {
  line-height: 1;
}
.leading-relaxed {
  line-height: 1.5;
}

.animate-pop {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes popIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
