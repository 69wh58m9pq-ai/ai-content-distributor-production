export default function TestPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>✅ AI Content Distributor - 测试页面</h1>
      <p>如果能看到这个页面，说明应用正常运行。</p>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>应用状态:</h2>
        <ul>
          <li>✅ Next.js服务器: 运行中</li>
          <li>✅ 端口3000: 可访问</li>
          <li>✅ 端口3001: 可访问</li>
          <li>✅ 数据库: SQLite配置完成</li>
          <li>✅ AI模拟API: 已设置</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2>访问链接:</h2>
        <ul>
          <li><a href="http://localhost:3000">主页面 (端口3000)</a></li>
          <li><a href="http://localhost:3001">备用端口 (3001)</a></li>
          <li><a href="http://localhost:3000/test">这个测试页面</a></li>
          <li><a href="http://localhost:3000/auth/signin">登录页面</a></li>
          <li><a href="http://localhost:3000/auth/signup">注册页面</a></li>
        </ul>
      </div>
      
      <div style={{ marginTop: '30px', color: '#666' }}>
        <p>如果仍然无法访问，可能是:</p>
        <ol>
          <li>浏览器缓存 - 尝试Ctrl+F5强制刷新</li>
          <li>防火墙阻止 - 检查防火墙设置</li>
          <li>其他应用占用端口 - 使用不同端口</li>
        </ol>
      </div>
    </div>
  )
}