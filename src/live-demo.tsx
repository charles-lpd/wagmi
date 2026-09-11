import { useCallback, useState } from 'react'
import {
  useBalance,
  useBlock,
  useBytecode,
  useChainId,
  useChains,
  useClient,
  useConnect,
  useConnection,
  useConnectionEffect,
  useConnections,
  useConnectorClient,
  useConnectors,
  useConfig,
  useDisconnect,
  useEnsAddress,
  useEnsName,
  useEstimateFeesPerGas,
  useEstimateGas,
  useGasPrice,
  usePublicClient,
  usePrepareTransactionRequest,
  useReconnect,
  useSignMessage,
  useSignTypedData,
  useSwitchChain,
  useSwitchConnection,
  useTransactionCount,
  useVerifyMessage,
  useVerifyTypedData,
  useWalletClient,
  useWatchBlockNumber,
} from 'wagmi'
import type { UseConnectionEffectParameters } from 'wagmi'
import { formatUnits, zeroAddress } from 'viem'
import { mainnet } from 'wagmi/chains'
import { SendTransactionPanel } from './send-transaction-panel.tsx'
import { SepoliaTransactionExercise } from './sepolia-transaction-exercise.tsx'

interface LiveDemoProps {
  lessonId: string
}

const defaultSigningMessage = `wagmi 学习演示
用途：演示 EIP-191 personal_sign
本签名不授权任何交易`

