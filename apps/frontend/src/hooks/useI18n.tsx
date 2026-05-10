import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type Locale = 'zh' | 'en'

const zhDict: Record<string, string> = {
  // App shell
  'Fast, privacy-friendly, edge-native utilities. All processing happens in your browser.': '快速、隐私友好的边缘原生开发工具。所有处理均在浏览器本地完成。',
  'Search tools...  (Ctrl+K)': '搜索工具...  (Ctrl+K)',
  'All': '全部',
  'No tools found matching': '未找到匹配的工具',
  'All Tools': '所有工具',
  'Text / Encoding': '文本 / 编码',
  'Developer Tools': '开发者工具',
  'Extra Utilities': '实用工具',
  'Switch to light mode': '切换到亮色模式',
  'Switch to dark mode': '切换到暗色模式',
  'Back': '返回',

  // Common
  'Input': '输入',
  'Output': '输出',
  'Result': '结果',
  'Generate': '生成',
  'Clear': '清除',
  'Copy': '复制',
  'Copied!': '已复制!',
  'Done': '完成',
  'Download': '下载',
  'Encode': '编码',
  'Decode': '解码',
  'Escape': '转义',
  'Unescape': '反转义',
  'Format': '格式化',
  'Minify': '压缩',
  'Validate': '验证',
  'Convert': '转换',
  'Sort': '排序',
  'Remove': '移除',
  'Test': '测试',
  'Compare': '对比',
  'Error': '错误',
  'Options': '选项',

  // JSON Formatter
  'JSON Formatter & Validator': 'JSON 格式化工具',
  'Format, minify, and validate JSON data.': '格式化、压缩和验证 JSON 数据',
  'JSON Input': 'JSON 输入',
  'Indentation': '缩进',
  '2 Spaces': '2 空格',
  '4 Spaces': '4 空格',
  'Tabs': '制表符',
  'Please enter some JSON to format.': '请输入要格式化的 JSON',
  'Please enter some JSON to minify.': '请输入要压缩的 JSON',
  'Please enter some JSON to validate.': '请输入要验证的 JSON',
  'Valid JSON': 'JSON 格式正确',

  // Base64
  'Base64 Encode/Decode': 'Base64 编解码',
  'Encode text to Base64 or decode Base64 to text with full Unicode support.': '支持 Unicode 的 Base64 编码和解码工具',
  'Enter text to encode or Base64 string to decode...': '输入要编码的文本或要解码的 Base64 字符串...',
  'Please enter text to encode.': '请输入要编码的文本',
  'Please enter Base64 text to decode.': '请输入要解码的 Base64 文本',
  'Encoding failed: ': '编码失败：',
  'Decoding failed: ': '解码失败：',

  // URL Encoder
  'URL Encode/Decode': 'URL 编解码',
  'Encode or decode URL components using encodeURIComponent and encodeURI.': '使用 encodeURIComponent 和 encodeURI 编解码 URL 组件',
  'Enter text to encode or URL-encoded string to decode...': '输入要编码的文本或要解码的 URL 编码字符串...',
  'Please enter URL-encoded text to decode.': '请输入要解码的 URL 编码文本',
  'encodeURIComponent Result': 'encodeURIComponent 结果',
  'encodeURI Result': 'encodeURI 结果',

  // HTML Escape
  'HTML Escape/Unescape': 'HTML 转义工具',
  'Escape and unescape HTML special characters': '转义和反转义 HTML 特殊字符',

  // UUID Generator
  'UUID Generator': 'UUID 生成器',
  'Generate RFC 4122 version 4 UUIDs.': '生成 RFC 4122 v4 版本的 UUID',
  'Count (1-100)': '数量 (1-100)',
  'Uppercase': '大写',
  'Generated UUID': '已生成的 UUID',
  'Generated UUIDs': '已生成的 UUID',
  'All UUIDs (plain text)': '全部 UUID（纯文本）',

  // Password Generator
  'Password Generator': '密码生成器',
  'Generate strong, cryptographically random passwords.': '生成安全的加密随机密码',
  'Length': '长度',
  'Exact Length': '精确长度',
  'Character Types': '字符类型',
  'Lowercase (a-z)': '小写字母 (a-z)',
  'Uppercase (A-Z)': '大写字母 (A-Z)',
  'Numbers (0-9)': '数字 (0-9)',
  'Symbols (!@#$...)': '特殊符号 (!@#$...)',
  'Generate Password': '生成密码',
  'Generated Password': '生成的密码',
  'Strength': '强度',
  'Very Weak': '非常弱',
  'Weak': '较弱',
  'Fair': '一般',
  'Strong': '较强',
  'Very Strong': '非常强',
  'Please select at least one character type.': '请至少选择一种字符类型',
  'Character pool: ': '字符池：',
  ' characters | Entropy: ~': ' 个字符 | 熵值：~',
  ' bits': ' 位',

  // JWT Decoder
  'JWT Decoder': 'JWT 解码器',
  'Decode and inspect JSON Web Tokens': '解码和检查 JSON Web Token',
  'JWT Token': 'JWT 令牌',
  'Paste your JWT token here (e.g. eyJhbGciOiJI...)': '粘贴 JWT 令牌（如 eyJhbGciOiJI...）',
  'Header': '头部',
  'Payload': '载荷',
  'Signature': '签名',
  'Please enter a JWT token.': '请输入 JWT 令牌',
  'Invalid JWT: token must have exactly 3 parts separated by dots (header.payload.signature).': '无效的 JWT：令牌必须包含由点号分隔的三部分（header.payload.signature）',
  'Invalid JWT: could not decode header.': '无效的 JWT：无法解码头部',
  'Invalid JWT: could not decode payload.': '无效的 JWT：无法解码载荷',

  // Regex Tester
  'Regex Tester': '正则测试器',
  'Test regular expressions with live matching and highlighting': '实时匹配和高亮的正则表达式测试',
  'Regular Expression Pattern': '正则表达式',
  'Enter regex pattern (e.g. \\d+|[a-z]+)': '输入正则表达式（如 \\d+|[a-z]+）',
  'Flags': '标志',
  'g = global, i = case-insensitive, m = multiline, s = dotAll': 'g=全局, i=忽略大小写, m=多行, s=单行',
  'Test String': '测试字符串',
  'Enter text to test against the regex': '输入要测试的文本',
  'Highlighted Matches': '高亮匹配',
  'Match Details': '匹配详情',
  'No matches found.': '未找到匹配项',
  ' match': ' 个匹配',
  ' matches': ' 个匹配',

  // SHA-256
  'SHA-256 Hash Generator': 'SHA-256 哈希生成器',
  'Generate SHA-256 hashes from text using the Web Crypto API': '使用 Web Crypto API 从文本生成 SHA-256 哈希',
  'Input Text': '输入文本',
  'Enter text to hash...': '输入要计算哈希的文本...',
  'Generate Hash': '生成哈希',
  'SHA-256 Hash (Hex)': 'SHA-256 哈希值（十六进制）',
  'Please enter some text to hash.': '请输入要计算哈希的文本',
  'Failed to generate hash: ': '生成哈希失败：',
  'Generating...': '生成中...',

  // MD5
  'MD5 Hash Generator': 'MD5 哈希生成器',
  'Generate MD5 hashes from text (pure in-browser implementation)': '纯浏览器实现的 MD5 哈希生成器',
  'MD5 Hash (Hex)': 'MD5 哈希值（十六进制）',
  '128 bits / 16 bytes': '128 位 / 16 字节',

  // Timestamp Converter
  'Timestamp Converter': '时间戳转换器',
  'Convert between Unix timestamps and human-readable dates': 'Unix 时间戳与日期之间互转',
  'Unix Timestamp to Date': 'Unix 时间戳转日期',
  'Unix Timestamp (seconds or milliseconds)': 'Unix 时间戳（秒或毫秒）',
  'Now': '当前时间',
  'Date to Unix Timestamp': '日期转 Unix 时间戳',
  'Date': '日期',
  'Time (optional)': '时间（可选）',
  'Convert to Timestamp': '转换为时间戳',
  'Invalid timestamp. Please enter a numeric value.': '无效时间戳，请输入数字',
  'Invalid timestamp: results in an invalid date.': '无效时间戳：转换结果不是有效日期',
  'Please select a date.': '请选择日期',
  'Invalid date/time combination.': '无效的日期/时间组合',
  'ISO 8601:    ': 'ISO 8601：  ',
  'UTC:         ': 'UTC：       ',
  'Local:       ': '本地时间：  ',
  'Relative:    ': '相对时间：  ',
  'Unix (s):    ': 'Unix (秒)： ',
  'Unix (ms):   ': 'Unix (毫秒)：',
  ' second ago': ' 秒前',
  ' seconds ago': ' 秒前',
  ' minute ago': ' 分钟前',
  ' minutes ago': ' 分钟前',
  ' hour ago': ' 小时前',
  ' hours ago': ' 小时前',
  ' day ago': ' 天前',
  ' days ago': ' 天前',
  ' month ago': ' 个月前',
  ' months ago': ' 个月前',
  ' year ago': ' 年前',
  ' years ago': ' 年前',
  'in ': '',
  ' ago': '前',

  // HTTP Status
  'HTTP Status Code Lookup': 'HTTP 状态码查询',
  'Look up HTTP status codes with descriptions and use cases': '查询 HTTP 状态码的描述和使用场景',
  'Search by Code or Keyword': '按状态码或关键词搜索',
  'Enter status code (e.g. 404) or keyword (e.g. not found)': '输入状态码（如 404）或关键词（如 not found）',
  'Filter by Category': '按分类筛选',
  'No status codes match your search.': '未找到匹配的状态码',
  '1xx Informational': '1xx 信息',
  '2xx Success': '2xx 成功',
  '3xx Redirection': '3xx 重定向',
  '4xx Client Error': '4xx 客户端错误',
  '5xx Server Error': '5xx 服务端错误',

  // QR Code
  'QR Code Generator': '二维码生成器',
  'Generate QR codes from text or URLs': '从文本或 URL 生成二维码',
  'Text or URL': '文本或 URL',
  'Enter text or URL...': '输入文本或 URL...',
  'Size (px)': '尺寸 (px)',
  'Error Correction': '纠错等级',
  'Low (7%)': '低 (7%)',
  'Medium (15%)': '中 (15%)',
  'Quartile (25%)': '较高 (25%)',
  'High (30%)': '高 (30%)',
  'Generate QR Code': '生成二维码',
  'Download PNG': '下载 PNG',
  'Generated QR Code': '生成的二维码',
  'Please enter text or a URL to generate a QR code.': '请输入文本或 URL 来生成二维码',
  'Failed to generate QR code.': '生成二维码失败',

  // Case Converter
  'Case Converter': '大小写转换',
  'Convert text between different casing styles': '在不同命名风格之间转换文本',
  'Enter text to convert (e.g., hello world, helloWorld, hello_world)...': '输入要转换的文本（如 hello world, helloWorld, hello_world）...',
  'All Conversions': '所有转换结果',

  // Diff Checker
  'Diff Checker': '差异对比',
  'Compare two texts and see the differences': '对比两段文本并查看差异',
  'Original Text': '原始文本',
  'Paste original text here...': '粘贴原始文本...',
  'Modified Text': '修改后文本',
  'Paste modified text here...': '粘贴修改后文本...',
  'Diff Output': '差异结果',
  ' added': ' 新增',
  ' removed': ' 删除',
  ' unchanged': ' 未变',
  'Both texts are identical.': '两段文本完全相同',

  // Line Sorter
  'Line Sorter': '行排序器',
  'Sort lines of text in various ways': '多种方式排序文本行',
  'Enter lines of text to sort (one item per line)...': '输入要排序的文本（每行一项）...',
  'Sort Mode': '排序方式',
  'Alphabetical (A-Z)': '字母升序 (A-Z)',
  'Alphabetical (Z-A)': '字母降序 (Z-A)',
  'By Length (Short to Long)': '按长度（短到长）',
  'By Length (Long to Short)': '按长度（长到短）',
  'Numeric': '数字排序',
  'Natural Sort': '自然排序',
  'Reverse Order': '反转顺序',
  'Random Shuffle': '随机打乱',
  'Re-shuffle': '重新打乱',
  'Sorted Output': '排序结果',
  ' non-empty line': ' 个非空行',
  ' non-empty lines': ' 个非空行',
  ' line': ' 行',
  ' lines': ' 行',

  // Duplicate Remover
  'Duplicate Line Remover': '去重工具',
  'Remove duplicate lines from text': '移除文本中的重复行',
  'Paste text with duplicate lines...': '粘贴含重复行的文本...',
  'Case Sensitivity': '大小写敏感',
  'Case Sensitive': '区分大小写',
  'Case Insensitive': '忽略大小写',
  'Whitespace': '空白字符',
  'Trim': '去除',
  'Keep': '保留',
  'Keep Occurrence': '保留出现',
  'First': '首次',
  'Last': '末次',
  'Total: ': '总计：',
  'Unique: ': '唯一：',
  'Removed: ': '已移除：',

  // character/byte counts
  ' character': ' 个字符',
  ' characters': ' 个字符',
  ' bytes': ' 字节',
}

