import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import OutputBox from '../../components/OutputBox'

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const UNESCAPE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&#x2F;': '/',
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, ch => ESCAPE_MAP[ch] || ch)
}

function unescapeHtml(str: string): string {
  return str.replace(/&(?:amp|lt|gt|quot|#39|#x27|#x2F);/g, e => UNESCAPE_MAP[e] || e)
}

export function HtmlEscape() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  return (
    <ToolLayout title="HTML Escape/Unescape" description="Escape and unescape HTML special characters">
      <div className="card space-y-4">
        <div>
          <label className="tool-label">Input</label>
          <textarea
            className="tool-textarea"
            rows={8}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'<div class="example">Hello & welcome</div>'}
          />
        </div>

        <div className="flex gap-3">
          <button className="btn-primary" onClick={() => setOutput(escapeHtml(input))}>
            Escape
          </button>
          <button className="btn-secondary" onClick={() => setOutput(unescapeHtml(input))}>
            Unescape
          </button>
        </div>
      </div>

      {output && <OutputBox label="Output" value={output} />}
    </ToolLayout>
  )
}

export default HtmlEscape
