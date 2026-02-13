const { createClient } = require('nat-upnp');

// 创建UPnP客户端
const client = createClient();

// 映射外部端口80到本地端口80
client.portMapping(
  {
    public: 80,      // 外部端口
    private: 80,     // 本地端口
    protocol: 'tcp', // 协议
    description: 'Astro Web Server', // 描述
    ttl: 0           // 0表示永久映射
  },
  (err) => {
    if (err) {
      console.error('端口映射失败:', err);
      return;
    }
    
    console.log('✅ UPnP端口映射成功!');
    console.log('📡 外部端口: 80 -> 本地端口: 80 (TCP)');
    
    // 查看当前的端口映射
    client.getMappings((err, mappings) => {
      if (err) {
        console.error('获取端口映射列表失败:', err);
        return;
      }
      
      console.log('\n🔍 当前端口映射列表:');
      mappings.forEach((mapping, index) => {
        console.log(`${index + 1}. 外部端口: ${mapping.public} -> 本地端口: ${mapping.private}`);
        console.log(`   协议: ${mapping.protocol}, 描述: ${mapping.description}`);
        console.log(`   本地IP: ${mapping.local.ip}`);
        console.log('');
      });
    });
  }
);
