import { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isFuture = diffMs > 0;

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let relative: string;
  if (seconds < 60) relative = `${seconds} second${seconds !== 1 ? 's' : ''}`;
  else if (minutes < 60) relative = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  else if (hours < 24) relative = `${hours} hour${hours !== 1 ? 's' : ''}`;
  else if (days < 30) relative = `${days} day${days !== 1 ? 's' : ''}`;
  else if (months < 12) relative = `${months} month${months !== 1 ? 's' : ''}`;
  else relative = `${years} year${years !== 1 ? 's' : ''}`;

  return isFuture ? `in ${relative}` : `${relative} ago`;
}

export function TimestampConverter() {
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [convertedFromTs, setConvertedFromTs] = useState<{
    iso: string;
    utc: string;
    local: string;
    relative: string;
    unixSeconds: number;
    unixMilliseconds: number;
  } | null>(null);
  const [convertedFromDate, setConvertedFromDate] = useState<{
    unixSeconds: number;
    unixMilliseconds: number;
    iso: string;
    utc: string;
    relative: string;
  } | null>(null);
  const [error, setError] = useState('');

  const convertTimestamp = useCallback((tsStr: string) => {
    setError('');
    setConvertedFromTs(null);

    if (!tsStr.trim()) return;

    const ts = Number(tsStr.trim());
    if (isNaN(ts)) {
      setError('Invalid timestamp. Please enter a numeric value.');
      return;
    }

    // Determine if seconds or milliseconds: if length <= 10 assume seconds, else milliseconds
    let ms: number;
    if (ts > 1e12) {
      ms = ts;
    } else {
      ms = ts * 1000;
    }

    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setError('Invalid timestamp: results in an invalid date.');
      return;
    }

    setConvertedFromTs({
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      relative: getRelativeTime(date),
      unixSeconds: Math.floor(ms / 1000),
      unixMilliseconds: ms,
    });
  }, []);

  const convertDate = useCallback(() => {
    setError('');
    setConvertedFromDate(null);

    if (!dateInput) {
      setError('Please select a date.');
      return;
    }

    const dateTimeStr = timeInput ? `${dateInput}T${timeInput}` : `${dateInput}T00:00:00`;
    const date = new Date(dateTimeStr);

    if (isNaN(date.getTime())) {
      setError('Invalid date/time combination.');
      return;
    }

    const ms = date.getTime();

    setConvertedFromDate({
      unixSeconds: Math.floor(ms / 1000),
      unixMilliseconds: ms,
      iso: date.toISOString(),
      utc: date.toUTCString(),
      relative: getRelativeTime(date),
    });
  }, [dateInput, timeInput]);

  const setNow = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestampInput(String(now));
    convertTimestamp(String(now));
  };

  useEffect(() => {
    if (timestampInput) {
      convertTimestamp(timestampInput);
    }
  }, [timestampInput, convertTimestamp]);

  const tsOutputText = convertedFromTs
    ? [
        `ISO 8601:    ${convertedFromTs.iso}`,
        `UTC:         ${convertedFromTs.utc}`,
        `Local:       ${convertedFromTs.local}`,
        `Relative:    ${convertedFromTs.relative}`,
        `Unix (s):    ${convertedFromTs.unixSeconds}`,
        `Unix (ms):   ${convertedFromTs.unixMilliseconds}`,
      ].join('\n')
    : '';

  const dateOutputText = convertedFromDate
    ? [
        `Unix (s):    ${convertedFromDate.unixSeconds}`,
        `Unix (ms):   ${convertedFromDate.unixMilliseconds}`,
        `ISO 8601:    ${convertedFromDate.iso}`,
        `UTC:         ${convertedFromDate.utc}`,
        `Relative:    ${convertedFromDate.relative}`,
      ].join('\n')
    : '';

  return (
    <ToolLayout title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates">
      <div className="space-y-6">
        {/* Timestamp to Date */}
        <div className="card p-4 space-y-4">
          <h3 className="font-semibold text-lg">Unix Timestamp to Date</h3>
          <div>
            <label className="tool-label">Unix Timestamp (seconds or milliseconds)</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="tool-input flex-1"
                placeholder="e.g. 1700000000 or 1700000000000"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
              />
              <button className="btn-primary" onClick={setNow}>
                Now
              </button>
            </div>
          </div>

          {convertedFromTs && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Result</h4>
                <CopyButton text={tsOutputText} />
              </div>
              <OutputBox content={tsOutputText} />
            </div>
          )}
        </div>

        {/* Date to Timestamp */}
        <div className="card p-4 space-y-4">
          <h3 className="font-semibold text-lg">Date to Unix Timestamp</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="tool-label">Date</label>
              <input
                type="date"
                className="tool-input"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
              />
            </div>
            <div>
              <label className="tool-label">Time (optional)</label>
              <input
                type="time"
                className="tool-input"
                step="1"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
              />
            </div>
          </div>
          <button className="btn-primary" onClick={convertDate}>
            Convert to Timestamp
          </button>

          {convertedFromDate && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Result</h4>
                <CopyButton text={dateOutputText} />
              </div>
              <OutputBox content={dateOutputText} />
            </div>
          )}
        </div>

        {error && (
          <div className="card border-red-300 bg-red-50 text-red-700 p-4">
            {error}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default TimestampConverter;
