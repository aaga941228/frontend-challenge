<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@stores/auth'
import { useNotify } from '@composables/useNotify'

const router = useRouter()
const { login } = useAuthStore()
const { showError } = useNotify()

const submitting = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const form = ref()

const emailRules = [
  (value: string) => !!value || 'El correo es requerido',
  (value: string) => /.+@.+\..+/.test(value) || 'Correo inválido',
]

const passwordRules = [(value: string) => !!value || 'La contraseña es requerida']

const onSubmitLogin = async () => {
  try {
    submitting.value = true
    const valid = await form.value.validate()

    if (!valid) return

    await login(email.value, password.value)

    router.push({ name: 'dashboard' })
  } catch (error: unknown) {
    showError(error as string)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-page flex flex-center items-center bg-grey-1">
    <q-card
      class="login-card q-pa-xl shadow-2 bg-white"
      style="width: 100%; max-width: 440px; border-radius: 12px"
    >
      <div class="text-center q-mb-lg">
        <q-avatar
          size="64px"
          color="primary"
          text-color="white"
          icon="credit_score"
          class="shadow-1"
        />

        <div class="text-h4 text-weight-bold text-grey-9 q-mt-md">Welcome</div>

        <div class="text-subtitle2 text-grey-6 q-mt-xs">Log in to continue</div>
      </div>

      <q-form ref="form" class="q-gutter-y-sm" @submit.prevent="onSubmitLogin">
        <q-input
          v-model="email"
          :rules="emailRules"
          :disable="submitting"
          type="email"
          class="full-width"
          label="Email"
          outlined
          dense
          lazy-rules
        >
          <template #prepend>
            <q-icon name="mail" color="grey-5" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          :disable="submitting"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          class="full-width q-mt-sm"
          outlined
          dense
        >
          <template #prepend>
            <q-icon name="lock" color="grey-5" />
          </template>

          <template #append>
            <q-icon
              class="cursor-pointer"
              color="grey-6"
              :name="showPassword ? 'visibility_off' : 'visibility'"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-btn
          :disable="submitting"
          type="submit"
          color="primary"
          label="Login"
          class="full-width q-mt-lg q-py-sm text-weight-bold"
          unelevated
          no-caps
          style="border-radius: 8px"
        />
      </q-form>
    </q-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100dvh;
}
</style>
