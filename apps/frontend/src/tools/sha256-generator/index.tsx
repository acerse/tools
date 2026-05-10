import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';
import { useI18n } from '../../hooks/useI18n';

async function generateSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function Sha256Generator() {
  const { t } = useI18n();
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
    <ToolLayout title={t('SHA-256 Hash Generator')} description={t('Generate SHA-256 hashes from text using the Web Crypto API')}>
      <div className="space-y-4">
        <div className="card">
          <div>
            <label className="tool-label">{t('Input Text')}</label>
            <textarea
              className="tool-textarea"
              rows={6}
              placeholder={t('Enter text to hash...')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {input && (
              <p className="text-xs text-surface-500 mt-1">
                {input.length} {input.length !== 1 ? t('characters') : t('character')} | {new TextEncoder().encode(input).length} {t('bytes')}
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button className="btn-primary" onClick={generate} disabled={isGenerating}>
              {isGenerating ? t('Generating...') : t('Generate Hash')}
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

        {hash && (
          <div className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="tool-label">{t('SHA-256 Hash (Hex)')}</label>
              <CopyButton text={hash} />
            </div>
            <OutputBox content={hash} />
            <p className="text-xs text-surface-500">{hash.length * 4} {t('bits')} / {hash.length / 2} {t('bytes')}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default Sha256Generator;
