import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

const errorCorrectionOptions: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: 'L', label: 'Low (7%)' },
  { value: 'M', label: 'Medium (15%)' },
  { value: 'Q', label: 'Quartile (25%)' },
  { value: 'H', label: 'High (30%)' },
];

const sizeOptions = [128, 256, 512, 1024];

export function QRGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter text or a URL to generate a QR code.');
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
      setError(err instanceof Error ? err.message : 'Failed to generate QR code.');
      setQrDataUrl(null);
    }
  }, [text, size, errorCorrection]);

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
    <ToolLayout title="QR Code Generator" description="Generate QR codes from text or URLs">
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="tool-label">Text or URL</label>
            <input
              type="text"
              className="tool-input"
              placeholder="Enter text or URL..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') generateQR();
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="tool-label">Size (px)</label>
              <select
                className="tool-input"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              >
                {sizeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s} x {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="tool-label">Error Correction</label>
              <select
                className="tool-input"
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
              >
                {errorCorrectionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-primary" onClick={generateQR}>
              Generate QR Code
            </button>
            {qrDataUrl && (
              <button className="btn-secondary" onClick={downloadQR}>
                Download PNG
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="card mt-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {qrDataUrl && (
        <div className="mt-4">
          <OutputBox label="Generated QR Code">
            <div className="flex flex-col items-center gap-4">
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                style={{ width: size, height: size, imageRendering: 'pixelated' }}
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2 items-center">
                <CopyButton text={text} />
                <span className="text-sm text-gray-500">
                  {size}x{size}px | Error Correction: {errorCorrection}
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
