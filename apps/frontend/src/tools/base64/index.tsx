import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

export function Base64EncodeDecode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    setError('');
    setOutput('');
    if (!input) {
      setError('Please enter text to encode.');
      return;
    }
    try {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(input);
      const binaryString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
      setOutput(btoa(binaryString));
    } catch (e) {
      setError(`Encoding failed: ${(e as Error).message}`);
    }
  };

  const handleDecode = () => {
    setError('');
    setOutput('');
    if (!input) {
      setError('Please enter Base64 text to decode.');
      return;
    }
    try {
      const binaryString = atob(input.trim());
      const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
      const decoder = new TextDecoder();
      setOutput(decoder.decode(bytes));
    } catch (e) {
      setError(`Decoding failed: ${(e as Error).message}`);
    }
  };

  return (
    <ToolLayout title="Base64 Encode/Decode" description="Encode text to Base64 or decode Base64 to text with full Unicode support.">
      <div className="card">
        <label className="tool-label" htmlFor="base64-input">
          Input
        </label>
        <textarea
          id="base64-input"
          className="tool-textarea"
          rows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode or Base64 string to decode..."
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

export default Base64EncodeDecode;
