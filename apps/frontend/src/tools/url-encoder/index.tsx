import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import { useI18n } from '../../hooks/useI18n';

export function UrlEncoder() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [componentOutput, setComponentOutput] = useState('');
  const [uriOutput, setUriOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    setError('');
    setComponentOutput('');
    setUriOutput('');
    if (!input) {
      setError(t('Please enter text to encode.'));
      return;
    }
    try {
      setComponentOutput(encodeURIComponent(input));
      setUriOutput(encodeURI(input));
    } catch (e) {
      setError(`${t('Encoding failed')}: ${(e as Error).message}`);
    }
  };

  const handleDecode = () => {
    setError('');
    setComponentOutput('');
    setUriOutput('');
    if (!input) {
      setError(t('Please enter URL-encoded text to decode.'));
      return;
    }
    try {
      setComponentOutput(decodeURIComponent(input));
      setUriOutput(decodeURI(input));
    } catch (e) {
      setError(`${t('Decoding failed')}: ${(e as Error).message}`);
    }
  };

  return (
    <ToolLayout title={t('URL Encode/Decode')} description={t('Encode or decode URL components using encodeURIComponent and encodeURI.')}>
      <div className="card">
        <label className="tool-label" htmlFor="url-input">
          {t('Input')}
        </label>
        <textarea
          id="url-input"
          className="tool-textarea"
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('Enter text to encode or URL-encoded string to decode...')}
        />

        <div className="flex gap-3 mt-4">
          <button className="btn-primary" onClick={handleEncode}>
            {t('Encode')}
          </button>
          <button className="btn-secondary" onClick={handleDecode}>
            {t('Decode')}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-box mt-4">
          <p className="font-medium">{t('Error')}</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {componentOutput && (
        <div className="mt-4">
          <OutputBox label={t('encodeURIComponent Result')} content={componentOutput} />
        </div>
      )}

      {uriOutput && (
        <div className="mt-4">
          <OutputBox label={t('encodeURI Result')} content={uriOutput} />
        </div>
      )}
    </ToolLayout>
  );
}

export default UrlEncoder;
