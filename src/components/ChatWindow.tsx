import React, { useState } from 'react';
import type { NonProfitData, ChatMessage } from '../types/nonprofit';
import { MessageSquare, Send, Sparkles, Bot, User, FileText } from 'lucide-react';

interface ChatWindowProps {
  nonprofit: NonProfitData;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ nonprofit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I am your Form 990 AI Assistant. I have analyzed ${nonprofit.name}'s latest audited IRS Form 990 filing. What would you like to know about executive salaries, program spend efficiency, or financial reserves?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: ['Form 990 Part VII', 'Form 990 Part IX Line 25']
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Quick Suggestion Chips
  const promptSuggestions = [
    `How much does the CEO make compared to peers?`,
    `What percentage of funds go directly to programs?`,
    `Does ${nonprofit.name} have enough reserves for a crisis?`,
    `Is their fundraising cost efficient?`
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(query, nonprofit);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const generateAIResponse = (query: string, np: NonProfitData): ChatMessage => {
    const qLower = query.toLowerCase();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (qLower.includes('ceo') || qLower.includes('salary') || qLower.includes('compensation') || qLower.includes('make')) {
      const ceo = np.executives.find((e) => e.title.includes('CEO') || e.title.includes('President')) || np.executives[0];
      return {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: `According to ${np.name}'s Form 990 (Part VII), ${ceo.name} (${ceo.title}) earned $${ceo.compensation.toLocaleString()} in annual compensation. This accounts for just ${ceo.percentOfBudget}% of total annual operating budget ($${(np.totalExpenses / 1000000).toFixed(1)}M). This ranks in the ${ceo.peerPercentile}th percentile among similar ${np.nteeCategory} nonprofits.`,
        timestamp: timeStr,
        citations: ['Form 990 Part VII Section A', 'Form 990 Part IX Line 25']
      };
    }

    if (qLower.includes('program') || qLower.includes('percent') || qLower.includes('direct') || qLower.includes('spend')) {
      return {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: `${np.name} allocated ${np.programExpenseRatio}% of its total functional expenses ($${(np.programExpenses / 1000000).toFixed(1)}M out of $${(np.totalExpenses / 1000000).toFixed(1)}M) directly to program services. Administrative overhead accounts for ${(np.adminExpenses / np.totalExpenses * 100).toFixed(1)}% and fundraising accounts for ${(np.fundraisingExpenses / np.totalExpenses * 100).toFixed(1)}%. Watchdog standard threshold is 75%.`,
        timestamp: timeStr,
        citations: ['Form 990 Part IX Line 25 Column B & C']
      };
    }

    if (qLower.includes('reserve') || qLower.includes('crisis') || qLower.includes('health') || qLower.includes('survive')) {
      return {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: `Based on Form 990 Part X (Balance Sheet), ${np.name} holds $${(np.netAssets / 1000000).toFixed(1)}M in net liquid assets. This represents ${np.operatingReserveMonths} months of unrestricted operating reserve cushion.`,
        timestamp: timeStr,
        citations: ['Form 990 Part X Lines 1-6 & 27', 'Form 990 Part IX Line 25']
      };
    }

    if (qLower.includes('fundraising') || qLower.includes('cost') || qLower.includes('raise')) {
      return {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: `${np.name} spends approximately $${np.fundraisingEfficiency.toFixed(2)} to raise every $100 in public contributions. Total fundraising outlays were $${(np.fundraisingExpenses / 1000000).toFixed(1)}M against $${(np.totalRevenue / 1000000).toFixed(1)}M in total incoming revenue.`,
        timestamp: timeStr,
        citations: ['Form 990 Part IX Column D', 'Form 990 Part VIII Line 1h']
      };
    }

    return {
      id: `ast-${Date.now()}`,
      sender: 'assistant',
      text: `${np.name} (EIN: ${np.ein}) maintains an Overall Explorer Rating of ${np.overallScore}/10. They generate $${(np.totalRevenue / 1000000).toFixed(1)}M in annual revenue with ${np.programExpenseRatio}% allocated directly to mission activities and ${np.operatingReserveMonths} months of emergency operating reserves.`,
      timestamp: timeStr,
      citations: ['Form 990 Part VIII & IX']
    };
  };

  return (
    <div
      style={{
        background: 'var(--bg-main)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
          <MessageSquare size={16} color="var(--accent-blue)" /> Ask 990 AI Assistant: <span style={{ color: 'var(--accent-emerald)' }}>{nonprofit.name}</span>
        </h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', background: 'rgba(5, 150, 105, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(5, 150, 105, 0.25)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Sparkles size={11} /> 990 Citation Engine
        </span>
      </div>

      {/* Suggestion Chips */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {promptSuggestions.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            style={{
              background: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              color: 'var(--accent-blue)',
              padding: '0.25rem 0.6rem',
              borderRadius: '12px',
              fontSize: '0.72rem',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
          >
            💬 {chip}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '0.85rem',
          height: '220px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%'
            }}
          >
            {msg.sender === 'assistant' && (
              <div style={{ width: '26px', height: '28px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.15)', border: '1px solid var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={14} color="var(--accent-blue)" />
              </div>
            )}

            <div
              style={{
                background: msg.sender === 'user' ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-main)',
                color: 'var(--text-primary)',
                padding: '0.6rem 0.85rem',
                borderRadius: msg.sender === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                border: msg.sender === 'assistant' ? '1px solid var(--border-subtle)' : '1px solid rgba(2, 132, 199, 0.3)',
                fontSize: '0.8rem',
                lineHeight: '1.45',
                fontWeight: 500
              }}
            >
              <div style={{ fontSize: '0.68rem', color: msg.sender === 'user' ? 'var(--accent-blue)' : 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>{msg.sender === 'user' ? 'You' : '990 AI Assistant'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p style={{ margin: 0 }}>{msg.text}</p>

              {msg.citations && msg.citations.length > 0 && (
                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  {msg.citations.map((cite, cIdx) => (
                    <span
                      key={cIdx}
                      style={{
                        background: 'rgba(5, 150, 105, 0.1)',
                        color: 'var(--accent-emerald)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        border: '1px solid rgba(5, 150, 105, 0.25)',
                        fontFamily: 'monospace',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <FileText size={10} /> {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={14} color="#fff" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-blue)', fontSize: '0.78rem', fontWeight: 600 }}>
            <Bot size={14} /> 990 AI Engine analyzing Form 990 lines...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{ display: 'flex', gap: '0.5rem' }}
      >
        <input
          type="text"
          placeholder={`Ask anything about ${nonprofit.name}'s Form 990...`}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          style={{
            flex: 1,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            padding: '0.55rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            background: 'var(--accent-blue)',
            border: '1px solid var(--accent-blue)',
            color: '#fff',
            borderRadius: '6px',
            padding: '0.55rem 0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontWeight: 700,
            fontSize: '0.8rem'
          }}
        >
          <Send size={14} color="#fff" /> ASK
        </button>
      </form>
    </div>
  );
};