const learningMessageTypes = {
  LearningMessage: [
    { name: 'wallet', type: 'address' },
    { name: 'statement', type: 'string' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const

const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function ConnectionDemo() {
  const connection = useConnection()

  return (
    <div className="demo-card">
      <dl className="demo-details">
        <div><dt>status</dt><dd>{connection.status}</dd></div>
        <div><dt>address</dt><dd>{connection.address ? shortAddress(connection.address) : 'undefined'}</dd></div>
        <div><dt>chainId</dt><dd>{connection.chainId ?? 'undefined'}</dd></div>
        <div><dt>connector</dt><dd>{connection.connector?.name ?? 'undefined'}</dd></div>
      </dl>
    </div>
  )
}

function ConnectionsDemo() {
  const connections = useConnections()

  return (
    <div className="demo-card demo-stack">
      <dl className="demo-details">
        <div><dt>连接数量</dt><dd>{connections.length}</dd></div>
        <div><dt>状态来源</dt><dd>Config Store</dd></div>
      </dl>
      {connections.map((connection) => (
        <dl className="demo-details connection-item" key={connection.connector.uid}>
          <div><dt>connector</dt><dd>{connection.connector.name}</dd></div>
          <div><dt>chainId</dt><dd>{connection.chainId}</dd></div>
          <div><dt>account</dt><dd>{shortAddress(connection.accounts[0])}</dd></div>
          <div><dt>accounts</dt><dd>{connection.accounts.length}</dd></div>
        </dl>
      ))}
      {connections.length === 0 ? <p className="demo-empty">当前没有活动连接</p> : null}
    </div>
  )
}

function WalletDemo() {
  const connection = useConnection()
  const connectors = useConnectors()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const error = connect.error ?? disconnect.error

  return (
    <div className="demo-card demo-stack">
      {connection.isConnected ? (
        <button className="button button--secondary" type="button" disabled={disconnect.isPending} onClick={() => disconnect.mutate()}>
          {disconnect.isPending ? '断开中...' : '断开钱包'}
        </button>
      ) : connectors.map((connector) => (
        <button className="button button--primary" type="button" key={connector.uid} disabled={connect.isPending} onClick={() => connect.mutate({ connector })}>
          {connect.isPending ? '连接中...' : `连接 ${connector.name}`}
        </button>
      ))}
      {error ? <p className="inline-error" role="alert">{error.message}</p> : null}
    </div>
  )
}

function ReconnectDemo() {
  const connection = useConnection()
  const reconnect = useReconnect({
    mutation: {
      retry: false,
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>连接状态</dt><dd>{connection.status}</dd></div>
        <div><dt>恢复数量</dt><dd>{reconnect.data?.length ?? '--'}</dd></div>
        <div><dt>Mutation</dt><dd>{reconnect.status}</dd></div>
        <div><dt>Connector</dt><dd>{connection.connector?.name ?? 'undefined'}</dd></div>
      </dl>
      <button
        className="button button--primary"
        type="button"
        disabled={connection.isConnected || reconnect.isPending}
        onClick={() => reconnect.mutate()}
      >
        {connection.isConnected ? '钱包已经连接' : reconnect.isPending ? '恢复中...' : '尝试恢复连接'}
      </button>
      {reconnect.error ? <p className="inline-error" role="alert">{reconnect.error.message}</p> : null}
    </div>
  )
}

function SwitchConnectionDemo() {
  const current = useConnection()
  const connections = useConnections()
  const switchConnection = useSwitchConnection({
    mutation: {
      retry: false,
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>活动 Connector</dt><dd>{current.connector?.name ?? 'undefined'}</dd></div>
        <div><dt>连接数量</dt><dd>{connections.length}</dd></div>
      </dl>
      {connections.map((connection) => (
        <button
          className="chain-button"
          type="button"
          key={connection.connector.uid}
          disabled={current.connector?.uid === connection.connector.uid || switchConnection.isPending}
          onClick={() => switchConnection.mutate({ connector: connection.connector })}
        >
          <span>{connection.connector.name}</span>
          <code>{shortAddress(connection.accounts[0])}</code>
        </button>
      ))}
      {connections.length === 0 ? <p className="demo-empty">当前没有可切换的活动连接</p> : null}
      {switchConnection.error ? <p className="inline-error" role="alert">{switchConnection.error.message}</p> : null}
    </div>
  )
}

function ConfigDemo() {
  const config = useConfig()

  return (
    <div className="demo-card">
      <dl className="demo-details">
        <div><dt>chains</dt><dd>{config.chains.length}</dd></div>
        <div><dt>connectors</dt><dd>{config.connectors.length}</dd></div>
        <div><dt>storage.key</dt><dd>{config.storage?.key ?? 'null'}</dd></div>
        <div><dt>state.status</dt><dd>{config.state.status}</dd></div>
      </dl>
    </div>
  )
}

function ChainIdDemo() {
  const chainId = useChainId()
  const chains = useChains()
  const chain = chains.find((item) => item.id === chainId)

  return (
    <div className="demo-card">
      <dl className="demo-details">
        <div><dt>chainId</dt><dd>{chainId}</dd></div>
        <div><dt>chain.name</dt><dd>{chain?.name ?? '未配置'}</dd></div>
        <div><dt>nativeCurrency</dt><dd>{chain?.nativeCurrency.symbol ?? '--'}</dd></div>
        <div><dt>testnet</dt><dd>{chain?.testnet ? 'true' : 'false'}</dd></div>
      </dl>
    </div>
  )
}

interface ClientDemoProps {
  publicActions?: boolean
}

function ClientDemo({ publicActions = false }: ClientDemoProps) {
  const client = useClient()
  const publicClient = usePublicClient()
  const activeClient = publicActions ? publicClient : client

  return (
    <div className="demo-card">
      <dl className="demo-details">
        <div><dt>client type</dt><dd>{publicActions ? 'PublicClient' : 'Client'}</dd></div>
        <div><dt>chain</dt><dd>{activeClient?.chain?.name ?? 'undefined'}</dd></div>
        <div><dt>chainId</dt><dd>{activeClient?.chain?.id ?? 'undefined'}</dd></div>
        <div><dt>transport</dt><dd>{activeClient?.transport.type ?? 'undefined'}</dd></div>
      </dl>
    </div>
  )
}

function WalletClientDemo() {
  const connection = useConnection()
  const walletClient = useWalletClient({
    query: {
      enabled: connection.isConnected,
      retry: false,
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>status</dt><dd>{walletClient.status}</dd></div>
        <div><dt>fetchStatus</dt><dd>{walletClient.fetchStatus}</dd></div>
        <div><dt>account</dt><dd>{walletClient.data?.account ? shortAddress(walletClient.data.account.address) : 'undefined'}</dd></div>
        <div><dt>chain</dt><dd>{walletClient.data?.chain?.name ?? 'undefined'}</dd></div>
      </dl>
      {walletClient.error ? <p className="inline-error" role="alert">{walletClient.error.message}</p> : null}
    </div>
  )
}

function ConnectorClientDemo() {
  const connection = useConnection()
  const connectorClient = useConnectorClient({
    query: {
      enabled: connection.isConnected,
      retry: false,
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>status</dt><dd>{connectorClient.status}</dd></div>
        <div><dt>fetchStatus</dt><dd>{connectorClient.fetchStatus}</dd></div>
        <div><dt>account</dt><dd>{connectorClient.data?.account ? shortAddress(connectorClient.data.account.address) : 'undefined'}</dd></div>
        <div><dt>transport</dt><dd>{connectorClient.data?.transport.type ?? 'undefined'}</dd></div>
      </dl>
      {connectorClient.error ? <p className="inline-error" role="alert">{connectorClient.error.message}</p> : null}
    </div>
  )
}

function ConnectionEffectDemo() {
  const connection = useConnection()
  const connectors = useConnectors()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const [lastEvent, setLastEvent] = useState('尚未发生连接事件')

  const handleConnect = useCallback<NonNullable<UseConnectionEffectParameters['onConnect']>>((data) => {
    const mode = data.isReconnected ? '自动恢复连接' : '新连接'
    setLastEvent(`${mode}: ${shortAddress(data.address)}`)
  }, [])
  const handleDisconnect = useCallback(() => {
    setLastEvent('连接已断开')
  }, [])

  useConnectionEffect({
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
  })

  const error = connect.error ?? disconnect.error

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>当前状态</dt><dd>{connection.status}</dd></div>
        <div><dt>最近事件</dt><dd title={lastEvent}>{lastEvent}</dd></div>
      </dl>
      {connection.isConnected ? (
        <button className="button button--secondary" type="button" disabled={disconnect.isPending} onClick={() => disconnect.mutate()}>
          {disconnect.isPending ? '断开中...' : '触发断开事件'}
        </button>
      ) : connectors.map((connector) => (
        <button className="button button--primary" type="button" key={connector.uid} disabled={connect.isPending} onClick={() => connect.mutate({ connector })}>
          {connect.isPending ? '连接中...' : `连接 ${connector.name}`}
        </button>
      ))}
      {error ? <p className="inline-error" role="alert">{error.message}</p> : null}
    </div>
  )
}

function ChainsDemo() {
  const connection = useConnection()
  const chains = useChains()
  const switchChain = useSwitchChain()

  return (
    <div className="demo-card demo-stack">
      {chains.map((chain) => (
        <button
          className="chain-button"
          type="button"
          key={chain.id}
          disabled={!connection.isConnected || connection.chainId === chain.id || switchChain.isPending}
          onClick={() => switchChain.mutate({ chainId: chain.id })}
        >
          <span>{chain.name}</span><code>{chain.id}</code>
        </button>
      ))}
      {switchChain.error ? <p className="inline-error" role="alert">{switchChain.error.message}</p> : null}
    </div>
  )
}

function BlockDemo() {
  const chainId = useChainId()
  const chains = useChains()
  const block = useBlock({
    chainId,
    blockTag: 'latest',
    includeTransactions: false,
    query: {
      staleTime: 5_000,
      retry: 2,
    },
  })
  const chain = chains.find((item) => item.id === chainId)

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>chain</dt><dd>{chain?.name ?? chainId}</dd></div>
        <div><dt>status</dt><dd>{block.status}</dd></div>
        <div><dt>number</dt><dd>{block.data?.number?.toString() ?? '--'}</dd></div>
        <div><dt>transactions</dt><dd>{block.data?.transactions.length ?? '--'}</dd></div>
        <div><dt>timestamp</dt><dd>{block.data?.timestamp.toString() ?? '--'}</dd></div>
        <div><dt>hash</dt><dd>{block.data?.hash ? shortAddress(block.data.hash) : '--'}</dd></div>
      </dl>
      <button className="button button--secondary" type="button" disabled={block.isFetching} onClick={() => void block.refetch()}>
        {block.isFetching ? '查询中...' : '刷新最新区块'}
      </button>
      {block.error ? <p className="inline-error" role="alert">{block.error.message}</p> : null}
    </div>
  )
}

function TransactionCountDemo() {
  const connection = useConnection()
  const transactionCount = useTransactionCount({
    address: connection.address,
    blockTag: 'pending',
    query: {
      enabled: connection.isConnected,
      staleTime: 5_000,
      retry: 1,
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>account</dt><dd>{connection.address ? shortAddress(connection.address) : 'undefined'}</dd></div>
        <div><dt>blockTag</dt><dd>pending</dd></div>
        <div><dt>Nonce</dt><dd>{transactionCount.data ?? '--'}</dd></div>
        <div><dt>status</dt><dd>{transactionCount.status}</dd></div>
      </dl>
      <button className="button button--secondary" type="button" disabled={!connection.isConnected || transactionCount.isFetching} onClick={() => void transactionCount.refetch()}>
        {!connection.isConnected ? '请先连接钱包' : transactionCount.isFetching ? '查询中...' : '刷新 Nonce'}
      </button>
      {transactionCount.error ? <p className="inline-error" role="alert">{transactionCount.error.message}</p> : null}
    </div>
  )
}

function BytecodeDemo() {
  const bytecode = useBytecode({
    address: wethAddress,
    chainId: mainnet.id,
    query: {
      staleTime: Infinity,
      retry: 2,
    },
  })
  const byteLength = bytecode.data ? (bytecode.data.length - 2) / 2 : undefined

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>contract</dt><dd>WETH</dd></div>
        <div><dt>chain</dt><dd>Ethereum</dd></div>
        <div><dt>byte length</dt><dd>{byteLength ?? '--'}</dd></div>
        <div><dt>has bytecode</dt><dd>{bytecode.data ? 'true' : bytecode.isSuccess ? 'false' : '--'}</dd></div>
      </dl>
      <div className="signature-output">
        <span>runtime bytecode</span>
        <code>{bytecode.data ? `${bytecode.data.slice(0, 42)}...` : '--'}</code>
      </div>
      {bytecode.error ? <p className="inline-error" role="alert">{bytecode.error.message}</p> : null}
    </div>
  )
}

function PrepareTransactionDemo() {
  const connection = useConnection()
  const prepared = usePrepareTransactionRequest({
    account: connection.address,
    to: connection.address,
    value: 0n,
    query: {
      enabled: connection.isConnected,
      staleTime: 5_000,
      retry: false,
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>请求</dt><dd>0 ETH 转给自己</dd></div>
        <div><dt>status</dt><dd>{prepared.status}</dd></div>
        <div><dt>gas</dt><dd>{prepared.data?.gas?.toString() ?? '--'}</dd></div>
        <div><dt>nonce</dt><dd>{prepared.data?.nonce ?? '--'}</dd></div>
        <div><dt>type</dt><dd>{prepared.data?.type ?? '--'}</dd></div>
        <div><dt>是否广播</dt><dd>否</dd></div>
      </dl>
      <button className="button button--secondary" type="button" disabled={!connection.isConnected || prepared.isFetching} onClick={() => void prepared.refetch()}>
        {!connection.isConnected ? '请先连接钱包' : prepared.isFetching ? '准备中...' : '重新准备交易'}
      </button>
      {prepared.error ? <p className="inline-error" role="alert">{prepared.error.message}</p> : null}
    </div>
  )
}

function WatchBlockNumberDemo() {
  const chainId = useChainId()
  const chains = useChains()
  const [latestBlock, setLatestBlock] = useState<bigint>()
  const [previousBlock, setPreviousBlock] = useState<bigint>()
  const [watchError, setWatchError] = useState<string>()
  const chain = chains.find((item) => item.id === chainId)

  useWatchBlockNumber({
    chainId,
    poll: true,
    pollingInterval: 12_000,
    emitOnBegin: true,
    emitMissed: true,
    onBlockNumber(blockNumber, previousBlockNumber) {
      setLatestBlock(blockNumber)
      setPreviousBlock(previousBlockNumber)
      setWatchError(undefined)
    },
    onError(error) {
      setWatchError(error.message)
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>chain</dt><dd>{chain?.name ?? chainId}</dd></div>
        <div><dt>mode</dt><dd>poll / 12s</dd></div>
        <div><dt>latest</dt><dd>{latestBlock?.toString() ?? '等待新区块...'}</dd></div>
        <div><dt>previous</dt><dd>{previousBlock?.toString() ?? '--'}</dd></div>
      </dl>
      {watchError ? <p className="inline-error" role="alert">{watchError}</p> : null}
    </div>
  )
}

function EnsNameDemo() {
  const ensName = useEnsName({
    address: vitalikAddress,
    chainId: mainnet.id,
    query: {
      staleTime: 5 * 60_000,
      retry: 2,
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>address</dt><dd>{shortAddress(vitalikAddress)}</dd></div>
        <div><dt>chain</dt><dd>Ethereum</dd></div>
        <div><dt>ENS name</dt><dd>{ensName.data ?? (ensName.isFetching ? '查询中...' : 'null')}</dd></div>
        <div><dt>status</dt><dd>{ensName.status}</dd></div>
      </dl>
      {ensName.error ? <p className="inline-error" role="alert">{ensName.error.message}</p> : null}
    </div>
  )
}

function EnsAddressDemo() {
  const ensAddress = useEnsAddress({
    name: 'vitalik.eth',
    chainId: mainnet.id,
    query: {
      staleTime: 5 * 60_000,
      retry: 2,
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>ENS name</dt><dd>vitalik.eth</dd></div>
        <div><dt>chain</dt><dd>Ethereum</dd></div>
        <div><dt>address</dt><dd>{ensAddress.data ? shortAddress(ensAddress.data) : ensAddress.isFetching ? '查询中...' : 'null'}</dd></div>
        <div><dt>status</dt><dd>{ensAddress.status}</dd></div>
      </dl>
      {ensAddress.error ? <p className="inline-error" role="alert">{ensAddress.error.message}</p> : null}
    </div>
  )
}

function BalanceDemo() {
  const connection = useConnection()
  const balance = useBalance({
    address: connection.address,
    query: {
      enabled: false,
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  })

  return (
    <div className="demo-card balance-demo" aria-live="polite">
      <span>{connection.chain?.name ?? '未连接钱包'}</span>
      <span>status: {balance.status} / fetchStatus: {balance.fetchStatus}</span>
      <strong>
        {!connection.isConnected
          ? '--'
          : balance.data
            ? `${formatUnits(balance.data.value, balance.data.decimals)} ${balance.data.symbol}`
            : '--'}
      </strong>
      <button
        className="button button--primary"
        type="button"
        disabled={!connection.isConnected || balance.isFetching}
        onClick={() => void balance.refetch()}
      >
        {balance.isFetching ? '查询中...' : '查询当前余额'}
      </button>
      {balance.error ? <p className="inline-error" role="alert">{balance.error.message}</p> : null}
    </div>
  )
}

function GasPriceDemo() {
  const chainId = useChainId()
  const chains = useChains()
  const gasPrice = useGasPrice({
    chainId,
    query: {
      staleTime: 10_000,
      refetchInterval: 15_000,
      retry: 2,
    },
  })
  const chain = chains.find((item) => item.id === chainId)

  return (
    <div className="demo-card balance-demo" aria-live="polite">
      <span>{chain?.name ?? `chain ${chainId}`}</span>
      <span>status: {gasPrice.status} / fetchStatus: {gasPrice.fetchStatus}</span>
      <strong>{gasPrice.data ? `${formatUnits(gasPrice.data, 9)} Gwei` : '--'}</strong>
      <button
        className="button button--secondary"
        type="button"
        disabled={gasPrice.isFetching}
        onClick={() => void gasPrice.refetch()}
      >
        {gasPrice.isFetching ? '查询中...' : '刷新 Gas Price'}
      </button>
      {gasPrice.error ? <p className="inline-error" role="alert">{gasPrice.error.message}</p> : null}
    </div>
  )
}

function EstimateFeesDemo() {
  const chainId = useChainId()
  const chains = useChains()
  const fees = useEstimateFeesPerGas({
    chainId,
    type: 'eip1559',
    query: {
      staleTime: 10_000,
      retry: 2,
    },
  })
  const chain = chains.find((item) => item.id === chainId)

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>chain</dt><dd>{chain?.name ?? chainId}</dd></div>
        <div><dt>status</dt><dd>{fees.status}</dd></div>
        <div><dt>maxFeePerGas</dt><dd>{fees.data ? `${formatUnits(fees.data.maxFeePerGas, 9)} Gwei` : '--'}</dd></div>
        <div><dt>maxPriorityFeePerGas</dt><dd>{fees.data ? `${formatUnits(fees.data.maxPriorityFeePerGas, 9)} Gwei` : '--'}</dd></div>
      </dl>
      <button className="button button--secondary" type="button" disabled={fees.isFetching} onClick={() => void fees.refetch()}>
        {fees.isFetching ? '估算中...' : '重新估算费用'}
      </button>
      {fees.error ? <p className="inline-error" role="alert">{fees.error.message}</p> : null}
    </div>
  )
}

function EstimateGasDemo() {
  const connection = useConnection()
  const estimate = useEstimateGas({
    account: connection.address,
    to: connection.address,
    value: 0n,
    query: {
      enabled: connection.isConnected,
      staleTime: 10_000,
      retry: false,
    },
  })

  return (
    <div className="demo-card demo-stack" aria-live="polite">
      <dl className="demo-details">
        <div><dt>模拟交易</dt><dd>0 ETH 转给自己</dd></div>
        <div><dt>status</dt><dd>{estimate.status}</dd></div>
        <div><dt>Gas Limit</dt><dd>{estimate.data?.toString() ?? '--'}</dd></div>
        <div><dt>是否广播</dt><dd>否</dd></div>
      </dl>
      <button className="button button--secondary" type="button" disabled={!connection.isConnected || estimate.isFetching} onClick={() => void estimate.refetch()}>
        {!connection.isConnected ? '请先连接钱包' : estimate.isFetching ? '估算中...' : '重新估算 Gas Limit'}
      </button>
      {estimate.error ? <p className="inline-error" role="alert">{estimate.error.message}</p> : null}
    </div>
  )
}

function SignMessageDemo() {
  const [message, setMessage] = useState(defaultSigningMessage)
  const connection = useConnection()
  const signMessage = useSignMessage({
    mutation: {
      retry: false,
    },
  })
  const verification = useVerifyMessage({
    address: connection.address,
    chainId: connection.chainId,
    message,
    signature: signMessage.data,
    query: {
      enabled: false,
    },
  })
  const signatureByteLength = signMessage.data
    ? (signMessage.data.length - 2) / 2
    : undefined
  const error = signMessage.error ?? verification.error

  return (
    <div className="demo-card demo-stack">
      <label className="sign-message-field">
        <span>待签名消息</span>
        <textarea
          value={message}
          spellCheck={false}
          onChange={(event) => {
            setMessage(event.target.value)
            signMessage.reset()
          }}
        />
      </label>

      <button
        className="button button--primary"
        type="button"
        disabled={!connection.isConnected || !message.trim() || signMessage.isPending}
        onClick={() => signMessage.mutate({ message })}
      >
        {!connection.isConnected
          ? '请先连接钱包'
          : signMessage.isPending
            ? '请在钱包中确认...'
            : '签名消息'}
      </button>

      <button
        className="button button--secondary"
        type="button"
        disabled={!connection.isConnected || !signMessage.data || verification.isFetching}
        onClick={() => void verification.refetch()}
      >
        {verification.isFetching ? '验证中...' : '验证签名'}
      </button>

      <dl className="demo-details">
        <div><dt>签名协议</dt><dd>EIP-191 / personal_sign</dd></div>
        <div><dt>Mutation 状态</dt><dd>{signMessage.status}</dd></div>
        <div><dt>返回格式</dt><dd>0x-prefixed Hex</dd></div>
        <div><dt>签名字节数</dt><dd>{signatureByteLength ?? '--'}</dd></div>
        <div>
          <dt>验证结果</dt>
          <dd>
            {verification.isFetching
              ? '验证中...'
              : verification.data === true
                ? '通过'
                : verification.data === false
                  ? '未通过'
                  : '--'}
          </dd>
        </div>
      </dl>

      {signMessage.data ? (
        <div className="signature-output">
          <span>signature</span>
          <code>{signMessage.data}</code>
        </div>
      ) : null}

      {error ? <p className="inline-error" role="alert">{error.message}</p> : null}
    </div>
  )
}

function SignTypedDataDemo() {
  const connection = useConnection()
  const signTypedData = useSignTypedData({
    mutation: {
      retry: false,
    },
  })
  const signatureByteLength = signTypedData.data
    ? (signTypedData.data.length - 2) / 2
    : undefined
  const verification = useVerifyTypedData({
    address: connection.address,
    domain: {
      name: 'wagmi lab',
      version: '1',
      chainId: connection.chainId,
    },
    types: learningMessageTypes,
    primaryType: 'LearningMessage',
    message: {
      wallet: connection.address ?? zeroAddress,
      statement: 'Learn EIP-712 with wagmi',
      nonce: 1n,
    },
    signature: signTypedData.data,
    query: {
      enabled: false,
      retry: false,
    },
  })

  function handleSignTypedData() {
    if (connection.status !== 'connected') return

    signTypedData.mutate({
      domain: {
        name: 'wagmi lab',
        version: '1',
        chainId: connection.chainId,
      },
      types: learningMessageTypes,
      primaryType: 'LearningMessage',
      message: {
        wallet: connection.address,
        statement: 'Learn EIP-712 with wagmi',
        nonce: 1n,
      },
    })
  }

  return (
    <div className="demo-card demo-stack">
      <dl className="demo-details">
        <div><dt>钱包方法</dt><dd>eth_signTypedData_v4</dd></div>
        <div><dt>domain.name</dt><dd>wagmi lab</dd></div>
        <div><dt>primaryType</dt><dd>LearningMessage</dd></div>
        <div><dt>chainId</dt><dd>{connection.chainId ?? '--'}</dd></div>
        <div><dt>statement</dt><dd>Learn EIP-712 with wagmi</dd></div>
        <div><dt>nonce</dt><dd>1</dd></div>
      </dl>

      <button
        className="button button--primary"
        type="button"
        disabled={!connection.isConnected || signTypedData.isPending}
        onClick={handleSignTypedData}
      >
        {!connection.isConnected
          ? '请先连接钱包'
          : signTypedData.isPending
            ? '请在钱包中确认...'
            : '签名 EIP-712 数据'}
      </button>

      <button
        className="button button--secondary"
        type="button"
        disabled={!connection.isConnected || !signTypedData.data || verification.isFetching}
        onClick={() => void verification.refetch()}
      >
        {verification.isFetching ? '验证中...' : '验证 EIP-712 签名'}
      </button>

      <dl className="demo-details">
        <div><dt>验证状态</dt><dd>{verification.status}</dd></div>
        <div>
          <dt>验证结果</dt>
          <dd>
            {verification.data === true
              ? '通过'
              : verification.data === false
                ? '未通过'
                : '--'}
          </dd>
        </div>
      </dl>

      {signTypedData.data ? (
        <div className="signature-output">
          <span>EIP-712 signature · {signatureByteLength} bytes</span>
          <code>{signTypedData.data}</code>
        </div>
      ) : null}

      {signTypedData.error ?? verification.error ? (
        <p className="inline-error" role="alert">{(signTypedData.error ?? verification.error)?.message}</p>
      ) : null}
    </div>
  )
}

export function LiveDemo({ lessonId }: LiveDemoProps) {
  if (lessonId === 'sepoliaTransactionExercise') return <SepoliaTransactionExercise />
  if (lessonId === 'useConnection') return <ConnectionDemo />
  if (lessonId === 'useConnections') return <ConnectionsDemo />
  if (['useConnectors', 'useConnect', 'useDisconnect'].includes(lessonId)) return <WalletDemo />
  if (lessonId === 'useReconnect') return <ReconnectDemo />
  if (lessonId === 'useSwitchConnection') return <SwitchConnectionDemo />
  if (lessonId === 'useConfig') return <ConfigDemo />
  if (lessonId === 'useChainId') return <ChainIdDemo />
  if (lessonId === 'useClient') return <ClientDemo />
  if (lessonId === 'usePublicClient') return <ClientDemo publicActions />
  if (lessonId === 'useWalletClient') return <WalletClientDemo />
  if (lessonId === 'useConnectorClient') return <ConnectorClientDemo />
  if (lessonId === 'useConnectionEffect') return <ConnectionEffectDemo />
  if (['useChains', 'useSwitchChain'].includes(lessonId)) return <ChainsDemo />
  if (lessonId === 'useBlock') return <BlockDemo />
  if (lessonId === 'useTransactionCount') return <TransactionCountDemo />
  if (lessonId === 'useBytecode') return <BytecodeDemo />
  if (lessonId === 'usePrepareTransactionRequest') return <PrepareTransactionDemo />
  if (lessonId === 'useWatchBlockNumber') return <WatchBlockNumberDemo />
  if (lessonId === 'useEnsName') return <EnsNameDemo />
  if (lessonId === 'useEnsAddress') return <EnsAddressDemo />
  if (lessonId === 'useBalance') return <BalanceDemo />
  if (lessonId === 'useGasPrice') return <GasPriceDemo />
  if (lessonId === 'useEstimateFeesPerGas') return <EstimateFeesDemo />
  if (lessonId === 'useEstimateGas') return <EstimateGasDemo />
  if (['useSendTransaction', 'useWaitForTransactionReceipt'].includes(lessonId)) return <SendTransactionPanel />
  if (['useSignMessage', 'useVerifyMessage'].includes(lessonId)) return <SignMessageDemo />
  if (['useSignTypedData', 'useVerifyTypedData'].includes(lessonId)) return <SignTypedDataDemo />
  return null
}
