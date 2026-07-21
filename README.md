# Gatus (zh-CN Fork)

Gatus 健康监控仪表盘的中文汉化版 Docker 镜像。

- 上游：<https://github.com/TwiN/gatus>
- 镜像：<https://hub.docker.com/r/zenbox01/gatus>
- 前端：Vue 3 + vue-i18n@9，默认根据浏览器语言自动切换（`zh-*` → 简体中文）

## 快速开始

```bash
docker run -d \
  --name gatus \
  --restart unless-stopped \
  -p 5001:8080 \
  -v /root/data/gatus:/config \
  docker.193019.xyz/zenbox01/gatus
```

挂载的 `config/config.yaml` 示例：

```yaml
endpoints:
  - name: Example
    url: https://example.com
    conditions:
      - "[STATUS] == 200"

ui:
  title: Gatus
  header: 健康监控
```

完整配置参考上游文档：<https://github.com/TwiN/gatus#configuration>

## 相对上游的改动

| 项 | 上游 | 此 fork |
|---|---|---|
| Docker 平台 | linux/amd64 + linux/arm64 + linux/arm/v7 + linux/ppc64le | **仅 linux/amd64** |
| 镜像名 | `twin/gatus` | **`zenbox01/gatus`** |
| 前端语言 | 英文 | **自动中英文切换**（`en.json` + `zh-CN.json`） |
| 健康状态 | 二态（UP/DOWN） | **三态（健康/亚健康/故障）** |
| 告警 | 仅故障告警 | **亚健康也触发告警**，复用 FailureThreshold 抑制机制 |
| Dependabot | 开启 | **关闭**（仅构建项目自身镜像） |

## 三态健康状态

在上游二态（健康/故障）基础上新增**亚健康**（DEGRADED）中间态，用于区分"服务没挂但性能不达标"的情况：

| 状态 | 颜色 | 标签 | 触发条件 |
|------|------|------|----------|
| 健康 | 🟢 绿 | 健康 | 所有条件通过 |
| 亚健康 | 🟡 黄 | 亚健康 | 连通性条件通过，性能条件失败（`[RESPONSE_TIME]` / `[CERTIFICATE_EXPIRATION]` / `[DOMAIN_EXPIRATION]`） |
| 故障 | 🔴 红 | 故障 | 连通性条件失败 |

- 悬停"亚健康"标签可查看具体触发原因（如 `响应时间 235ms 超过阈值 200ms`）
- 事件日志支持三态记录（`HEALTHY` / `DEGRADED` / `UNHEALTHY`）
- 亚健康告警复用 `failure-threshold` 阈值和 `Triggered` 抑制机制，不会刷屏

## 语言切换

浏览器 `Accept-Language` 决定默认语言。强制切换：

- 在 DevTools → Application → Local Storage → 把 `gatus:locale` 改为 `zh-CN` 或 `en`

新增翻译键流程：

1. 在 Vue 组件里用 `t('xxx')` 调用
2. `web/app/src/locales/en.json` 加 `"xxx": "English text"`
3. `web/app/src/locales/zh-CN.json` 加 `"xxx": "中文"`
4. `npm run build` 重新构建前端（Go embed 会自动打包到二进制）

## 构建

```bash
git clone https://github.com/jswmcy/gatus.git
cd gatus
docker build -t zenbox01/gatus:latest .
```

仅支持 x86_64 平台，多平台构建已禁用以节省 CI 时间。

## 自动发布

GitHub Actions：

- `test.yml` — 跑测试，main 分支 push 触发
- `publish-latest.yml` — test 通过后自动构建推送 `zenbox01/gatus:latest`

需要仓库 Secrets：`DOCKER_USERNAME` = `zenbox01`、`DOCKER_PASSWORD` = Docker Hub Access Token。

## 许可

继承上游 [MIT License](https://github.com/TwiN/gatus/blob/master/LICENSE)。
