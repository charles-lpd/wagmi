export interface ApiField {
  name: string
  type: string
  description: string
  required?: boolean
}

export interface Lesson {
  id: string
  category: string
  title: string
  kind: 'Configuration' | 'Provider' | 'State' | 'Query' | 'Mutation' | 'Watcher' | 'Action' | 'Utility'
  summary: string
  code: string
  parameters: ApiField[]
  returns: ApiField[]
  notes: string[]
}

export const categories = [
  '配置',
  '钱包连接',
  '客户端 Hooks',
  '网络与查询',
  '交易与签名',
  '智能合约',
  'Miscellaneous',
] as const

const liveDemoIds = new Set([
  'useConnection',
  'useConnections',
  'useConnectors',
  'useConnect',
  'useDisconnect',
  'useConfig',
  'useChainId',
  'useClient',
  'usePublicClient',
  'useWalletClient',
  'useConnectorClient',
  'useConnectionEffect',
  'useChains',
  'useSwitchChain',
  'useBalance',
  'useGasPrice',
  'useEstimateFeesPerGas',
  'useEstimateGas',
  'useSendTransaction',
  'useWaitForTransactionReceipt',
  'useSignMessage',
  'useVerifyMessage',
  'useSignTypedData',
  'useVerifyTypedData',
])

export function hasLiveDemo(lessonId: string) {
  return liveDemoIds.has(lessonId)
}

const commonQueryParameters: ApiField[] = [
  { name: 'query.enabled', type: 'boolean', description: '是否允许自动执行查询；设为 false 后仍可调用 refetch 手动查询。' },
  { name: 'query.staleTime', type: 'number | "static" | function', description: '数据在多少毫秒内保持新鲜；新鲜期间通常不会自动重新查询。' },
  { name: 'query.gcTime', type: 'number | Infinity', description: '没有组件使用该缓存后，缓存保留的毫秒数。' },
  { name: 'query.retry', type: 'boolean | number | function', description: '查询失败后的重试策略或最大重试次数。' },
  { name: 'query.refetchInterval', type: 'number | false | function', description: '轮询间隔；false 表示不轮询。' },
  { name: 'query.refetchOnWindowFocus', type: 'boolean | "always" | function', description: '窗口重新获得焦点时是否自动刷新过期数据。' },
  { name: 'query.select', type: '(data) => SelectedData', description: '转换当前组件读取到的数据形状，不修改查询缓存中的原始数据。' },
]

const commonQueryReturns: ApiField[] = [
  { name: 'status', type: 'pending | error | success', description: '当前数据生命周期状态。' },
  { name: 'fetchStatus', type: 'fetching | paused | idle', description: '当前网络请求状态，与是否已有数据相互独立。' },
  { name: 'isPending', type: 'boolean', description: '是否还没有成功获得过数据。' },
  { name: 'isFetching', type: 'boolean', description: '当前是否正在请求 RPC，包括首次查询和重新查询。' },
  { name: 'isLoading', type: 'boolean', description: '是否正在执行第一次实际查询，等价于 isPending && isFetching。' },
  { name: 'isRefetching', type: 'boolean', description: '已有结果后是否正在重新查询。' },
  { name: 'isSuccess', type: 'boolean', description: '最近一次查询是否成功。' },
  { name: 'isError', type: 'boolean', description: '最近一次查询是否失败。' },
  { name: 'error', type: 'Error | null', description: '最近一次查询错误；没有错误时为 null。' },
  { name: 'refetch', type: '(options?) => Promise<QueryObserverResult>', description: '忽略自动执行条件，手动发起一次查询。' },
  { name: 'dataUpdatedAt', type: 'number', description: '数据最近成功更新的 Unix 毫秒时间戳。' },
]

const commonMutationParameters: ApiField[] = [
  { name: 'mutation.onSuccess', type: '(data, variables, context) => void', description: '传给 Hook 的成功回调，适合刷新相关查询或继续下一步流程。' },
  { name: 'mutation.onError', type: '(error, variables, context) => void', description: '传给 Hook 的失败或用户拒绝回调。' },
  { name: 'mutation.onSettled', type: '(data, error, variables, context) => void', description: '传给 Hook 的收尾回调，无论成功失败都会执行。' },
  { name: 'mutation.retry', type: 'boolean | number | function', description: '传给 Hook 的失败重试策略；钱包签名操作通常不应自动重试。' },
]

const commonMutationReturns: ApiField[] = [
  { name: 'mutate', type: '(variables, options?) => void', description: '触发操作，结果通过状态字段或回调读取。' },
  { name: 'mutateAsync', type: '(variables, options?) => Promise<Data>', description: '触发操作并返回 Promise，适合串联后续异步步骤。' },
  { name: 'status', type: 'idle | pending | error | success', description: 'Mutation 当前生命周期状态。' },
  { name: 'isIdle', type: 'boolean', description: '是否尚未触发或已经 reset。' },
  { name: 'isPending', type: 'boolean', description: '操作是否正在进行。' },
  { name: 'isSuccess', type: 'boolean', description: '最近一次操作是否成功。' },
  { name: 'isError', type: 'boolean', description: '最近一次操作是否失败。' },
  { name: 'error', type: 'Error | null', description: '最近一次操作的错误；没有错误时为 null。' },
  { name: 'reset', type: '() => void', description: '清空当前 Mutation 的 data、error 和状态。' },
]

