import { useState, useMemo } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

function splitWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

function toCamelCase(str: string): string {
  const words = splitWords(str);
  if (words.length === 0) return '';
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join('');
}

function toPascalCase(str: string): string {
  const words = splitWords(str);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function toSnakeCase(str: string): string {
  return splitWords(str)
    .map((w) => w.toLowerCase())
    .join('_');
}

function toKebabCase(str: string): string {
  return splitWords(str)
    .map((w) => w.toLowerCase())
    .join('-');
}

function toUpperSnakeCase(str: string): string {
  return splitWords(str)
    .map((w) => w.toUpperCase())
    .join('_');
}

function toLowerCase(str: string): string {
  return str.toLowerCase();
}

function toUpperCase(str: string): string {
  return str.toUpperCase();
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|[-_])\S/g, (match) => match.toUpperCase());
}

function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
}

function toLowerSpaced(str: string): string {
  return splitWords(str)
    .map((w) => w.toLowerCase())
    .join(' ');
}

interface Conversion {
  name: string;
  fn: (str: string) => string;
}

const conversions: Conversion[] = [
  { name: 'camelCase', fn: toCamelCase },
  { name: 'PascalCase', fn: toPascalCase },
  { name: 'snake_case', fn: toSnakeCase },
  { name: 'kebab-case', fn: toKebabCase },
  { name: 'UPPER_CASE', fn: toUpperSnakeCase },
  { name: 'lower case', fn: toLowerSpaced },
  { name: 'Title Case', fn: toTitleCase },
  { name: 'UPPERCASE', fn: toUpperCase },
  { name: 'lowercase', fn: toLowerCase },
  { name: 'Sentence case', fn: toSentenceCase },
];

export function CaseConverter() {
  const [input, setInput] = useState('');

  const results = useMemo(() => {
    if (!input.trim()) return [];
    return conversions.map((c) => ({
      name: c.name,
      value: c.fn(input),
    }));
  }, [input]);

  return (
    <ToolLayout title="Case Converter" description="Convert text between different casing styles">
      <div className="card">
        <div>
          <label className="tool-label">Input Text</label>
          <textarea
            className="tool-textarea"
            rows={4}
            placeholder="Enter text to convert (e.g., hello world, helloWorld, hello_world)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-4">
          <OutputBox label="All Conversions">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((result) => (
                <div key={result.name} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <label className="tool-label">{result.name}</label>
                    <CopyButton text={result.value} />
                  </div>
                  <div className="tool-input bg-gray-50 break-all">{result.value}</div>
                </div>
              ))}
            </div>
          </OutputBox>
        </div>
      )}
    </ToolLayout>
  );
}

export default CaseConverter;
