import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';

// Pure JavaScript MD5 implementation (RFC 1321)
function md5(input: string): string {
  function toUTF8(str: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 0x80) {
        bytes.push(c);
      } else if (c < 0x800) {
        bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      } else if (c < 0xd800 || c >= 0xe000) {
        bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
      } else {
        i++;
        c = 0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        bytes.push(
          0xf0 | (c >> 18),
          0x80 | ((c >> 12) & 0x3f),
          0x80 | ((c >> 6) & 0x3f),
          0x80 | (c & 0x3f)
        );
      }
    }
    return bytes;
  }

  function addUnsigned(x: number, y: number): number {
    return (x + y) & 0xffffffff;
  }

  function rotateLeft(val: number, bits: number): number {
    return (val << bits) | (val >>> (32 - bits));
  }

  function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z); }

  function step(
    fn: (x: number, y: number, z: number) => number,
    a: number, b: number, c: number, d: number,
    x: number, s: number, t: number
  ): number {
    let res = addUnsigned(a, addUnsigned(addUnsigned(fn(b, c, d), x), t));
    return addUnsigned(rotateLeft(res, s), b);
  }

  function wordToHex(val: number): string {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      hex += ((val >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
  }

  const bytes = toUTF8(input);
  const bitLen = bytes.length * 8;

  // Padding
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) {
    bytes.push(0);
  }

  // Append original length as 64-bit little-endian
  for (let i = 0; i < 8; i++) {
    bytes.push((bitLen >>> (i * 8)) & 0xff);
  }

  // Per-round shift amounts
  const S = [
    [7, 12, 17, 22], [5, 9, 14, 20], [4, 11, 16, 23], [6, 10, 15, 21]
  ];

  // T table (precomputed: floor(2^32 * abs(sin(i+1))))
  const T = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ];

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const M: number[] = [];
    for (let j = 0; j < 16; j++) {
      const base = offset + j * 4;
      M[j] = bytes[base] | (bytes[base + 1] << 8) | (bytes[base + 2] << 16) | (bytes[base + 3] << 24);
    }

    let a = a0, b = b0, c = c0, d = d0;

    // Round 1 (F)
    for (let i = 0; i < 16; i++) {
      const g = i;
      a = step(F, a, b, c, d, M[g], S[0][i % 4], T[i]);
      [a, b, c, d] = [d, a, b, c];
    }

    // Round 2 (G)
    for (let i = 0; i < 16; i++) {
      const g = (5 * i + 1) % 16;
      a = step(G, a, b, c, d, M[g], S[1][i % 4], T[16 + i]);
      [a, b, c, d] = [d, a, b, c];
    }

    // Round 3 (H)
    for (let i = 0; i < 16; i++) {
      const g = (3 * i + 5) % 16;
      a = step(H, a, b, c, d, M[g], S[2][i % 4], T[32 + i]);
      [a, b, c, d] = [d, a, b, c];
    }

    // Round 4 (I)
    for (let i = 0; i < 16; i++) {
      const g = (7 * i) % 16;
      a = step(I, a, b, c, d, M[g], S[3][i % 4], T[48 + i]);
      [a, b, c, d] = [d, a, b, c];
    }

    a0 = addUnsigned(a0, a);
    b0 = addUnsigned(b0, b);
    c0 = addUnsigned(c0, c);
    d0 = addUnsigned(d0, d);
  }

  return wordToHex(a0) + wordToHex(b0) + wordToHex(c0) + wordToHex(d0);
}

export function Md5Generator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setHash('');

    if (!input) {
      setError('Please enter some text to hash.');
      return;
    }

    try {
      const result = md5(input);
      setHash(result);
    } catch (e) {
      setError(`Failed to generate hash: ${(e as Error).message}`);
    }
  };

  const clear = () => {
    setInput('');
    setHash('');
    setError('');
  };

  return (
    <ToolLayout title="MD5 Hash Generator" description="Generate MD5 hashes from text (pure in-browser implementation)">
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
            <p className="text-xs text-gray-500 mt-1">
              {input.length} character{input.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" onClick={generate}>
            Generate Hash
          </button>
          <button className="btn-secondary" onClick={clear}>
            Clear
          </button>
        </div>

        {error && (
          <div className="card border-red-300 bg-red-50 text-red-700 p-4">
            {error}
          </div>
        )}

        {hash && (
          <div className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">MD5 Hash (Hex)</h3>
              <CopyButton text={hash} />
            </div>
            <OutputBox content={hash} />
            <p className="text-xs text-gray-500">128 bits / 16 bytes</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default Md5Generator;
