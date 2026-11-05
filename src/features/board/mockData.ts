export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'

export type MockMember = {
  id: string
  name: string
  initials: string
  color: string
}

export type MockTask = {
  id: string
  title: string
  status: TaskStatus
  isHighPriority?: boolean
  labels: string[]
  assignees: MockMember[]
  due?: { label: string; tone?: 'soon' | 'overdue' }
  commentCount?: number
}

const mina: MockMember = { id: 'mina', name: 'Mina Park', initials: 'MP', color: 'var(--color-avatar-1)' }
const theo: MockMember = { id: 'theo', name: 'Theo Grant', initials: 'TG', color: 'var(--color-avatar-2)' }
const ana: MockMember = { id: 'ana', name: 'Ana Ruiz', initials: 'AR', color: 'var(--color-avatar-3)' }
const jae: MockMember = { id: 'jae', name: 'Jae Kim', initials: 'JK', color: 'var(--color-avatar-4)' }

export const members = [mina, theo, ana, jae]

export const labels = ['Bug', 'Feature', 'Design', 'Content']

export const priorities = ['High', 'Normal', 'Low']

export const columns: { status: TaskStatus; name: string; color: string }[] = [
  { status: 'todo', name: 'To Do', color: 'var(--color-status-todo)' },
  { status: 'in_progress', name: 'In Progress', color: 'var(--color-status-in-progress)' },
  { status: 'in_review', name: 'In Review', color: 'var(--color-status-in-review)' },
  { status: 'done', name: 'Done', color: 'var(--color-status-done)' },
]

export const tasks: MockTask[] = [
  {
    id: 't1',
    title: 'Tutorial skips step 3 after reconnect',
    status: 'todo',
    isHighPriority: true,
    labels: ['Bug'],
    assignees: [ana],
    due: { label: 'Due tomorrow', tone: 'soon' },
    commentCount: 1,
  },
  {
    id: 't2',
    title: 'Add controller remapping to settings',
    status: 'todo',
    labels: ['Feature'],
    assignees: [theo],
    due: { label: 'Nov 13' },
  },
  {
    id: 't3',
    title: 'Localize store page for KR and JP',
    status: 'todo',
    labels: ['Content'],
    assignees: [jae, mina],
    due: { label: 'Nov 10' },
  },
  {
    id: 't4',
    title: 'Draft season 2 reward track',
    status: 'todo',
    labels: ['Design'],
    assignees: [mina],
  },
  {
    id: 't5',
    title: 'Balance boss phase two timings',
    status: 'in_progress',
    isHighPriority: true,
    labels: ['Design'],
    assignees: [mina, theo],
    due: { label: 'Overdue 2d', tone: 'overdue' },
    commentCount: 2,
  },
  {
    id: 't6',
    title: 'Matchmaking retry with backoff',
    status: 'in_progress',
    isHighPriority: true,
    labels: ['Feature'],
    assignees: [jae],
    due: { label: 'Due today', tone: 'soon' },
  },
  {
    id: 't7',
    title: 'Inventory screen empty states',
    status: 'in_progress',
    labels: ['Design', 'Feature'],
    assignees: [ana],
    due: { label: 'Nov 7' },
  },
  {
    id: 't8',
    title: 'Leaderboard rank desync on relog',
    status: 'in_review',
    isHighPriority: true,
    labels: ['Bug'],
    assignees: [theo, jae],
    due: { label: 'Due tomorrow', tone: 'soon' },
    commentCount: 1,
  },
  {
    id: 't9',
    title: 'Duck music during cutscenes',
    status: 'in_review',
    labels: ['Feature'],
    assignees: [ana],
    due: { label: 'Nov 9' },
  },
  {
    id: 't10',
    title: 'Crash on cloud-save conflict',
    status: 'done',
    isHighPriority: true,
    labels: ['Bug'],
    assignees: [jae],
  },
  {
    id: 't11',
    title: 'New key art for storefront',
    status: 'done',
    labels: ['Design'],
    assignees: [mina],
  },
  {
    id: 't12',
    title: 'Session-length telemetry',
    status: 'done',
    labels: ['Feature'],
    assignees: [theo],
  },
]
