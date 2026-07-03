<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@stores/auth'

const router = useRouter()
const { logout, state } = useAuthStore()

const mini = ref(false)

const menuItems = [
  { role: 'public', label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
  { role: 'operator', label: 'Operator', icon: 'engineering', to: '/operator' },
  { role: 'supervisor', label: 'Supervisor', icon: 'admin_panel_settings', to: '/supervisor' },
]

const menuItemsForRoles = computed(() =>
  menuItems.filter(x => {
    return x.role === 'public' || x.role === state.role
  })
)

const toggleSidebar = () => {
  mini.value = !mini.value
}

const onLogout = () => {
  logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <q-drawer :model-value="true" :breakpoint="0" :mini="mini" :mini-width="64" :width="240" bordered>
    <div class="column fit">
      <div class="q-pa-sm">
        <q-btn flat round dense icon="menu" @click="toggleSidebar">
          <q-tooltip>Expand / Collapse</q-tooltip>
        </q-btn>
      </div>

      <q-list class="col">
        <q-item v-for="item in menuItemsForRoles" :key="item.label" clickable :to="item.to">
          <q-item-section avatar>
            <q-icon :name="item.icon">
              <q-tooltip v-if="mini" anchor="center right" self="center left">
                {{ item.label }}
              </q-tooltip>
            </q-icon>
          </q-item-section>

          <q-item-section v-show="!mini">
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>

      <div class="q-pa-sm">
        <q-btn
          flat
          color="negative"
          icon="logout"
          class="full-width"
          :label="mini ? '' : 'Logout'"
          @click="onLogout"
        >
          <q-tooltip v-if="mini" anchor="center right" self="center left"> Logout </q-tooltip>
        </q-btn>
      </div>
    </div>
  </q-drawer>
</template>
