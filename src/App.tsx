import { useState, useEffect, useRef } from 'react';
import type { Role, ScreenId } from './data';
import { ORG_ORDERS, REQUESTS } from './data';
import { CheckoutOverLimit, CheckoutConfirmation } from './screens/Checkout';
import { Dashboard } from './screens/Dashboard';
import { ApprovalsQueue } from './screens/ApprovalsQueue';
import { MyRequests } from './screens/MyRequests';
import { Members } from './screens/Settings';
import { Account } from './screens/Account';
import {
  OrdersList, OrderDetails, PendingRequestDetails,
  filterOrdersByApproval, filterRequestsByTab, tabForOrderApproval, tabForRequest,
  ORDER_STATUS_NAV, REQUEST_STATUS_NAV,
  type OLTab, type OrderApprovalTab, type RequestDetailTab,
} from './screens/OrderDetails';
import type { OrgOrder, ApprovalRequest } from './data';

// ─── Screen registry ───────────────────────────────────────────────────────────

interface ScreenDef {
  id: ScreenId;
  label: string;
  group: string;
  roles: Role[];
}

const SCREENS: ScreenDef[] = [
  { id: 'account', label: 'Account', group: 'Profile', roles: ['owner', 'admin', 'buyer'] },
  { id: 'checkout-overlimit', label: 'Checkout', group: 'Buyer', roles: ['buyer', 'admin'] },
  { id: 'checkout-confirmation', label: 'Checkout', group: 'Buyer', roles: ['buyer', 'admin'] },
  { id: 'my-requests', label: 'My requests', group: 'Buyer', roles: ['buyer', 'admin'] },
  { id: 'dashboard', label: 'Dashboard', group: 'Approvals', roles: ['owner', 'admin'] },
  { id: 'approvals-queue', label: 'Approvals', group: 'Approvals', roles: ['owner', 'admin'] },
  { id: 'members', label: 'Users & limits', group: 'Org Settings', roles: ['owner', 'admin'] },
  { id: 'orders-list', label: 'My orders', group: 'Buyer', roles: ['buyer', 'admin'] },
  { id: 'request-details', label: 'Request details', group: 'Buyer', roles: ['buyer', 'admin'] },
  { id: 'order-details', label: 'Order details', group: 'Buyer', roles: ['buyer', 'admin'] },
];

const CHECKOUT_NAV: { id: ScreenId; label: string }[] = [
  { id: 'checkout-overlimit', label: 'Needs approval' },
  { id: 'checkout-confirmation', label: 'Confirmed' },
];

const DEFAULT_SCREEN: Record<Role, ScreenId> = {
  owner: 'account',
  admin: 'account',
  buyer: 'account',
};

