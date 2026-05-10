import { useState, useMemo } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

type KeepOccurrence = 'first' | 'last';

export function DuplicateRemover() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(false);
  const [keepOccurrence, setKeepOccurrence] = useState<KeepOccurrence>('first');

  const { output, totalLines, uniqueLines, duplicatesRemoved } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', totalLines: 0, uniqueLines: 0, duplicatesRemoved: 0 };
    }

    const lines = input.split('\n');
    const total = lines.length;

    const normalize = (line: string): string => {
      let normalized = line;
      if (trimWhitespace) normalized = normalized.trim();
      if (!caseSensitive) normalized = normalized.toLowerCase();
      return normalized;
    };

    let result: string[];

    if (keepOccurrence === 'first') {
      const seen = new Set<string>();
      result = [];
      for (const line of lines) {
        const key = normalize(line);
        if (!seen.has(key)) {
          seen.add(key);
          result.push(line);
        }
      }
    } else {
      // keep last: iterate in reverse, then reverse the result
      const seen = new Set<string>();
      result = [];
      for (let i = lines.length - 1; i >= 0; i--) {
        const key = normalize(lines[i]);
        if (!seen.has(key)) {
          seen.add(key);
          result.push(lines[i]);
        }
      }
      result.reverse();
    }

    return {
      output: result.join('\n'),
      totalLines: total,
      uniqueLines: result.length,
      duplicatesRemoved: total - result.length,
    };
  }, [input, caseSensitive, trimWhitespace, keepOccurrence]);

  const handleClear = () => {
    setInput('');
  };

  return (
    <ToolLayout
      title="Duplicate Line Remover"
      description="Remove duplicate lines from text"
    >
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="tool-label">Input Text</label>
            <textarea
              className="tool-textarea font-mono"
              rows={10}
              placeholder="Paste text with duplicate lines..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="tool-label">Case Sensitivity</label>
              <div className="flex gap-2">
                <button
                  className={caseSensitive ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setCaseSensitive(true)}
                >
                  Case Sensitive
                </button>
                <button
                  className={!caseSensitive ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setCaseSensitive(false)}
                >
                  Case Insensitive
                </button>
              </div>
            </div>

            <div>
              <label className="tool-label">Whitespace</label>
              <div className="flex gap-2">
                <button
                  className={trimWhitespace ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setTrimWhitespace(true)}
                >
                  Trim
                </button>
                <button
                  className={!trimWhitespace ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setTrimWhitespace(false)}
                >
                  Keep
                </button>
              </div>
            </div>

            <div>
              <label className="tool-label">Keep Occurrence</label>
              <div className="flex gap-2">
                <button
                  className={keepOccurrence === 'first' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setKeepOccurrence('first')}
                >
                  First
                </button>
                <button
                  className={keepOccurrence === 'last' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setKeepOccurrence('last')}
                >
                  Last
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {input.trim() && (
        <div className="mt-4">
          <OutputBox label="Result">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-4 text-sm">
                <span className="text-surface-500">Total: {totalLines}</span>
                <span className="text-green-400 font-medium">Unique: {uniqueLines}</span>
                <span className="text-red-400 font-medium">
                  Removed: {duplicatesRemoved}
                </span>
              </div>
              <CopyButton text={output} />
            </div>
            <textarea
              className="tool-textarea font-mono"
              rows={10}
              value={output}
              readOnly
            />
          </OutputBox>
        </div>
      )}
    </ToolLayout>
  );
}

export default DuplicateRemover;
