import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

export default function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <button
      onClick={() => copy(text)}
      className={`copy-btn ${className}`}
      title="Copy to clipboard"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
