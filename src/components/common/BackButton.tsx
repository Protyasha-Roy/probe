import { useNavigate } from 'react-router-dom'
import { Button } from './Button'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(-1)}
      className="mb-6"
    >
      ← Back
    </Button>
  )
} 