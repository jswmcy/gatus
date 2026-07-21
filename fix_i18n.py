#!/usr/bin/env python3
import re

def edit_file(path, replacements):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            print(f"OK: {old[:60]}")
        else:
            print(f"MISS: {old[:60]}")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Done: " + path)


# ===================== EndpointDetails.vue =====================
path = r"C:\Users\Administrator\Downloads\gatus-master\gatus-master\web\app\src\views\EndpointDetails.vue"
replacements = [
    ("import { ref, computed, onMounted } from 'vue'",
     "import { ref, computed, onMounted } from 'vue'\nimport { useI18n } from 'vue-i18n'\n\nconst { t } = useI18n()"),
    ("Back to Dashboard\n        </Button>",
     "{{ t('endpointDetails.backToDashboard') }}\n        </Button>"),
    ("Group: {{ endpointStatus.group }}</span>",
     "{{ t('endpointDetails.group', { group: endpointStatus.group }) }}</span>"),
    (">Current Status</CardTitle>",
     ">{{ t('endpointDetails.currentStatus') }}</CardTitle>"),
    ("currentHealthStatus === 'healthy' ? 'Operational' : 'Issues Detected'",
     "currentHealthStatus === 'healthy' ? t('status.operational') : t('status.issuesDetected')"),
    (">Avg Response Time</CardTitle>",
     ">{{ t('endpointDetails.avgResponseTime') }}</CardTitle>"),
    (">Response Time Range</CardTitle>",
     ">{{ t('endpointDetails.responseTimeRange') }}</CardTitle>"),
    (">Last Check</CardTitle>",
     ">{{ t('endpointDetails.lastCheck') }}</CardTitle>"),
    (">Recent Checks</CardTitle>",
     ">{{ t('endpointDetails.recentChecks') }}</CardTitle>"),
    ("title=\"showAverageResponseTime ? 'Show min-max response time' : 'Show average response time'\"",
     ":title=\"showAverageResponseTime ? t('home.showMinMaxResponseTime') : t('home.showAverageResponseTime')\""),
    ("title=\"Refresh data\"",
     ":title=\"t('home.refreshData')\""),
    (">Response Time Trend</CardTitle>",
     ">{{ t('endpointDetails.responseTimeTrend') }}</CardTitle>"),
    ("<option value=\"24h\">24 hours</option>",
     "<option value=\"24h\">{{ t('endpointDetails.last24Hours') }}</option>"),
    ("<option value=\"7d\">7 days</option>",
     "<option value=\"7d\">{{ t('endpointDetails.last7Days') }}</option>"),
    ("<option value=\"30d\">30 days</option>",
     "<option value=\"30d\">{{ t('endpointDetails.last30Days') }}</option>"),
    ("period === '30d' ? 'Last 30 days' : period === '7d' ? 'Last 7 days' : period === '24h' ? 'Last 24 hours' : 'Last hour'",
     "period === '30d' ? t('endpointDetails.last30Days') : period === '7d' ? t('endpointDetails.last7Days') : period === '24h' ? t('endpointDetails.last24Hours') : t('endpointDetails.lastHour')"),
    (">Uptime Statistics</CardTitle>",
     ">{{ t('endpointDetails.uptimeStatistics') }}</CardTitle>"),
    (">Current Health</CardTitle>",
     ">{{ t('endpointDetails.currentHealth') }}</CardTitle>"),
    (">Events</CardTitle>",
     ">{{ t('endpointDetails.events') }}</CardTitle>"),
    ("event.fancyText = 'Endpoint is unhealthy'",
     "event.fancyText = t('endpointDetails.endpointUnhealthy')"),
    ("event.fancyText = 'Endpoint is healthy'",
     "event.fancyText = t('endpointDetails.endpointHealthy')"),
    ("event.fancyText = 'Monitoring started'",
     "event.fancyText = t('endpointDetails.monitoringStarted')"),
    ("event.fancyText = 'Endpoint became healthy'",
     "event.fancyText = t('endpointDetails.endpointBecameHealthy')"),
    ("event.fancyText = 'Endpoint was unhealthy for ' + generatePrettyTimeDifference(nextEvent.timestamp, event.timestamp)",
     "event.fancyText = t('endpointDetails.endpointWasUnhealthyFor', { duration: generatePrettyTimeDifference(nextEvent.timestamp, event.timestamp) })"),
    ("event.fancyText = 'Endpoint became unhealthy'",
     "event.fancyText = t('endpointDetails.endpointBecameUnhealthy')"),
    ("return 'Never'",
     "return t('endpointDetails.never')"),
]
edit_file(path, replacements)


