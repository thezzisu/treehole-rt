<template>
  <div class="min-h-100dvh flex items-center justify-center">
    <VCard title="Start">
      <VCardText>
        <VTextField v-model="chatroomId" label="ChatRoom ID" />
        <VTextField v-model="token" label="Token (Optional)" type="password" />
      </VCardText>
      <VCardActions>
        <VBtn text="Join" color="primary" variant="flat" @click="join" />
        <VBtn text="Join (as Admin)" :disabled="!token" @click="joinAsAdmin" />
        <VBtn text="Projector" :disabled="true" @click="projector" />
      </VCardActions>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { token } from '@/utils/storage'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const chatroomId = ref(`${route.query.chatroomId ?? crypto.randomUUID()}`)
const router = useRouter()

function join() {
  router.push({ path: '/client', query: { chatroomId: chatroomId.value } })
}

function joinAsAdmin() {
  router.push({
    path: '/client',
    query: { chatroomId: chatroomId.value, admin: 1 }
  })
}

function projector() {
  // Electron Specific Code
}
</script>
