import { useState, type FormEvent } from 'react'
import {
  useConnection,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getAddress, isAddress, parseEther } from 'viem'

export function SendTransactionPanel() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [validationError, setValidationError] = useState<string>()
  const connection = useConnection()
  const switchChain = useSwitchChain()
  const transaction = useSendTransaction()
  const receipt = useWaitForTransactionReceipt({
    chainId: sepolia.id,
    hash: transaction.data,
    query: {
      // 没有交易 Hash 时保持 idle，不向 RPC 查询 Receipt。
      enabled: Boolean(transaction.data),
    },
  })

  const isSepolia = connection.chainId === sepolia.id
  const isAwaitingReceipt = Boolean(transaction.data) && receipt.isFetching
  const error =
    validationError ??
    transaction.error?.message ??
    switchChain.error?.message ??
    receipt.error?.message

  function resetTransaction() {
    setValidationError(undefined)
    transaction.reset()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError(undefined)

    if (!isAddress(recipient)) {
      setValidationError('请输入有效的 EVM 收款地址。')
      return
    }

    let value: bigint
    try {
      value = parseEther(amount)
    } catch {
      setValidationError('请输入有效的 ETH 数量。')
      return
    }

    if (value <= 0n) {
      setValidationError('发送数量必须大于 0。')
      return
    }

    transaction.mutate({
      chainId: sepolia.id,
      to: getAddress(recipient),
      value,
    })
  }

  return (
    <div className="demo-card">
      <form className="transaction-form" onSubmit={handleSubmit}>
        <label>
          <span>收款地址</span>
          <input
            type="text"
            value={recipient}
            placeholder="0x..."
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => {
              setRecipient(event.target.value.trim())
              resetTransaction()
            }}
          />
        </label>

        <label>
          <span>数量</span>
          <div className="amount-input">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              placeholder="0.001"
              autoComplete="off"
              onChange={(event) => {
                setAmount(event.target.value)
                resetTransaction()
              }}
            />
            <span>ETH</span>
          </div>
        </label>

        {!connection.isConnected ? (
          <button className="button button--primary" type="button" disabled>
            请先连接钱包
          </button>
        ) : !isSepolia ? (
          <button
            className="button button--primary"
            type="button"
            disabled={switchChain.isPending}
            onClick={() => switchChain.mutate({ chainId: sepolia.id })}
          >
            {switchChain.isPending ? '切换中...' : '切换到 Sepolia'}
          </button>
        ) : (
          <button
            className="button button--primary"
            type="submit"
            disabled={transaction.isPending || isAwaitingReceipt}
          >
            {transaction.isPending
              ? '请在钱包中确认...'
              : isAwaitingReceipt
                ? '等待链上确认...'
                : '发送测试币'}
          </button>
        )}
      </form>

      {transaction.data ? (
        <div className="transaction-result" aria-live="polite">
          <div>
            <span>交易 Hash</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${transaction.data}`}
              target="_blank"
              rel="noreferrer"
              title={transaction.data}
            >
              {`${transaction.data.slice(0, 10)}...${transaction.data.slice(-8)}`}
            </a>
          </div>
          <div>
            <span>交易状态</span>
            <strong>
              {isAwaitingReceipt
                ? '确认中'
                : receipt.data?.status === 'success'
                  ? '已确认'
                  : receipt.data?.status === 'reverted'
                    ? '执行失败'
                    : receipt.isError
                      ? '确认查询失败'
                    : '已提交'}
            </strong>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="error-message" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  )
}
