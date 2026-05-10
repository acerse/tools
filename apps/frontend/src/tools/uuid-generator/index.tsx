import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';
import Checkbox from '../../components/Checkbox';
import { useI18n } from '../../hooks/useI18n';

export function UuidGenerator() {
  const { t } = useI18n();
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);

  const generateUuids = () => {
    const clampedCount = Math.min(100, Math.max(1, count));
    const generated: string[] = [];
    for (let i = 0; i < clampedCount; i++) {
      const uuid = crypto.randomUUID();
      generated.push(uppercase ? uuid.toUpperCase() : uuid);
    }
    setUuids(generated);
  };

  const allUuidsText = uuids.join('\n');

  return (
    <ToolLayout title={t('UUID Generator')} description={t('Generate RFC 4122 version 4 UUIDs.')}>
      <div className="card">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="tool-label" htmlFor="uuid-count">
              {t('Count (1-100)')}
            </label>
            <input
              id="uuid-count"
              type="number"
              className="tool-input w-28"
              min={1}
              max={100}
              value={count}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  setCount(Math.min(100, Math.max(1, val)));
                }
              }}
            />
          </div>

          <div>
            <Checkbox checked={uppercase} onChange={setUppercase} label={t('Uppercase')} />
          </div>

          <button className="btn-primary" onClick={generateUuids}>
            {t('Generate')}
          </button>
        </div>
      </div>

      {uuids.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="tool-label mb-0">
              {t('Generated UUID')}{uuids.length > 1 ? 's' : ''} ({uuids.length})
            </label>
            {uuids.length > 1 && <CopyButton text={allUuidsText} />}
          </div>

          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div key={index} className="card flex items-center justify-between gap-3 py-2 px-3">
                <code className="text-sm font-mono break-all">{uuid}</code>
                <CopyButton text={uuid} />
              </div>
            ))}
          </div>

          {uuids.length > 1 && (
            <div className="mt-4">
              <label className="tool-label">{t('All UUIDs (plain text)')}</label>
              <OutputBox content={allUuidsText} />
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}

export default UuidGenerator;
