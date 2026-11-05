import { Fragment, useRef, useState } from 'react'
import { DragDropProvider, DragOverlay, PointerSensor } from '@dnd-kit/react'
import { Accessibility, PointerActivationConstraints } from '@dnd-kit/dom'
import { Button } from '../../ui/Button'
import { Toast } from '../../ui/Toast'
import { LockIcon, PlusIcon, RetryIcon, SearchIcon, WarningIcon } from '../../ui/icons'
import type { GuestSessionStatus } from '../auth/guestSession'
import { TaskCard } from '../tasks/TaskCard'
import { createTask, deleteTask, updateTask, type TaskPatch, type TaskRow } from '../tasks/api'
import { createMember, setAssignee, type MemberRow } from '../team/api'
import { createLabel, setTaskLabel } from '../labels/api'
import { createComment } from '../comments/api'
import { commentEntryId, type TimelineEntry } from '../activity/timeline'
import { TaskComposer } from '../tasks/TaskComposer'
import { TaskDetailPanel } from '../tasks/TaskDetailPanel'
import { AddMemberForm } from '../team/AddMemberForm'
import { Avatar } from '../team/Avatar'
import { columns, columnsByStatus } from './columns'
import { priorities, priorityNames, type Label, type Member, type Task, type TaskDraft, type TaskStatus } from './types'
import { positionBetween, positionForDrop } from './position'
import { useBoardDrag } from './useBoardDrag'
import { useBoardMutation } from './useBoardMutation'
import { useBoardData } from './useBoardData'
import { useBoardFilters } from './useBoardFilters'
import styles from './Board.module.css'

const sensors = [
  PointerSensor.configure({
    activationConstraints: (event) => event.pointerType === 'touch'
      ? [new PointerActivationConstraints.Delay({ value: 250, tolerance: 5 })]
      : [new PointerActivationConstraints.Distance({ value: 5 })],
  }),
]

type BoardProps = {
  sessionStatus: GuestSessionStatus
  onRetrySession: () => void
}

