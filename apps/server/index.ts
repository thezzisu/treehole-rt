import { Server, Socket } from 'socket.io'

const SOCKET_TYPES = ['client', 'admin', 'projector'] as const
type SocketType = (typeof SOCKET_TYPES)[number]

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'V3ryS3cr3tT0k3n'
const CHATROOM_REGEX = /([a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8})/

const io = new Server(3000, {
  cors: {
    origin: '*'
  }
})

const isValidType = (type: any): type is SocketType => {
  return SOCKET_TYPES.includes(type)
}

interface IChatroom {
  size: number
  messages: { sender: number; ts: number; message: string }[]
}

const chatrooms = new Map<string, IChatroom>()

io.on('connection', (socket) => {
  const { type, chatroomId, token } = socket.handshake.query
  if (typeof type !== 'string' || !isValidType(type)) {
    socket.emit('error', 'Invalid type')
    return socket.disconnect(true)
  }
  if (type !== 'client' && token !== ADMIN_TOKEN) {
    socket.emit('error', 'Invalid token')
    return socket.disconnect(true)
  }
  if (typeof chatroomId !== 'string' || !CHATROOM_REGEX.test(chatroomId)) {
    socket.emit('error', 'Invalid chatroomId')
    return socket.disconnect(true)
  }
  let sender: number
  let chatroom: IChatroom
  if (type !== 'client') {
    if (!chatrooms.has(chatroomId)) {
      chatrooms.set(chatroomId, { size: 0, messages: [] })
    }
    chatroom = chatrooms.get(chatroomId)!
    sender = 0
  } else {
    const _chatroom = chatrooms.get(chatroomId)
    if (!_chatroom) {
      socket.emit('error', 'Chatroom not found')
      return socket.disconnect(true)
    }
    chatroom = _chatroom
    sender = ++chatroom.size
  }
  console.log(`[${type}] ${sender} connected to ${chatroomId}`)
  socket.join(chatroomId)
  socket.emit('message', chatroom.messages)

  let last = 0
  const sendMessage = (message: string) => {
    const now = Date.now()
    if (type === 'client') {
      // One message per second
      if (now - last < 1000) return
    }
    const msg = { sender, ts: now, message }
    chatroom.messages.push(msg)
    io.to(chatroomId).emit('message', [msg])
  }

  socket.on('message', (message) => {
    if (typeof message !== 'string') return
    sendMessage(message)
  })

  socket.on('getChatroomSenderId', (cb) => {
    cb({ id: sender })
  })
})
