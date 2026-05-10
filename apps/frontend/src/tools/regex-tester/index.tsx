import { useState, useMemo } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import { useI18n } from '../../hooks/useI18n';

interface MatchDetail {
  index: number;
  match: string;
  groups: Record<string, string> | null;
}

export function RegexTester() {
  const { t } = useI18n();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  const flagOptions = ['g', 'i', 'm', 's'] as const;

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: '' };
    try {
      const r = new RegExp(pattern, flags);
      return { regex: r, error: '' };
    } catch (e) {
      return { regex: null, error: (e as Error).message };
    }
  }, [pattern, flags]);

  const matches: MatchDetail[] = useMemo(() => {
    if (!regex || !testString) return [];
    const results: MatchDetail[] = [];
    if (flags.includes('g')) {
      let match: RegExpExecArray | null;
      const re = new RegExp(regex.source, regex.flags);
      while ((match = re.exec(testString)) !== null) {
        results.push({
          index: match.index,
          match: match[0],
          groups: match.groups ? { ...match.groups } : null,
        });
        if (match[0].length === 0) re.lastIndex++;
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        results.push({
          index: match.index,
          match: match[0],
          groups: match.groups ? { ...match.groups } : null,
        });
      }
    }
    return results;
  }, [regex, flags, testString]);

  const highlightedHtml = useMemo(() => {
    if (!regex || !testString || matches.length === 0) return null;

    const parts: { text: string; highlighted: boolean }[] = [];
    let lastIndex = 0;

    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    for (const m of sortedMatches) {
      if (m.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, m.index), highlighted: false });
      }
      parts.push({ text: m.match, highlighted: true });
      lastIndex = m.index + m.match.length;
    }

    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), highlighted: false });
    }

    return parts;
  }, [regex, testString, matches]);

  const matchDetailsText = useMemo(() => {
    if (matches.length === 0) return '';
    return matches
      .map((m, i) => {
        let detail = `Match ${i + 1}: "${m.match}" at index ${m.index}`;
        if (m.groups) {
          detail += `\n  Groups: ${JSON.stringify(m.groups)}`;
        }
        return detail;
      })
      .join('\n');
  }, [matches]);

  return (
    <ToolLayout title={t('Regex Tester')} description={t('Test regular expressions with live matching and highlighting')}>
      <div className="space-y-4">
        <div className="card">
          <div>
            <label className="tool-label">{t('Regular Expression Pattern')}</label>
            <input
              type="text"
              className="tool-input font-mono"
              placeholder={t('Enter regex pattern (e.g. \\d+|[a-z]+)')}
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="tool-label">{t('Flags')}</label>
            <div className="flex gap-2">
              {flagOptions.map((flag) => (
                <button
                  key={flag}
                  className={`px-3 py-1.5 rounded-lg font-mono text-sm border transition-all ${
                    flags.includes(flag)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-surface-900/50 text-surface-300 border-surface-600/50 hover:bg-surface-800'
                  }`}
                  onClick={() => toggleFlag(flag)}
                >
                  {flag}
                </button>
              ))}
            </div>
            <p className="text-xs text-surface-500 mt-1">
              {t('g = global, i = case-insensitive, m = multiline, s = dotAll')}
            </p>
          </div>

          <div className="mt-4">
            <label className="tool-label">{t('Test String')}</label>
            <textarea
              className="tool-textarea"
              rows={6}
              placeholder={t('Enter text to test against the regex')}
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="error-box">
            {t('Invalid regex:')} {error}
          </div>
        )}

        {highlightedHtml && highlightedHtml.length > 0 && (
          <div className="card p-4 space-y-2">
            <label className="tool-label">{t('Highlighted Matches')}</label>
            <div className="font-mono text-sm whitespace-pre-wrap bg-surface-900/50 p-3 rounded-xl border border-surface-700/50">
              {highlightedHtml.map((part, i) =>
                part.highlighted ? (
                  <mark key={i} className="bg-yellow-500/30 text-yellow-300 px-0.5 rounded">
                    {part.text}
                  </mark>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </div>
          </div>
        )}

        {pattern && testString && !error && (
          <div className="card p-4 space-y-2">
            <label className="tool-label">
              {t('Match Details')} ({matches.length} {matches.length !== 1 ? t('matches') : t('match')})
            </label>
            {matches.length > 0 ? (
              <OutputBox content={matchDetailsText} />
            ) : (
              <p className="text-surface-500">{t('No matches found.')}</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default RegexTester;
