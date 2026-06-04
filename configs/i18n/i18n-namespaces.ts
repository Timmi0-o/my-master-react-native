export const I18N_NAMESPACES = ['common', 'pages', 'ui'] as const

export type I18nNamespace = (typeof I18N_NAMESPACES)[number]
