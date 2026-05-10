import { useState, useMemo } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

interface MatchDetail {
  index: number;
  match: string;
  groups: Record<string, string> | null;
}

export function RegexTester() {
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
    <ToolLayout title="Regex Tester" description="Test regular expressions with live matching and highlighting">
      <div className="space-y-4">
        <div>
          <label className="tool-label">Regular Expression Pattern</label>
          <input
            type="text"
            className="tool-input font-mono"
            placeholder="Enter regex pattern (e.g. \\d+|[a-z]+)"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          />
        </div>

        <div>
          <label className="tool-label">Flags</label>
          <div className="flex gap-2">
            {flagOptions.map((flag) => (
              <button
                key={flag}
                className={`px-3 py-1 rounded font-mono text-sm border ${
                  flags.includes(flag)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => toggleFlag(flag)}
              >
                {flag}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            g = global, i = case-insensitive, m = multiline, s = dotAll
          </p>
        </div>

        <div>
          <label className="tool-label">Test String</label>
          <textarea
            className="tool-textarea"
            rows={6}
            placeholder="Enter text to test against the regex"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
          />
        </div>

        {error && (
          <div className="card border-red-300 bg-red-50 text-red-700 p-4">
            Invalid regex: {error}
          </div>
        )}

        {highlightedHtml && highlightedHtml.length > 0 && (
          <div className="card p-4 space-y-2">
            <h3 className="font-semibold text-lg">Highlighted Matches</h3>
            <div className="font-mono text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border">
              {highlightedHtml.map((part, i) =>
                part.highlighted ? (
                  <mark key={i} className="bg-yellow-300 text-black px-0.5 rounded">
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
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Match Details ({matches.length} match{matches.length !== 1 ? 'es' : ''})
              </h3>
              {matchDetailsText && <CopyButton text={matchDetailsText} />}
            </div>
            {matches.length > 0 ? (
              <OutputBox content={matchDetailsText} />
            ) : (
              <p className="text-gray-500">No matches found.</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default RegexTester;
