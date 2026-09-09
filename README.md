# wagmi React Playground

一个使用 React、TypeScript 和 Vite 搭建的 wagmi API 学习项目。页面采用侧边栏课程结构，每个 API 都包含独立示例、参数、返回值和关键说明。

## 启动

```bash
npm install
npm run dev
```

## 已包含

- 配置与 Provider
- 钱包连接、断开和连接状态
- 网络切换、余额与区块查询
- Sepolia ETH 发送、交易回执与消息签名
- 合约读取、模拟、写入和事件监听

课程数据位于 `src/lessons.ts`，实时示例位于 `src/live-demo.tsx`，wagmi 配置位于 `src/wagmi.ts`。

## 参考

- [wagmi React 文档](https://wagmi.sh/react/getting-started)
- [viem 文档](https://viem.sh/)
