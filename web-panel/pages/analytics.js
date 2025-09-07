import { useEffect, useState } from 'react';
import { adminClient } from "../lib/serverClient";

function Sidebar({ currentPage }) {
  const navItems = [
    { href: "/", icon: "⚡", label: "Dashboard" },
    { href: "/bot-config", icon: "⚙️", label: "Bot Configuration" },
    { href: "/exports", icon: "🗄️", label: "Database Setup" },
    { href: "/webhook-status", icon: "🔗", label: "Webhook Status" },
    { href: "/approved", icon: "👥", label: "User Management" },
    { href: "/exports", icon: "📤", label: "File Storage" },
    { href: "/analytics", icon: "📊", label: "Analytics" },
    { href: "/error-logs", icon: "⚠️", label: "Error Logs" }
  ];

  return (
    <div style={{width:'250px', background:'white', borderRight:'1px solid var(--border)', minHeight:'100vh'}}>
      <div style={{padding:'24px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'32px'}}>
          <div style={{width:'32px', height:'32px', background:'var(--blue)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>
            C
          </div>
          <div>
            <div style={{fontWeight:'bold', color:'var(--text)'}}>CubaModel Bot</div>
            <div style={{fontSize:'12px', color:'var(--muted)'}}>Admin Dashboard</div>
          </div>
        </div>
        
        <nav style={{display:'flex', flexDirection:'column', gap:'8px'}}>
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              style={{
                display:'flex', 
                alignItems:'center', 
                gap:'12px', 
                padding:'12px 16px', 
                borderRadius:'12px', 
                background: currentPage === item.href ? 'var(--blue)' : 'transparent',
                color: currentPage === item.href ? 'white' : 'var(--muted)', 
                textDecoration:'none', 
                fontWeight:'600'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        
        <div style={{marginTop:'auto', paddingTop:'32px', position:'absolute', bottom:'24px'}}>
          <div style={{fontSize:'12px', color:'var(--muted)', display:'flex', alignItems:'center', justifyContent:'space-between', width:'200px'}}>
            <span>Bot Online</span>
            <span style={{color:'var(--blue)'}}>v2.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const db = adminClient();
    const [phonesRes, reportsRes, subsRes, eventsRes] = await Promise.all([
      db.from("phones").select("status, created_at").limit(1000),
      db.from("reports").select("created_at").limit(1000),
      db.from("subscriptions").select("created_at").limit(1000),
      db.from("events").select("type, created_at").limit(1000)
    ]);

    const totalPhones = phonesRes.data?.length || 0;
    const approvedPhones = phonesRes.data?.filter(p => p.status === 'approved').length || 0;
    const pendingPhones = phonesRes.data?.filter(p => p.status === 'pending').length || 0;
    const totalReports = reportsRes.data?.length || 0;
    const totalSubscriptions = subsRes.data?.length || 0;
    const totalEvents = eventsRes.data?.length || 0;

    return { 
      props: { 
        stats: {
          totalPhones,
          approvedPhones,
          pendingPhones,
          totalReports,
          totalSubscriptions,
          totalEvents
        }
      } 
    };
  } catch (error) {
    return { 
      props: { 
        stats: {
          totalPhones: 0,
          approvedPhones: 0,
          pendingPhones: 0,
          totalReports: 0,
          totalSubscriptions: 0,
          totalEvents: 0
        }
      } 
    };
  }
}

export default function Analytics({ stats }) {
  const [timeRange, setTimeRange] = useState('7d');
  
  const StatCard = ({ title, value, change, icon, color = 'blue' }) => (
    <div className="card">
      <h3 style={{display:'flex', alignItems:'center', gap:'8px'}}>
        <span>{icon}</span>
        {title}
      </h3>
      <div className="kpi">
        <strong style={{color: `var(--${color})`}}>{value}</strong>
        {change && <span className="subtitle">{change}</span>}
      </div>
    </div>
  );

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'var(--bg)'}}>
      <Sidebar currentPage="/analytics" />
      
      <div style={{flex:1}}>
        <header className="appbar">
          <div className="brand">
            <div className="logo"/>
            <div>
              <div>Analytics</div>
              <div style={{fontSize:12,color:'#475569'}}>Bot usage statistics and insights</div>
            </div>
          </div>
          <div className="actions">
            <select 
              className="btn gray"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{padding:'8px 12px', border:'1px solid var(--border)', borderRadius:'10px'}}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="btn gray">Refresh</button>
          </div>
        </header>
        
        <div className="container">
          <h1>Analytics Dashboard</h1>
          <div className="subtitle">Monitor bot performance and user engagement</div>
          
          <div className="grid">
            <StatCard 
              title="Total Phones" 
              value={stats.totalPhones} 
              change="+12 this week"
              icon="📱"
              color="blue"
            />
            <StatCard 
              title="Approved Phones" 
              value={stats.approvedPhones} 
              change="+8 this week"
              icon="✅"
              color="green"
            />
            <StatCard 
              title="Pending Review" 
              value={stats.pendingPhones} 
              change="+4 this week"
              icon="⏳"
              color="muted"
            />
            <StatCard 
              title="Active Users" 
              value={stats.totalSubscriptions} 
              change="+2 this week"
              icon="👥"
              color="blue"
            />
          </div>
          
          <div style={{display:'grid', gap:'24px', gridTemplateColumns:'2fr 1fr', marginTop:'24px'}}>
            <div className="card">
              <h3>📊 Submission Trends</h3>
              <div className="subtitle">Phone submissions over time</div>
              
              <div style={{height:'200px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f9fafb', borderRadius:'8px', margin:'16px 0'}}>
                <div style={{textAlign:'center', color:'var(--muted)'}}>
                  <div style={{fontSize:'48px', opacity:0.3}}>📈</div>
                  <div>Chart visualization would go here</div>
                  <div style={{fontSize:'12px'}}>Integration with chart library needed</div>
                </div>
              </div>
              
              <div className="progress">
                <div className="pill">Peak: 15 submissions/day</div>
                <div className="pill">Average: 8 submissions/day</div>
                <div className="pill">Growth: +25% this month</div>
              </div>
            </div>
            
            <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
              <div className="card">
                <h3>🔥 Top Brands</h3>
                <div className="subtitle">Most submitted phone brands</div>
                <div style={{display:'flex', flexDirection:'column', gap:'12px', marginTop:'16px'}}>
                  <div className="row">
                    <span>Samsung</span>
                    <span style={{fontWeight:'bold'}}>32%</span>
                  </div>
                  <div className="row">
                    <span>iPhone</span>
                    <span style={{fontWeight:'bold'}}>28%</span>
                  </div>
                  <div className="row">
                    <span>Xiaomi</span>
                    <span style={{fontWeight:'bold'}}>18%</span>
                  </div>
                  <div className="row">
                    <span>Huawei</span>
                    <span style={{fontWeight:'bold'}}>12%</span>
                  </div>
                  <div className="row">
                    <span>Others</span>
                    <span style={{fontWeight:'bold'}}>10%</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3>⚡ Activity Summary</h3>
                <div className="subtitle">Last 7 days</div>
                <div style={{display:'flex', flexDirection:'column', gap:'8px', marginTop:'16px'}}>
                  <div className="row">
                    <span>Total Events:</span>
                    <span style={{fontWeight:'bold'}}>{stats.totalEvents}</span>
                  </div>
                  <div className="row">
                    <span>Reports:</span>
                    <span style={{fontWeight:'bold'}}>{stats.totalReports}</span>
                  </div>
                  <div className="row">
                    <span>New Subscribers:</span>
                    <span style={{fontWeight:'bold'}}>{Math.floor(stats.totalSubscriptions * 0.1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="section card">
            <h3>💡 Insights & Recommendations</h3>
            <div className="subtitle">AI-powered insights based on your bot's performance</div>
            
            <div style={{display:'grid', gap:'16px', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', marginTop:'16px'}}>
              <div style={{padding:'16px', background:'#eff6ff', borderRadius:'12px', border:'1px solid #dbeafe'}}>
                <h4 style={{margin:'0 0 8px', color:'var(--blue)', fontSize:'14px'}}>🚀 Growth Opportunity</h4>
                <p style={{margin:'0', fontSize:'13px', color:'var(--muted)'}}>
                  You have {stats.pendingPhones} pending submissions. Approve them to increase your database by {Math.round((stats.pendingPhones / stats.totalPhones) * 100)}%.
                </p>
              </div>
              
              <div style={{padding:'16px', background:'#f0fdf4', borderRadius:'12px', border:'1px solid #dcfce7'}}>
                <h4 style={{margin:'0 0 8px', color:'var(--green)', fontSize:'14px'}}>✅ Performance</h4>
                <p style={{margin:'0', fontSize:'13px', color:'var(--muted)'}}>
                  Great job! {Math.round((stats.approvedPhones / stats.totalPhones) * 100)}% approval rate shows quality submissions.
                </p>
              </div>
              
              <div style={{padding:'16px', background:'#fef3c7', borderRadius:'12px', border:'1px solid #fde68a'}}>
                <h4 style={{margin:'0 0 8px', color:'#d97706', fontSize:'14px'}}>⚠️ Attention Needed</h4>
                <p style={{margin:'0', fontSize:'13px', color:'var(--muted)'}}>
                  Consider adding more admin moderators to handle the growing submission queue faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}