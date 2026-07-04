import axios from 'axios'
import { useAuthStore } from '@stores/auth'

const http = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const auth = useAuthStore()

  if (auth.state.token) {
    config.headers.Authorization = `Bearer ${auth.state.token}`
  }

  return config
})

export default http
