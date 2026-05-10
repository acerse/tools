import type { ComponentType } from 'react'

export type ToolCategory =
  | 'text'
  | 'developer'
  | 'utility'

export interface ToolDefinition {
  id: string
  name: string
  description: string
  route: string
  category: ToolCategory
  keywords: string[]
  component: ComponentType
  icon: string
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  text: 'Text / Encoding',
  developer: 'Developer Tools',
  utility: 'Extra Utilities',
}

export const CATEGORY_ORDER: ToolCategory[] = ['text', 'developer', 'utility']
