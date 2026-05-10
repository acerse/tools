import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';
import Select from '../../components/Select';
import { useI18n } from '../../hooks/useI18n';

type IndentType = '2' | '4' | 'tab';

export function JsonFormatter() {
  const { t } = useI18n();
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
      setError(t('Please enter some JSON to format.'));
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, getIndent()));
    } catch (e) {
      setError(`${t('Invalid JSON')}: ${(e as Error).message}`);
    }
  };

  const handleMinify = () => {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError(t('Please enter some JSON to minify.'));
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(`${t('Invalid JSON')}: ${(e as Error).message}`);
    }
  };

  const handleValidate = () => {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError(t('Please enter some JSON to validate.'));
      return;
    }
    try {
      JSON.parse(input);
      setOutput(t('Valid JSON'));
    } catch (e) {
      setError(`${t('Invalid JSON')}: ${(e as Error).message}`);
    }
  };

  return (
    <ToolLayout title={t('JSON Formatter & Validator')} description={t('Format, minify, and validate JSON data.')}>
      <div className="card">
        <label className="tool-label" htmlFor="json-input">
          {t('JSON Input')}
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
              {t('Indentation')}
            </label>
            <Select
              value={indent}
              onChange={(val) => setIndent(val as IndentType)}
              options={[
                { value: '2', label: t('2 Spaces') },
                { value: '4', label: t('4 Spaces') },
                { value: 'tab', label: t('Tabs') },
              ]}
            />
          </div>

          <button className="btn-primary" onClick={handleFormat}>
            {t('Format')}
          </button>
          <button className="btn-secondary" onClick={handleMinify}>
            {t('Minify')}
          </button>
          <button className="btn-secondary" onClick={handleValidate}>
            {t('Validate')}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-box mt-4">
          <p className="font-medium">{t('Error')}</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {output && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="tool-label mb-0">{t('Output')}</label>
            <CopyButton text={output} />
          </div>
          <OutputBox content={output} />
        </div>
      )}
    </ToolLayout>
  );
}

export default JsonFormatter;
