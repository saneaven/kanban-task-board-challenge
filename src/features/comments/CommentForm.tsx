import type { FormEvent } from 'react'
import { Button } from '../../ui/Button'
import inputStyles from '../../ui/Input.module.css'
import styles from './CommentForm.module.css'

export function CommentForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.currentTarget.reset()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="comment-body">
        Write a comment
      </label>
      <textarea id="comment-body" className={inputStyles.input} rows={2} placeholder="Write a comment" />
      <Button type="submit">Comment</Button>
    </form>
  )
}
