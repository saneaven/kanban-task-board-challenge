export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'

export type MockColumn = {
  status: TaskStatus
  name: string
  color: string
}

export type MockMember = {
  id: string
  name: string
  initials: string
  color: string
}

export type MockDue = {
  date: string
  label: string
  tone?: 'soon' | 'overdue'
}

export type TimelineItem = {
  kind: 'event' | 'comment'
  text: string
  when: string
}

export type MockTask = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: 'High' | 'Normal' | 'Low'
  labels: string[]
  assignees: MockMember[]
  due?: MockDue
  timeline: TimelineItem[]
}

const mina: MockMember = { id: 'mina', name: 'Mina Park', initials: 'MP', color: 'var(--color-avatar-1)' }
const theo: MockMember = { id: 'theo', name: 'Theo Grant', initials: 'TG', color: 'var(--color-avatar-2)' }
const ana: MockMember = { id: 'ana', name: 'Ana Ruiz', initials: 'AR', color: 'var(--color-avatar-3)' }
const jae: MockMember = { id: 'jae', name: 'Jae Kim', initials: 'JK', color: 'var(--color-avatar-4)' }

export const members = [mina, theo, ana, jae]

export const guest: MockMember = { id: 'guest', name: 'You', initials: 'G', color: 'var(--color-surface)' }

export const labels = ['Bug', 'Feature', 'Design', 'Content']

export const priorities: MockTask['priority'][] = ['High', 'Normal', 'Low']

export const columnsByStatus: Record<TaskStatus, MockColumn> = {
  todo: { status: 'todo', name: 'To Do', color: 'var(--color-status-todo)' },
  in_progress: { status: 'in_progress', name: 'In Progress', color: 'var(--color-status-in-progress)' },
  in_review: { status: 'in_review', name: 'In Review', color: 'var(--color-status-in-review)' },
  done: { status: 'done', name: 'Done', color: 'var(--color-status-done)' },
}

export const columns = Object.values(columnsByStatus)

