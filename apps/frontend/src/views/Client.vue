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
                <div class="flex items-center gap-2">
                  <div class="text-lg">
                    <code>#{{ i }}</code> by
                    <b>{{ getName(m.sender) }}</b>
                  </div>
                  <div class="flex-1" />
                  <div v-if="m.d" class="text-xs">
                    <b>Edited</b>
                  </div>
                  <div class="text-xs">
                    <code>{{ new Date(m.ts).toLocaleString() }}</code>
                  </div>
                  <VIcon
                    v-if="admin || m.sender === senderId"
                    icon="mdi-pencil"
                    size="24"
                    @click="switchEdit(i)"
                    :color="editId === i ? 'info' : 'grey'"
                  />
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
            :placeholder="'Say something as ' + getName(senderId)"
            class="font-mono"
          />
          <VBtn block color="primary" variant="flat" @click="sendMessage">
            {{
              editId === undefined
                ? `Send as ${getName(senderId)}`
                : `Edit #${editId}`
            }}
          </VBtn>
          <template v-if="admin">
            <div class="pt-4">
              <b>Admin Area</b>
              <div class="flex gap-2 py-2">
                <VBtn text="Export" />
              </div>
            </div>
          </template>
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
const messages = ref<
  { sender: number; ts: number; message: string; d: boolean }[]
>([])
socket.on('message', (arr) => {
  messages.value.push(...arr)
})
socket.on('edit', (id, msg) => {
  const message = messages.value[id]
  if (message) {
    message.message = msg
    message.d = true
  }
})
const senderId = ref(-1)
socket.emit('getChatroomSenderId', ({ id }: { id: number }) => {
  senderId.value = id
})
const msg = ref('')
function sendMessage() {
  if (editId.value !== undefined) {
    socket.emit('edit', editId.value, msg.value)
    editId.value = undefined
  } else {
    socket.emit('message', msg.value)
  }
  msg.value = ''
}
const editId = ref<number>()
function switchEdit(i: number) {
  if (editId.value !== undefined) {
    editId.value = undefined
    msg.value = ''
  } else {
    editId.value = i
    msg.value = messages.value[i].message
  }
}
</script>
