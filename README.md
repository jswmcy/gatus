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
  -p 8080:8080 \
  -v $(pwd)/config:/config \
  zenbox01/gatus:latest
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
| Dependabot | 开启 | **关闭**（仅构建项目自身镜像） |

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
