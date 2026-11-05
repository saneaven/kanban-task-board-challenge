import { guest } from '../auth/guest'
import type { TimelineItem } from '../board/types'
import { Avatar } from '../team/Avatar'
import styles from './ActivityTimeline.module.css'

export function ActivityTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className={styles.timeline}>
      {items.map((item) =>
        item.kind === 'comment' ? (
          <li key={item.id} className={styles.item}>
            <Avatar member={guest} />
            <div className={styles.comment}>
              <p className={styles.commentMeta}>
                <span className={styles.author}>{guest.name}</span>
                <span className={styles.when}>{item.when}</span>
              </p>
              <p className={styles.commentText}>{item.text}</p>
            </div>
          </li>
        ) : (
          <li key={item.id} className={styles.item}>
            <span className={styles.dot} />
            <p className={styles.event}>
              {item.text} · {item.when}
            </p>
          </li>
        ),
      )}
    </ol>
  )
}
