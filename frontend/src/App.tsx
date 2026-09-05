import { useEffect, useState } from 'react';

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Disconnected 🔴");

  useEffect(() => {
    // 1. Connect to your Go Backend
    const ws = new WebSocket("ws://localhost:8080/ws");
    
    ws.onopen = () => setStatus("Connected 🟢");
    ws.onclose = () => setStatus("Disconnected 🔴");

    ws.onmessage = (event) => {
      // 2. Receive messages from the server
      setMessages((prev) => [...prev, event.data]);
    };

    setSocket(ws);
    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && input) {
      socket.send(input);
      setInput("");
    }
  };

  // Allow pressing "Enter" to send
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ 
      padding: '2rem', 
      background: '#1a1a1a', 
      color: '#fff', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>🔐 Secure Chat</h2>
          <span style={{ fontSize: '0.8rem' }}>{status}</span>
        </div>

        {/* Message History Box */}
        <div style={{ 
          background: '#2a2a2a', 
          height: '400px', 
          overflowY: 'auto', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '1px solid #444',
          marginBottom: '1rem'
        }}>
          {messages.length === 0 ? (
            <p style={{ color: '#666' }}>No messages yet...</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} style={{ 
                background: '#333', 
                padding: '8px 12px', 
                borderRadius: '4px', 
                marginBottom: '8px',
                borderLeft: '4px solid #646cff'
              }}>
                {msg}
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a secured message..."
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #444',
              background: '#2a2a2a',
              color: '#fff' 
            }}
          />
          <button 
            onClick={sendMessage} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '4px', 
              border: 'none', 
              background: '#646cff', 
              color: '#fff', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
