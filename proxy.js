const http = require('http');
const httpProxy = require('http-proxy');

// 创建代理服务器实例
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:4322',
  changeOrigin: true
});

// 基本认证配置
const credentials = {
  username: 'user',
  password: 'password'
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 解析基本认证头
  const authHeader = req.headers['authorization'] || '';
  const auth = Buffer.from(authHeader.split(' ')[1] || '', 'base64').toString('utf8');
  const [username, password] = auth.split(':');

  // 检查认证
  if (username !== credentials.username || password !== credentials.password) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Protected Area"');
    res.end('Authentication required');
    return;
  }

  // 认证成功，代理请求
  proxy.web(req, res);
});

// 监听端口
const PORT = 4324;
server.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
  console.log(`Basic Auth: ${credentials.username}:${credentials.password}`);
  console.log('Forwarding to http://localhost:4322');
});

// 处理代理错误
proxy.on('error', (err, req, res) => {
  res.statusCode = 500;
  res.end('Proxy error: ' + err.message);
});