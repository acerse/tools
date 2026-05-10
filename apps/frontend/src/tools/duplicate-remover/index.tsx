import { useState, useMemo } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';
import RadioGroup from '../../components/RadioGroup';
import { useI18n } from '../../hooks/useI18n';

type KeepOccurrence = 'first' | 'last';

export function DuplicateRemover() {
  const { t } = useI18n();
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
      title={t('Duplicate Line Remover')}
      description={t('Remove duplicate lines from text')}
    >
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="tool-label">{t('Input Text')}</label>
            <textarea
              className="tool-textarea font-mono"
              rows={10}
              placeholder={t('Paste text with duplicate lines...')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="tool-label">{t('Case Sensitivity')}</label>
              <RadioGroup
                value={caseSensitive ? 'true' : 'false'}
                onChange={(v) => setCaseSensitive(v === 'true')}
                options={[
                  { value: 'true', label: t('Case Sensitive') },
                  { value: 'false', label: t('Case Insensitive') },
                ]}
              />
            </div>

            <div>
              <label className="tool-label">{t('Whitespace')}</label>
              <RadioGroup
                value={trimWhitespace ? 'true' : 'false'}
                onChange={(v) => setTrimWhitespace(v === 'true')}
                options={[
                  { value: 'true', label: t('Trim') },
                  { value: 'false', label: t('Keep') },
                ]}
              />
            </div>

            <div>
              <label className="tool-label">{t('Keep Occurrence')}</label>
              <RadioGroup
                value={keepOccurrence}
                onChange={(v) => setKeepOccurrence(v as KeepOccurrence)}
                options={[
                  { value: 'first', label: t('First') },
                  { value: 'last', label: t('Last') },
                ]}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-secondary" onClick={handleClear}>
              {t('Clear')}
            </button>
          </div>
        </div>
      </div>

      {input.trim() && (
        <div className="mt-4">
          <OutputBox label={t('Result')}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-4 text-sm">
                <span className="text-surface-500">{t('Total')}: {totalLines}</span>
                <span className="text-green-400 font-medium">{t('Unique')}: {uniqueLines}</span>
                <span className="text-red-400 font-medium">
                  {t('Removed')}: {duplicatesRemoved}
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
