/**
 * Placeholder to human-readable label map.
 * Must stay in sync with the server-side placeholder constants.
 */
const PLACEHOLDER_LABELS = {
  '[CONNECTED]': '连接',
  '[STATUS]': '状态码',
  '[BODY]': '响应体',
  '[RESPONSE_TIME]': '响应时间',
  '[CERTIFICATE_EXPIRATION]': '证书到期',
  '[DOMAIN_EXPIRATION]': '域名到期',
  '[IP]': 'IP地址',
  '[DNS_RCODE]': 'DNS返回码',
}

/**
 * Translate a raw condition string into a human-readable Chinese label
 * by replacing placeholders with their Chinese equivalents.
 *
 * @param {string} condition - e.g. "[RESPONSE_TIME] < 200"
 * @returns {string}          - e.g. "响应时间 < 200"
 */
export function translateCondition(condition) {
  if (!condition) return condition
  let result = condition
  for (const [key, label] of Object.entries(PLACEHOLDER_LABELS)) {
    result = result.replaceAll(key, label)
  }
  // Also translate contains/not-contains and boolean comparisons
  result = result.replace(/contains "(.*?)"/g, '包含 "$1"')
  result = result.replace(/not contains "(.*?)"/g, '不包含 "$1"')
  result = result.replace(/== true/g, '正常')
  result = result.replace(/== false/g, '异常')
  // Escape comparison operators for safe HTML rendering (used in Tooltip.vue)
  result = result.replace(/<(\d+)/g, '&lt; $1')
  result = result.replace(/>(\d+)/g, '&gt; $1')
  return result
}

/**
 * Extract a human-readable degraded reason from a result's conditionResults.
 * Falls back to response time if no failed performance conditions are found.
 *
 * @param {object} result - endpoint result object (with duration and conditionResults)
 * @returns {string}       - e.g. "响应时间 235ms 超过阈值 200ms"
 */
export function buildDegradedReason(result) {
  if (!result || !result.conditionResults || result.conditionResults.length === 0) {
    const durationMs = Math.trunc((result?.duration || 0) / 1000000)
    return `响应时间 ${durationMs}ms`
  }

  const failedConditions = result.conditionResults.filter(c => !c.success)
  if (failedConditions.length === 0) {
    const durationMs = Math.trunc((result.duration || 0) / 1000000)
    return `响应时间 ${durationMs}ms`
  }

  const reasons = failedConditions.map(c => {
    const raw = c.condition || ''

    // Try to parse [RESPONSE_TIME] < 200  (supports optional unit suffix like "ms")
    // Also matches [RESPONSE_TIME] <= 200ms, [RESPONSE_TIME] >= 500
    const responseTimeMatch = raw.match(
      /\[RESPONSE_TIME\]\s*([<>=!]+)\s*(\d+)\s*(ms|s)?/
    )
    if (responseTimeMatch) {
      const [, operator, threshold, unit = 'ms'] = responseTimeMatch
      const durationMs = Math.trunc((result.duration || 0) / 1000000)
      return `响应时间 ${durationMs}ms ${operator} ${threshold}${unit}`
    }

    return translateCondition(raw)
  })

  return reasons.join('; ')
}
