# wagmi React Playground 协作规范

适用范围：本仓库及其全部子目录。若以后某个子目录存在更近的 `AGENTS.md`，以更近的规则为补充；未覆盖的规则继续遵循本文件。

## 项目目标

这是一个用于学习 wagmi React API 的可运行课程项目，不是生产钱包或通用组件库。

- 技术栈：React、TypeScript、Vite、wagmi、viem、TanStack Query。
- 学习内容必须与仓库当前安装的 wagmi 主版本一致。
- 页面采用文档式侧边栏导航，每个 API 拥有独立代码、参数、返回值和说明。
- 在安全且具备条件时提供真实可操作示例；不能运行的内容不得伪装成已实现 Demo。

## 当前结构

- `src/wagmi.ts`：支持的链、Connector 和 Transport 配置。
- `src/main.tsx`：`WagmiProvider`、`QueryClientProvider` 等应用入口。
- `src/lessons.ts`：课程分类、示例代码、参数、返回值和说明。
- `src/live-demo.tsx`：可以直接操作的 wagmi Hook 示例。
- `src/send-transaction-panel.tsx`：Sepolia 原生币交易和 Receipt 示例。
- `src/sepolia-transaction-exercise.tsx`：由学习者独立完成的 Sepolia 交易闭环练习文件。
- `src/App.tsx`：侧边栏、Hash 导航和课程内容编排。
- `src/App.css`、`src/index.css`：页面样式和设计变量。

不要直接修改 `node_modules/` 或 `dist/`。它们分别是依赖目录和构建产物。

## 开始任务前

1. 阅读目标文件、相关课程和已有 Demo，确认功能属于配置、连接、查询、Mutation、签名还是合约调用。
2. 查看 `package.json` 确认 wagmi 和 viem 版本，不凭旧版本经验直接编写 API。
3. 参数或返回类型不确定时，优先核对当前 `node_modules` 中的公开类型声明和 wagmi 官方文档。
4. 保持修改聚焦于当前课程，不顺带升级依赖或重构无关页面。

## 课程内容规范

新增或修改一个 wagmi API 课程时，必须维护以下内容：

- `id`：与公开 API 名称一致，例如 `useReadContract`。
- `category`：放入已有业务含义最接近的分类；只有确有一组新能力时才新增分类。
- `kind`：准确标记为 `Configuration`、`Provider`、`Query`、`Mutation` 或 `Watcher`。
- `summary`：说明它解决什么问题，不重复函数名称。
- `code`：可以独立理解的最小 TypeScript 示例，使用当前版本推荐 API，并用中文注释解释关键步骤、参数和触发时机。
- `parameters`：列出关键参数、真实类型、是否必填和业务含义。
- `returns`：区分 `data`、状态、错误以及 Mutation 方法。
- `notes`：指出最容易导致资金、精度、网络或生命周期错误的事项。

基于 TanStack Query 的 RPC 查询课程还必须列出常用的 `query.*` 控制项，以及 `status`、`fetchStatus`、`isPending`、`isFetching`、`isLoading`、`isRefetching`、`error` 和 `refetch`。`useConnection`、`useChains` 等同步状态 Hook 不得因为标记为 Query 就套用这些字段。

Mutation 课程还必须列出常用的 `mutation.*` 回调，以及 `mutate`、`mutateAsync`、`status`、`isPending`、`isSuccess`、`isError`、`error` 和 `reset`。

代码示例和文字解释必须保持一致。参数改名、返回类型变化或示例流程变化时，两者一起更新。

若课程拥有真实 Demo：

- 在 `src/live-demo.tsx` 中创建职责明确的演示组件。
- 在 `src/lessons.ts` 的 `liveDemoIds` 中登记对应课程。
- Demo 必须展示 loading、成功、错误、未连接和网络不匹配等关键状态。
- 不为了复用一两行代码创建薄包装组件。

## wagmi 与 React 约定

- wagmi 负责钱包连接和链上数据生命周期，不提供业务 UI。
- `WagmiProvider` 必须使用 `createConfig` 生成的配置。
- 查询类 Hook 依赖 TanStack Query；服务端数据不要复制到长期 React 状态。
- wagmi v3 Mutation 使用 `mutate` 或 `mutateAsync`，不要新增已弃用的 `connect`、`disconnect`、`writeContract` 等别名调用。
- 使用 `status === 'connected'` 对连接状态进行 TypeScript 收窄，再访问确定存在的 `address` 和 `connector`。
- 查询条件不足时通过 `query.enabled` 禁用请求，不发送无意义 RPC。
- Mutation 必须由明确的用户操作触发，并在 pending 时禁止重复提交。
- 需要缓存、自动刷新和重试的数据使用 wagmi Query Hook；一次性流程和写操作使用 Mutation Hook。

