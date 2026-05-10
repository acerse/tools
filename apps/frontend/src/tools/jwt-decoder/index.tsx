import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import { useI18n } from '../../hooks/useI18n';

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
  const { t } = useI18n();
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
    <ToolLayout title={t('JWT Decoder')} description={t('Decode and inspect JSON Web Tokens')}>
      <div className="space-y-4">
        <div className="card">
          <div>
            <label className="tool-label">{t('JWT Token')}</label>
            <textarea
              className="tool-textarea"
              rows={4}
              placeholder={t('Paste your JWT token here (e.g. eyJhbGciOiJI...)')}
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={decode}>
              {t('Decode')}
            </button>
            <button className="btn-secondary" onClick={clear}>
              {t('Clear')}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-box">
            {t(error)}
          </div>
        )}

        {header && (
          <div className="card p-4 space-y-2">
            <OutputBox label={t('Header')} content={header} />
          </div>
        )}

        {payload && (
          <div className="card p-4 space-y-2">
            <OutputBox label={t('Payload')} content={payload} />
          </div>
        )}

        {signature && (
          <div className="card p-4 space-y-2">
            <OutputBox label={t('Signature')} content={signature} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default JwtDecoder;
