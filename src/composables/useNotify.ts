import { useQuasar } from 'quasar'

export function useNotify() {
  const $q = useQuasar()

  const showSuccess = (message: string) => {
    $q.notify({
      message,
      type: 'positive',
      icon: 'check_circle',
      progress: true,
      actions: [{ icon: 'close', color: 'white', round: true }],
    })
  }

  const showError = (message: string) => {
    $q.notify({
      message,
      type: 'negative',
      icon: 'error',
      progress: true,
      actions: [{ icon: 'close', color: 'white', round: true }],
    })
  }

  return {
    showSuccess,
    showError,
  }
}
