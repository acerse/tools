import { lazy } from 'react'
import type { ToolDefinition } from './types'

const JsonFormatter = lazy(() => import('./json-formatter'))
const Base64Tool = lazy(() => import('./base64'))
const UrlEncoder = lazy(() => import('./url-encoder'))
const HtmlEscape = lazy(() => import('./html-escape'))
const UuidGenerator = lazy(() => import('./uuid-generator'))
const PasswordGenerator = lazy(() => import('./password-generator'))
const JwtDecoder = lazy(() => import('./jwt-decoder'))
const RegexTester = lazy(() => import('./regex-tester'))
const Sha256Generator = lazy(() => import('./sha256-generator'))
const Md5Generator = lazy(() => import('./md5-generator'))
const TimestampConverter = lazy(() => import('./timestamp-converter'))
const HttpStatus = lazy(() => import('./http-status'))
const QrGenerator = lazy(() => import('./qr-generator'))
const CaseConverter = lazy(() => import('./case-converter'))
const DiffChecker = lazy(() => import('./diff-checker'))
const LineSorter = lazy(() => import('./line-sorter'))
const DuplicateRemover = lazy(() => import('./duplicate-remover'))

export const tools: ToolDefinition[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON data',
    route: '/json-formatter',
    category: 'text',
    keywords: ['json', 'format', 'validate', 'minify', 'pretty', 'parse'],
    component: JsonFormatter,
    icon: '{ }',
  },
  {
    id: 'base64',
    name: 'Base64 Encode/Decode',
    description: 'Encode and decode Base64 strings',
    route: '/base64',
    category: 'text',
    keywords: ['base64', 'encode', 'decode', 'binary', 'ascii'],
    component: Base64Tool,
    icon: 'B64',
  },
  {
    id: 'url-encoder',
    name: 'URL Encode/Decode',
    description: 'Encode and decode URL components',
    route: '/url-encoder',
    category: 'text',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent', 'query'],
    component: UrlEncoder,
    icon: '%',
  },
  {
    id: 'html-escape',
    name: 'HTML Escape/Unescape',
    description: 'Escape and unescape HTML entities',
    route: '/html-escape',
    category: 'text',
    keywords: ['html', 'escape', 'unescape', 'entities', 'xss'],
    component: HtmlEscape,
    icon: '<>',
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUID v4 identifiers',
    route: '/uuid-generator',
    category: 'text',
    keywords: ['uuid', 'guid', 'random', 'identifier', 'unique'],
    component: UuidGenerator,
    icon: '#',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure random passwords',
    route: '/password-generator',
    category: 'text',
    keywords: ['password', 'random', 'secure', 'generate', 'strong'],
    component: PasswordGenerator,
    icon: '***',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens',
    route: '/jwt-decoder',
    category: 'developer',
    keywords: ['jwt', 'token', 'decode', 'json', 'web', 'auth'],
    component: JwtDecoder,
    icon: 'JWT',
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions with live matching',
    route: '/regex-tester',
    category: 'developer',
    keywords: ['regex', 'regexp', 'regular', 'expression', 'match', 'test'],
    component: RegexTester,
    icon: '.*',
  },
  {
    id: 'sha256-generator',
    name: 'SHA-256 Generator',
    description: 'Generate SHA-256 hash digests',
    route: '/sha256-generator',
    category: 'developer',
    keywords: ['sha256', 'hash', 'digest', 'checksum', 'crypto'],
    component: Sha256Generator,
    icon: '#S',
  },
  {
    id: 'md5-generator',
    name: 'MD5 Generator',
    description: 'Generate MD5 hash digests',
    route: '/md5-generator',
    category: 'developer',
    keywords: ['md5', 'hash', 'digest', 'checksum'],
    component: Md5Generator,
    icon: '#M',
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and dates',
    route: '/timestamp-converter',
    category: 'developer',
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'time', 'convert'],
    component: TimestampConverter,
    icon: 'T',
  },
  {
    id: 'http-status',
    name: 'HTTP Status Lookup',
    description: 'Look up HTTP status codes and descriptions',
    route: '/http-status',
    category: 'developer',
    keywords: ['http', 'status', 'code', 'response', '404', '200', '500'],
    component: HttpStatus,
    icon: '200',
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs',
    route: '/qr-generator',
    category: 'utility',
    keywords: ['qr', 'qrcode', 'barcode', 'scan', 'generate'],
    component: QrGenerator,
    icon: 'QR',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between different cases',
    route: '/case-converter',
    category: 'utility',
    keywords: ['case', 'camel', 'snake', 'pascal', 'kebab', 'upper', 'lower'],
    component: CaseConverter,
    icon: 'Aa',
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare two texts and highlight differences',
    route: '/diff-checker',
    category: 'utility',
    keywords: ['diff', 'compare', 'difference', 'merge', 'patch'],
    component: DiffChecker,
    icon: '+-',
  },
  {
    id: 'line-sorter',
    name: 'Line Sorter',
    description: 'Sort lines alphabetically, numerically, or randomly',
    route: '/line-sorter',
    category: 'utility',
    keywords: ['sort', 'lines', 'alphabetical', 'order', 'arrange'],
    component: LineSorter,
    icon: 'AZ',
  },
  {
    id: 'duplicate-remover',
    name: 'Duplicate Remover',
    description: 'Remove duplicate lines from text',
    route: '/duplicate-remover',
    category: 'utility',
    keywords: ['duplicate', 'unique', 'remove', 'deduplicate', 'distinct'],
    component: DuplicateRemover,
    icon: '1!',
  },
]

export function getToolByRoute(route: string): ToolDefinition | undefined {
  return tools.find(t => t.route === route)
}
