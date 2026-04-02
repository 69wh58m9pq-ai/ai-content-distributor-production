'use client'

import { useEffect, useState } from 'react'

export default function SimplePage() {
  const [status, setStatus] = useState('加载中...')
  
  useEffect(() => {
    // 检查API连接
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        setStatus('✅ 应用正常运行！')
        console.log('Session data:', data)
      })
      .catch(err => {
        setStatus('❌ API连接失败')
        console.error('API error:', err)
      })
  }, [])
  
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>AI Content Distributor - 简化测试</h1>
      <p>这个页面使用最简React代码，避免复杂DOM操作。</p>
      
      <div style={{ 
        margin: '30px 0', 
        padding: '20px', 
        background: status.includes('✅') ? '#e8f5e9' : '#ffebee',
        borderRadius: '8px',
        border: `2px solid ${status.includes('✅') ? '#4caf50' : '#f44336'}`
      }}>
        <h2>应用状态: {status}</h2>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>功能测试:</h3>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ 
            padding: '12px 24px', 
            margin: '10px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          访问主页面
        </button>
        
        <button 
          onClick={() => window.location.href = '/auth/signin'}
          style={{ 
            padding: '12px 24px', 
            margin: '10px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          测试登录
        </button>
        
        <button 
          onClick={() => {
            fetch('/api/mock-openai/chat/completions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messages: [{ role: 'user', content: '测试AI生成' }]
              })
            })
            .then(res => res.json())
            .then(data => alert('AI响应: ' + data.choices[0].message.content))
          }}
          style={{ 
            padding: '12px 24px', 
            margin: '10px',
            background: '#9c27b0',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          测试AI API
        </button>
      </div>
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <h4>技术信息:</h4>
        <ul>
          <li>页面类型: 纯客户端组件 (use client)</li>
          <li>无服务端渲染</li>
          <li>无复杂DOM操作</li>
          <li>最小依赖</li>
        </ul>
      </div>
    </div>
  )
}