export function Board({ sessionStatus, onRetrySession }: BoardProps) {
  const { tasks, members, labels, hasData, isError: queryError, retry } = useBoardData(sessionStatus === 'ready')
  const filters = useBoardFilters(tasks)
  const { mutate, toast } = useBoardMutation()
  const toastElement = toast && <Toast text={toast.text} onRetry={toast.retry} onDismiss={toast.dismiss} />
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null)
  const [landedId, setLandedId] = useState<string | null>(null)
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [composerStatus, setComposerStatus] = useState<TaskStatus | null>(null)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const addMemberToggle = useRef<HTMLButtonElement>(null)

  const isLoading = !hasData
  const isError = sessionStatus === 'error' || queryError
  const isFirstRun = hasData && tasks.length === 0
  const openTask = tasks.find((task) => task.id === openTaskId)
  const doneCount = tasks.filter((task) => task.status === 'done').length
  const overdueCount = tasks.filter((task) => task.due?.tone === 'overdue').length

  function move(task: Task, status: TaskStatus, anchorId: string | null = null) {
    const position = positionForDrop(tasks, task, status, anchorId)
    if (task.status === status && task.position === position) return

    mutate<TaskRow>({
      queryKey: ['tasks'],
      request: () => updateTask(task.id, { status, position }),
      update: (rows) => rows.map((row) => row.id === task.id ? { ...row, status, position } : row),
      errorText: (rows) => {
        const currentStatus = rows.find((row) => row.id === task.id)?.status as TaskStatus | undefined
        return `Couldn’t move “${task.title}” to ${columnsByStatus[status].name}. It’s back in ${columnsByStatus[currentStatus ?? task.status].name}.`
      },
    })
    setLandedId(task.id)
  }

  function addTask(draft: TaskDraft) {
    const first = tasks.find((task) => task.status === draft.status)
    const row: TaskRow = {
      id: crypto.randomUUID(),
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      status: draft.status,
      due_date: draft.dueDate,
      position: positionBetween(null, first?.position ?? null),
      task_labels: [],
      task_assignees: [],
      comments: [{ count: 0 }],
    }
    const { task_labels, task_assignees, comments, ...input } = row

    mutate<TaskRow>({
      queryKey: ['tasks'],
      request: () => createTask(input),
      update: (rows) => rows.some((task) => task.id === row.id) ? rows : [row, ...rows],
      errorText: () => `Couldn’t create “${row.title}”.`,
    })
    setLandedId(row.id)
  }

  function editTask(task: Task, patch: TaskPatch) {
    mutate<TaskRow>({
      queryKey: ['tasks'],
      request: () => updateTask(task.id, patch),
      update: (rows) => rows.map((row) => row.id === task.id ? { ...row, ...patch } : row),
      errorText: () => `Couldn’t save changes to “${task.title}”.`,
    })
  }

  function removeTask(task: Task) {
    setOpenTaskId(null)
    setFocusedTaskId(null)
    mutate<TaskRow>({
      queryKey: ['tasks'],
      request: () => deleteTask(task.id),
      update: (rows) => rows.filter((row) => row.id !== task.id),
      errorText: () => `Couldn’t delete “${task.title}”. It’s back on your board.`,
    })
  }

  function assignMember(task: Task, member: Pick<Member, 'id' | 'name'>, assigned: boolean) {
    if (assigned === task.assignees.some((item) => item.id === member.id)) return
    mutate<TaskRow>({
      queryKey: ['tasks'],
      request: () => setAssignee(task.id, member.id, assigned),
      update: (rows) => rows.map((row) => row.id === task.id ? {
        ...row,
        task_assignees: [
          ...row.task_assignees.filter((item) => item.member_id !== member.id),
          ...(assigned ? [{ member_id: member.id }] : []),
        ],
      } : row),
      errorText: () => assigned
        ? `Couldn’t assign “${member.name}” to “${task.title}”.`
        : `Couldn’t unassign “${member.name}” from “${task.title}”.`,
    })
  }

  function assignLabel(task: Task, label: Label, assigned: boolean) {
    if (assigned === task.labels.some((item) => item.id === label.id)) return
    mutate<TaskRow>({
      queryKey: ['tasks'],
      request: () => setTaskLabel(task.id, label.id, assigned),
      update: (rows) => rows.map((row) => row.id === task.id ? {
        ...row,
        task_labels: [
          ...row.task_labels.filter((item) => item.label_id !== label.id),
          ...(assigned ? [{ label_id: label.id }] : []),
        ],
      } : row),
      errorText: () => assigned
        ? `Couldn’t add label “${label.name}” to “${task.title}”.`
        : `Couldn’t remove label “${label.name}” from “${task.title}”.`,
    })
  }

  function addMember(name: string, task?: Task) {
    const existing = task ? members.find((member) => member.name === name) : undefined
    if (existing && task) {
      assignMember(task, existing, true)
      return
    }

    const member: MemberRow = {
      id: crypto.randomUUID(),
      name,
      color: `avatar-${members.length % 4 + 1}`,
    }
    mutate<MemberRow>({
      queryKey: ['members'],
      request: async () => {
        await createMember(member)
        if (task) assignMember(task, member, true)
      },
      update: (rows) => rows.some((row) => row.id === member.id) ? rows : [...rows, member],
      errorText: () => `Couldn’t add “${name}” to your team.`,
    })
  }

  function addLabel(task: Task, name: string) {
    const existing = labels.find((label) => label.name === name)
    if (existing) {
      assignLabel(task, existing, true)
      return
    }

    const label: Label = { id: crypto.randomUUID(), name }
    mutate<Label>({
      queryKey: ['labels'],
      request: async () => {
        await createLabel(label)
        assignLabel(task, label, true)
      },
      update: (rows) => rows.some((row) => row.id === label.id) ? rows : [...rows, label],
      errorText: () => `Couldn’t create label “${name}”.`,
    })
  }

  function addComment(task: Task, body: string) {
    const id = crypto.randomUUID()
    const entry: TimelineEntry = {
      id: commentEntryId(id),
      kind: 'comment',
      text: body,
      createdAt: new Date().toISOString(),
    }
    mutate<TimelineEntry>({
      queryKey: ['timeline', task.id],
      request: () => createComment(id, task.id, body),
      update: (rows) => rows.some((row) => row.id === entry.id) ? rows : [...rows, entry],
      errorText: () => 'Couldn’t add your comment.',
    })
  }

  const { drag, justDragged, handleDragStart, handleDragMove, handleDragEnd } = useBoardDrag((taskId, target) => {
    const task = tasks.find((item) => item.id === taskId)
    if (task) move(task, target.status, target.anchorId)
  })
  const draggedTask = tasks.find((task) => task.id === drag?.taskId)

  function retryConnection() {
    if (sessionStatus === 'error') onRetrySession()
    else retry()
  }

  return (
    <DragDropProvider
      sensors={sensors}
      plugins={(plugins) => plugins.filter((plugin) => plugin !== Accessibility)}
      onDragStart={(event) => {
        setLandedId(null)
        handleDragStart(event)
      }}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div
        className={`${styles.app} ${drag ? styles.dragging : ''}`}
        onFocusCapture={(event) => {
          const card = event.target.closest<HTMLElement>('[data-card]')
          setFocusedTaskId(card?.dataset.card ?? null)
        }}
        onBlurCapture={() => setFocusedTaskId(null)}
      >
        <header className={styles.top}>
          <h1 className={styles.wordmark}>Task Board</h1>
          <span className={styles.guest}>
            <LockIcon />
            Guest
          </span>

          <div className={styles.stats} aria-label="Board summary">
            <p className={styles.stat}>
              <b>{isLoading ? '–' : tasks.length}</b>tasks
            </p>
            <p className={styles.stat}>
              <b>{isLoading ? '–' : doneCount}</b>done
            </p>
            <p className={`${styles.stat} ${styles.statAlert}`}>
              <b>{isLoading ? '–' : overdueCount}</b>overdue
            </p>
          </div>

          <span className={styles.spacer} />

          <label className={styles.search}>
            <SearchIcon />
            <span className="visually-hidden">Search tasks by title</span>
            <input
              type="search"
              placeholder="Search tasks"
              value={filters.query}
              onChange={(event) => filters.setQuery(event.target.value)}
            />
          </label>

          <div className={styles.crew} role="group" aria-label="Filter by team member">
            <div className={styles.crewList}>
              {members.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  className={`${styles.crewBtn} ${filters.member === member.id ? styles.on : ''}`}
                  aria-pressed={filters.member === member.id}
                  aria-label={member.name}
                  title={member.name}
                  onClick={() => filters.toggleMember(member.id)}
                >
                  <Avatar member={member} className={styles.crewAvatar} />
                </button>
              ))}
            </div>
            <button
              type="button"
              ref={addMemberToggle}
              className={styles.addMember}
              disabled={isLoading}
              aria-label="Add team member"
              aria-expanded={isAddingMember}
              onClick={() => setIsAddingMember(!isAddingMember)}
            >
              <PlusIcon />
            </button>
            {isAddingMember && (
              <AddMemberForm
                onAdd={(name) => addMember(name)}
                onClose={() => {
                  setIsAddingMember(false)
                  addMemberToggle.current?.focus()
                }}
              />
            )}
          </div>

          <Button variant="accent" className={styles.newTask} disabled={isLoading} onClick={() => setComposerStatus('todo')}>
            <PlusIcon />
            New task
          </Button>

          <div className={styles.filters}>
            <div className={styles.chips} role="group" aria-label="Filter by label">
              {labels.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  className={`${styles.chip} ${filters.label === label.id ? styles.on : ''}`}
                  aria-pressed={filters.label === label.id}
                  onClick={() => filters.toggleLabel(label.id)}
                >
                  {label.name}
                </button>
              ))}
            </div>
            <div className={styles.chips} role="group" aria-label="Filter by priority">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  className={`${styles.chip} ${filters.priority === priority ? styles.on : ''}`}
                  aria-pressed={filters.priority === priority}
                  onClick={() => filters.togglePriority(priority)}
                >
                  {priorityNames[priority]}
                </button>
              ))}
            </div>
            {!isLoading && filters.filtering && (
              <button type="button" className={styles.clear} onClick={filters.clearFilters}>
                {filters.matchText}
                <span className={styles.clearX}>Clear</span>
              </button>
            )}
            {isLoading && !isError && (
              <p className={styles.note} role="status">Setting up your guest session…</p>
            )}
          </div>
        </header>

        {isError && (
          <div className={styles.banner} role="alert">
            <WarningIcon />
            <span>Connection lost. Changes won’t save until you’re back online.</span>
            <button type="button" className={styles.bannerAct} onClick={retryConnection}>
              <RetryIcon />
              Retry now
            </button>
          </div>
        )}

        <main className={styles.columns}>
          {columns.map((column) => {
            const columnTasks = filters.filteredTasks.filter((task) => task.status === column.status)
            const isFirst = isFirstRun && column.status === 'todo'
            const isTarget = drag?.target?.status === column.status

            return (
              <section
                key={column.status}
                data-col={column.status}
                className={`${styles.column} ${isTarget ? styles.over : ''}`}
                style={{ background: column.color }}
                aria-label={column.name}
              >
                <div className={styles.columnTop}>
                  <header className={styles.columnHead}>
                    <h2 className={styles.columnName}>{column.name}</h2>
                    <button
                      type="button"
                      className={styles.addTask}
                      disabled={isLoading}
                      aria-label={`Add task to ${column.name}`}
                      onClick={() => setComposerStatus(column.status)}
                    >
                      <PlusIcon />
                    </button>
                  </header>
                  <p className={styles.count}>{isLoading ? '–' : columnTasks.length}</p>
                </div>
                <div className={styles.cards}>
                  {isLoading ? (
                    Array.from({ length: column.skeletonCount }, (_, index) => (
                      <span key={index} className={styles.skCard} aria-hidden="true" />
                    ))
                  ) : (
                    <>
                      {columnTasks.map((task) => (
                        <Fragment key={task.id}>
                          {isTarget && drag?.target?.anchorId === task.id && (
                            <div className={styles.placeholder} style={{ height: drag.height }} />
                          )}
                          <TaskCard
                            task={task}
                            autoFocus={focusedTaskId === task.id}
                            isDragging={drag?.taskId === task.id}
                            landed={landedId === task.id}
                            onLandEnd={() => setLandedId((current) => current === task.id ? null : current)}
                            onOpen={() => { if (!justDragged.current) setOpenTaskId(task.id) }}
                            onShift={(direction) => {
                              const next = columns[columns.findIndex((column) => column.status === task.status) + direction]
                              if (next) move(task, next.status)
                            }}
                          />
                        </Fragment>
                      ))}
                      {isTarget && drag?.target?.anchorId === null && (
                        <div className={styles.placeholder} style={{ height: drag.height }} />
                      )}
                      {columnTasks.length === 0 && !isFirst && !isTarget && (
                        <p className={styles.columnHint}>
                          {filters.filtering ? 'No matches in this column.' : column.hint}
                        </p>
                      )}
                      {isFirst && (
                        <div className={styles.first}>
                          <h3 className={styles.firstH}>Nothing here yet.</h3>
                          <p className={styles.firstP}>Tasks you add are private to this guest session.</p>
                          <div className={styles.firstActs}>
                            <Button onClick={() => setComposerStatus('todo')}>
                              <PlusIcon />
                              Create first task
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>
            )
          })}
        </main>

        <DragOverlay dropAnimation={null}>
          {draggedTask && (
            <div aria-hidden="true">
              <TaskCard task={draggedTask} overlay onOpen={() => {}} />
            </div>
          )}
        </DragOverlay>
        {openTask && (
          <TaskDetailPanel
            task={openTask}
            members={members}
            labels={labels}
            toast={toastElement}
            onStatusChange={(status) => move(openTask, status)}
            onPriorityChange={(priority) => editTask(openTask, { priority })}
            onDueChange={(dueDate) => editTask(openTask, { due_date: dueDate })}
            onTitleChange={(title) => editTask(openTask, { title })}
            onDescriptionChange={(description) => editTask(openTask, { description })}
            onAssigneeToggle={(member) => assignMember(openTask, member, !openTask.assignees.some((item) => item.id === member.id))}
            onLabelToggle={(label) => assignLabel(openTask, label, !openTask.labels.some((item) => item.id === label.id))}
            onMemberCreate={(name) => addMember(name, openTask)}
            onLabelCreate={(name) => addLabel(openTask, name)}
            onComment={(body) => addComment(openTask, body)}
            onDelete={() => removeTask(openTask)}
            onClose={() => {
              setFocusedTaskId(openTask.id)
              setOpenTaskId(null)
            }}
          />
        )}
        {composerStatus && <TaskComposer status={composerStatus} toast={toastElement} onCreate={addTask} onClose={() => setComposerStatus(null)} />}
        {!openTask && !composerStatus && toastElement}
      </div>
    </DragDropProvider>
  )
}
