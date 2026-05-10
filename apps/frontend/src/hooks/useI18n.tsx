import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type Locale = 'zh' | 'en'

const translations = {
  zh: {
    'app.title': 'CF 工具箱',
    'app.subtitle': '快速、隐私友好的边缘原生开发工具。所有处理均在浏览器本地完成。',
    'app.search': '搜索工具...  (Ctrl+K)',
    'app.all': '全部',
    'app.noResults': '未找到匹配的工具',
    'app.home': '所有工具',
    'app.copy': '复制',
    'app.copied': '已复制!',
    'app.input': '输入',
    'app.output': '输出',
    'app.generate': '生成',
    'app.clear': '清除',
    'app.download': '下载',
    'app.encode': '编码',
    'app.decode': '解码',
    'app.escape': '转义',
    'app.unescape': '反转义',
    'app.format': '格式化',
    'app.minify': '压缩',
    'app.convert': '转换',
    'app.sort': '排序',
    'app.remove': '移除',
    'app.test': '测试',
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
    'app.copy': 'Copy',
    'app.copied': 'Copied!',
    'app.input': 'Input',
    'app.output': 'Output',
    'app.generate': 'Generate',
    'app.clear': 'Clear',
    'app.download': 'Download',
    'app.encode': 'Encode',
    'app.decode': 'Decode',
    'app.escape': 'Escape',
    'app.unescape': 'Unescape',
    'app.format': 'Format',
    'app.minify': 'Minify',
    'app.convert': 'Convert',
    'app.sort': 'Sort',
    'app.remove': 'Remove',
    'app.test': 'Test',
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

type TranslationKey = keyof typeof translations.zh

interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
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

  const t = useCallback((key: TranslationKey): string => {
    return translations[locale][key] || key
  }, [locale])

  const toolName = useCallback((id: string): string => {
    const key = `tool.${id}` as TranslationKey
    return translations[locale][key] || id
  }, [locale])

  const toolDesc = useCallback((id: string): string => {
    const key = `tool.${id}.desc` as TranslationKey
    return translations[locale][key] || ''
  }, [locale])

  const catName = useCallback((cat: string): string => {
    const key = `cat.${cat}` as TranslationKey
    return translations[locale][key] || cat
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, toolName, toolDesc, catName }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