# ===================== SuiteDetails.vue =====================
path = r"C:\Users\Administrator\Downloads\gatus-master\gatus-master\web\app\src\views\SuiteDetails.vue"
replacements = [
    ("import { ref, computed, onMounted } from 'vue'",
     "import { ref, computed, onMounted } from 'vue'\nimport { useI18n } from 'vue-i18n'\n\nconst { t } = useI18n()"),
    ("Back to Dashboard\n        </Button>",
     "{{ t('suiteDetails.backToDashboard') }}\n        </Button>"),
    ("{{ suite?.name || 'Loading...' }}</h1>",
     "{{ suite?.name || t('suiteDetails.loading') }}</h1>"),
    ("{{ selectedResult && selectedResult.timestamp !== sortedResults[0]?.timestamp ? 'Ran' : 'Last run' }}",
     "{{ selectedResult && selectedResult.timestamp !== sortedResults[0]?.timestamp ? t('suiteDetails.ran') : t('suiteDetails.lastRun') }}"),
    ('title="Refresh">',
     ':title="t(\'home.refreshData\')">'),
    (">Suite not found</h3>",
     ">{{ t('suiteDetails.suiteNotFound') }}</h3>"),
    (">The requested suite could not be found.</p>",
     ">{{ t('suiteDetails.suiteNotFoundDesc') }}</p>"),
    (">{{ selectedResult?.timestamp === sortedResults[0]?.timestamp ? 'Latest Execution' : `Execution at ${formatTimestamp(selectedResult.timestamp)}` }}</CardTitle>",
     ">{{ selectedResult?.timestamp === sortedResults[0]?.timestamp ? t('suiteDetails.latestExecution') : t('suiteDetails.executionAt', { time: formatTimestamp(selectedResult.timestamp) }) }}</CardTitle>"),
    (">Status</p>",
     ">{{ t('suiteDetails.status') }}</p>"),
    (">{{ latestResult.success ? 'Success' : 'Failed' }}</p>",
     ">{{ latestResult.success ? t('suiteDetails.success') : t('suiteDetails.failed') }}</p>"),
    (">Duration</p>",
     ">{{ t('suiteDetails.duration') }}</p>"),
    (">Endpoints</p>",
     ">{{ t('suiteDetails.endpoints') }}</p>"),
    (">Success Rate</p>",
     ">{{ t('suiteDetails.successRate') }}</p>"),
    (">Execution Flow</h3>",
     ">{{ t('suiteDetails.executionFlow') }}</h3>"),
    (">Suite Errors</h3>",
     ">{{ t('suiteDetails.suiteErrors') }}</h3>"),
    (">Execution History</CardTitle>",
     ">{{ t('suiteDetails.executionHistory') }}</CardTitle>"),
    (">No execution history available</div>",
     ">{{ t('suiteDetails.noExecutionHistory') }}</div>"),
]
edit_file(path, replacements)


# ===================== SearchBar.vue =====================
path = r"C:\Users\Administrator\Downloads\gatus-master\gatus-master\web\app\src\components\SearchBar.vue"
replacements = [
    ("import { ref, onMounted } from 'vue'",
     "import { ref, onMounted } from 'vue'\nimport { useI18n } from 'vue-i18n'\n\nconst { t } = useI18n()"),
    ('placeholder="Search endpoints..."',
     ':placeholder="t(\'search.placeholder\')"'),
    ('label: "None", value: "none"',
     'label: t(\'search.none\'), value: "none"'),
    ('label: "Failing", value: "failing"',
     'label: t(\'search.failing\'), value: "failing"'),
    ('label: "Unstable", value: "unstable"',
     'label: t(\'search.unstable\'), value: "unstable"'),
    ('label: "Name", value: "name"',
     'label: t(\'search.name\'), value: "name"'),
    ('label: "Group", value: "group"',
     'label: t(\'search.group\'), value: "group"'),
    ('label: "Health", value: "health"',
     'label: t(\'search.health\'), value: "health"'),
]
edit_file(path, replacements)


# ===================== StatusBadge.vue =====================
path = r"C:\Users\Administrator\Downloads\gatus-master\gatus-master\web\app\src\components\StatusBadge.vue"
replacements = [
    ("import { computed } from 'vue'\nimport { Badge } from '@/components/ui/badge'",
     "import { computed } from 'vue'\nimport { useI18n } from 'vue-i18n'\nimport { Badge } from '@/components/ui/badge'\n\nconst { t } = useI18n()"),
    ("return 'Healthy'\n    case 'unhealthy':\n      return 'Unhealthy'\n    case 'degraded':\n      return 'Degraded'\n    default:\n      return 'Unknown'",
     "return t('status.healthy')\n    case 'unhealthy':\n      return t('status.unhealthy')\n    case 'degraded':\n      return t('status.degraded')\n    default:\n      return t('status.unknown')"),
]
edit_file(path, replacements)


