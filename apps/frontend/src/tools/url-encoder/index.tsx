import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

export function UrlEncoder() {
  const [input, setInput] = useState('');
  const [componentOutput, setComponentOutput] = useState('');
  const [uriOutput, setUriOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    setError('');
    setComponentOutput('');
    setUriOutput('');
    if (!input) {
      setError('Please enter text to encode.');
      return;
    }
    try {
      setComponentOutput(encodeURIComponent(input));
      setUriOutput(encodeURI(input));
    } catch (e) {
      setError(`Encoding failed: ${(e as Error).message}`);
    }
  };

  const handleDecode = () => {
    setError('');
    setComponentOutput('');
    setUriOutput('');
    if (!input) {
      setError('Please enter URL-encoded text to decode.');
      return;
    }
    try {
      setComponentOutput(decodeURIComponent(input));
      setUriOutput(decodeURI(input));
    } catch (e) {
      setError(`Decoding failed: ${(e as Error).message}`);
    }
  };

  return (
    <ToolLayout title="URL Encode/Decode" description="Encode or decode URL components using encodeURIComponent and encodeURI.">
      <div className="card">
        <label className="tool-label" htmlFor="url-input">
          Input
        </label>
        <textarea
          id="url-input"
          className="tool-textarea"
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode or URL-encoded string to decode..."
        />

        <div className="flex gap-3 mt-4">
          <button className="btn-primary" onClick={handleEncode}>
            Encode
          </button>
          <button className="btn-secondary" onClick={handleDecode}>
            Decode
          </button>
        </div>
      </div>

      {error && (
        <div className="card mt-4 border-red-400 bg-red-50 text-red-700">
          <p className="font-medium">Error</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {componentOutput && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="tool-label mb-0">encodeURIComponent Result</label>
            <CopyButton text={componentOutput} />
          </div>
          <OutputBox content={componentOutput} />
        </div>
      )}

      {uriOutput && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="tool-label mb-0">encodeURI Result</label>
            <CopyButton text={uriOutput} />
          </div>
          <OutputBox content={uriOutput} />
        </div>
      )}
    </ToolLayout>
  );
}

export default UrlEncoder;