// ─── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [role, setRole] = useState<Role>('owner');
  const [screen, setScreen] = useState<ScreenId>('approvals-queue');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrgOrder | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [ordersTab, setOrdersTab] = useState<OLTab>('all');
  const [orderApprovalTab, setOrderApprovalTab] = useState<OrderApprovalTab>('auto');
  const [requestsTab, setRequestsTab] = useState<RequestDetailTab>('pending');
  const [requestBack, setRequestBack] = useState<ScreenId>('my-requests');
  const frameAreaRef = useRef<HTMLDivElement>(null);
  const [phoneScale, setPhoneScale] = useState(0.82);

  useEffect(() => {
    const update = () => {
      if (!frameAreaRef.current) return;
      const availH = frameAreaRef.current.clientHeight - 80; // subtract toolbar + gap
      const availW = frameAreaRef.current.clientWidth - 48;
      const scaleH = availH / 812;
      const scaleW = availW / 375;
      setPhoneScale(Math.min(scaleH, scaleW, 1));
    };
    update();
    const ro = new ResizeObserver(update);
    if (frameAreaRef.current) ro.observe(frameAreaRef.current);
    return () => ro.disconnect();
  }, []);

  const changeRole = (r: Role) => {
    setRole(r);
    const available = SCREENS.filter(s => s.roles.includes(r));
    if (!available.find(s => s.id === screen)) {
      setScreen(DEFAULT_SCREEN[r]);
    }
  };

  const changeScreen = (id: ScreenId, opts?: { order?: typeof ORG_ORDERS[0]; request?: typeof REQUESTS[0] }) => {
    if (opts?.order) {
      setSelectedOrder(opts.order);
      setOrderApprovalTab(tabForOrderApproval(opts.order));
    } else if (id === 'order-details') {
      const list = filterOrdersByApproval(orderApprovalTab);
      const fallback = list[0] ?? ORG_ORDERS.find(o => o.approvalType === 'auto') ?? ORG_ORDERS[0];
      setSelectedOrder(fallback);
      setOrderApprovalTab(tabForOrderApproval(fallback));
    }
    if (opts?.request) {
      setSelectedRequest(opts.request);
      setRequestsTab(tabForRequest(opts.request));
    } else if (id === 'request-details') {
      const fallback = REQUESTS[Math.floor(Math.random() * REQUESTS.length)];
      setSelectedRequest(fallback);
      setRequestsTab(tabForRequest(fallback));
    }
    setScreen(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleOrderApprovalChange = (tab: OrderApprovalTab) => {
    setOrderApprovalTab(tab);
    setSelectedOrder(prev => {
      const list = filterOrdersByApproval(tab);
      if (prev && list.some(o => o.id === prev.id)) return prev;
      return list[0] ?? null;
    });
  };

  const handleRequestsTabChange = (tab: RequestDetailTab) => {
    setRequestsTab(tab);
    setSelectedRequest(prev => {
      const list = filterRequestsByTab(tab);
      if (prev && list.some(r => r.id === prev.id)) return prev;
      return list[0] ?? null;
    });
  };

  const openOrderDetailsWithTab = (tab: OrderApprovalTab) => {
    handleOrderApprovalChange(tab);
    setScreen('order-details');
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const openRequestDetailsWithTab = (tab: RequestDetailTab) => {
    handleRequestsTabChange(tab);
    setScreen('request-details');
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const toolbarLabel = (() => {
    const base = SCREENS.find(s => s.id === screen)?.label ?? '';
    if (screen === 'order-details') {
      const sub = ORDER_STATUS_NAV.find(t => t.id === orderApprovalTab)?.label;
      return sub ? `${base} · ${sub}` : base;
    }
    if (screen === 'request-details') {
      const sub = REQUEST_STATUS_NAV.find(t => t.id === requestsTab)?.label;
      return sub ? `${base} · ${sub}` : base;
    }
    if (screen === 'checkout-overlimit' || screen === 'checkout-confirmation') {
      const sub = CHECKOUT_NAV.find(t => t.id === screen)?.label;
      return sub ? `Checkout · ${sub}` : 'Checkout';
    }
    return base;
  })();

  const ordersListScreen = (
    <OrdersList
      tab={ordersTab}
      onTabChange={setOrdersTab}
      onBack={() => changeScreen('account')}
      onSelect={o => changeScreen('order-details', { order: o })}
      onSelectRequest={r => changeScreen('request-details', { request: r })}
    />
  );

  const visibleScreens = SCREENS.filter(s => s.roles.includes(role));
  const groups = [...new Set(visibleScreens.map(s => s.group))];

  // Navigate from checkout to confirmation
  const handleCheckoutSubmit = () => setScreen('checkout-confirmation');
  const handleCheckoutBack = () => setScreen('checkout-overlimit');

  const renderScreen = () => {
    switch (screen) {
      case 'account': return <Account role={role} onNavigate={changeScreen} />;
      case 'orders-list': return ordersListScreen;
      case 'order-details': return (
        <OrderDetails
          order={selectedOrder}
          onBack={() => changeScreen('orders-list')}
        />
      );
      case 'request-details': return (
        <PendingRequestDetails
          key={selectedRequest?.id ?? 'empty'}
          req={selectedRequest}
          onBack={() => changeScreen(requestBack)}
        />
      );
      case 'checkout-overlimit': return <CheckoutOverLimit onSubmit={handleCheckoutSubmit} />;
      case 'checkout-confirmation': return <CheckoutConfirmation onViewRequest={() => setScreen('my-requests')} onContinue={handleCheckoutBack} />;
      case 'dashboard': return (
        <Dashboard
          onBack={() => changeScreen('account')}
          onSelectRequest={r => { setRequestBack('dashboard'); changeScreen('request-details', { request: r }); }}
          onEditLimit={() => changeScreen('members')}
        />
      );
      case 'approvals-queue': return <ApprovalsQueue role={role} onSelectOrder={o => changeScreen('order-details', { order: o })} />;
      case 'my-requests': return <MyRequests onOpenRequest={r => { setRequestBack('my-requests'); changeScreen('request-details', { request: r }); }} />;
      case 'governance-on':
      case 'members': return <Members role={role} />;
      default: return null;
    }
  };

  const ROLE_LABELS: Record<Role, string> = { owner: 'Owner', admin: 'Admin', buyer: 'Buyer' };

  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col shrink-0 transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-64' : 'w-0'}`}
        style={{ background: 'linear-gradient(180deg, #161b27 0%, #111520 100%)' }}
      >
        <div className="flex flex-col h-full w-64 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {/* App title */}
          <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10">
            <div className="bg-[#0076ff] flex items-center justify-center rounded-xl shrink-0" style={{ width: 32, height: 32 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 14h12M9 4v6m0 0L6 7m3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-['Figtree:Bold'] text-[13px] leading-[16px] text-white">Spend Controls</p>
              <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-white/50">Acme Distribution</p>
            </div>
          </div>

          {/* Role switcher */}
          <div className="px-3 py-4 border-b border-white/10">
            <p className="font-['Noontree:Regular'] text-[10px] leading-[12px] text-white/40 uppercase tracking-widest mb-2 px-1">Viewing as</p>
            <div className="flex bg-white/10 rounded-xl p-1 gap-1">
              {(['owner', 'admin', 'buyer'] as Role[]).map(r => (
                <button
                  key={r}
                  onClick={() => changeRole(r)}
                  className={`flex-1 py-1.5 rounded-lg font-['Noontree:SemiBold'] text-[11px] leading-[14px] transition-all cursor-pointer capitalize ${role === r ? 'bg-white text-[#0e0e0e] shadow' : 'text-white/50 hover:text-white/80'}`}
                  style={{ fontFeatureSettings: '"case" 1' }}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Screen list */}
          <div className="flex flex-col gap-4 px-3 py-4 flex-1">
            {groups.map(group => (
              <div key={group}>
                <p className="font-['Noontree:Regular'] text-[10px] leading-[12px] text-white/40 uppercase tracking-widest px-2 mb-1.5">{group}</p>
                <div className="flex flex-col gap-0.5">
                  {visibleScreens.filter(s => s.group === group).map(s => {
                    if (s.id === 'checkout-confirmation' || s.id === 'orders-list') return null;
                    if (s.id === 'checkout-overlimit') {
                      const parentActive = screen === 'checkout-overlimit' || screen === 'checkout-confirmation';
                      return (
                        <div key={s.id} className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => changeScreen(parentActive ? screen : 'checkout-overlimit')}
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all ${parentActive ? 'bg-[#0076ff]/20 text-[#4da6ff]' : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}
                          >
                            <ScreenIcon id={s.id} active={parentActive} />
                            <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{s.label}</p>
                          </button>
                          <div className="ml-3 pl-2 border-l border-white/10 flex flex-col gap-0.5">
                            {CHECKOUT_NAV.map(t => {
                              const subActive = screen === t.id;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => changeScreen(t.id)}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left cursor-pointer transition-all ${subActive ? 'bg-[#0076ff]/15 text-[#4da6ff]' : 'text-white/45 hover:bg-white/5 hover:text-white/75'}`}
                                >
                                  <p className="font-['Noontree:Medium'] text-[11px] leading-[14px] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{t.label}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    if (s.id === 'order-details') {
                      const parentActive = screen === 'order-details';
                      return (
                        <div key={s.id} className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => openOrderDetailsWithTab(orderApprovalTab)}
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all ${parentActive ? 'bg-[#0076ff]/20 text-[#4da6ff]' : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}
                          >
                            <ScreenIcon id={s.id} active={parentActive} />
                            <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{s.label}</p>
                          </button>
                          <div className="ml-3 pl-2 border-l border-white/10 flex flex-col gap-0.5">
                            {ORDER_STATUS_NAV.map(t => {
                              const subActive = parentActive && orderApprovalTab === t.id;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => openOrderDetailsWithTab(t.id)}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left cursor-pointer transition-all ${subActive ? 'bg-[#0076ff]/15 text-[#4da6ff]' : 'text-white/45 hover:bg-white/5 hover:text-white/75'}`}
                                >
                                  <p className="font-['Noontree:Medium'] text-[11px] leading-[14px] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{t.label}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    if (s.id === 'request-details') {
                      const parentActive = screen === 'request-details';
                      return (
                        <div key={s.id} className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => openRequestDetailsWithTab(requestsTab)}
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all ${parentActive ? 'bg-[#0076ff]/20 text-[#4da6ff]' : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}
                          >
                            <ScreenIcon id={s.id} active={parentActive} />
                            <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{s.label}</p>
                          </button>
                          <div className="ml-3 pl-2 border-l border-white/10 flex flex-col gap-0.5">
                            {REQUEST_STATUS_NAV.map(t => {
                              const subActive = parentActive && requestsTab === t.id;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => openRequestDetailsWithTab(t.id)}
                                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left cursor-pointer transition-all ${subActive ? 'bg-[#0076ff]/15 text-[#4da6ff]' : 'text-white/45 hover:bg-white/5 hover:text-white/75'}`}
                                >
                                  <p className="font-['Noontree:Medium'] text-[11px] leading-[14px] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{t.label}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => changeScreen(s.id)}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all ${screen === s.id ? 'bg-[#0076ff]/20 text-[#4da6ff]' : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}
                      >
                        <ScreenIcon id={s.id} active={screen === s.id} />
                        <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{s.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Role indicator footer */}
          <div className="p-3 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2.5">
              <div className="bg-[#0076ff] flex items-center justify-center rounded-full shrink-0" style={{ width: 28, height: 28 }}>
                <p className="font-['Noontree:Bold'] text-[11px] text-white">{ROLE_LABELS[role][0]}</p>
              </div>
              <div>
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-white">Khalid Al-Mansoori</p>
                <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-white/50 capitalize">{ROLE_LABELS[role]}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Phone frame area */}
      <div ref={frameAreaRef} className="flex-1 flex flex-col items-center justify-center gap-4 p-6 min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 shrink-0" style={{ width: Math.round(375 * phoneScale) }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="bg-white/10 hover:bg-white/20 flex items-center justify-center rounded-xl transition-colors cursor-pointer"
            style={{ width: 32, height: 32 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-white/70 tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              {toolbarLabel}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-[#4ade80] shrink-0" />
            <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-white/60 capitalize">{ROLE_LABELS[role]}</p>
          </div>
        </div>

        {/* Phone frame — shrink-wrapped via transform so it fits the viewport */}
        <div className="shrink-0" style={{ width: Math.round(375 * phoneScale), height: Math.round(812 * phoneScale) }}>
          <div
            className="relative overflow-hidden bg-white"
            style={{
              width: 375,
              height: 812,
              borderRadius: 40,
              transform: `scale(${phoneScale})`,
              transformOrigin: 'top left',
              boxShadow: '0 0 0 8px #1e2333, 0 32px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0f1117] rounded-b-3xl z-50" style={{ width: 120, height: 28 }} />
            {renderScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenIcon({ id, active }: { id: ScreenId; active: boolean }) {
  const color = active ? '#4da6ff' : 'rgba(255,255,255,0.5)';
  const s = 14;
  switch (id) {
    case 'account':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><circle cx="7" cy="5" r="2.5" stroke={color} strokeWidth="1.2" /><path d="M2 12c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>;
    case 'checkout-overlimit':
    case 'checkout-confirmation':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><path d="M2 3h10l-1 6H3L2 3z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" /><circle cx="5" cy="12" r="0.8" fill={color} /><circle cx="9" cy="12" r="0.8" fill={color} /></svg>;
    case 'dashboard':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><rect x="2" y="2" width="4.5" height="4.5" rx="1" stroke={color} strokeWidth="1.2"/><rect x="7.5" y="2" width="4.5" height="4.5" rx="1" stroke={color} strokeWidth="1.2"/><rect x="2" y="7.5" width="4.5" height="4.5" rx="1" stroke={color} strokeWidth="1.2"/><rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" stroke={color} strokeWidth="1.2"/></svg>;
    case 'approvals-queue':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><rect x="2" y="2" width="10" height="10" rx="2" stroke={color} strokeWidth="1.2" /><path d="M5 7l1.5 1.5L9.5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>;
    case 'my-requests':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><path d="M3 3h8v2H3V3zm0 4h8M3 9h5" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>;
    case 'orders-list':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><rect x="2" y="2" width="10" height="10" rx="1.5" stroke={color} strokeWidth="1.2" /><path d="M4 5h6M4 7h4M4 9h2" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>;
    case 'order-details':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><rect x="3" y="2" width="8" height="10" rx="1.5" stroke={color} strokeWidth="1.2" /><path d="M5 5h4M5 7h3" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>;
    case 'governance-on':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><path d="M7 2L2.5 4.5v3C2.5 9.6 4.5 11.5 7 12c2.5-.5 4.5-2.4 4.5-4.5v-3L7 2z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" /></svg>;
    case 'members':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><circle cx="5.5" cy="5" r="2" stroke={color} strokeWidth="1.2" /><path d="M2 12c0-2 1.6-3 3.5-3s3.5 1 3.5 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" /><circle cx="9.5" cy="5.5" r="1.5" stroke={color} strokeWidth="1.2" /><path d="M11.5 11c0-1.5-1-2.3-2-2.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" /></svg>;
    case 'request-details':
      return <svg width={s} height={s} viewBox="0 0 14 14" fill="none" className="shrink-0"><rect x="2" y="2" width="10" height="10" rx="2" stroke={color} strokeWidth="1.2"/><path d="M4.5 5.5h5M4.5 7.5h3M4.5 9.5h2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>;
    default: return null;
  }
}
