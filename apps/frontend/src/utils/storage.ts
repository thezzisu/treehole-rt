import { useLocalStorage } from '@vueuse/core'

export const token = useLocalStorage('thrt-token', '')
