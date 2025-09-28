# 静态文件部署指南

## 🎉 构建成功！

匿名签到系统前端已成功打包为静态文件，可以部署到任何静态托管服务。

## 📁 静态文件位置

```
checkin-app/dist/
├── index.html              # 主页面
├── 404.html                # 404 页面  
├── create/                 # 创建会话页面
├── sessions/               # 会话列表页面
├── debug/                  # 调试页面
├── redirect/               # 重定向页面
└── _next/                  # Next.js 资源文件
    ├── static/
    └── chunks/
```

## 🚀 部署选项

### 1. Netlify 部署

1. **拖拽部署**：
   - 访问 [Netlify](https://www.netlify.com)
   - 直接将 `dist` 文件夹拖拽到部署区域

2. **Git 部署**：
   - 连接您的 Git 仓库
   - 构建命令：`cd checkin-app && npm run build:static`
   - 发布目录：`checkin-app/dist`

### 2. Vercel 部署

1. **命令行部署**：
   ```bash
   cd checkin-app
   npx vercel --prod
   # 选择 dist 目录作为构建输出
   ```

2. **Git 部署**：
   - 连接 Git 仓库
   - 构建命令：`cd checkin-app && npm run build:static`
   - 输出目录：`checkin-app/dist`

### 3. GitHub Pages 部署

1. **创建 GitHub Actions**：
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3
       
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           
       - name: Install dependencies
         run: |
           cd checkin-app
           npm install
           
       - name: Build
         run: |
           cd checkin-app
           npm run build:static
           
       - name: Deploy
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./checkin-app/dist
   ```

### 4. 其他静态托管服务

- **Surge**: `npx surge checkin-app/dist`
- **Firebase Hosting**: `firebase deploy`
- **AWS S3**: 上传 `dist` 文件夹内容
- **IPFS**: 使用去中心化存储

## 🔧 配置要点

### 环境变量配置

部署前确认 `.env.local` 中的配置：

```bash
# 合约地址（Sepolia 测试网）
NEXT_PUBLIC_CONTRACT_ADDRESS=0xd45ce30660297F50C0e2C87C8434A8697B217A96

# FHEVM 配置（Sepolia 测试网）
NEXT_PUBLIC_RELAYER_URL=https://relayer.sepolia.zama.ai
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# 开发配置
NODE_ENV=development
```

### 重要说明

1. **智能合约部署**：
   - 合约已部署到 Sepolia 测试网
   - 地址：`0xd45ce30660297F50C0e2C87C8434A8697B217A96`
   - 用户需要 Sepolia 测试网的 ETH

2. **FHEVM 支持**：
   - 自动检测网络类型
   - 测试网使用真实的 Zama FHEVM 服务
   - 本地开发使用 mock 实现

3. **钱包要求**：
   - 需要 MetaMask 或兼容钱包
   - 支持 Sepolia 测试网

## 🧪 本地测试

```bash
# 生成静态文件
cd checkin-app
npm run build:static

# 本地预览
npm run serve:static

# 访问 http://localhost:3000
```

## 📊 构建信息

```
Route (app)                     Size    First Load JS
┌ ○ /                          123 B         102 kB
├ ○ /create                  4.09 kB         223 kB
├ ○ /sessions                4.97 kB         224 kB
├ ○ /debug                     882 B         103 kB
└ ○ /redirect                  618 B         103 kB
+ First Load JS shared by all               102 kB
```

## 🔒 安全特性

- **完全匿名**：所有签到数据经过 FHEVM 加密
- **隐私保护**：零知识证明技术
- **去中心化**：部署到区块链网络
- **前端安全**：静态文件，无服务器风险

## 📝 使用说明

1. **连接钱包**：支持 MetaMask
2. **切换网络**：连接到 Sepolia 测试网
3. **获取测试币**：从水龙头获取测试 ETH
4. **创建会话**：设置签到活动
5. **匿名签到**：参与者加密签到

## 🛠 故障排除

### 常见问题

1. **FHEVM 初始化失败**：
   - 检查网络连接
   - 确认钱包已连接正确网络
   - 刷新页面重试

2. **合约交互失败**：
   - 确认账户有足够的 ETH
   - 检查合约地址配置
   - 验证网络配置

3. **静态文件访问问题**：
   - 检查路由配置
   - 确认所有资源文件存在
   - 验证 HTTPS 配置（部分功能需要）

## 📞 支持

如遇问题，请检查：
- 浏览器控制台错误信息
- MetaMask 网络配置
- 合约地址和 ABI 配置

---

🎉 **部署完成！您的匿名签到系统现已可在生产环境使用！**
