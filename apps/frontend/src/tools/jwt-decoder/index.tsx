import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return atob(base64);
}

function formatTimestamp(value: number): string {
  try {
    const date = new Date(value * 1000);
    if (isNaN(date.getTime())) return String(value);
    return `${date.toISOString()} (${date.toLocaleString()})`;
  } catch {
    return String(value);
  }
}

function formatPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const formatted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (['exp', 'iat', 'nbf'].includes(key) && typeof value === 'number') {
      formatted[key] = `${value} -- ${formatTimestamp(value)}`;
    } else {
      formatted[key] = value;
    }
  }
  return formatted;
}

export function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    setHeader('');
    setPayload('');
    setSignature('');

    if (!token.trim()) {
      setError('Please enter a JWT token.');
      return;
    }

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT: token must have exactly 3 parts separated by dots (header.payload.signature).');
      return;
    }

    try {
      const headerJson = JSON.parse(decodeBase64Url(parts[0]));
      setHeader(JSON.stringify(headerJson, null, 2));
    } catch {
      setError('Invalid JWT: could not decode header.');
      return;
    }

    try {
      const payloadJson = JSON.parse(decodeBase64Url(parts[1]));
      const formatted = formatPayload(payloadJson);
      setPayload(JSON.stringify(formatted, null, 2));
    } catch {
      setError('Invalid JWT: could not decode payload.');
      return;
    }

    setSignature(parts[2]);
  };

  const clear = () => {
    setToken('');
    setHeader('');
    setPayload('');
    setSignature('');
    setError('');
  };

  return (
    <ToolLayout title="JWT Decoder" description="Decode and inspect JSON Web Tokens">
      <div className="space-y-4">
        <div>
          <label className="tool-label">JWT Token</label>
          <textarea
            className="tool-textarea"
            rows={4}
            placeholder="Paste your JWT token here (e.g. eyJhbGciOiJI...)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={decode}>
            Decode
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

        {header && (
          <div className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Header</h3>
              <CopyButton text={header} />
            </div>
            <OutputBox content={header} />
          </div>
        )}

        {payload && (
          <div className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Payload</h3>
              <CopyButton text={payload} />
            </div>
            <OutputBox content={payload} />
          </div>
        )}

        {signature && (
          <div className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Signature</h3>
              <CopyButton text={signature} />
            </div>
            <OutputBox content={signature} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default JwtDecoder;