const appTranslations = {
  zh: {
    'app.title': 'CF 工具箱',
    'app.subtitle': '快速、隐私友好的边缘原生开发工具。所有处理均在浏览器本地完成。',
    'app.search': '搜索工具...  (Ctrl+K)',
    'app.all': '全部',
    'app.noResults': '未找到匹配的工具',
    'app.home': '所有工具',
    'app.lightMode': '切换到亮色模式',
    'app.darkMode': '切换到暗色模式',
    'cat.text': '文本 / 编码',
    'cat.developer': '开发者工具',
    'cat.utility': '实用工具',
    'tool.json-formatter': 'JSON 格式化',
    'tool.json-formatter.desc': '格式化、验证和压缩 JSON 数据',
    'tool.base64': 'Base64 编解码',
    'tool.base64.desc': '编码和解码 Base64 字符串',
    'tool.url-encoder': 'URL 编解码',
    'tool.url-encoder.desc': '编码和解码 URL 组件',
    'tool.html-escape': 'HTML 转义',
    'tool.html-escape.desc': '转义和反转义 HTML 特殊字符',
    'tool.uuid-generator': 'UUID 生成器',
    'tool.uuid-generator.desc': '生成随机 UUID v4 标识符',
    'tool.password-generator': '密码生成器',
    'tool.password-generator.desc': '生成安全的随机密码',
    'tool.jwt-decoder': 'JWT 解码器',
    'tool.jwt-decoder.desc': '解码和检查 JSON Web Token',
    'tool.regex-tester': '正则测试器',
    'tool.regex-tester.desc': '实时匹配测试正则表达式',
    'tool.sha256-generator': 'SHA-256 生成器',
    'tool.sha256-generator.desc': '生成 SHA-256 哈希摘要',
    'tool.md5-generator': 'MD5 生成器',
    'tool.md5-generator.desc': '生成 MD5 哈希摘要',
    'tool.timestamp-converter': '时间戳转换器',
    'tool.timestamp-converter.desc': 'Unix 时间戳与日期之间互转',
    'tool.http-status': 'HTTP 状态码',
    'tool.http-status.desc': '查询 HTTP 状态码及说明',
    'tool.qr-generator': '二维码生成器',
    'tool.qr-generator.desc': '从文本或 URL 生成二维码',
    'tool.case-converter': '大小写转换',
    'tool.case-converter.desc': '在不同命名风格之间转换文本',
    'tool.diff-checker': '差异对比',
    'tool.diff-checker.desc': '对比两段文本并高亮差异',
    'tool.line-sorter': '行排序器',
    'tool.line-sorter.desc': '按字母、数字或随机排序文本行',
    'tool.duplicate-remover': '去重工具',
    'tool.duplicate-remover.desc': '移除文本中的重复行',
  },
  en: {
    'app.title': 'Developer Tools',
    'app.subtitle': 'Fast, privacy-friendly, edge-native utilities. All processing happens in your browser.',
    'app.search': 'Search tools...  (Ctrl+K)',
    'app.all': 'All',
    'app.noResults': 'No tools found matching',
    'app.home': 'All Tools',
    'app.lightMode': 'Switch to light mode',
    'app.darkMode': 'Switch to dark mode',
    'cat.text': 'Text / Encoding',
    'cat.developer': 'Developer Tools',
    'cat.utility': 'Extra Utilities',
    'tool.json-formatter': 'JSON Formatter',
    'tool.json-formatter.desc': 'Format, validate, and minify JSON data',
    'tool.base64': 'Base64 Encode/Decode',
    'tool.base64.desc': 'Encode and decode Base64 strings',
    'tool.url-encoder': 'URL Encode/Decode',
    'tool.url-encoder.desc': 'Encode and decode URL components',
    'tool.html-escape': 'HTML Escape/Unescape',
    'tool.html-escape.desc': 'Escape and unescape HTML entities',
    'tool.uuid-generator': 'UUID Generator',
    'tool.uuid-generator.desc': 'Generate random UUID v4 identifiers',
    'tool.password-generator': 'Password Generator',
    'tool.password-generator.desc': 'Generate secure random passwords',
    'tool.jwt-decoder': 'JWT Decoder',
    'tool.jwt-decoder.desc': 'Decode and inspect JSON Web Tokens',
    'tool.regex-tester': 'Regex Tester',
    'tool.regex-tester.desc': 'Test regular expressions with live matching',
    'tool.sha256-generator': 'SHA-256 Generator',
    'tool.sha256-generator.desc': 'Generate SHA-256 hash digests',
    'tool.md5-generator': 'MD5 Generator',
    'tool.md5-generator.desc': 'Generate MD5 hash digests',
    'tool.timestamp-converter': 'Timestamp Converter',
    'tool.timestamp-converter.desc': 'Convert between Unix timestamps and dates',
    'tool.http-status': 'HTTP Status Lookup',
    'tool.http-status.desc': 'Look up HTTP status codes and descriptions',
    'tool.qr-generator': 'QR Code Generator',
    'tool.qr-generator.desc': 'Generate QR codes from text or URLs',
    'tool.case-converter': 'Case Converter',
    'tool.case-converter.desc': 'Convert text between different cases',
    'tool.diff-checker': 'Diff Checker',
    'tool.diff-checker.desc': 'Compare two texts and highlight differences',
    'tool.line-sorter': 'Line Sorter',
    'tool.line-sorter.desc': 'Sort lines alphabetically, numerically, or randomly',
    'tool.duplicate-remover': 'Duplicate Remover',
    'tool.duplicate-remover.desc': 'Remove duplicate lines from text',
  },
} as const

type AppKey = keyof typeof appTranslations.zh

interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (text: string) => string
  tk: (key: AppKey) => string
  toolName: (id: string) => string
  toolDesc: (id: string) => string
  catName: (cat: string) => string
}

const I18nContext = createContext<I18nContextType>(null!)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'zh'
    return (localStorage.getItem('locale') as Locale) || 'zh'
  })

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }, [])

  const t = useCallback((text: string): string => {
    if (locale === 'en') return text
    return zhDict[text] || text
  }, [locale])

  const tk = useCallback((key: AppKey): string => {
    return appTranslations[locale][key] || key
  }, [locale])

  const toolName = useCallback((id: string): string => {
    const key = `tool.${id}` as AppKey
    return appTranslations[locale][key] || id
  }, [locale])

  const toolDesc = useCallback((id: string): string => {
    const key = `tool.${id}.desc` as AppKey
    return appTranslations[locale][key] || ''
  }, [locale])

  const catName = useCallback((cat: string): string => {
    const key = `cat.${cat}` as AppKey
    return appTranslations[locale][key] || cat
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tk, toolName, toolDesc, catName }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
