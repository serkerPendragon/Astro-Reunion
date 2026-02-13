# 国内免费部署指南

## 1. Gitee Pages 部署

### 步骤1：创建Gitee仓库
1. 登录 [Gitee](https://gitee.com/)
2. 创建一个新的仓库（建议仓库名与项目名一致）
3. 选择公开仓库（Gitee Pages免费版仅支持公开仓库）

### 步骤2：配置本地Git仓库
```bash
# 添加Gitee远程仓库
git remote add gitee https://gitee.com/你的用户名/你的仓库名.git

# 推送代码到Gitee
git push -u gitee astro-reunion:main
```

### 步骤3：开启Gitee Pages
1. 进入Gitee仓库页面
2. 点击「服务」→「Gitee Pages」
3. 选择分支：`main`
4. 选择目录：`dist`
5. 点击「启动」

### 步骤4：访问网站
Gitee Pages会为您生成一个访问地址：`https://你的用户名.gitee.io/你的仓库名/`

## 2. Coding Pages 部署

### 步骤1：创建Coding项目
1. 登录 [Coding](https://coding.net/)
2. 创建一个新的项目
3. 选择「代码托管」项目类型

### 步骤2：配置本地Git仓库
```bash
# 添加Coding远程仓库
git remote add coding https://e.coding.net/你的用户名/你的项目名/你的仓库名.git

# 推送代码到Coding
git push -u coding astro-reunion:main
```

### 步骤3：开启Coding Pages
1. 进入Coding项目页面
2. 点击「部署」→「静态网站托管」
3. 点击「立即开通」
4. 选择仓库和分支
5. 配置构建命令：`pnpm install && pnpm run build`
6. 配置输出目录：`dist`
7. 点击「保存并部署」

### 步骤4：访问网站
Coding Pages会为您生成一个访问地址：`https://你的项目名.coding-pages.com/`

## 3. 本地预览

在部署前，您可以本地预览构建后的网站：

```bash
# 预览构建后的网站
pnpm run preview
```

然后访问 http://localhost:4321

## 4. 自动部署配置

### Gitee Pages 自动部署

创建 `.github/workflows/gitee-pages.yml` 文件：

```yaml
name: Deploy to Gitee Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm run build
      - name: Deploy to Gitee Pages
        uses: yanglbme/gitee-pages-action@main
        with:
          gitee-username: ${{ secrets.GITEE_USERNAME }}
          gitee-password: ${{ secrets.GITEE_PASSWORD }}
          gitee-repo: 你的用户名/你的仓库名
          branch: main
          directory: dist
```

### Coding Pages 自动部署

Coding Pages支持自动部署，无需额外配置，推送代码后会自动构建部署。

## 5. 注意事项

1. **构建目录**：确保构建命令执行后，静态文件输出到 `dist` 目录
2. **仓库权限**：Gitee Pages免费版仅支持公开仓库
3. **部署时间**：Gitee Pages部署可能需要几分钟时间生效
4. **自定义域名**：可以配置自定义域名，但需要备案
5. **访问速度**：建议使用CDN加速静态资源访问

祝您部署成功！🎉