## Connector 规范

- `injected()` 是通用 EIP-1193 浏览器钱包连接器，不等同于 MetaMask 专用连接器。
- EIP-6963 自动发现的钱包需要显示其真实 `connector.name`，多钱包环境不要假定 `window.ethereum` 一定属于 MetaMask。
- 使用 `metaMask()`、`walletConnect()` 等专用 Connector 前，说明引入原因、移动端行为和所需配置。
- WalletConnect 的项目 ID 等公开配置通过 Vite 环境变量和统一配置读取，不散落在组件中。
- 私钥、助记词、服务端凭证和私有 RPC 密钥不得进入前端源码、日志或示例。

## 金额与精度

- 链上整数金额使用原生 `bigint`，禁止转换成 `number`。
- 用户输入保持字符串，通过 `parseEther` 或 `parseUnits` 转为 `bigint`。
- 展示通过 `formatEther` 或 `formatUnits` 转为十进制字符串。
- 不使用 `Number(value) / 10 ** decimals` 处理链上金额。
- `bigint` 运算不能与 `number` 混用；除法会截断，费率计算需明确舍入规则。
- JSON、URL 或 Go 接口传输金额时使用十进制字符串，并明确它是最小单位还是人类可读单位。
- 只有汇率、法币和复杂小数业务确实需要时才引入 `bignumber.js` 或 `decimal.js`，输入仍必须来自字符串。

## 交易与合约安全

- 可写 Demo 默认只允许 Sepolia 等明确测试网，不新增默认主网转账按钮。
- 发送交易前校验目标链、地址、金额和连接状态。
- 合约写入优先执行 `useSimulateContract`，再把模拟得到的 request 交给 `useWriteContract`。
- 获得交易 Hash 只表示已广播；必须使用 Receipt 判断 `success` 或 `reverted`。
- 支付、充值和资金状态还应考虑确认数、交易替换、链重组、超时和重复处理。
- 前端不得自动确认钱包弹窗，也不得诱导用户签署含义不明的消息、授权或交易。
- 签名登录示例必须包含域名、nonce、签发时间和过期时间，并说明后端需要独立验证。
- ABI 使用可推导的静态类型或 `as const`，不要用 `any` 绕过函数名和参数检查。

## TypeScript 与文件约定

- 禁止使用 `any`；未知值使用 `unknown` 并及时收窄。
- React 使用函数组件；可复用组件和工具优先 Named Export。
- Props 使用 `interface`；联合类型和组合类型使用 `type`。
- 新文件使用 `kebab-case`，Hook 使用 `useCamelCase`。
- 复杂状态和格式转换提取成可测试的纯函数；简单局部值依赖类型推导。
- 不吞掉钱包拒绝、RPC、模拟或 Receipt 错误，界面必须提供可读反馈。

## 页面与导航

- 桌面端保持固定侧边栏，移动端使用课程选择菜单。
- 课程导航状态保存在 URL Hash 中，保证刷新和浏览器前进后退可恢复。
- 每个导航项只展示自己的课程内容，不把多个无关 Hook 混在同一代码示例中。
- 长函数名、地址、Hash、错误和代码块必须能滚动或换行，不能覆盖相邻内容。
- 交互控件必须支持键盘操作、可见焦点和可访问名称。
- 延续现有克制的文档视觉风格，不因新增课程引入另一套 UI 框架。

## 依赖与配置

- 使用 npm，并提交或维护 `package-lock.json` 与 `package.json` 一致。
- 不为了单个示例引入大型 UI、状态管理或代码高亮依赖。
- 新增依赖前确认浏览器兼容性、包体积和实际调用方。
- 环境变量新增时同步提供 `.env.example`，变量名使用 `VITE_` 前缀。
- 公共 RPC 只适合学习和开发；生产说明中必须提示速率限制和服务稳定性风险。

## 校验要求

每次代码修改后至少执行：

```bash
npm run lint
npm run build
```

涉及页面或交互时还需要：

- 启动 `npm run dev`，确认目标 URL 返回并可打开。
- 验证侧边栏切换、Hash 更新和刷新恢复。
- 检查主要桌面和移动端布局。
- 钱包相关功能检查未连接、连接中、拒绝、错误网络和成功状态。
- 交易签名只能由开发者在测试钱包中手动确认；无法自动完成时在变更说明中明确标注。

## 完成说明

交付时简要说明：

- 新增或修改了哪些课程/API。
- 是否增加真实 Demo，以及它使用的网络和 Connector。
- 已执行的 lint、类型检查、构建和页面验证。
- 仍需人工钱包签名、测试币或外部 RPC 才能验证的部分。
