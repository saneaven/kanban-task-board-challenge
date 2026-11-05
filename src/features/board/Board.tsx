import { useState } from 'react'
import { Button } from '../../ui/Button'
import { LockIcon, PlusIcon, RetryIcon, SearchIcon, WarningIcon } from '../../ui/icons'
import type { GuestSessionStatus } from '../auth/guestSession'
import { TaskCard } from '../tasks/TaskCard'
import { TaskComposer } from '../tasks/TaskComposer'
import { TaskDetailPanel } from '../tasks/TaskDetailPanel'
import { AddMemberForm } from '../team/AddMemberForm'
import { Avatar } from '../team/Avatar'
import { columns } from './columns'
import { priorities, priorityNames, type TaskStatus } from './types'
import { useBoardData } from './useBoardData'
import { useBoardFilters } from './useBoardFilters'
import styles from './Board.module.css'

type BoardProps = {
  sessionStatus: GuestSessionStatus
  onRetrySession: () => void
}

export function Board({ sessionStatus, onRetrySession }: BoardProps) {
  const { tasks, members, labels, hasData, isError: queryError, retry } = useBoardData(sessionStatus === 'ready')
  const filters = useBoardFilters(tasks)
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [composerStatus, setComposerStatus] = useState<TaskStatus | null>(null)
  const [isAddingMember, setIsAddingMember] = useState(false)

  const isLoading = !hasData
  const isError = sessionStatus === 'error' || queryError
  const isFirstRun = hasData && tasks.length === 0
  const openTask = tasks.find((task) => task.id === openTaskId)
  const doneCount = tasks.filter((task) => task.status === 'done').length
  const overdueCount = tasks.filter((task) => task.due?.tone === 'overdue').length

  function retryConnection() {
    if (sessionStatus === 'error') onRetrySession()
    else retry()
  }

  return (
    <div className={styles.app}>
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
            className={styles.addMember}
            aria-label="Add team member"
            aria-expanded={isAddingMember}
            onClick={() => setIsAddingMember(!isAddingMember)}
          >
            <PlusIcon />
          </button>
          {isAddingMember && <AddMemberForm onClose={() => setIsAddingMember(false)} />}
        </div>

        <Button variant="accent" className={styles.newTask} onClick={() => setComposerStatus('todo')}>
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

          return (
            <section
              key={column.status}
              className={styles.column}
              style={{ background: column.color }}
              aria-label={column.name}
            >
              <div className={styles.columnTop}>
                <header className={styles.columnHead}>
                  <h2 className={styles.columnName}>{column.name}</h2>
                  <button
                    type="button"
                    className={styles.addTask}
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
                      <TaskCard key={task.id} task={task} onOpen={() => setOpenTaskId(task.id)} />
                    ))}
                    {columnTasks.length === 0 && !isFirst && (
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

      {openTask && (
        <TaskDetailPanel task={openTask} members={members} labels={labels} onClose={() => setOpenTaskId(null)} />
      )}
      {composerStatus && <TaskComposer status={composerStatus} onClose={() => setComposerStatus(null)} />}
    </div>
  )
}
