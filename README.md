# Anonymous Check-In System (FHEVM)

一个基于FHEVM（全同态加密虚拟机）技术的匿名签到系统，提供完全的隐私保护和匿名性。

## 🌟 特性

- **完全匿名**: 使用FHEVM技术对所有签到数据进行加密
- **隐私保护**: 零知识证明，只有验证状态是公开的
- **去中心化**: 部署在区块链上，无需中心化服务器
- **实时加密**: 支持实时的同态加密计算
- **多网络支持**: 支持本地开发环境和Sepolia测试网

## 🏗 项目结构

```
├── checkin-app/              # Next.js 前端应用
│   ├── app/                  # App Router页面
│   ├── components/           # React组件
│   ├── fhevm/               # FHEVM集成代码
│   ├── hooks/               # 自定义React Hooks
│   └── dist/                # 静态构建输出
├── fhevm-hardhat-template/   # Hardhat智能合约开发环境
│   ├── contracts/           # Solidity智能合约
│   ├── deploy/              # 部署脚本
│   ├── test/                # 合约测试
│   └── deployments/         # 部署记录
└── STATIC_DEPLOYMENT.md     # 静态部署指南
```

## 🚀 快速开始

### 前置要求

- Node.js 18+
- MetaMask 钱包
- Sepolia 测试网 ETH

### 本地开发

1. **克隆仓库**
   ```bash
   git clone [repository-url]
   cd zama_checkin
   ```

2. **启动Hardhat节点**
   ```bash
   cd fhevm-hardhat-template
   npm install
   npm run node
   ```

3. **部署合约**
   ```bash
   # 新终端
   cd fhevm-hardhat-template
   npm run deploy
   ```

4. **启动前端**
   ```bash
   cd checkin-app
   npm install
   npm run dev:mock
   ```

5. **访问应用**
   ```
   http://localhost:3000
   ```

### 生产部署

合约已部署到Sepolia测试网：
- **合约地址**: `0xd45ce30660297F50C0e2C87C8434A8697B217A96`
- **网络**: Sepolia Testnet (Chain ID: 11155111)

#### 静态文件部署

```bash
cd checkin-app
npm run build:static
# 部署 dist/ 文件夹到任意静态托管服务
```

支持的托管平台：
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- IPFS

详细部署指南请参考 [STATIC_DEPLOYMENT.md](./STATIC_DEPLOYMENT.md)

## 🔧 技术栈

### 智能合约
- **Solidity**: ^0.8.27
- **FHEVM**: v0.8 (Zama Network)
- **Hardhat**: 部署和测试框架
- **Ethers.js**: Web3交互库

### 前端
- **Next.js**: 15.x (App Router)
- **React**: 19.x
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **FHEVM SDK**: 同态加密集成

### 加密技术
- **FHEVM**: 全同态加密虚拟机
- **Zero-Knowledge Proofs**: 零知识证明
- **Homomorphic Encryption**: 同态加密计算

## 📖 使用说明

### 创建签到会话

1. 连接MetaMask钱包到Sepolia网络
2. 点击"Create Session"
3. 填写会话信息（标题、描述、持续时间）
4. 提交创建会话交易

### 匿名签到

1. 在会话列表中找到活跃会话
2. 点击"Anonymous Check-In"按钮
3. 填写加密签到信息
4. 提交签到，数据将被完全加密

### 查看统计

- 总会话数量
- 活跃会话数量
- 参与者统计
- 所有数据保持匿名性

## 🔐 隐私保护

### 数据加密
- 所有敏感数据使用FHEVM加密
- 支持同态计算，无需解密即可处理
- 零知识证明保护用户身份

### 匿名性保证
- 签到内容完全加密
- 只有验证状态公开
- 无法追溯到具体用户

## 🧪 测试

### 合约测试
```bash
cd fhevm-hardhat-template
npm test
```

### 前端测试
```bash
cd checkin-app
npm run lint
npm run build
```

## 📊 性能指标

- **Gas消耗**: ~1,900,000 (合约部署)
- **首屏加载**: ~102kB (gzipped)
- **支持网络**: Sepolia, Localhost
- **加密类型**: AES-256, RSA-2048

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](./LICENSE) 文件了解详情

## 🛟 支持

如遇问题，请：
1. 检查浏览器控制台错误
2. 确认MetaMask网络配置
3. 验证合约地址和ABI配置
4. 提交Issue到GitHub仓库

## 🔗 相关链接

- [FHEVM文档](https://docs.fhevm.io)
- [Zama Network](https://www.zama.ai)
- [Sepolia Faucet](https://sepoliafaucet.com)
- [MetaMask](https://metamask.io)

---

🚀 **由FHEVM技术驱动的下一代隐私保护应用**