# ===================== Pagination.vue =====================
path = r"C:\Users\Administrator\Downloads\gatus-master\gatus-master\web\app\src\components\Pagination.vue"
replacements = [
    ("import { ref, computed } from 'vue'",
     "import { ref, computed } from 'vue'\nimport { useI18n } from 'vue-i18n'\n\nconst { t } = useI18n()"),
    (">\n      Previous\n    </Button>",
     ">\n      {{ t('pagination.previous') }}\n    </Button>"),
    (">\n      Next\n    </Button>",
     ">\n      {{ t('pagination.next') }}\n    </Button>"),
    ("Page {{ currentPage }} of {{ maxPages }}",
     "{{ t('pagination.page', { current: currentPage, total: maxPages }) }}"),
]
edit_file(path, replacements)


# ===================== Settings.vue =====================
path = r"C:\Users\Administrator\Downloads\gatus-master\gatus-master\web\app\src\components\Settings.vue"
replacements = [
    ("import { ref, onMounted, onUnmounted } from 'vue'",
     "import { ref, onMounted, onUnmounted } from 'vue'\nimport { useI18n } from 'vue-i18n'\n\nconst { t } = useI18n()"),
    ("{{ darkMode ? 'Light mode' : 'Dark mode' }}\n        </div>",
     "{{ darkMode ? t('settings.lightMode') : t('settings.darkMode') }}\n        </div>"),
]
edit_file(path, replacements)


# ===================== AnnouncementBanner.vue =====================
path = r"C:\Users\Administrator\Downloads\gatus-master\gatus-master\web\app\src\components\AnnouncementBanner.vue"
replacements = [
    ("import { computed, ref } from 'vue'",
     "import { computed, ref } from 'vue'\nimport { useI18n } from 'vue-i18n'\n\nconst { t } = useI18n()"),
    (">Announcements</h2>",
     ">{{ t('announcements.announcements') }}</h2>"),
    ("return 'Today'\n  } else if (date.toDateString() === yesterday.toDateString()) {\n    return 'Yesterday'",
     "return t('announcements.today')\n  } else if (date.toDateString() === yesterday.toDateString()) {\n    return t('announcements.yesterday')"),
]
edit_file(path, replacements)


# ===================== StepDetailsModal.vue =====================
path = r"C:\Users\Administrator\Downloads\gatus-master\gatus-master\web\app\src\components\StepDetailsModal.vue"
replacements = [
    ("import { computed } from 'vue'",
     "import { computed } from 'vue'\nimport { useI18n } from 'vue-i18n'\n\nconst { t } = useI18n()"),
    ("Step {{ index + 1 }} • {{ formatDuration(step.duration) }}",
     "{{ t('stepDetails.step', { index: index + 1 }) }} • {{ formatDuration(step.duration) }}"),
    (">Always Run</p>",
     ">{{ t('stepDetails.alwaysRun') }}</p>"),
    (">This endpoint is configured to execute even after failures</p>",
     ">{{ t('stepDetails.alwaysRunDesc') }}</p>"),
    (">Errors ({{ step.errors.length }})",
     ">{{ t('stepDetails.errors', { count: step.errors.length }) }}"),
    (">Timestamp</h3>",
     ">{{ t('stepDetails.timestamp') }}</h3>"),
    (">Response</h3>",
     ">{{ t('stepDetails.response') }}</h3>"),
    (">{{ step.result.success ? 'Yes' : 'No' }}",
     ">{{ step.result.success ? t('stepDetails.yes') : t('stepDetails.no') }}"),
    (">Condition Results ({{ step.result.conditionResults.length }})",
     ">{{ t('stepDetails.conditionResults', { count: step.result.conditionResults.length }) }}"),
    (">{{ conditionResult.success ? 'Passed' : 'Failed' }}",
     ">{{ conditionResult.success ? t('stepDetails.passed') : t('stepDetails.failed') }}"),
    (">Endpoint Configuration</h3>",
     ">{{ t('stepDetails.endpointConfiguration') }}</h3>"),
    (">Result Errors ({{ step.result.errors.length }})",
     ">{{ t('stepDetails.resultErrors', { count: step.result.errors.length }) }}"),
]
edit_file(path, replacements)


print("ALL DONE")
