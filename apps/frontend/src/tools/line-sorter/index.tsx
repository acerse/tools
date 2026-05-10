import { useState, useMemo, useCallback } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

type SortMode =
  | 'az'
  | 'za'
  | 'short-long'
  | 'long-short'
  | 'numeric'
  | 'natural'
  | 'reverse'
  | 'random';

interface SortOption {
  value: SortMode;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'az', label: 'Alphabetical (A-Z)' },
  { value: 'za', label: 'Alphabetical (Z-A)' },
  { value: 'short-long', label: 'By Length (Short to Long)' },
  { value: 'long-short', label: 'By Length (Long to Short)' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'natural', label: 'Natural Sort' },
  { value: 'reverse', label: 'Reverse Order' },
  { value: 'random', label: 'Random Shuffle' },
];

function naturalCompare(a: string, b: string): number {
  const ax: (string | number)[] = [];
  const bx: (string | number)[] = [];

  a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
    ax.push($1 ? parseInt($1, 10) : $2);
    return '';
  });

  b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => {
    bx.push($1 ? parseInt($1, 10) : $2);
    return '';
  });

  const len = Math.max(ax.length, bx.length);
  for (let i = 0; i < len; i++) {
    const ai = ax[i] ?? '';
    const bi = bx[i] ?? '';

    if (typeof ai === 'number' && typeof bi === 'number') {
      if (ai !== bi) return ai - bi;
    } else {
      const cmp = String(ai).localeCompare(String(bi));
      if (cmp !== 0) return cmp;
    }
  }

  return 0;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function sortLines(lines: string[], mode: SortMode): string[] {
  const copy = [...lines];

  switch (mode) {
    case 'az':
      return copy.sort((a, b) => a.localeCompare(b));
    case 'za':
      return copy.sort((a, b) => b.localeCompare(a));
    case 'short-long':
      return copy.sort((a, b) => a.length - b.length || a.localeCompare(b));
    case 'long-short':
      return copy.sort((a, b) => b.length - a.length || a.localeCompare(b));
    case 'numeric':
      return copy.sort((a, b) => {
        const na = parseFloat(a) || 0;
        const nb = parseFloat(b) || 0;
        return na - nb;
      });
    case 'natural':
      return copy.sort(naturalCompare);
    case 'reverse':
      return copy.reverse();
    case 'random':
      return shuffleArray(copy);
    default:
      return copy;
  }
}

export function LineSorter() {
  const [input, setInput] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('az');
  const [shuffleKey, setShuffleKey] = useState(0);

  const lines = useMemo(() => {
    return input.split('\n').filter((line) => line.trim().length > 0);
  }, [input]);

  const sortedLines = useMemo(() => {
    if (lines.length === 0) return [];
    // shuffleKey is used to re-trigger random sort
    return sortLines(lines, sortMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, sortMode, shuffleKey]);

  const output = useMemo(() => sortedLines.join('\n'), [sortedLines]);

  const handleSort = useCallback(() => {
    if (sortMode === 'random') {
      setShuffleKey((k) => k + 1);
    }
  }, [sortMode]);

  return (
    <ToolLayout title="Line Sorter" description="Sort lines of text in various ways">
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="tool-label">Input Text</label>
            <textarea
              className="tool-textarea font-mono"
              rows={10}
              placeholder="Enter lines of text to sort (one item per line)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              {lines.length} non-empty line{lines.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div>
            <label className="tool-label">Sort Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={sortMode === opt.value ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => {
                    setSortMode(opt.value);
                    if (opt.value === 'random') {
                      setShuffleKey((k) => k + 1);
                    }
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {sortMode === 'random' && (
            <button className="btn-secondary" onClick={handleSort}>
              Re-shuffle
            </button>
          )}
        </div>
      </div>

      {sortedLines.length > 0 && (
        <div className="mt-4">
          <OutputBox label="Sorted Output">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                {sortedLines.length} line{sortedLines.length !== 1 ? 's' : ''}
              </span>
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

export default LineSorter;
