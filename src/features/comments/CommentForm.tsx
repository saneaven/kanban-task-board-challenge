import { useState, type FormEvent } from 'react'
import { Button } from '../../ui/Button'
import inputStyles from '../../ui/Input.module.css'
import styles from './CommentForm.module.css'

export function CommentForm({ onComment }: { onComment: (body: string) => void }) {
  const [body, setBody] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = body.trim()
    if (!text) return
    onComment(text)
    setBody('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="comment-body">
        Write a comment
      </label>
      <textarea
        id="comment-body"
        className={inputStyles.input}
        rows={2}
        placeholder="Write a comment"
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />
      <Button type="submit">Comment</Button>
    </form>
  )
}
