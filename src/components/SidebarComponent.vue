<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@stores/auth'
import { ROLES } from '@constants/roles'

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
    :width="260"
    :breakpoint="600"
    :mini-width="76"
    show-if-above
    bordered
    class="sidebar bg-white"
  >
    <div class="column fit no-wrap justify-between">
      <div>
        <div class="row items-center justify-between q-py-md q-px-md" style="min-height: 70px">
          <div class="row items-center no-wrap">
            <q-btn flat round dense icon="menu" color="grey-7" @click="toggleSidebar" />
            <div
              v-show="!mini"
              class="text-h6 text-weight-bold text-primary q-ml-md tracking-tight"
              style="letter-spacing: -0.5px"
            >
              EGlobal
            </div>
          </div>
        </div>

        <q-separator color="grey-2" />

        <div
          class="column items-center q-py-lg text-center transition-all"
          :class="mini ? 'q-px-xs' : 'q-px-md'"
        >
          <q-avatar
            color="primary"
            text-color="white"
            :size="mini ? '36px' : '52px'"
            class="shadow-1 transition-all"
          >
            {{ state.email?.charAt(0).toUpperCase() }}
          </q-avatar>

          <div
            v-show="!mini"
            class="q-mt-sm text-subtitle2 text-weight-bold text-grey-9 ellipsis full-width"
          >
            {{ state.email }}
          </div>

          <div
            v-show="!mini"
            class="text-caption text-weight-medium text-primary text-uppercase q-mt-xs bg-blue-1 q-px-sm q-py-xs"
            style="border-radius: 4px; font-size: 0.65rem; letter-spacing: 0.5px"
          >
            {{ state.role }}
          </div>
        </div>

        <q-separator color="grey-2" class="q-mb-sm" />

        <q-list class="col q-px-md">
          <q-item
            v-for="item in menuItemsForRoles"
            :key="item.label"
            clickable
            :to="item.to"
            exact
            active-class="menu-item-active text-primary text-weight-bold"
            class="menu-item q-my-xs text-grey-7"
          >
            <q-item-section avatar class="justify-center items-center" style="min-width: 44px">
              <q-icon :name="item.icon" size="22px">
                <q-tooltip
                  v-if="mini"
                  anchor="center right"
                  self="center left"
                  class="bg-dark text-white shadow-2"
                >
                  {{ item.label }}
                </q-tooltip>
              </q-icon>
            </q-item-section>

            <q-item-section v-show="!mini" class="text-body2">
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div>
        <q-separator color="grey-2" class="q-mb-sm" />

        <div class="q-pa-md">
          <q-btn
            flat
            color="negative"
            class="full-width logout-btn"
            icon="logout"
            :label="mini ? '' : 'Logout'"
            no-caps
            style="border-radius: 8px; min-height: 40px"
            @click="onLogout"
          >
            <q-tooltip
              v-if="mini"
              anchor="center right"
              self="center left"
              class="bg-negative text-white shadow-2"
            >
              Logout
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<style scoped>
.transition-all {
  transition:
    transform 0.2s ease,
    width 0.2s ease,
    size 0.2s ease,
    padding 0.2s ease;
}

.menu-item {
  border-radius: 8px;
  min-height: 44px;
  padding: 0 12px;
  position: relative;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #f3f4f6;
  color: #111827;
}

.menu-item-active {
  background: #eff6ff !important;
}

.menu-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  height: 70%;
  width: 4px;
  background-color: var(--q-primary);
  border-radius: 0 4px 4px 0;
}

.logout-btn:hover {
  background: #fef2f2;
}
</style>
