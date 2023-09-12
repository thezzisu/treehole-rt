const Names0 = [
  'Angry',
  'Baby',
  'Crazy',
  'Diligent',
  'Excited',
  'Fat',
  'Greedy',
  'Hungry',
  'Interesting',
  'Jolly',
  'Kind',
  'Little',
  'Magic',
  'Naïve',
  'Old',
  'PKU',
  'Quiet',
  'Rich',
  'Superman',
  'Tough',
  'Undefined',
  'Valuable',
  'Wifeless',
  'Xiangbuchulai',
  'Young',
  'Zombie'
]

const Names1 = [
  'Alice',
  'Bob',
  'Carol',
  'Dave',
  'Eve',
  'Francis',
  'Grace',
  'Hans',
  'Isabella',
  'Jason',
  'Kate',
  'Louis',
  'Margaret',
  'Nathan',
  'Olivia',
  'Paul',
  'Queen',
  'Richard',
  'Susan',
  'Thomas',
  'Uma',
  'Vivian',
  'Winnie',
  'Xander',
  'Yasmine',
  'Zach'
]

export function getName(senderId: number) {
  if (senderId < 0) return 'Unknown'
  if (senderId === 0) return 'Admin'
  senderId--
  let name = Names1[senderId % Names1.length]
  senderId = Math.floor(senderId / Names1.length)
  while (senderId > 0) {
    name = Names0[senderId % Names0.length] + ' ' + name
    senderId = Math.floor(senderId / Names0.length)
  }
  return name
}