export const lessons: Lesson[] = [
  {
    id: 'createConfig',
    category: '配置',
    title: 'createConfig',
    kind: 'Configuration',
    summary: '创建整个应用共享的 wagmi 配置，声明支持的链、钱包连接器和 RPC 通道。',
    code: `// createConfig 负责创建全局 wagmi 配置；http 创建 RPC Transport
import { createConfig, http } from 'wagmi'
// 直接复用 wagmi 内置的链定义，避免手写 chainId 等元数据
import { mainnet, sepolia } from 'wagmi/chains'
// injected 用于连接 MetaMask、Rabby 等浏览器注入钱包
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  // 第一条链会成为未连接钱包时的默认链
  chains: [mainnet, sepolia],
  // 注册应用允许用户选择的钱包连接方式
  connectors: [injected()],
  // 每一条已配置的链都必须具有对应的 RPC Transport
  transports: {
    [mainnet.id]: http('YOUR_MAINNET_RPC_URL'),
    [sepolia.id]: http('YOUR_SEPOLIA_RPC_URL'),
  },
})`,
    parameters: [
      { name: 'chains', type: 'readonly Chain[]', required: true, description: '应用允许访问和切换的链。' },
      { name: 'connectors', type: 'CreateConnectorFn[]', description: '钱包连接方式，例如 injected、walletConnect。' },
      { name: 'transports', type: 'Record<chainId, Transport>', required: true, description: '每条链对应的 HTTP、WebSocket 或 fallback RPC。' },
      { name: 'storage', type: 'Storage | null', description: '连接状态持久化方式；传 null 可关闭持久化。' },
      { name: 'ssr', type: 'boolean', description: 'SSR 应用设为 true，Vite SPA 保持 false。' },
    ],
    returns: [
      { name: 'config', type: 'Config', description: '传给 WagmiProvider 和 Core Actions 的配置对象。' },
    ],
    notes: ['chains 的第一项是未连接时的默认链。', '生产环境应使用自己的 RPC URL，不要长期依赖公共 RPC。'],
  },
  {
    id: 'createStorage',
    category: '配置',
    title: 'createStorage',
    kind: 'Configuration',
    summary: '把浏览器或自定义键值存储包装成 wagmi Storage，用于持久化最近连接器和连接状态。',
    code: `// createStorage 会统一添加 key 前缀，并处理 wagmi 状态的序列化
import { createConfig, createStorage, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const storage = createStorage({
  // Vite SPA 可以直接使用 localStorage；SSR 需要避免在服务端访问 window
  storage: window.localStorage,
  // 实际键名会以 wagmi-learning. 开头，避免与其他应用冲突
  key: 'wagmi-learning',
})

export const config = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
  // WagmiProvider 会通过该存储恢复最近一次连接状态
  storage,
})`,
    parameters: [
      { name: 'storage', type: 'BaseStorage', description: '底层同步或异步键值存储，需要实现 getItem、setItem、removeItem。' },
      { name: 'key', type: 'string', description: '存储键前缀，默认值为 wagmi。' },
      { name: 'serialize', type: '(value) => string', description: '自定义序列化函数；默认实现支持 bigint、Map 和循环引用占位。' },
      { name: 'deserialize', type: '(value) => unknown', description: '自定义反序列化函数，必须与 serialize 成对使用。' },
    ],
    returns: [
      { name: 'storage', type: 'Storage', description: '可传入 createConfig.storage 的 wagmi 存储适配器。' },
      { name: 'storage.key', type: 'string', description: '当前存储键前缀。' },
      { name: 'storage.getItem / setItem / removeItem', type: 'function', description: '经过前缀和序列化处理的读写方法。' },
    ],
    notes: ['createConfig 未显式传 storage 时，浏览器环境默认使用 localStorage。', '传 storage: null 给 createConfig 可以关闭连接状态持久化。', '不要把私钥、助记词或服务端凭证保存在前端 Storage。'],
  },
  {
    id: 'Chains',
    category: '配置',
    title: 'Chains',
    kind: 'Configuration',
    summary: '使用预定义 Chain 描述网络元数据，并限定应用允许读取和切换的链。',
    code: `// wagmi/chains 复用 viem 维护的标准链定义
import { bscTestnet, mainnet, sepolia } from 'wagmi/chains'
import { createConfig, http } from 'wagmi'

export const config = createConfig({
  // 第一项是钱包未连接时的默认链；这里只允许这三条链
  chains: [sepolia, bscTestnet, mainnet],
  // 每条已声明的链都必须配置对应 Transport
  transports: {
    [sepolia.id]: http(),
    [bscTestnet.id]: http(),
    [mainnet.id]: http(),
  },
})

// 读取链的原生币精度时使用定义中的 decimals
console.log(bscTestnet.id) // 97
console.log(bscTestnet.nativeCurrency.decimals) // 18`,
    parameters: [
      { name: 'id', type: 'number', required: true, description: 'EIP-155 链 ID，例如 BNB Smart Chain Testnet 为 97。' },
      { name: 'name', type: 'string', required: true, description: '网络展示名称。' },
      { name: 'nativeCurrency', type: '{ name; symbol; decimals }', required: true, description: '原生币元数据，用于金额展示和添加网络。' },
      { name: 'rpcUrls', type: 'Record<string, { http; webSocket? }>', required: true, description: '默认及第三方 RPC 地址集合。' },
      { name: 'blockExplorers', type: 'Record<string, BlockExplorer>', description: '区块浏览器名称和 URL。' },
      { name: 'contracts', type: 'Record<string, ChainContract>', description: 'Multicall 等常用系统合约地址。' },
      { name: 'testnet', type: 'boolean', description: '是否为测试网络。' },
    ],
    returns: [
      { name: 'chain', type: 'Chain', description: '可放入 createConfig.chains 并用于严格类型推导的链定义。' },
    ],
    notes: ['useChains 只返回 createConfig.chains 中的条目。', '自定义网络可使用 viem 的 defineChain，但链 ID、RPC、币种精度和浏览器地址必须真实准确。', '配置一条链不会立即把网络添加进钱包；切链时仍可能需要用户确认添加。'],
  },
  {
    id: 'Transports',
    category: '配置',
    title: 'Transports',
    kind: 'Configuration',
    summary: '定义 wagmi 与 RPC 节点通信的通道，并配置超时、重试或多节点回退。',
    code: `// http、webSocket 和 fallback 都由 wagmi 直接导出
import { createConfig, fallback, http, webSocket } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: fallback([
      // WebSocket 适合实时订阅，但服务商必须提供 wss 地址
      webSocket('wss://YOUR_MAINNET_RPC_URL'),
      // 前一个 Transport 失败时回退到 HTTP RPC
      http('https://YOUR_BACKUP_RPC_URL', {
        retryCount: 2,
        timeout: 10_000,
      }),
    ]),
  },
})`,
    parameters: [
      { name: 'http(url?, config?)', type: 'Transport', description: '通过 HTTP JSON-RPC 通信；省略 URL 时使用 Chain 默认 RPC。' },
      { name: 'webSocket(url?, config?)', type: 'Transport', description: '通过 WebSocket RPC 通信，适合区块和事件订阅。' },
      { name: 'fallback(transports, config?)', type: 'Transport', description: '按顺序或排名尝试多个 Transport，提高节点故障时的可用性。' },
      { name: 'retryCount', type: 'number', description: '单个 Transport 请求失败后的重试次数。' },
      { name: 'retryDelay', type: 'number', description: '重试基础间隔，单位毫秒。' },
      { name: 'timeout', type: 'number', description: '单次 RPC 请求超时时间，单位毫秒。' },
    ],
    returns: [
      { name: 'transport', type: 'Transport', description: '由 createConfig 为指定链创建 viem Client 时使用的 Transport 工厂。' },
    ],
    notes: ['公共 RPC 有速率和稳定性限制，生产环境应使用受控服务。', 'WebSocket 断线与 fallback 只能改善前端连接，不能替代业务层重试和幂等。', '不要把带服务端权限的私密 RPC 凭证打包进浏览器代码。'],
  },
  {
    id: 'Connectors',
    category: '配置',
    title: 'Connectors',
    kind: 'Configuration',
    summary: '配置 DApp 支持的钱包接入方式，并决定浏览器插件、移动钱包和二维码连接的行为。',
    code: `// Connector 从 wagmi/connectors 导入，在 createConfig 中统一注册
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    // injected 适配 EIP-1193 浏览器钱包，并支持 EIP-6963 多钱包发现
    injected(),
    // WalletConnect 需要在 WalletConnect Cloud 创建公开 projectId
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})`,
    parameters: [
      { name: 'injected(parameters?)', type: 'CreateConnectorFn', description: '连接 MetaMask、Rabby 等注入 EIP-1193 Provider 的浏览器钱包。' },
      { name: 'metaMask(parameters?)', type: 'CreateConnectorFn', description: '通过 MetaMask SDK 提供专用 MetaMask 桌面和移动连接体验。' },
      { name: 'walletConnect({ projectId })', type: 'CreateConnectorFn', description: '通过 WalletConnect v2 会话连接移动端或二维码钱包。' },
      { name: 'safe(parameters?)', type: 'CreateConnectorFn', description: '在 Safe App iframe 环境中连接 Safe 智能账户。' },
      { name: 'mock(parameters)', type: 'CreateConnectorFn', description: '供测试使用的模拟 Connector，不应作为真实钱包入口。' },
    ],
    returns: [
      { name: 'connector', type: 'CreateConnectorFn', description: '交给 createConfig.connectors 创建 Connector 实例的工厂。' },
    ],
    notes: ['injected 是通用协议连接器，不等于 MetaMask 专用 Connector。', '同时注册 injected 与 MetaMask 专用 Connector 可能产生重复入口，应根据产品目标决定。', 'WalletConnect projectId 可以出现在前端，但必须配置允许的域名，不能误当服务端密钥。'],
  },
  {
    id: 'SSR-Cookies',
    category: '配置',
    title: 'SSR Cookies',
    kind: 'Configuration',
    summary: '在 SSR 框架中使用 Cookie 传递 wagmi 初始状态，避免服务端 HTML 与客户端首次渲染不一致。',
    code: `// config.ts：SSR 模式使用 cookieStorage 保存可水合的连接状态
import {
  cookieStorage,
  cookieToInitialState,
  createConfig,
  createStorage,
  http,
} from 'wagmi'
import { mainnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
  // 告诉 wagmi 当前应用会经历服务端渲染和客户端水合
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
})

// 服务端组件：从请求 Cookie 恢复 WagmiProvider 的 initialState
const initialState = cookieToInitialState(
  config,
  request.headers.get('cookie'),
)

// initialState 必须传给客户端边界中的 WagmiProvider
// <WagmiProvider config={config} initialState={initialState}>...</WagmiProvider>`,
    parameters: [
      { name: 'cookieStorage', type: 'BaseStorage', description: '使用 document.cookie 实现的客户端 Storage 适配器。' },
      { name: 'cookieToInitialState(config, cookie)', type: 'State | undefined', description: '在服务端从完整 Cookie 请求头中解析 wagmi 状态。' },
      { name: 'ssr', type: 'boolean', required: true, description: 'SSR 应用设为 true，延迟读取浏览器专属状态。' },
      { name: 'initialState', type: 'State | undefined', description: '传给 WagmiProvider 的首次水合状态。' },
    ],
    returns: [
      { name: 'initialState', type: 'State | undefined', description: '成功解析时得到连接快照，无 Cookie 或解析失败时为 undefined。' },
    ],
    notes: ['这套流程用于 Next.js 等 SSR 框架；当前 Vite SPA 不需要启用。', 'Cookie 有大小限制，wagmi 仅保存恢复连接所需状态，禁止存私钥或认证凭证。', 'cookieStorage 使用 SameSite=Lax 且不是 HttpOnly，它不是服务端安全会话方案。'],
  },
  {
    id: 'WagmiProvider',
    category: '配置',
    title: 'WagmiProvider',
    kind: 'Provider',
    summary: '把 wagmi 配置注入 React 组件树，使下层组件能够调用所有 wagmi Hooks。',
    code: `// TanStack Query Client 保存链上查询缓存和异步状态
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  // WagmiProvider 让子组件能够访问 config 和钱包状态
  <WagmiProvider config={config}>
    {/* wagmi 的查询 Hooks 依赖 QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>,
)`,
    parameters: [
      { name: 'config', type: 'Config', required: true, description: 'createConfig 创建的全局配置。' },
      { name: 'initialState', type: 'State', description: 'SSR 水合时使用的初始连接状态。' },
      { name: 'reconnectOnMount', type: 'boolean', description: '挂载时是否恢复上一次钱包连接。' },
    ],
    returns: [],
    notes: ['QueryClientProvider 来自 TanStack Query，负责查询缓存和异步状态。', '调用 wagmi Hook 的组件必须位于 Provider 内部。'],
  },
  {
    id: 'useConnection',
    category: '钱包连接',
    title: 'useConnection',
    kind: 'State',
    summary: '读取当前活动钱包连接、账户地址、网络和连接状态。',
    code: `// 订阅当前活动钱包连接；账户或网络变化时组件会重新渲染
const connection = useConnection()

// 用 status 判别联合类型，可让 TypeScript 确认下面字段一定存在
if (connection.status === 'connected') {
  console.log(connection.address) // 当前选中的账户
  console.log(connection.chainId) // 钱包当前链 ID
  console.log(connection.connector.name) // 实际连接的钱包名称
}`,
    parameters: [],
    returns: [
      { name: 'status', type: 'connected | connecting | reconnecting | disconnected', description: '当前连接状态。' },
      { name: 'address', type: 'Address | undefined', description: '当前选中的账户地址。' },
      { name: 'addresses', type: 'readonly Address[] | undefined', description: '钱包授权给应用的全部地址。' },
      { name: 'chainId', type: 'number | undefined', description: '钱包当前网络 ID。' },
      { name: 'connector', type: 'Connector | undefined', description: '当前使用的钱包连接器。' },
    ],
    notes: ['使用 status === connected 可以让 TypeScript 正确收窄 address 和 connector。'],
  },
  {
    id: 'useConnections',
    category: '钱包连接',
    title: 'useConnections',
    kind: 'State',
    summary: '订阅 Config 中全部活动钱包连接，适合同时保留多个 Connector 会话的应用。',
    code: `// useConnections 返回所有活动连接；useConnection 只返回当前连接
const connections = useConnections()

return connections.map((connection) => (
  <div key={connection.connector.uid}>
    {/* connector.name 是实际钱包入口名称 */}
    <strong>{connection.connector.name}</strong>
    {/* accounts 可能包含钱包授权的多个账户 */}
    <span>{connection.accounts[0]}</span>
    {/* 每个连接可以处于不同网络 */}
    <span>chainId: {connection.chainId}</span>
  </div>
))`,
    parameters: [
      { name: 'config', type: 'Config', description: '可选显式 Config；默认读取 WagmiProvider。' },
    ],
    returns: [
      { name: 'connections', type: 'readonly Connection[]', description: '当前所有活动连接的响应式数组。' },
      { name: 'connection.accounts', type: 'readonly Address[]', description: '该 Connector 授权的账户。' },
      { name: 'connection.chainId', type: 'number', description: '该连接当前使用的链 ID。' },
      { name: 'connection.connector', type: 'Connector', description: '建立该连接的 Connector 实例。' },
    ],
    notes: ['这是同步 Store Hook，不返回 Query 状态字段。', '普通单钱包界面使用 useConnection 更直接；只有多连接业务才需要遍历 useConnections。', '不要假设数组第一项永远是当前连接，应通过 useConnection 获取活动项。'],
  },
  {
    id: 'useConnectors',
    category: '钱包连接',
    title: 'useConnectors',
    kind: 'State',
    summary: '返回配置中以及通过 EIP-6963 发现的可用钱包连接器。',
    code: `// 获取配置和 EIP-6963 自动发现的全部钱包连接器
const connectors = useConnectors()

// uid 标识连接器实例；name 用于向用户展示钱包名称
return connectors.map((connector) => (
  <button key={connector.uid}>
    {connector.name}
  </button>
))`,
    parameters: [],
    returns: [
      { name: 'uid', type: 'string', description: '连接器实例的唯一标识，适合作为 React key。' },
      { name: 'id', type: 'string', description: '连接器类型标识。' },
      { name: 'name', type: 'string', description: '展示给用户的钱包名称。' },
      { name: 'type', type: 'string', description: '底层连接器类型。' },
    ],
    notes: ['浏览器安装多个 EIP-6963 钱包时，列表可以包含多个注入式钱包。'],
  },
  {
    id: 'useConnect',
    category: '钱包连接',
    title: 'useConnect',
    kind: 'Mutation',
    summary: '请求用户授权账户并建立钱包连接。该操作必须由用户交互触发。',
    code: `// 先取得用户可以选择的钱包连接器
const connectors = useConnectors()
// Mutation 配置写在 Hook 的 mutation 对象中，不是传给 mutate
const connect = useConnect({
  mutation: {
    // 钱包授权不应自动重复弹窗
    retry: false,
    // 成功后可以读取账户列表和实际连接的链
    onSuccess(data) {
      console.log(data.accounts, data.chainId)
    },
    // 用户拒绝和钱包错误都从这里处理
    onError(error) {
      console.error(error.message)
    },
  },
})

// 钱包弹窗打开期间禁止重复发起连接
<button
  disabled={connect.isPending}
  onClick={() => connect.mutate({
    // connector 决定连接 MetaMask、Rabby 或其他钱包
    connector: connectors[0],
    // 可选：连接后期望钱包所在的链
    chainId: 11155111,
  })}
>
  连接钱包
</button>

// status 可用于统一渲染 idle、pending、success、error 状态
console.log(connect.status, connect.isSuccess, connect.error)
// reset 只清空本次 Mutation 状态，不会断开钱包
// connect.reset()`,
    parameters: [
      { name: 'connector', type: 'Connector', required: true, description: '要连接的钱包连接器。' },
      { name: 'chainId', type: 'number', description: '期望连接的钱包网络。' },
      { name: 'withCapabilities', type: 'boolean', description: '是否同时请求钱包能力信息。' },
      ...commonMutationParameters,
    ],
    returns: [
      { name: 'data', type: 'ConnectReturnType | undefined', description: '连接成功后的账户列表和 chainId。' },
      ...commonMutationReturns,
    ],
    notes: ['用户拒绝连接属于正常错误分支，界面需要恢复可操作状态。'],
  },
  {
    id: 'useDisconnect',
    category: '钱包连接',
    title: 'useDisconnect',
    kind: 'Mutation',
    summary: '断开当前连接并清理 wagmi 保存的连接状态。',
    code: `// disconnect 只清理 DApp 连接状态，不会删除钱包账户
const disconnect = useDisconnect({
  mutation: {
    // 断开结束后执行界面收尾，无论成功还是失败
    onSettled() {
      console.log('断开操作已经结束')
    },
  },
})

// 避免用户在断开过程中连续点击
<button
  disabled={disconnect.isPending}
  onClick={() => disconnect.mutate()}
>
  断开连接
</button>

// isError 和 error 用于展示失败信息
if (disconnect.isError) console.error(disconnect.error.message)
// reset 只重置 Mutation 显示状态
// disconnect.reset()`,
    parameters: [
      { name: 'connector', type: 'Connector', description: '多连接场景下指定要断开的连接器。' },
      ...commonMutationParameters,
    ],
    returns: [
      { name: 'data', type: 'void | undefined', description: '断开成功后没有业务数据。' },
      ...commonMutationReturns,
    ],
    notes: ['断开应用连接不等同于删除钱包账户或锁定钱包。'],
  },
  {
    id: 'useConfig',
    category: '客户端 Hooks',
    title: 'useConfig',
    kind: 'Configuration',
    summary: '读取最近一层 WagmiProvider 提供的 Config，供高级组件访问链、连接器、存储和 Core Actions。',
    code: `// useConfig 返回 WagmiProvider 传入的同一个 Config 实例
const config = useConfig()

// 可以检查应用静态配置，但不要读取 _internal 私有字段
console.log(config.chains.map((chain) => chain.name))
console.log(config.connectors.map((connector) => connector.name))
console.log(config.storage?.key)

// Core Action 需要把 Config 作为第一个参数传入
const balance = await getBalance(config, {
  address: '0x...',
})`,
    parameters: [
      { name: 'config', type: 'Config', description: '可选显式 Config；默认从最近的 WagmiProvider Context 读取。' },
    ],
    returns: [
      { name: 'chains', type: 'readonly Chain[]', description: '应用已配置的链。' },
      { name: 'connectors', type: 'readonly Connector[]', description: '当前 Config 中的连接器实例。' },
      { name: 'storage', type: 'Storage | null', description: '当前连接状态存储适配器。' },
      { name: 'state', type: 'State', description: 'Config 当前快照；需要响应更新时应使用对应 Hook。' },
      { name: 'getClient', type: '(parameters?) => Client', description: '按 chainId 取得基础 viem Client。' },
      { name: 'subscribe', type: 'function', description: '订阅 Config Store 的底层方法。' },
    ],
    notes: ['这是同步 Context Hook，没有 isFetching、status 或 refetch。', '读取响应式连接状态优先使用 useConnection、useChainId、useChains 等专用 Hook。', '不要依赖 config._internal，它不属于稳定公开 API。'],
  },
  {
    id: 'useChainId',
    category: '客户端 Hooks',
    title: 'useChainId',
    kind: 'State',
    summary: '订阅 wagmi 当前活动链 ID；连接钱包后通常与活动连接同步，未连接时使用 Config 状态。',
    code: `// useChainId 同步订阅 Config Store，不会发起 RPC 请求
const chainId = useChainId()
const chains = useChains()

// 通过已配置链列表取得完整链元数据
const chain = chains.find((item) => item.id === chainId)
console.log(chainId, chain?.name)

// 切换钱包网络应调用 useSwitchChain，不能修改 chainId 返回值
// switchChain.mutate({ chainId: sepolia.id })`,
    parameters: [
      { name: 'config', type: 'Config', description: '可选显式 Config；默认读取 WagmiProvider。' },
    ],
    returns: [
      { name: 'chainId', type: 'number', description: 'Config 当前活动链的 EIP-155 ID。' },
    ],
    notes: ['这是同步 Store Hook，不会返回 isFetching 或 error。', '钱包未连接时仍会返回 createConfig 中的默认链或 Config 保存的当前链。', '它只返回 ID；链名称、币种和浏览器信息应从 useChains 中查找。'],
  },
  {
    id: 'useClient',
    category: '客户端 Hooks',
    title: 'useClient',
    kind: 'State',
    summary: '取得 createConfig 为指定链创建的基础 viem Client，适合扩展自定义 Actions。',
    code: `// useClient 同步取得 Config 缓存的基础 viem Client
const client = useClient({
  // 固定到 Sepolia；省略时使用 wagmi 当前活动链
  chainId: sepolia.id,
})

// 基础 Client 包含 chain、transport 和 request 等底层能力
console.log(client?.chain?.name)
console.log(client?.transport.type)

// 常规公开 RPC 调用优先使用 usePublicClient
// const publicClient = usePublicClient({ chainId: sepolia.id })`,
    parameters: [
      { name: 'chainId', type: 'number', description: '要取得 Client 的已配置链 ID。' },
      { name: 'config', type: 'Config', description: '可选显式 Config。' },
    ],
    returns: [
      { name: 'client', type: 'Client | undefined', description: '指定链的基础 viem Client；链未配置时可能为 undefined。' },
      { name: 'client.chain', type: 'Chain | undefined', description: 'Client 绑定的链。' },
      { name: 'client.transport', type: 'Transport', description: 'Client 当前使用的 RPC Transport。' },
      { name: 'client.request', type: 'EIP1193RequestFn', description: '直接发送 JSON-RPC 请求的底层方法。' },
    ],
    notes: ['这是同步外部 Store Hook，不具有 TanStack Query 状态字段。', 'useClient 返回基础 Client；usePublicClient 在其上扩展了公开链读取 Actions。', '直接调用 request 会绕过高级参数校验，应优先使用类型化 viem Actions。'],
  },
  {
    id: 'usePublicClient',
    category: '客户端 Hooks',
    title: 'usePublicClient',
    kind: 'State',
    summary: '取得带 publicActions 的 viem Public Client，用于不需要钱包签名的底层 RPC 读取。',
    code: `// Public Client 使用 createConfig 中该链对应的 RPC Transport
const publicClient = usePublicClient({
  chainId: sepolia.id,
})

async function readLatestBlock() {
  // Public Client 可以直接调用 viem 的公开链 Actions
  const blockNumber = await publicClient?.getBlockNumber()
  // 区块号是 bigint，展示时转为十进制字符串
  console.log(blockNumber?.toString())
}

// 组件需要缓存和自动刷新时，优先使用 useBlockNumber 等 wagmi Query Hook`,
    parameters: [
      { name: 'chainId', type: 'number', description: 'Public Client 使用的已配置链；省略时使用当前活动链。' },
      { name: 'config', type: 'Config', description: '可选显式 Config。' },
    ],
    returns: [
      { name: 'publicClient', type: 'PublicClient | undefined', description: '带 viem publicActions 的只读客户端。' },
      { name: 'publicClient.chain', type: 'Chain | undefined', description: '客户端绑定的链。' },
      { name: 'publicClient.transport', type: 'Transport', description: '公开 RPC 请求所使用的 Transport。' },
      { name: 'publicClient.getBlockNumber 等', type: 'function', description: 'viem Public Actions，不需要钱包授权。' },
    ],
    notes: ['这是同步 Client Hook，本身没有 isFetching；调用 client Action 的 Promise 状态需要自行管理。', '需要 React 缓存、去重、重试和 refetch 时应使用对应 wagmi Query Hook。', 'Public Client 不能代替钱包签名交易。'],
  },
  {
    id: 'useWalletClient',
    category: '客户端 Hooks',
    title: 'useWalletClient',
    kind: 'Query',
    summary: '从当前 Connector 取得带 walletActions 的 viem Wallet Client，用于需要已授权账户的高级钱包操作。',
    code: `// useWalletClient 是 TanStack Query Hook；未连接时不会得到客户端
const walletClient = useWalletClient({
  chainId: sepolia.id,
  query: {
    // 只有连接到目标链后才查询 Connector Client
    enabled: isConnected && currentChainId === sepolia.id,
    // 钱包拒绝或连接错误不自动重复请求
    retry: false,
  },
})

if (walletClient.data) {
  // account 是用户已经授权给当前 DApp 的账户
  console.log(walletClient.data.account.address)
  console.log(walletClient.data.chain?.name)
}

// 常用交易和签名仍优先使用 useSendTransaction、useWriteContract 等 Hook
console.log(walletClient.status, walletClient.isFetching, walletClient.error)`,
    parameters: [
      { name: 'chainId', type: 'number', description: '期望 Wallet Client 使用的已配置链。' },
      { name: 'connector', type: 'Connector', description: '指定连接器；默认使用当前活动连接器。' },
      { name: 'account', type: 'Address | Account', description: '指定已由 Connector 授权的账户。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data', type: 'WalletClient | undefined', description: '带 walletActions、账户和钱包 Transport 的 viem 客户端。' },
      { name: 'data.account', type: 'Account', description: 'Wallet Client 当前使用的已授权账户。' },
      { name: 'data.chain', type: 'Chain | undefined', description: 'Wallet Client 当前目标链。' },
      ...commonQueryReturns,
    ],
    notes: ['Wallet Client 依赖钱包连接和账户授权，不能仅凭一个地址构造。', '直接调用 Wallet Client 适合 wagmi 尚未封装的高级操作；常规流程优先使用专用 Hook。', '任何签名或交易 Action 都必须由明确的用户操作触发。'],
  },
  {
    id: 'useConnectorClient',
    category: '客户端 Hooks',
    title: 'useConnectorClient',
    kind: 'Query',
    summary: '从当前钱包 Connector 创建带账户的基础 viem Client，供自定义客户端扩展使用。',
    code: `// Connector Client 依赖已连接钱包，因此它是异步 Query
const connectorClient = useConnectorClient({
  query: {
    // 未连接时暂停查询，避免请求不存在的 Provider
    enabled: isConnected,
    // 钱包查询失败后不自动重复唤起连接流程
    retry: false,
  },
})

if (connectorClient.data) {
  // Client 已绑定用户授权账户和 Connector Transport
  console.log(connectorClient.data.account.address)
  console.log(connectorClient.data.chain?.name)

  // 可用 extend 增加项目自定义 Actions
  // const client = connectorClient.data.extend(customActions)
}

console.log(connectorClient.status, connectorClient.isFetching)`,
    parameters: [
      { name: 'account', type: 'Address | Account', description: '指定 Connector 已授权的账户；默认使用当前账户。' },
      { name: 'chainId', type: 'number', description: '期望客户端使用的已配置链。' },
      { name: 'connector', type: 'Connector', description: '指定钱包 Connector；默认使用当前活动连接器。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data', type: 'Client | undefined', description: '绑定钱包账户、链和 Connector Transport 的基础 viem Client。' },
      { name: 'data.account', type: 'Account', description: '当前已授权账户。' },
      { name: 'data.chain', type: 'Chain | undefined', description: '客户端当前链。' },
      { name: 'data.transport', type: 'Transport', description: '通过 Connector EIP-1193 Provider 发请求的 Transport。' },
      ...commonQueryReturns,
    ],
    notes: ['useWalletClient 在 Connector Client 上扩展了标准 walletActions；两者不是两个独立钱包连接。', '需要 sendTransaction、signMessage 等常规能力时优先使用专用 Hook 或 useWalletClient。', '账户切换或断开时 wagmi 会失效或移除对应查询缓存。'],
  },
  {
    id: 'useConnectionEffect',
    category: '客户端 Hooks',
    title: 'useConnectionEffect',
    kind: 'Watcher',
    summary: '在钱包建立或断开连接的生命周期边界执行副作用，而不是用渲染逻辑猜测状态变化。',
    code: `// 从 Hook 参数类型中提取回调签名，避免重复手写事件类型
import type { UseConnectionEffectParameters } from 'wagmi'

// useCallback 保持回调引用稳定，避免每次渲染都重新订阅
const handleConnect = useCallback<
  NonNullable<UseConnectionEffectParameters['onConnect']>
>((data) => {
  console.log('连接账户', data.address)
  console.log('是否为自动恢复', data.isReconnected)
}, [])

const handleDisconnect = useCallback(() => {
  console.log('钱包已断开')
}, [])

useConnectionEffect({
  // 首次连接或自动恢复连接成功时触发
  onConnect: handleConnect,
  // 状态从 connected 变为 disconnected 时触发
  onDisconnect: handleDisconnect,
})`,
    parameters: [
      { name: 'onConnect', type: '(data) => void', description: '连接成功时调用，data 包含 address、addresses、chainId、connector 和 isReconnected。' },
      { name: 'onDisconnect', type: '() => void', description: '活动连接断开时调用。' },
      { name: 'config', type: 'Config', description: '可选显式 Config。' },
    ],
    returns: [],
    notes: ['这是 Effect Hook，不返回连接状态；渲染 UI 仍使用 useConnection。', '开发环境 StrictMode 可能使 Effect 订阅经历额外的挂载与清理，副作用应可重复执行。', '不要仅在这里保存关键登录状态；后端会话仍需独立校验。'],
  },
  {
    id: 'useChains',
    category: '网络与查询',
    title: 'useChains',
    kind: 'State',
    summary: '读取 createConfig 中配置的所有区块链。',
    code: `// 返回 createConfig.chains 中声明的链，而非钱包支持的全部链
const chains = useChains()

// 使用 chain.id 作为表单值，使用 chain.name 作为展示文本
return chains.map((chain) => (
  <option key={chain.id} value={chain.id}>
    {chain.name}
  </option>
))`,
    parameters: [],
    returns: [
      { name: 'id', type: 'number', description: '链 ID，例如 Mainnet 为 1。' },
      { name: 'name', type: 'string', description: '链名称。' },
      { name: 'nativeCurrency', type: 'ChainNativeCurrency', description: '原生币名称、符号和 decimals。' },
      { name: 'blockExplorers', type: 'Record', description: '区块浏览器配置。' },
    ],
    notes: ['它返回的是应用允许使用的链，不是钱包支持的全部链。'],
  },
  {
    id: 'useSwitchChain',
    category: '网络与查询',
    title: 'useSwitchChain',
    kind: 'Mutation',
    summary: '请求钱包切换到 createConfig 已配置的目标网络。',
    code: `// useSwitchChain 返回切链 Mutation，不会在 Hook 调用时自动切链
const switchChain = useSwitchChain({
  mutation: {
    // 钱包切链需要用户确认，不进行自动重试
    retry: false,
    // data 是切换成功后的 Chain
    onSuccess(data) {
      console.log('已切换到', data.name)
    },
  },
})

// 必须由用户操作触发，钱包会显示切换网络请求
switchChain.mutate({
  // 目标链必须已存在于 createConfig.chains
  chainId: sepolia.id,
})

// pending 时禁用切链按钮；错误可能来自拒绝或链未配置
console.log(switchChain.isPending, switchChain.error)
// reset 可以清除当前成功或错误状态
// switchChain.reset()`,
    parameters: [
      { name: 'chainId', type: 'number', required: true, description: '目标网络的链 ID。' },
      { name: 'addEthereumChainParameter', type: 'object', description: '钱包尚未添加该网络时使用的网络元数据。' },
      ...commonMutationParameters,
    ],
    returns: [
      { name: 'data', type: 'Chain | undefined', description: '切换成功后的链。' },
      ...commonMutationReturns,
    ],
    notes: ['切链是钱包操作，用户可以拒绝。', 'chainId 必须在 createConfig.chains 中。'],
  },
  {
    id: 'useBalance',
    category: '网络与查询',
    title: 'useBalance',
    kind: 'Query',
    summary: '查询地址的原生币余额，结果使用 bigint 保存最小单位。',
    code: `// 查询地址在指定链上的余额
const balance = useBalance({
  address, // 要查询的账户地址
  chainId: sepolia.id, // 固定从 Sepolia 读取
  query: {
    // 关闭自动查询，改由按钮点击时调用 refetch
    enabled: false,
    // 成功结果在 30 秒内视为新鲜数据
    staleTime: 30_000,
    // RPC 查询失败后最多再重试一次
    retry: 1,
    // 返回页面时不自动查询，保持完全由按钮控制
    refetchOnWindowFocus: false,
  },
})

// isFetching 表示当前确实正在请求 RPC
<button
  disabled={!address || balance.isFetching}
  onClick={() => balance.refetch()}
>
  {balance.isFetching ? '查询中...' : '查询余额'}
</button>

// value 是最小单位 bigint；formatUnits 精确转换为展示字符串
const text = balance.data
  ? formatUnits(balance.data.value, balance.data.decimals)
  : '--'

// 首次实际查询时 isLoading 为 true；后续刷新使用 isRefetching
console.log(balance.status, balance.isLoading, balance.isRefetching)
if (balance.isError) console.error(balance.error.message)`,
    parameters: [
      { name: 'address', type: 'Address', required: true, description: '需要查询余额的账户地址。' },
      { name: 'chainId', type: 'number', description: '查询网络；默认使用当前链。' },
      { name: 'blockNumber', type: 'bigint', description: '查询指定区块高度的历史余额。' },
      { name: 'blockTag', type: 'BlockTag', description: '按 latest、safe、finalized 等区块标签查询。' },
      { name: 'blockHash', type: 'Hash', description: '查询指定区块 Hash 下的历史余额。' },
      { name: 'requireCanonical', type: 'boolean', description: '使用 blockHash 时，是否要求该区块仍在规范链上。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data.value', type: 'bigint', description: '以最小单位表示的精确余额。' },
      { name: 'data.decimals', type: 'number', description: '目标链原生币的小数位。' },
      { name: 'data.symbol', type: 'string', description: '目标链原生币符号。' },
      ...commonQueryReturns,
    ],
    notes: ['展示使用 formatUnits，不要把 value 转成 number。', 'blockNumber、blockTag、blockHash 三者互斥。', 'ERC-20 余额应使用 useReadContract 调用 balanceOf。'],
  },
  {
    id: 'useGasPrice',
    category: '网络与查询',
    title: 'useGasPrice',
    kind: 'Query',
    summary: '查询指定链当前建议的 legacy Gas Price，并以 bigint 表示每单位 Gas 的 Wei 价格。',
    code: `// 查询 Sepolia 当前 eth_gasPrice 建议值
const gasPrice = useGasPrice({
  chainId: sepolia.id,
  query: {
    // Gas 价格变化较快，10 秒后视为过期
    staleTime: 10_000,
    // 每 15 秒主动刷新一次
    refetchInterval: 15_000,
    // 临时 RPC 错误最多重试两次
    retry: 2,
  },
})

// data 是 Wei bigint；formatUnits 转成精确的 Gwei 字符串
const gwei = gasPrice.data
  ? formatUnits(gasPrice.data, 9)
  : '--'

// isFetching 同时覆盖首次请求和后台刷新
console.log(gwei, gasPrice.isFetching, gasPrice.dataUpdatedAt)
if (gasPrice.isError) console.error(gasPrice.error.message)`,
    parameters: [
      { name: 'chainId', type: 'number', description: '查询网络；默认使用 wagmi 当前活动链。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data', type: 'bigint | undefined', description: '每单位 Gas 的建议价格，单位为 Wei。' },
      ...commonQueryReturns,
    ],
    notes: ['不要把 Gas Price 转成 number；使用 formatUnits(data, 9) 展示 Gwei。', 'eth_gasPrice 是建议值，不是交易最终实际支付的总费用。', 'EIP-1559 交易应进一步学习 useEstimateFeesPerGas，区分 maxFeePerGas 与 maxPriorityFeePerGas。'],
  },
  {
    id: 'useEstimateFeesPerGas',
    category: '网络与查询',
    title: 'useEstimateFeesPerGas',
    kind: 'Query',
    summary: '估算当前链建议的 EIP-1559 或 legacy 每单位 Gas 费用参数。',
    code: `// 默认按 EIP-1559 估算 maxFeePerGas 和 maxPriorityFeePerGas
const fees = useEstimateFeesPerGas({
  chainId: sepolia.id,
  type: 'eip1559',
  query: {
    // 费用变化较快，10 秒后允许重新查询
    staleTime: 10_000,
    // 临时 RPC 错误最多重试两次
    retry: 2,
  },
})

// 所有费用字段都是 Wei bigint，展示 Gwei 时保持字符串精度
const maxFee = fees.data
  ? formatUnits(fees.data.maxFeePerGas, 9)
  : '--'
const priorityFee = fees.data
  ? formatUnits(fees.data.maxPriorityFeePerGas, 9)
  : '--'

console.log(maxFee, priorityFee, fees.isFetching)`,
    parameters: [
      { name: 'chainId', type: 'number', description: '需要估算费用的链。' },
      { name: 'type', type: 'eip1559 | legacy', description: '费用模型；默认使用 eip1559。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data.maxFeePerGas', type: 'bigint', description: 'EIP-1559 每单位 Gas 愿意支付的费用上限，单位 Wei。' },
      { name: 'data.maxPriorityFeePerGas', type: 'bigint', description: 'EIP-1559 每单位 Gas 的优先费用上限，单位 Wei。' },
      { name: 'data.gasPrice', type: 'bigint', description: 'legacy 模式下建议的每单位 Gas 价格，单位 Wei。' },
      ...commonQueryReturns,
    ],
    notes: ['返回字段随 type 变化：eip1559 使用两个 max 字段，legacy 使用 gasPrice。', '费用参数不是交易总价；粗略上限为 gasLimit × maxFeePerGas。', '不要把任何费用 bigint 转换为 number。'],
  },
  {
    id: 'useEstimateGas',
    category: '网络与查询',
    title: 'useEstimateGas',
    kind: 'Query',
    summary: '模拟一笔交易并估算执行所需 Gas Limit，不会签名、广播或扣款。',
    code: `// 估算从当前账户发送到 recipient 的交易 Gas Limit
const estimate = useEstimateGas({
  account: address,
  to: recipient,
  // 用户金额字符串必须先精确转换为 Wei bigint
  value: parseEther(amountText),
  chainId: sepolia.id,
  query: {
    // 地址、金额和网络准备完整后才发送 eth_estimateGas
    enabled: Boolean(address && recipient && amountText),
    // 参数不变时 10 秒内复用结果
    staleTime: 10_000,
    // 确定性的 revert 通常不需要自动重试
    retry: false,
  },
})

// 返回的是 Gas 数量，不是 Wei 金额，也不需要 formatUnits
console.log(estimate.data?.toString())
if (estimate.isError) console.error(estimate.error.message)`,
    parameters: [
      { name: 'account', type: 'Address | Account', description: '模拟交易发送方；默认使用当前连接账户。' },
      { name: 'to', type: 'Address', description: '交易接收地址；部署合约时可以省略。' },
      { name: 'value', type: 'bigint', description: '附带的原生币金额，单位 Wei。' },
      { name: 'data', type: 'Hex', description: '合约调用或部署字节码。' },
      { name: 'chainId', type: 'number', description: '执行估算的网络。' },
      { name: 'nonce / fee fields', type: 'bigint | number', description: '需要精确模拟时提供 nonce 和费用参数。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data', type: 'bigint | undefined', description: '估算的 Gas Limit 数量。' },
      ...commonQueryReturns,
    ],
    notes: ['估算不会发送交易，但节点会模拟执行，因此合约 revert 会表现为查询错误。', '链上状态可能在广播前变化，Gas 估算不是绝对保证。', 'Gas Limit 与 Gas Price 含义不同，总费用需要把两者相乘。'],
  },
  {
    id: 'useBlockNumber',
    category: '网络与查询',
    title: 'useBlockNumber',
    kind: 'Query',
    summary: '读取当前区块高度，并可持续监听新区块。',
    code: `// 读取 Sepolia 当前区块高度
const blockNumber = useBlockNumber({
  chainId: sepolia.id,
  // 开启监听并立即返回当前区块；HTTP Transport 通常通过轮询实现
  watch: {
    emitOnBegin: true,
    emitMissed: true,
  },
  query: {
    // 页面不可见时可以传 false，暂停首次查询和 watch
    enabled: isPageVisible,
    // 区块号在 10 秒内视为新鲜数据
    staleTime: 10_000,
  },
})

// 区块高度是 bigint，展示前转成字符串
const text = blockNumber.data?.toString() ?? '--'

// fetchStatus 区分正在请求、暂停和空闲
console.log(blockNumber.fetchStatus, blockNumber.isFetching)
// 除了 watch 自动更新，也可以主动重新查询
// await blockNumber.refetch()`,
    parameters: [
      { name: 'chainId', type: 'number', description: '需要读取的网络。' },
      { name: 'watch', type: 'boolean', description: '是否持续监听新区块。' },
      { name: 'watch.emitOnBegin', type: 'boolean', description: '开启 watch 时是否立即返回当前区块号。' },
      { name: 'watch.emitMissed', type: 'boolean', description: '开启 watch 时是否补发轮询期间错过的区块号。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data', type: 'bigint | undefined', description: '最新区块高度。' },
      ...commonQueryReturns,
    ],
    notes: ['长时间 watch 会持续产生 RPC 请求，应根据页面可见性控制。'],
  },
  {
    id: 'useSendTransaction',
    category: '交易与签名',
    title: 'useSendTransaction',
    kind: 'Mutation',
    summary: '让当前钱包签名并广播原生币转账或带 data 的交易。',
    code: `// 返回发送交易 Mutation；此时还不会弹出钱包
const transaction = useSendTransaction({
  mutation: {
    // 钱包交易不能在失败后自动再次弹窗
    retry: false,
    // 成功只代表获得 Hash，并不代表链上执行成功
    onSuccess(hash) {
      console.log('交易已广播', hash)
    },
    // 用户拒绝、余额不足和 RPC 错误都会进入这里
    onError(error) {
      console.error(error.message)
    },
  },
})

// 应由按钮点击等明确的用户操作触发
transaction.mutate({
  chainId: sepolia.id, // 限定在 Sepolia 测试网发送
  to: '0x...', // 接收方 EVM 地址
  // 用户输入是字符串；parseEther 精确转换为 Wei bigint
  value: parseEther('0.001'),
})

// pending 期间应禁用提交按钮，防止重复发送
console.log(transaction.status, transaction.isPending)
// reset 只清空本次提交状态，不会撤销已经广播的交易
// transaction.reset()`,
    parameters: [
      { name: 'to', type: 'Address', required: true, description: '交易接收地址。' },
      { name: 'value', type: 'bigint', description: '发送的原生币最小单位数量。' },
      { name: 'chainId', type: 'number', description: '目标网络。' },
      { name: 'data', type: 'Hex', description: '可选调用数据。' },
      { name: 'gas / maxFeePerGas', type: 'bigint', description: '可选 Gas 限制和 EIP-1559 费用。' },
      ...commonMutationParameters,
    ],
    returns: [
      { name: 'data', type: 'Hash | undefined', description: '广播成功后的交易 Hash。' },
      ...commonMutationReturns,
    ],
    notes: ['获得 Hash 只代表已广播，不代表交易成功。', 'value 必须使用 parseEther 或 parseUnits 创建。'],
  },
  {
    id: 'useTransaction',
    category: '交易与签名',
    title: 'useTransaction',
    kind: 'Query',
    summary: '按交易 Hash 或区块位置读取交易本身的输入、金额、费用和区块归属信息。',
    code: `// 根据已经存在的交易 Hash 读取交易详情
const transaction = useTransaction({
  hash: transactionHash,
  chainId: sepolia.id,
  query: {
    // Hash 准备完成后才查询
    enabled: Boolean(transactionHash),
    // 已确认交易通常不会变化，可延长新鲜时间
    staleTime: 60_000,
    retry: 2,
  },
})

if (transaction.data) {
  // value 是 Wei bigint；input 是调用数据 Hex
  console.log(formatEther(transaction.data.value))
  console.log(transaction.data.input)
  // 未打包的 pending 交易可能没有 blockNumber
  console.log(transaction.data.blockNumber?.toString())
}

console.log(transaction.isFetching, transaction.error)`,
    parameters: [
      { name: 'hash', type: 'Hash', description: '交易 Hash；最常用的定位方式。' },
      { name: 'blockHash', type: 'Hash', description: '与 index 配合，通过区块 Hash 定位交易。' },
      { name: 'blockNumber', type: 'bigint', description: '与 index 配合，通过区块高度定位交易。' },
      { name: 'blockTag', type: 'BlockTag', description: '与 index 配合，按 latest、pending 等标签定位。' },
      { name: 'index', type: 'number', description: '交易在目标区块中的索引。' },
      { name: 'chainId', type: 'number', description: '交易所在链。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data.hash', type: 'Hash', description: '交易 Hash。' },
      { name: 'data.from / to', type: 'Address / Address | null', description: '发送方和接收方；合约部署交易的 to 为 null。' },
      { name: 'data.value', type: 'bigint', description: '交易附带的原生币数量，单位 Wei。' },
      { name: 'data.input', type: 'Hex', description: '交易调用数据或合约部署字节码。' },
      { name: 'data.blockNumber', type: 'bigint | null', description: '已打包区块高度；pending 交易可能为 null。' },
      { name: 'data.chainId', type: 'number', description: 'wagmi 附加的来源链 ID。' },
      ...commonQueryReturns,
    ],
    notes: ['Transaction 描述用户提交的请求，不能证明 EVM 执行成功。', '判断 success 或 reverted 必须读取 Transaction Receipt。', 'hash 与 blockHash、blockNumber、blockTag + index 是不同定位方式，不应混用。'],
  },
  {
    id: 'useTransactionReceipt',
    category: '交易与签名',
    title: 'useTransactionReceipt',
    kind: 'Query',
    summary: '立即查询已生成的 Transaction Receipt；交易尚未打包时返回未找到错误，而不是持续等待。',
    code: `// 适合确认已知已打包交易，内部调用 eth_getTransactionReceipt
const receipt = useTransactionReceipt({
  hash: transactionHash,
  chainId: sepolia.id,
  query: {
    // 没有 Hash 时不查询
    enabled: Boolean(transactionHash),
    // Receipt 一旦生成通常不会变化
    staleTime: Infinity,
    // pending 交易未找到不是临时网络错误，不盲目高频重试
    retry: false,
  },
})

if (receipt.data?.status === 'success') {
  console.log('执行成功', receipt.data.gasUsed.toString())
}
if (receipt.data?.status === 'reverted') {
  console.log('交易已打包但执行回滚')
}

// 需要持续等待 pending 交易时改用 useWaitForTransactionReceipt
console.log(receipt.isFetching, receipt.error)`,
    parameters: [
      { name: 'hash', type: 'Hash', required: true, description: '已广播交易的 Hash。' },
      { name: 'chainId', type: 'number', description: '交易所在链。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data.status', type: 'success | reverted', description: 'EVM 执行结果。' },
      { name: 'data.transactionHash', type: 'Hash', description: 'Receipt 对应的交易 Hash。' },
      { name: 'data.blockNumber', type: 'bigint', description: '交易被打包的区块高度。' },
      { name: 'data.gasUsed', type: 'bigint', description: '实际使用的 Gas 数量。' },
      { name: 'data.logs', type: 'Log[]', description: '交易执行产生的事件日志。' },
      { name: 'data.chainId', type: 'number', description: 'wagmi 附加的来源链 ID。' },
      ...commonQueryReturns,
    ],
    notes: ['它只查询一次普通 Receipt，不负责轮询等待或交易替换检测。', '刚获得 Hash 后应使用 useWaitForTransactionReceipt。', 'Receipt 存在仍必须检查 status，reverted 也是已打包的 Receipt。'],
  },
  {
    id: 'useWaitForTransactionReceipt',
    category: '交易与签名',
    title: 'useWaitForTransactionReceipt',
    kind: 'Query',
    summary: '根据交易 Hash 等待上链并取得 Receipt，用于判断最终执行结果。',
    code: `// 根据广播后得到的 Hash 等待链上 Receipt
const receipt = useWaitForTransactionReceipt({
  hash: transactionHash, // Hash 为空时查询不会启动
  chainId: sepolia.id, // 必须与交易所在网络一致
  confirmations: 1, // 至少等待一个区块确认
  query: {
    // 有 Hash 后才开始查询 Receipt
    enabled: Boolean(transactionHash),
    // 临时 RPC 错误最多重试三次
    retry: 3,
    // 回到页面时不额外创建一轮查询
    refetchOnWindowFocus: false,
  },
})

// isFetching 表示正在向 RPC 查询或等待 Receipt
if (receipt.isFetching) console.log('正在等待交易确认')
if (receipt.isError) console.error(receipt.error.message)

// 被打包不代表执行成功，必须检查 Receipt status
if (receipt.data?.status === 'success') {
  console.log('交易执行成功')
}

// 需要时也可以手动重新检查 Receipt
// await receipt.refetch()`,
    parameters: [
      { name: 'hash', type: 'Hash', required: true, description: '要等待的交易 Hash；为空时查询不会启动。' },
      { name: 'chainId', type: 'number', description: '交易所在网络。' },
      { name: 'confirmations', type: 'number', description: '要求的区块确认数量。' },
      { name: 'timeout', type: 'number', description: '等待超时时间，单位毫秒。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data.status', type: 'success | reverted', description: 'EVM 执行结果。' },
      { name: 'data.blockNumber', type: 'bigint', description: '交易所在区块。' },
      { name: 'data.transactionHash', type: 'Hash', description: 'Receipt 对应的交易 Hash。' },
      { name: 'data.gasUsed', type: 'bigint', description: '交易实际消耗的 Gas 数量。' },
      ...commonQueryReturns,
    ],
    notes: ['交易被打包不等于成功，必须检查 Receipt status。', '充值和支付业务通常需要超过 1 个确认。'],
  },
  {
    id: 'useSignMessage',
    category: '交易与签名',
    title: 'useSignMessage',
    kind: 'Mutation',
    summary: '请求钱包对普通消息签名，常用于登录认证和所有权证明。',
    code: `// string 会按 UTF-8 编码，再按 EIP-191 添加 Ethereum 消息前缀
const message = 'wagmi EIP-191 signing demo'

// 创建消息签名 Mutation；调用 Hook 本身不会弹出钱包
const signMessage = useSignMessage({
  mutation: {
    // 签名操作必须由用户明确触发，不自动重试
    retry: false,
    // data 是钱包返回的签名 Hex
    onSuccess(data) {
      console.log('签名结果', data)
    },
    onError(error) {
      console.error('签名失败', error.message)
    },
  },
})

// 同一份消息、地址和签名可交给 useVerifyMessage 验证
const verification = useVerifyMessage({
  address,
  message,
  signature: signMessage.data,
  query: {
    // 关闭自动验证，改为用户点击按钮后调用 refetch
    enabled: false,
  },
})

// 必须由用户点击触发，钱包通常调用 personal_sign
function handleSign() {
  signMessage.mutate({ message })

  // 如果需要直接签名字节，可改用 raw Hex 或 Uint8Array
  // signMessage.mutate({ message: { raw: '0x68656c6c6f' } })
}

// 点击验证按钮时，使用同一份消息、地址和签名手动查询
async function handleVerify() {
  if (!address || !signMessage.data) return
  const result = await verification.refetch()
  console.log('签名是否有效', result.data)
}

// pending 时应禁用签名按钮，避免连续弹出钱包确认
console.log(signMessage.status, signMessage.isPending)
// 返回值是 0x 开头的 Hex；不要假设所有账户都固定为 65 字节
console.log(signMessage.data, verification.data)`,
    parameters: [
      { name: 'message', type: 'string | { raw: Hex | Uint8Array }', required: true, description: 'string 按 UTF-8 编码；raw 直接提供待签名字节。' },
      { name: 'account', type: 'Address', description: '签名账户；默认使用当前账户。' },
      { name: 'connector', type: 'Connector', description: '指定执行签名的钱包。' },
      ...commonMutationParameters,
    ],
    returns: [
      { name: 'data', type: 'Hex | undefined', description: '0x 开头的钱包签名字节；EOA 通常为 r + s + v。' },
      ...commonMutationReturns,
    ],
    notes: ['浏览器钱包通常使用 personal_sign，并按 EIP-191 对带前缀的消息摘要签名。', '普通 EOA 签名通常为 65 字节的 r + s + v；智能合约账户或封装签名可能采用可变长度。', '不要手动拆分签名判断真伪，应使用 useVerifyMessage 或后端 viem verifyMessage。', '登录消息必须包含服务域名、一次性 nonce、签发时间和过期时间。', 'EIP-712 结构化数据应使用 useSignTypedData，而不是 useSignMessage。'],
  },
  {
    id: 'useVerifyMessage',
    category: '交易与签名',
    title: 'useVerifyMessage',
    kind: 'Query',
    summary: '验证 EIP-191 消息、签名和预期地址是否匹配，并兼容 EOA 与智能合约账户。',
    code: `// 验证时必须提供签名时完全相同的地址和消息
const verification = useVerifyMessage({
  address,
  message,
  signature,
  chainId: sepolia.id,
  query: {
    // 关闭自动查询，改为用户点击验证按钮后执行
    enabled: false,
    // 签名验证失败通常不是临时错误，不自动重试
    retry: false,
  },
})

async function handleVerify() {
  // refetch 返回本次查询结果，不需要等待 React 下一次渲染
  const result = await verification.refetch()
  console.log('签名是否有效', result.data)
}

// data 为 true 才表示这三项匹配
console.log(verification.data, verification.isFetching)`,
    parameters: [
      { name: 'address', type: 'Address', required: true, description: '预期的签名账户地址。' },
      { name: 'message', type: 'string | { raw: Hex | Uint8Array }', required: true, description: '签名时使用的原始消息，编码方式必须完全一致。' },
      { name: 'signature', type: 'Hex | ByteArray | Signature', required: true, description: '钱包返回的签名。' },
      { name: 'chainId', type: 'number', description: '验证智能合约账户签名时使用的链。' },
      { name: 'blockNumber / blockTag', type: 'bigint / BlockTag', description: '按特定链上状态验证智能合约账户。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data', type: 'boolean | undefined', description: '签名有效时为 true，无效时为 false。' },
      ...commonQueryReturns,
    ],
    notes: ['消息中的任意字符、换行或编码变化都会使验证失败。', '它兼容 EOA 及 ERC-6492 等智能合约账户签名，因此可能需要 RPC。', '登录认证应在后端验证并消费一次性 nonce，前端 true 不能独立建立可信会话。'],
  },
  {
    id: 'useSignTypedData',
    category: '交易与签名',
    title: 'useSignTypedData',
    kind: 'Mutation',
    summary: '按照 EIP-712 对具有 domain 和明确字段类型的结构化数据签名。',
    code: `// domain 把签名绑定到应用、版本和链，降低跨域与跨链重放风险
const domain = {
  name: 'wagmi lab',
  version: '1',
  chainId,
} as const

// types 描述每个字段的 Solidity 类型，钱包可以结构化展示
const types = {
  LearningMessage: [
    { name: 'wallet', type: 'address' },
    { name: 'statement', type: 'string' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const

// message 的字段必须与 primaryType 对应的定义完全一致
const message = {
  wallet: address,
  statement: 'Learn EIP-712 with wagmi',
  nonce: 1n,
}

const signTypedData = useSignTypedData({
  mutation: {
    // 签名需要用户明确确认，失败后不要自动再次弹窗
    retry: false,
    onSuccess(signature) {
      console.log('EIP-712 signature', signature)
    },
  },
})

// 必须由按钮点击触发，浏览器钱包通常调用 eth_signTypedData_v4
function handleSignTypedData() {
  signTypedData.mutate({
    domain,
    types,
    primaryType: 'LearningMessage',
    message,
  })
}

// 返回值同样是 Hex；应使用 useVerifyTypedData 或后端验证
console.log(signTypedData.data, signTypedData.status)`,
    parameters: [
      { name: 'domain', type: 'TypedDataDomain', required: true, description: '签名域，通常包含 name、version、chainId 和 verifyingContract。' },
      { name: 'types', type: 'TypedData', required: true, description: '结构名称及其字段名与 Solidity 类型定义。' },
      { name: 'primaryType', type: 'keyof types', required: true, description: '本次签名使用的根结构名称。' },
      { name: 'message', type: '按 types 推导的对象', required: true, description: '要签名的结构化业务数据。' },
      { name: 'account', type: 'Address', description: '签名账户；默认使用当前账户。' },
      { name: 'connector', type: 'Connector', description: '指定执行签名的钱包。' },
      ...commonMutationParameters,
    ],
    returns: [
      { name: 'data', type: 'Hex | undefined', description: '钱包返回的 EIP-712 签名字节。' },
      ...commonMutationReturns,
    ],
    notes: ['钱包通常通过 eth_signTypedData_v4 展示并签署结构化字段。', 'EIP-712 摘要为 keccak256(0x1901 || domainSeparator || hashStruct(message))。', 'EIP-712 在编码层面使用 EIP-191 的 0x01 版本封装，但与 personal_sign 的文本签名流程不同。', 'types、primaryType 或 message 任一字段变化都会产生不同摘要。', '验证 EIP-712 签名应使用 useVerifyTypedData 或后端 viem verifyTypedData。'],
  },
  {
    id: 'useVerifyTypedData',
    category: '交易与签名',
    title: 'useVerifyTypedData',
    kind: 'Query',
    summary: '验证 EIP-712 domain、types、message、签名和预期地址是否完全匹配。',
    code: `// 验证参数必须与 useSignTypedData 时的结构完全相同
const verification = useVerifyTypedData({
  address,
  domain: {
    name: 'wagmi lab',
    version: '1',
    chainId,
  },
  types,
  primaryType: 'LearningMessage',
  message,
  signature,
  query: {
    // 由验证按钮调用 refetch，避免签名一出现就自动查询
    enabled: false,
    retry: false,
  },
})

async function handleVerifyTypedData() {
  const result = await verification.refetch()
  console.log('EIP-712 签名是否有效', result.data)
}

console.log(verification.status, verification.isFetching)`,
    parameters: [
      { name: 'address', type: 'Address', required: true, description: '预期签署结构化数据的账户。' },
      { name: 'domain', type: 'TypedDataDomain', required: true, description: '签名域；必须与签名时的 name、version、chainId、verifyingContract 一致。' },
      { name: 'types', type: 'TypedData', required: true, description: '结构及字段类型定义。' },
      { name: 'primaryType', type: 'keyof types', required: true, description: '根消息类型名称。' },
      { name: 'message', type: '按 types 推导的对象', required: true, description: '签名时的结构化业务数据。' },
      { name: 'signature', type: 'Hex | ByteArray | Signature', required: true, description: 'EIP-712 签名。' },
      { name: 'chainId', type: 'number', description: '执行验证 RPC 的链。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data', type: 'boolean | undefined', description: '地址与完整 EIP-712 数据匹配时为 true。' },
      ...commonQueryReturns,
    ],
    notes: ['domain、types、primaryType 或 message 任一值变化都会导致验证失败。', 'domain.chainId 是签名内容的一部分，Hook 的 chainId 还决定使用哪条链的 Public Client。', '授权、Permit 和订单签名必须在后端或合约侧再次验证 nonce、过期时间与业务权限。'],
  },
  {
    id: 'useReadContract',
    category: '智能合约',
    title: 'useReadContract',
    kind: 'Query',
    summary: '调用合约的 pure 或 view 函数，不需要钱包签名，也不会消耗 Gas。',
    code: `// 调用 ERC-20 的只读函数，不需要连接钱包或支付 Gas
const tokenBalance = useReadContract({
  address: tokenAddress, // ERC-20 合约地址
  abi: erc20Abi, // ABI 决定可调用函数及 TypeScript 类型
  functionName: 'balanceOf', // 要执行的 view 函数
  args: [ownerAddress], // 参数顺序必须与 ABI 一致
  chainId: sepolia.id, // 合约所在网络
  query: {
    // 地址准备完成后才读取合约
    enabled: Boolean(ownerAddress),
    // 余额在 15 秒内视为新鲜数据
    staleTime: 15_000,
    // 回到页面时刷新已经过期的数据
    refetchOnWindowFocus: true,
  },
})

// isLoading 只表示第一次实际查询，isFetching 也包含后续刷新
console.log(tokenBalance.isLoading, tokenBalance.isFetching)
if (tokenBalance.isError) console.error(tokenBalance.error.message)

// 用户也可以主动刷新合约数据
// await tokenBalance.refetch()`,
    parameters: [
      { name: 'address', type: 'Address', required: true, description: '合约地址。' },
      { name: 'abi', type: 'Abi', required: true, description: '合约 ABI，决定函数、参数和返回类型。' },
      { name: 'functionName', type: 'string', required: true, description: '要调用的只读函数名。' },
      { name: 'args', type: 'readonly unknown[]', description: '按照 ABI 顺序传入的函数参数。' },
      { name: 'chainId', type: 'number', description: '合约部署所在网络。' },
      { name: 'account', type: 'Address', description: '模拟 msg.sender 时使用的账户地址。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data', type: 'ABI 推导类型', description: '合约函数返回值。' },
      ...commonQueryReturns,
    ],
    notes: ['ABI 使用 as const 后，TypeScript 可以推导 functionName、args 和 data。'],
  },
  {
    id: 'useReadContracts',
    category: '智能合约',
    title: 'useReadContracts',
    kind: 'Query',
    summary: '在一个查询中批量读取多个合约函数，尽可能通过 Multicall 减少 RPC 往返。',
    code: `// 相同 address 和 abi 可以先提取，避免每项重复书写
const tokenContract = {
  address: tokenAddress,
  abi: erc20Abi,
  chainId: mainnet.id,
} as const

const tokenInfo = useReadContracts({
  contracts: [
    // 返回值顺序与 contracts 数组顺序严格一致
    { ...tokenContract, functionName: 'name' },
    { ...tokenContract, functionName: 'symbol' },
    { ...tokenContract, functionName: 'decimals' },
    { ...tokenContract, functionName: 'balanceOf', args: [owner] },
  ],
  // 默认 true：单项失败不会让整个批次抛错
  allowFailure: true,
  query: {
    // owner 准备好后再读取包含 balanceOf 的批次
    enabled: Boolean(owner),
    staleTime: 30_000,
    retry: 1,
  },
})

// allowFailure: true 时每一项都有 status、result 或 error
console.log(tokenInfo.data?.[0]?.status, tokenInfo.data?.[0]?.result)`,
    parameters: [
      { name: 'contracts', type: 'readonly ContractFunctionParameters[]', required: true, description: '需要批量读取的合约、ABI、函数、参数和可选 chainId。' },
      { name: 'allowFailure', type: 'boolean', description: '默认 true，允许单项失败并在对应结果中返回 error。' },
      { name: 'batchSize', type: 'number', description: '每批 Multicall calldata 最大字节数；0 表示不按大小拆批。' },
      { name: 'chainId', type: 'number', description: '没有为单项指定链时使用的默认链。' },
      { name: 'blockNumber / blockTag', type: 'bigint / BlockTag', description: '从指定区块状态读取。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data', type: 'readonly Result[] | undefined', description: '与 contracts 相同顺序的结果数组。' },
      { name: 'data[n].status', type: 'success | failure', description: 'allowFailure 为 true 时的单项状态。' },
      { name: 'data[n].result', type: 'ABI 推导类型', description: '该合约函数成功时的返回值。' },
      { name: 'data[n].error', type: 'Error | undefined', description: '该项失败时的错误。' },
      ...commonQueryReturns,
    ],
    notes: ['批量结果按索引对应请求，不要按返回值猜测属于哪个函数。', 'allowFailure: false 时返回原始结果数组，但任一调用失败会使整个查询失败。', 'Multicall 能减少网络往返，但不会把不同区块状态或不同链强行合并成同一次执行。'],
  },
  {
    id: 'useSimulateContract',
    category: '智能合约',
    title: 'useSimulateContract',
    kind: 'Query',
    summary: '在真正写入前模拟合约调用，提前发现余额、授权和 revert 错误。',
    code: `// 写入前先用 eth_call 模拟执行，不会真正产生链上交易
const simulation = useSimulateContract({
  address: tokenAddress, // 目标 Token 合约
  abi: erc20Abi, // 提供 transfer 的参数和返回类型
  functionName: 'transfer', // 准备模拟的写函数
  // parseUnits 根据 Token 的 6 位 decimals 生成 bigint
  args: [recipient, parseUnits('1', 6)],
  // 指定调用者，模拟余额和权限检查时需要
  account: walletAddress,
  query: {
    // 必要参数准备好后才执行模拟
    enabled: Boolean(walletAddress && recipient),
    // 合约 revert 通常是确定性错误，不自动重复模拟
    retry: false,
    // 输入不变时，5 秒内复用成功结果
    staleTime: 5_000,
  },
})

// 正在重新模拟时仍可能保留上一次成功的 data
console.log(simulation.isFetching, simulation.isRefetching)
if (simulation.isError) console.error(simulation.error.message)

// 只有模拟成功后才会得到可交给写 Hook 的 request
const request = simulation.data?.request`,
    parameters: [
      { name: 'address / abi', type: 'Address / Abi', required: true, description: '目标合约和接口。' },
      { name: 'functionName / args', type: 'string / tuple', required: true, description: '写函数及参数。' },
      { name: 'account', type: 'Address', description: '以哪个账户身份模拟。' },
      { name: 'value', type: 'bigint', description: '调用时附带的原生币。' },
      { name: 'chainId', type: 'number', description: '合约部署所在网络。' },
      ...commonQueryParameters,
    ],
    returns: [
      { name: 'data.request', type: 'WriteContractParameters', description: '验证通过、可交给写 Hook 的请求。' },
      { name: 'data.result', type: 'ABI 推导类型', description: '模拟执行时合约函数返回的结果。' },
      ...commonQueryReturns,
    ],
    notes: ['模拟成功不能保证未来一定成功，因为链上状态可能变化。'],
  },
  {
    id: 'useWriteContract',
    category: '智能合约',
    title: 'useWriteContract',
    kind: 'Mutation',
    summary: '请求钱包签名并广播合约写入交易，推荐与 useSimulateContract 配合。',
    code: `// 第一步：模拟写入，提前捕获合约 revert
const simulation = useSimulateContract({
  address,
  abi,
  functionName: 'transfer',
  args: [recipient, amount],
  query: {
    // 参数完整后才模拟，避免无效 RPC 请求
    enabled: Boolean(recipient),
  },
})
// 第二步：创建真正发送写入交易的 Mutation
const write = useWriteContract({
  mutation: {
    // 钱包拒绝后不应自动再次弹出签名窗口
    retry: false,
    onSuccess(hash) {
      console.log('合约交易已广播', hash)
    },
    onError(error) {
      console.error(error.message)
    },
  },
})

// 只有模拟成功且钱包空闲时才能提交
<button
  disabled={!simulation.data?.request || write.isPending}
  onClick={() => {
    // request 是模拟验证过、包含完整类型的交易请求
    if (simulation.data?.request)
      write.mutate(simulation.data.request)
  }}
>
  发送 Token
</button>

// status 和 error 用于渲染本次写入的完整状态
console.log(write.status, write.isSuccess, write.error)
// reset 不会取消已经提交到链上的交易
// write.reset()`,
    parameters: [
      { name: 'address / abi', type: 'Address / Abi', required: true, description: '目标合约和 ABI。' },
      { name: 'functionName / args', type: 'string / tuple', required: true, description: '写函数及参数。' },
      { name: 'value', type: 'bigint', description: '调用 payable 函数时附带的原生币。' },
      { name: 'chainId', type: 'number', description: '交易目标网络。' },
      ...commonMutationParameters,
    ],
    returns: [
      { name: 'data', type: 'Hash | undefined', description: '广播后的交易 Hash。' },
      ...commonMutationReturns,
    ],
    notes: ['写入后继续使用 useWaitForTransactionReceipt 判断最终状态。'],
  },
  {
    id: 'useWatchContractEvent',
    category: '智能合约',
    title: 'useWatchContractEvent',
    kind: 'Watcher',
    summary: '订阅指定合约事件，并在新日志出现时执行回调。',
    code: `// 组件挂载时开始监听，卸载时 wagmi 会自动取消订阅
useWatchContractEvent({
  address: tokenAddress, // 要监听的 Token 合约
  abi: erc20Abi, // 用于解析日志和推导事件类型
  eventName: 'Transfer', // 只接收 Transfer 事件
  chainId: sepolia.id, // 监听合约所在网络
  // 每次检测到新的匹配日志时执行
  onLogs(logs) {
    console.log('新的 Transfer 日志', logs)
  },
})`,
    parameters: [
      { name: 'address / abi', type: 'Address / Abi', required: true, description: '需要监听的合约和 ABI。' },
      { name: 'eventName', type: 'string', required: true, description: 'ABI 中定义的事件名称。' },
      { name: 'args', type: 'object', description: '按 indexed 参数过滤日志。' },
      { name: 'onLogs', type: '(logs) => void', required: true, description: '收到新日志时执行的回调。' },
      { name: 'enabled', type: 'boolean', description: '是否开启监听。' },
    ],
    returns: [],
    notes: ['WebSocket RPC 更适合实时监听；HTTP 通常通过轮询实现。', '回调可能收到重复日志，业务处理需要幂等。'],
  },
  {
    id: 'Actions',
    category: 'Miscellaneous',
    title: 'Actions',
    kind: 'Action',
    summary: '在事件处理器、服务层或 React 之外直接调用 wagmi Core Action，执行一次命令式链上操作。',
    code: `// React 组件中可通过 useConfig 取得 Core Action 所需的 Config
import { useConfig } from 'wagmi'
import { getBalance } from 'wagmi/actions'
import { sepolia } from 'wagmi/chains'
import { formatUnits, type Address } from 'viem'

const config = useConfig()

async function handleReadBalance(address: Address) {
  // Action 的第一个参数始终是 wagmi Config
  const balance = await getBalance(config, {
    address,
    chainId: sepolia.id,
  })

  // Action 直接返回 Promise，不提供 React 查询缓存和状态字段
  return formatUnits(balance.value, balance.decimals)
}

// 点击时执行一次读取，由调用方自行处理 loading 和 error
// const text = await handleReadBalance(address)`,
    parameters: [
      { name: 'config', type: 'Config', required: true, description: 'createConfig 创建的配置，是所有 Core Action 的第一个参数。' },
      { name: 'parameters', type: 'ActionParameters', description: '每个 Action 自己的参数，例如 address、chainId 或交易数据。' },
    ],
    returns: [
      { name: 'result', type: 'Promise<ActionReturnType>', description: '一次调用的异步结果，不包含 Query 状态或缓存。' },
    ],
    notes: ['Actions 从 wagmi/actions 导入，适合事件处理器、普通 TypeScript 模块和 React 之外的逻辑。', 'Hooks 通常在 Actions 之上增加订阅、TanStack Query 缓存或 Mutation 生命周期。', '不要在组件渲染期间直接调用异步 Action；放在事件处理器或 Effect 中并处理竞态与卸载。'],
  },
  {
    id: 'Errors',
    category: 'Miscellaneous',
    title: 'Errors',
    kind: 'Utility',
    summary: '识别钱包拒绝、连接器能力和 Provider 配置错误，并向界面输出简洁但可诊断的信息。',
    code: `// 具体错误类比比较 message 文本更稳定
import {
  SwitchChainNotSupportedError,
  WagmiProviderNotFoundError,
} from 'wagmi'

function getErrorText(error: unknown) {
  // Provider 缺失通常代表组件树配置错误
  if (error instanceof WagmiProviderNotFoundError)
    return '组件必须放在 WagmiProvider 内部'

  // 某些 Connector 根本不实现切链能力
  if (error instanceof SwitchChainNotSupportedError)
    return '当前钱包不支持由 DApp 切换网络'

  // wagmi、Core 和 viem 的详细错误通常提供 shortMessage
  if (
    error instanceof Error &&
    'shortMessage' in error &&
    typeof error.shortMessage === 'string'
  ) return error.shortMessage

  // 最后回退到标准 Error，未知值不得直接假定为 Error
  return error instanceof Error ? error.message : '未知错误'
}

// Mutation 和 Query 的 error 都可通过同一个函数转成界面文本
// const message = getErrorText(transaction.error)`,
    parameters: [
      { name: 'error', type: 'unknown', required: true, description: 'catch 捕获值或跨层传入值应先按 unknown 处理。' },
    ],
    returns: [
      { name: 'name', type: 'string', description: '错误类型名称。' },
      { name: 'shortMessage', type: 'string', description: '部分 wagmi、Core 或 viem 错误提供的简洁用户可读原因。' },
      { name: 'message', type: 'string', description: '包含上下文、版本或元数据的完整错误消息。' },
      { name: 'details', type: 'string', description: '部分 BaseError 提供的底层错误详情。' },
      { name: 'cause', type: 'unknown', description: '原始底层错误；可用于进一步分类和日志记录。' },
    ],
    notes: ['用户拒绝钱包请求是正常业务分支，不应当作不可恢复崩溃。', '展示给用户优先使用 shortMessage，诊断日志可以保留完整 message 和 cause。', '不要依赖完整 message 字符串做业务判断，优先使用具体错误类或错误码。'],
  },
  {
    id: 'serialize',
    category: 'Miscellaneous',
    title: 'serialize',
    kind: 'Utility',
    summary: '把包含 bigint 或 Map 的 wagmi 数据编码为字符串，避免 JSON.stringify 无法处理 bigint。',
    code: `// wagmi serialize 能处理 bigint 和 Map，适合客户端缓存或调试
import { serialize } from 'wagmi'

const state = {
  balance: 1234567890123456789n,
  labels: new Map([[1, 'Ethereum']]),
}

// 原生 JSON.stringify(state) 会因为 bigint 抛出 TypeError
const text = serialize(state)
localStorage.setItem('learning-state', text)

// 序列化结果是字符串；金额不会经过 number，因此不会损失精度
console.log(text)`,
    parameters: [
      { name: 'value', type: 'unknown', required: true, description: '需要编码的 JavaScript 值。' },
      { name: 'replacer', type: '(key, value) => unknown', description: '在默认 bigint 和 Map 转换之后进一步替换值。' },
      { name: 'indent', type: 'number', description: 'JSON 缩进空格数，主要用于调试输出。' },
      { name: 'circularReplacer', type: '(key, value, referenceKey) => unknown', description: '发现循环引用时的自定义替换函数。' },
    ],
    returns: [
      { name: 'text', type: 'string', description: '可存储或传输的 JSON 字符串。' },
    ],
    notes: ['serialize 保留 bigint 的十进制值，不会产生科学计数法或 number 精度损失。', '反序列化必须使用对应的 deserialize，不能只用 JSON.parse。', '循环引用默认被编码为引用标记字符串，不会自动恢复成原始对象环。'],
  },
  {
    id: 'deserialize',
    category: 'Miscellaneous',
    title: 'deserialize',
    kind: 'Utility',
    summary: '把 serialize 生成的字符串恢复为 JavaScript 值，并还原其中的 bigint 和 Map。',
    code: `// deserialize 与 wagmi serialize 成对使用
import { deserialize } from 'wagmi'

const text = localStorage.getItem('learning-state')

if (text) {
  // 泛型只描述期望类型，不会验证外部字符串是否可信
  const state = deserialize<{
    balance: bigint
    labels: Map<number, string>
  }>(text)

  // balance 恢复后仍是 bigint，可以继续进行精确整数运算
  console.log(typeof state.balance) // bigint
  console.log(state.labels.get(1)) // Ethereum
}`,
    parameters: [
      { name: 'value', type: 'string', required: true, description: '由 serialize 生成的字符串。' },
      { name: 'reviver', type: '(key, value) => unknown', description: '在默认 bigint 和 Map 恢复之后进一步转换值。' },
    ],
    returns: [
      { name: 'value', type: 'T', description: '恢复后的 JavaScript 值；泛型 T 仅用于 TypeScript 描述。' },
    ],
    notes: ['deserialize 的泛型不会执行运行时校验，外部或用户可控数据仍需 Schema 验证。', '无效 JSON 会抛出错误，读取持久化数据时应使用 try/catch。', '来自 Go API 的链上整数通常仍建议定义为十进制字符串，再显式调用 BigInt。'],
  },
  {
    id: 'version',
    category: 'Miscellaneous',
    title: 'version',
    kind: 'Utility',
    summary: '读取当前打包进应用的 wagmi 版本，便于调试依赖差异和提交诊断信息。',
    code: `// version 是构建时确定的只读字符串，不会发起请求
import { version } from 'wagmi'

// 本项目当前输出 3.7.7
console.log('wagmi version:', version)

// 可以把版本附在错误日志中，帮助定位 API 行为差异
const diagnostic = {
  library: 'wagmi',
  version,
}`,
    parameters: [],
    returns: [
      { name: 'version', type: 'string', description: '当前 wagmi 包的语义化版本字符串。' },
    ],
    notes: ['不要用运行时 version 分支长期兼容多个主版本；升级时应更新代码和课程。', '页面显示版本应与实际打包依赖一致，不能只依赖 package.json 范围字符串。'],
  },
]

export function getLesson(id: string | undefined) {
  return lessons.find((lesson) => lesson.id === id) ?? lessons[0]
}
