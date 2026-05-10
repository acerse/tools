import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

type IndentType = '2' | '4' | 'tab';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<IndentType>('2');

  const getIndent = (): string | number => {
    switch (indent) {
      case '2':
        return 2;
      case '4':
        return 4;
      case 'tab':
        return '\t';
    }
  };

  const handleFormat = () => {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter some JSON to format.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, getIndent()));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  const handleMinify = () => {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter some JSON to minify.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  const handleValidate = () => {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter some JSON to validate.');
      return;
    }
    try {
      JSON.parse(input);
      setOutput('Valid JSON');
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  return (
    <ToolLayout title="JSON Formatter & Validator" description="Format, minify, and validate JSON data.">
      <div className="card">
        <label className="tool-label" htmlFor="json-input">
          JSON Input
        </label>
        <textarea
          id="json-input"
          className="tool-textarea"
          rows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"key": "value", "numbers": [1, 2, 3]}'
        />

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <label className="tool-label mb-0" htmlFor="indent-select">
              Indentation
            </label>
            <select
              id="indent-select"
              className="tool-input w-auto"
              value={indent}
              onChange={(e) => setIndent(e.target.value as IndentType)}
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">Tabs</option>
            </select>
          </div>

          <button className="btn-primary" onClick={handleFormat}>
            Format
          </button>
          <button className="btn-secondary" onClick={handleMinify}>
            Minify
          </button>
          <button className="btn-secondary" onClick={handleValidate}>
            Validate
          </button>
        </div>
      </div>

      {error && (
        <div className="card mt-4 error-box border-0">
          <p className="font-medium">Error</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {output && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="tool-label mb-0">Output</label>
            <CopyButton text={output} />
          </div>
          <OutputBox content={output} />
        </div>
      )}
    </ToolLayout>
  );
}

export default JsonFormatter;
