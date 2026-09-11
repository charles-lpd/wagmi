/**
 * Sepolia 原生 ETH 交易练习
 *
 * 目标：由学习者独立完成钱包连接、余额查询、交易广播、Receipt 等待和余额刷新。
 * 当前文件刻意不导入 wagmi、viem 或 TanStack Query；请按 TODO 顺序逐步实现。
 * 完成前只能使用 Sepolia 测试网和测试币，不能加入主网发送入口。
 */
import { useConnections } from 'wagmi'

export function SepoliaTransactionExercise() {
  // TODO 1：导入并调用钱包连接所需的 wagmi Hooks。
  const connections = useConnections()
  // TODO 2：读取当前连接状态，并提供 Injected Connector 的连接按钮。
  // TODO 3：检查当前链；不是 Sepolia 时提供由用户触发的切链按钮。
  // TODO 4：使用 useBalance 实现手动余额查询，正确区分 isLoading、isRefetching 和 isFetching。
  // TODO 5：接收地址和金额始终使用字符串状态，并在发送前完成校验。
  // TODO 6：使用 parseEther 把金额字符串转换成 Wei bigint，禁止经过 number。
  // TODO 7：使用 useSendTransaction 在明确的按钮点击中广播交易，并在 isPending 时禁止重复提交。
  // TODO 8：保存广播得到的 Hash，使刷新页面后仍能继续等待这笔测试网交易。
  // TODO 9：使用 useWaitForTransactionReceipt 等待 Receipt，并区分 success 与 reverted。
  // TODO 10：Receipt 返回后让当前账户的余额 Query 失效，并清理已处理的 Hash。
  // TODO 11：把连接、查询、切链、交易和 Receipt 的错误分别显示为可读信息。

  return (
    <div className="demo-card exercise-workspace" aria-live="polite">
      <div>
        {connections.map((connection) => (
          <div key={connection.connector.id}>
            <span>{connection.connector.name}</span>
          </div>
        ))}
      </div>
      <div className="exercise-status">
        <span>当前状态</span>
        <strong>等待实现</strong>
      </div>
      <p>
        请直接编辑 <code>src/sepolia-transaction-exercise.tsx</code>，用你的实现替换这个占位内容。
      </p>
      <p className="demo-empty">
        当前页面不会连接钱包、请求签名或发送交易。
      </p>
    </div>
  )
}
