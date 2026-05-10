import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

async function generateSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function Sha256Generator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    setError('');
    setHash('');

    if (!input) {
      setError('Please enter some text to hash.');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateSha256(input);
      setHash(result);
    } catch (e) {
      setError(`Failed to generate hash: ${(e as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const clear = () => {
    setInput('');
    setHash('');
    setError('');
  };

  return (
    <ToolLayout title="SHA-256 Hash Generator" description="Generate SHA-256 hashes from text using the Web Crypto API">
      <div className="space-y-4">
        <div>
          <label className="tool-label">Input Text</label>
          <textarea
            className="tool-textarea"
            rows={6}
            placeholder="Enter text to hash..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {input && (
            <p className="text-xs text-surface-500 mt-1">
              {input.length} character{input.length !== 1 ? 's' : ''} | {new TextEncoder().encode(input).length} bytes
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={generate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Hash'}
          </button>
          <button className="btn-secondary" onClick={clear}>
            Clear
          </button>
        </div>

        {error && (
          <div className="card error-box border-0 p-4">
            {error}
          </div>
        )}

        {hash && (
          <div className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">SHA-256 Hash (Hex)</h3>
              <CopyButton text={hash} />
            </div>
            <OutputBox content={hash} />
            <p className="text-xs text-surface-500">{hash.length * 4} bits / {hash.length / 2} bytes</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default Sha256Generator;
