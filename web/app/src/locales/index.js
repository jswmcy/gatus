import { createI18n } from 'vue-i18n'
import en from './en.json'
import zhCN from './zh-CN.json'

// Detect browser language
function getBrowserLocale() {
  const locale = navigator.language || navigator.userLanguage || 'en'
  // Support zh-* variants
  if (locale.toLowerCase().startsWith('zh')) {
    return 'zh-CN'
  }
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN
  }
})

export default i18n