export const tasks: MockTask[] = [
  {
    id: 't1',
    title: 'Tutorial skips step 3 after reconnect',
    description: 'Reconnecting during the crafting step drops the player straight into step 4. Reproduces on slow networks.',
    status: 'todo',
    priority: 'High',
    labels: ['Bug'],
    assignees: [ana],
    due: { date: '2026-11-05', label: 'Due tomorrow', tone: 'soon' },
    timeline: [
      { kind: 'event', text: 'Created', when: '1 day ago' },
      { kind: 'event', text: 'Assigned Ana Ruiz', when: '1 day ago' },
      { kind: 'comment', text: 'Repro video is in the build channel.', when: '5 hours ago' },
    ],
  },
  {
    id: 't2',
    title: 'Add controller remapping to settings',
    description: 'Every action should be rebindable, with a reset to defaults.',
    status: 'todo',
    priority: 'Normal',
    labels: ['Feature'],
    assignees: [theo],
    due: { date: '2026-11-13', label: 'Nov 13' },
    timeline: [
      { kind: 'event', text: 'Created', when: '2 days ago' },
      { kind: 'event', text: 'Assigned Theo Grant', when: '2 days ago' },
    ],
  },
  {
    id: 't3',
    title: 'Localize store page for KR and JP',
    description: 'Store description, feature bullets and screenshot captions.',
    status: 'todo',
    priority: 'Normal',
    labels: ['Content'],
    assignees: [jae, mina],
    due: { date: '2026-11-10', label: 'Nov 10' },
    timeline: [
      { kind: 'event', text: 'Created', when: '3 days ago' },
      { kind: 'event', text: 'Assigned Jae Kim', when: '3 days ago' },
      { kind: 'event', text: 'Assigned Mina Park', when: '2 days ago' },
    ],
  },
  {
    id: 't4',
    title: 'Draft season 2 reward track',
    status: 'todo',
    priority: 'Low',
    labels: ['Design'],
    assignees: [mina],
    timeline: [
      { kind: 'event', text: 'Created', when: '4 days ago' },
      { kind: 'event', text: 'Assigned Mina Park', when: '4 days ago' },
    ],
  },
  {
    id: 't5',
    title: 'Balance boss phase two timings',
    description: 'Playtesters clear phase two in under 40 seconds. Slow the slam telegraph and add a second wave of adds.',
    status: 'in_progress',
    priority: 'High',
    labels: ['Design'],
    assignees: [mina, theo],
    due: { date: '2026-11-02', label: 'Overdue 2d', tone: 'overdue' },
    timeline: [
      { kind: 'event', text: 'Created', when: '7 days ago' },
      { kind: 'event', text: 'Assigned Mina Park', when: '7 days ago' },
      { kind: 'event', text: 'Moved from To Do → In Progress', when: '2 days ago' },
      { kind: 'comment', text: 'Telemetry build is up, so we can compare real clear times.', when: '5 hours ago' },
      { kind: 'comment', text: 'Trying a 0.4s longer telegraph first.', when: '2 hours ago' },
      { kind: 'event', text: 'Assigned Theo Grant', when: '2 hours ago' },
    ],
  },
  {
    id: 't6',
    title: 'Matchmaking retry with backoff',
    description: 'Back off exponentially after a failed queue join and tell the player what is happening.',
    status: 'in_progress',
    priority: 'High',
    labels: ['Feature'],
    assignees: [jae],
    due: { date: '2026-11-04', label: 'Due today', tone: 'soon' },
    timeline: [
      { kind: 'event', text: 'Created', when: '5 days ago' },
      { kind: 'event', text: 'Assigned Jae Kim', when: '5 days ago' },
      { kind: 'event', text: 'Moved from To Do → In Progress', when: '1 day ago' },
    ],
  },
  {
    id: 't7',
    title: 'Inventory screen empty states',
    description: 'New accounts see a blank grid. Show what the inventory is for and where items come from.',
    status: 'in_progress',
    priority: 'Normal',
    labels: ['Design', 'Feature'],
    assignees: [ana],
    due: { date: '2026-11-07', label: 'Nov 7' },
    timeline: [
      { kind: 'event', text: 'Created', when: '6 days ago' },
      { kind: 'event', text: 'Assigned Ana Ruiz', when: '6 days ago' },
      { kind: 'event', text: 'Moved from To Do → In Progress', when: '10 hours ago' },
    ],
  },
  {
    id: 't8',
    title: 'Leaderboard rank desync on relog',
    description: 'Rank shows the cached value until the next match. Fetch it on session start.',
    status: 'in_review',
    priority: 'High',
    labels: ['Bug'],
    assignees: [theo, jae],
    due: { date: '2026-11-05', label: 'Due tomorrow', tone: 'soon' },
    timeline: [
      { kind: 'event', text: 'Created', when: '8 days ago' },
      { kind: 'event', text: 'Moved from In Progress → In Review', when: '4 hours ago' },
      { kind: 'comment', text: 'Fix looks good, one note on the cache key.', when: '2 hours ago' },
    ],
  },
  {
    id: 't9',
    title: 'Duck music during cutscenes',
    description: 'Lower the music bus by 6 dB while dialogue plays.',
    status: 'in_review',
    priority: 'Normal',
    labels: ['Feature'],
    assignees: [ana],
    due: { date: '2026-11-09', label: 'Nov 9' },
    timeline: [
      { kind: 'event', text: 'Created', when: '9 days ago' },
      { kind: 'event', text: 'Moved from In Progress → In Review', when: '8 hours ago' },
    ],
  },
  {
    id: 't10',
    title: 'Crash on cloud-save conflict',
    description: 'Picking the older save crashed the client.',
    status: 'done',
    priority: 'High',
    labels: ['Bug'],
    assignees: [jae],
    timeline: [
      { kind: 'event', text: 'Created', when: '14 days ago' },
      { kind: 'event', text: 'Moved from In Review → Done', when: '1 day ago' },
    ],
  },
  {
    id: 't11',
    title: 'New key art for storefront',
    status: 'done',
    priority: 'Normal',
    labels: ['Design'],
    assignees: [mina],
    timeline: [
      { kind: 'event', text: 'Created', when: '15 days ago' },
      { kind: 'event', text: 'Moved from In Review → Done', when: '2 days ago' },
    ],
  },
  {
    id: 't12',
    title: 'Session-length telemetry',
    status: 'done',
    priority: 'Low',
    labels: ['Feature'],
    assignees: [theo],
    timeline: [
      { kind: 'event', text: 'Created', when: '16 days ago' },
      { kind: 'event', text: 'Moved from In Review → Done', when: '3 days ago' },
    ],
  },
]
