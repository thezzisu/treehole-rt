<template>
  <div class="h-100dvh p-8 flex justify-center items-stretch">
    <VCard class="flex-1 max-w-256">
      <div class="grid grid-rows-[auto_auto_1fr_auto_auto] fill-height">
        <VCardTitle>
          <div>
            <div>ChatRoom</div>
            <div class="text-xs">
              <code>#{{ chatroomId }}</code>
            </div>
          </div>
        </VCardTitle>
        <VDivider />
        <VCardText class="overflow-y-scroll">
          <VAlert v-if="err" type="error" :text="err" />
          <div class="flex flex-col-reverse items-stretch gap-2">
            <VCard variant="outlined" v-for="(m, i) in messages" :key="i">
              <VCardTitle>
                <div class="flex justify-between items-center">
                  <div class="text-lg">
                    <code>#{{ i }}</code> by
                    <b>{{ getName(m.sender) }}</b>
                  </div>
                  <div class="text-xs">
                    <code>{{ new Date(m.ts).toLocaleString() }}</code>
                  </div>
                </div>
              </VCardTitle>
              <VCardText>
                <article
                  class="markdown-body"
                  v-html="renderMarkdown(m.message)"
                />
              </VCardText>
            </VCard>
          </div>
        </VCardText>
        <VDivider />
        <VCardText>
          <VTextarea
            v-model="msg"
            label="Message"
            placeholder="Say something..."
            class="font-mono"
          />
          <VBtn
            block
            color="primary"
            variant="flat"
            @click="sendMessage"
            :disabled="!msg"
          >
            Send
          </VBtn>
        </VCardText>
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import io from 'socket.io-client'
import { token } from '@/utils/storage'
import { getName } from '@/utils/name'
import { renderMarkdown } from '@/utils/markdown'
import { ref } from 'vue'

const route = useRoute()
const chatroomId = route.query.chatroomId as string
const admin = !!route.query.admin
const endpoint = import.meta.env.VITE_SIO_ENDPOINT
const socket = io(endpoint, {
  query: {
    type: admin ? 'admin' : 'client',
    chatroomId,
    token: token.value
  }
})
const err = ref('')
socket.on('error', (e) => {
  err.value = '' + e
})
const messages = ref<{ sender: number; ts: number; message: string }[]>([])
socket.on('message', (arr) => {
  messages.value.push(...arr)
})

const msg = ref('')
function sendMessage() {
  socket.emit('message', msg.value)
  msg.value = ''
}
</script>
