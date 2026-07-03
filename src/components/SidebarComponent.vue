<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@stores/auth'
import { ROLES } from '@/constants/roles'

const router = useRouter()
const { logout, state } = useAuthStore()

const mini = ref(false)

const menuItems = [
  { role: 'public', label: 'EGlobal', icon: 'dashboard', to: '/dashboard' },
  { role: ROLES.OPERATOR, label: 'Operator', icon: 'engineering', to: '/operator' },
  { role: ROLES.SUPERVISOR, label: 'Supervisor', icon: 'admin_panel_settings', to: '/supervisor' },
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
  <q-drawer
    :model-value="true"
    :mini="mini"
    :width="240"
    :breakpoint="0"
    :mini-width="72"
    show-if-above
    bordered
    class="sidebar"
  >
    <div class="column fit no-wrap">
      <div class="row items-center q-pa-md">
        <q-btn flat round dense icon="menu" @click="toggleSidebar" />

        <div v-show="!mini" class="text-h6 text-weight-bold q-ml-sm">EGlobal</div>
      </div>

      <q-separator />

      <div class="column items-center q-py-lg">
        <q-avatar color="primary" text-color="white" size="48px">
          {{ state.email?.charAt(0).toUpperCase() }}
        </q-avatar>

        <div v-show="!mini" class="q-mt-sm text-subtitle2 text-weight-medium">
          {{ state.email }}
        </div>

        <div v-show="!mini" class="text-caption text-grey-7 text-uppercase">
          {{ state.role }}
        </div>
      </div>

      <q-separator />

      <q-list padding class="col">
        <q-item
          v-for="item in menuItemsForRoles"
          :key="item.label"
          clickable
          :to="item.to"
          exact
          active-class="bg-primary text-white"
          class="menu-item q-my-xs"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon">
              <q-tooltip v-if="mini">
                {{ item.label }}
              </q-tooltip>
            </q-icon>
          </q-item-section>

          <q-item-section v-show="!mini">
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <div class="q-pa-md">
        <q-btn
          flat
          color="negative"
          class="full-width"
          icon="logout"
          :label="mini ? '' : 'Logout'"
          @click="onLogout"
        >
          <q-tooltip v-if="mini"> Logout </q-tooltip>
        </q-btn>
      </div>
    </div>
  </q-drawer>
</template>

<style scoped>
.sidebar {
  background: white;
}

.menu-item {
  border-radius: 10px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(25, 118, 210, 0.08);
}
</style>
