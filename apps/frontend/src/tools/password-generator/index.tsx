import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

type StrengthLevel = 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';

interface StrengthInfo {
  level: StrengthLevel;
  color: string;
  width: string;
}

function calculateStrength(password: string, charPoolSize: number): StrengthInfo {
  const entropy = password.length * Math.log2(charPoolSize || 1);

  if (entropy < 28) return { level: 'Very Weak', color: 'bg-red-500', width: 'w-1/5' };
  if (entropy < 36) return { level: 'Weak', color: 'bg-orange-500', width: 'w-2/5' };
  if (entropy < 60) return { level: 'Fair', color: 'bg-yellow-500', width: 'w-3/5' };
  if (entropy < 80) return { level: 'Strong', color: 'bg-green-500', width: 'w-4/5' };
  return { level: 'Very Strong', color: 'bg-emerald-600', width: 'w-full' };
}

function generateSecurePassword(length: number, charset: string): string {
  if (!charset) return '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (val) => charset[val % charset.length]).join('');
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const buildCharset = (): string => {
    let charset = '';
    if (useLowercase) charset += CHAR_SETS.lowercase;
    if (useUppercase) charset += CHAR_SETS.uppercase;
    if (useNumbers) charset += CHAR_SETS.numbers;
    if (useSymbols) charset += CHAR_SETS.symbols;
    return charset;
  };

  const handleGenerate = () => {
    setError('');
    const charset = buildCharset();
    if (!charset) {
      setError('Please select at least one character type.');
      setPassword('');
      return;
    }
    const clampedLength = Math.min(128, Math.max(8, length));
    setPassword(generateSecurePassword(clampedLength, charset));
  };

  const charset = buildCharset();
  const strength = password ? calculateStrength(password, charset.length) : null;

  return (
    <ToolLayout title="Password Generator" description="Generate strong, cryptographically random passwords.">
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="tool-label" htmlFor="pw-length">
              Length ({length})
            </label>
            <input
              id="pw-length"
              type="range"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-surface-500 mt-1">
              <span>8</span>
              <span>128</span>
            </div>
          </div>

          <div>
            <label className="tool-label" htmlFor="pw-length-input">
              Exact Length
            </label>
            <input
              id="pw-length-input"
              type="number"
              className="tool-input w-28"
              min={8}
              max={128}
              value={length}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setLength(Math.min(128, Math.max(8, val)));
                }
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="tool-label">Character Types</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useLowercase}
                onChange={(e) => setUseLowercase(e.target.checked)}
                className="rounded border-surface-600"
              />
              <span className="text-sm">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useUppercase}
                onChange={(e) => setUseUppercase(e.target.checked)}
                className="rounded border-surface-600"
              />
              <span className="text-sm">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="rounded border-surface-600"
              />
              <span className="text-sm">Numbers (0-9)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="rounded border-surface-600"
              />
              <span className="text-sm">Symbols (!@#$...)</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <button className="btn-primary" onClick={handleGenerate}>
            Generate Password
          </button>
        </div>
      </div>

      {error && (
        <div className="card mt-4 error-box border-0">
          <p className="font-medium">Error</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {password && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="tool-label mb-0">Generated Password</label>
            <CopyButton text={password} />
          </div>
          <OutputBox content={password} />

          {strength && (
            <div className="card mt-4">
              <label className="tool-label">Strength</label>
              <div className="w-full bg-surface-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                />
              </div>
              <p className="mt-2 text-sm font-medium">{strength.level}</p>
              <p className="text-xs text-surface-500 mt-1">
                Character pool: {charset.length} characters | Entropy: ~{Math.round(password.length * Math.log2(charset.length))} bits
              </p>
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

export default PasswordGenerator;
