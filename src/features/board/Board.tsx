import { useState } from 'react'
import { Button } from '../../ui/Button'
import { LockIcon, PlusIcon, SearchIcon } from '../../ui/icons'
import { TaskCard } from '../tasks/TaskCard'
import { TaskComposer } from '../tasks/TaskComposer'
import { TaskDetailPanel } from '../tasks/TaskDetailPanel'
import { AddMemberForm } from '../team/AddMemberForm'
import { Avatar } from '../team/Avatar'
import styles from './Board.module.css'
import { columns, labels, members, priorities, tasks, type TaskStatus } from './mockData'

export function Board() {
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const [composerStatus, setComposerStatus] = useState<TaskStatus | null>(null)
  const [isAddingMember, setIsAddingMember] = useState(false)

  const openTask = tasks.find((task) => task.id === openTaskId)
  const doneCount = tasks.filter((task) => task.status === 'done').length
  const overdueCount = tasks.filter((task) => task.due?.tone === 'overdue').length

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
            <b>{tasks.length}</b>tasks
          </p>
          <p className={styles.stat}>
            <b>{doneCount}</b>done
          </p>
          <p className={`${styles.stat} ${styles.statAlert}`}>
            <b>{overdueCount}</b>overdue
          </p>
        </div>

        <span className={styles.spacer} />

        <label className={styles.search}>
          <SearchIcon />
          <span className="visually-hidden">Search tasks by title</span>
          <input type="search" placeholder="Search tasks" />
        </label>

        <div className={styles.crew} aria-label="Team members">
          <div className={styles.crewList}>
            {members.map((member) => (
              <Avatar key={member.id} member={member} className={styles.crewAvatar} />
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
          <div className={styles.chips} aria-label="Filter by label">
            {labels.map((label) => (
              <button key={label} type="button" className={styles.chip}>
                {label}
              </button>
            ))}
          </div>
          <div className={styles.chips} aria-label="Filter by priority">
            {priorities.map((priority) => (
              <button key={priority} type="button" className={styles.chip}>
                {priority}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className={styles.columns}>
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.status)

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
                <p className={styles.count}>{columnTasks.length}</p>
              </div>
              <div className={styles.cards}>
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onOpen={() => setOpenTaskId(task.id)} />
                ))}
              </div>
            </section>
          )
        })}
      </main>

      {openTask && <TaskDetailPanel task={openTask} onClose={() => setOpenTaskId(null)} />}
      {composerStatus && <TaskComposer status={composerStatus} onClose={() => setComposerStatus(null)} />}
    </div>
  )
}
