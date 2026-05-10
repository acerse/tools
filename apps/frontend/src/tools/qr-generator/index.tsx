import { useState, useCallback } from 'react';
import QRCode from 'qrcode';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';
import Select from '../../components/Select';
import { useI18n } from '../../hooks/useI18n';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export function QRGenerator() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sizeOptions = [128, 256, 512, 1024].map((s) => ({
    value: String(s),
    label: `${s} x ${s}`,
  }));

  const errorCorrectionOptions = [
    { value: 'L', label: t('Low (7%)') },
    { value: 'M', label: t('Medium (15%)') },
    { value: 'Q', label: t('Quartile (25%)') },
    { value: 'H', label: t('High (30%)') },
  ];

  const generateQR = useCallback(async () => {
    if (!text.trim()) {
      setError(t('Please enter text or a URL to generate a QR code.'));
      setQrDataUrl(null);
      return;
    }

    setError(null);

    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Failed to generate QR code.'));
      setQrDataUrl(null);
    }
  }, [text, size, errorCorrection, t]);

  const downloadQR = useCallback(() => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrDataUrl]);

  return (
    <ToolLayout title={t('QR Code Generator')} description={t('Generate QR codes from text or URLs')}>
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="tool-label">{t('Text or URL')}</label>
            <input
              type="text"
              className="tool-input"
              placeholder={t('Enter text or URL...')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') generateQR();
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="tool-label">{t('Size (px)')}</label>
              <Select
                value={String(size)}
                onChange={(val) => setSize(Number(val))}
                options={sizeOptions}
              />
            </div>

            <div>
              <label className="tool-label">{t('Error Correction')}</label>
              <Select
                value={errorCorrection}
                onChange={(val) => setErrorCorrection(val as ErrorCorrectionLevel)}
                options={errorCorrectionOptions}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-primary" onClick={generateQR}>
              {t('Generate QR Code')}
            </button>
            {qrDataUrl && (
              <button className="btn-secondary" onClick={downloadQR}>
                {t('Download PNG')}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-box mt-4">
          <p>{error}</p>
        </div>
      )}

      {qrDataUrl && (
        <div className="mt-4">
          <OutputBox label={t('Generated QR Code')}>
            <div className="flex flex-col items-center gap-4">
              <img
                src={qrDataUrl}
                alt={t('Generated QR Code')}
                className="max-w-full"
                style={{ width: size, height: size, imageRendering: 'pixelated' }}
              />

              <div className="flex gap-2 items-center">
                <CopyButton text={text} />
                <span className="text-sm text-surface-500">
                  {size}x{size}px | {t('Error Correction')}: {errorCorrection}
                </span>
              </div>
            </div>
          </OutputBox>
        </div>
      )}
    </ToolLayout>
  );
}

export default QRGenerator;
