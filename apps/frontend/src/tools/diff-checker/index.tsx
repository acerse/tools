import { useState, useMemo } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';
import { useI18n } from '../../hooks/useI18n';

type DiffLineType = 'same' | 'added' | 'removed';

interface DiffLine {
  type: DiffLineType;
  text: string;
  oldLineNum: number | null;
  newLineNum: number | null;
}

function computeLCS(oldLines: string[], newLines: string[]): number[][] {
  const m = oldLines.length;
  const n = newLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

function buildDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const dp = computeLCS(oldLines, newLines);
  const result: DiffLine[] = [];

  let i = oldLines.length;
  let j = newLines.length;

  const stack: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({ type: 'same', text: oldLines[i - 1], oldLineNum: i, newLineNum: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'added', text: newLines[j - 1], oldLineNum: null, newLineNum: j });
      j--;
    } else {
      stack.push({ type: 'removed', text: oldLines[i - 1], oldLineNum: i, newLineNum: null });
      i--;
    }
  }

  while (stack.length > 0) {
    result.push(stack.pop()!);
  }

  return result;
}

function getDiffStats(diff: DiffLine[]) {
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  for (const line of diff) {
    if (line.type === 'added') added++;
    else if (line.type === 'removed') removed++;
    else unchanged++;
  }
  return { added, removed, unchanged };
}

export function DiffChecker() {
  const { t } = useI18n();
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  const diff = useMemo(() => {
    if (!showDiff) return [];
    const oldLines = original.split('\n');
    const newLines = modified.split('\n');
    return buildDiff(oldLines, newLines);
  }, [original, modified, showDiff]);

  const stats = useMemo(() => getDiffStats(diff), [diff]);

  const diffText = useMemo(() => {
    return diff
      .map((line) => {
        if (line.type === 'added') return `+ ${line.text}`;
        if (line.type === 'removed') return `- ${line.text}`;
        return `  ${line.text}`;
      })
      .join('\n');
  }, [diff]);

  const handleCompare = () => {
    setShowDiff(true);
  };

  const handleClear = () => {
    setOriginal('');
    setModified('');
    setShowDiff(false);
  };

  const lineStyles: Record<DiffLineType, string> = {
    same: '',
    added: 'bg-green-500/15 text-green-400',
    removed: 'bg-red-500/15 text-red-400',
  };

  const linePrefix: Record<DiffLineType, string> = {
    same: ' ',
    added: '+',
    removed: '-',
  };

  return (
    <ToolLayout title={t('Diff Checker')} description={t('Compare two texts and see the differences')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <label className="tool-label">{t('Original Text')}</label>
          <textarea
            className="tool-textarea font-mono"
            rows={12}
            placeholder={t('Paste original text here...')}
            value={original}
            onChange={(e) => {
              setOriginal(e.target.value);
              setShowDiff(false);
            }}
          />
        </div>

        <div className="card">
          <label className="tool-label">{t('Modified Text')}</label>
          <textarea
            className="tool-textarea font-mono"
            rows={12}
            placeholder={t('Paste modified text here...')}
            value={modified}
            onChange={(e) => {
              setModified(e.target.value);
              setShowDiff(false);
            }}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="btn-primary" onClick={handleCompare}>
          {t('Compare')}
        </button>
        <button className="btn-secondary" onClick={handleClear}>
          {t('Clear')}
        </button>
      </div>

      {showDiff && diff.length > 0 && (
        <div className="mt-4">
          <OutputBox label={t('Diff Output')}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-4 text-sm">
                <span className="text-green-400 font-medium">+{stats.added} {t('added')}</span>
                <span className="text-red-400 font-medium">-{stats.removed} {t('removed')}</span>
                <span className="text-surface-500">{stats.unchanged} {t('unchanged')}</span>
              </div>
              <CopyButton text={diffText} />
            </div>

            <div className="border border-surface-700/50 rounded-xl overflow-auto font-mono text-sm">
              {diff.map((line, idx) => (
                <div key={idx} className={`flex ${lineStyles[line.type]}`}>
                  <div className="w-12 text-right pr-2 text-surface-500 select-none border-r border-surface-700/50 shrink-0 py-0.5">
                    {line.oldLineNum ?? ''}
                  </div>
                  <div className="w-12 text-right pr-2 text-surface-500 select-none border-r border-surface-700/50 shrink-0 py-0.5">
                    {line.newLineNum ?? ''}
                  </div>
                  <div className="w-6 text-center text-surface-500 select-none shrink-0 py-0.5">
                    {linePrefix[line.type]}
                  </div>
                  <div className="flex-1 whitespace-pre-wrap break-all py-0.5 px-1">
                    {line.text}
                  </div>
                </div>
              ))}
            </div>
          </OutputBox>
        </div>
      )}

      {showDiff && diff.length === 0 && (
        <div className="card mt-4">
          <p className="text-surface-500 text-center">{t('Both texts are identical.')}</p>
        </div>
      )}
    </ToolLayout>
  );
}

export default DiffChecker;
