import { useState, type ReactNode } from 'react';
import { REQUESTS, ORG_ORDERS, fmt, type ApprovalRequest } from '../data';
import { BottomNav } from '../components';

const assetPathPrefix = '/assets';
const imgBackBtn = `${assetPathPrefix}/f1d90.svg`;
const imgEditIcon = `${assetPathPrefix}/cc22d.svg`;
const imgCheckCircle = `${assetPathPrefix}/63a5f.svg`;
const imgLightning = `${assetPathPrefix}/7cd06.svg`;
const imgArrowRight = `${assetPathPrefix}/da5f3.svg`;
const imgCollapseIcon = `${assetPathPrefix}/3779e.svg`;

function StatCard({ label, value, sub, iconBg, icon, borderColor }: {
  label: string;
  value: number | string;
  sub: string;
  iconBg: string;
  icon: ReactNode;
  borderColor?: string;
}) {
  return (
    <div
      className="bg-white flex gap-3 items-start p-3 rounded-[16px] shrink-0"
      style={{ border: `1px solid ${borderColor ?? '#f2f3f7'}` }}
    >
      <div className="flex flex-1 min-w-0 flex-col gap-3 items-start">
        <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] w-full" style={{ fontFeatureSettings: '"case" 1' }}>{label}</p>
        <div className="flex flex-col gap-1 items-start w-full">
          <p className="font-['Noontree:Bold'] text-[16px] leading-5 text-[#0e0e0e] tracking-[-0.16px] w-full" style={{ fontFeatureSettings: '"case" 1' }}>{value}</p>
          <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#959595] tracking-[-0.12px] w-full" style={{ fontFeatureSettings: '"case" 1' }}>{sub}</p>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-[6px] shrink-0 size-8" style={{ background: iconBg }}>
        {icon}
      </div>
    </div>
  );
}

function ReviewRow({ req, onSelect }: { req: ApprovalRequest; onSelect: (r: ApprovalRequest) => void }) {
  const date = new Date(req.submittedAt);
  const dateStr = date.toLocaleDateString('en-AE', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' });

  return (
    <button
      onClick={() => onSelect(req)}
      className="bg-white border border-[#ebebeb] flex flex-col gap-3 items-start p-3 rounded-[16px] w-full text-left cursor-pointer hover:border-[#d4d4d4] transition-colors"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2 items-center shrink-0">
          <div className="bg-[#eaecf0] flex items-center justify-center rounded-full shrink-0 size-8">
            <p className="font-['Noontree:Bold'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{req.requester.initials}</p>
          </div>
          <div className="flex flex-col gap-0.5 items-start">
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{req.requester.name}</p>
            <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{dateStr} · {timeStr}</p>
          </div>
        </div>
        <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{fmt(req.grandTotal)}</p>
      </div>
      <div className="bg-[#eaecf0] h-px w-full shrink-0" />
      <div className="flex items-end justify-between w-full">
        <div className="flex flex-col gap-1.5 items-start justify-center shrink-0">
          <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>
            Order ID <span className="font-['Noontree:SemiBold']">{req.reference}</span>
          </p>
          <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#959595] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>
            {req.productCount} products · {req.itemCount} items
          </p>
        </div>
        <div className="flex flex-col items-center justify-center size-4">
          <div className="rotate-90 size-4 flex items-center justify-center">
            <img alt="" className="block max-w-none size-4" src={imgArrowRight} />
          </div>
        </div>
      </div>
    </button>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#d97706" strokeWidth="1.5" />
      <path d="M10 7v3.5l2.5 1.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#ef4444" strokeWidth="1.5" />
      <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Dashboard({ onBack, onSelectRequest, onEditLimit }: {
  onBack: () => void;
  onSelectRequest: (r: ApprovalRequest) => void;
  onEditLimit: () => void;
}) {
  const [reviewCollapsed, setReviewCollapsed] = useState(false);

  const pendingReqs = REQUESTS.filter(r => r.status === 'pending');
  const approvedReqs = REQUESTS.filter(r => r.status === 'approved');
  const rejectedReqs = REQUESTS.filter(r => r.status === 'rejected');
  const autoOrders = ORG_ORDERS.filter(o => o.approvalType === 'auto');

  const pendingTotal = pendingReqs.reduce((s, r) => s + r.grandTotal, 0);
  const approvedTotal = approvedReqs.reduce((s, r) => s + r.grandTotal, 0);
  const rejectedTotal = rejectedReqs.reduce((s, r) => s + r.grandTotal, 0);

  const totalSpend = ORG_ORDERS.reduce((s, o) => s + o.amount, 0);
  const autoSpend = ORG_ORDERS.filter(o => o.approvalType === 'auto').reduce((s, o) => s + o.amount, 0);
  const manualSpend = ORG_ORDERS.filter(o => o.approvalType === 'manual').reduce((s, o) => s + o.amount, 0);
  const autoPct = totalSpend > 0 ? (autoSpend / totalSpend) * 100 : 0;
  const manualPct = totalSpend > 0 ? (manualSpend / totalSpend) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb]">
      <div className="bg-white shrink-0 w-full" style={{ boxShadow: '0 1px 1.5px rgba(14,14,14,0.07)' }}>
        <div className="flex gap-3 items-center pb-3 pt-[62px] px-3 w-full">
          <button
            onClick={onBack}
            className="bg-white border border-[#ebebeb] flex items-center justify-center p-2 rounded-[18px] cursor-pointer hover:bg-[#f5f5f5] transition-colors shrink-0"
          >
            <div className="relative shrink-0 size-5">
              <img alt="Back" className="absolute block inset-0 max-w-none size-full" src={imgBackBtn} />
            </div>
          </button>
          <p className="font-['Figtree:Bold'] text-[18px] leading-[26px] text-[#0e0e0e] flex-1" style={{ fontFeatureSettings: '"case" 1' }}>Dashboard</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3" style={{ scrollbarWidth: 'none' }}>
        <div className="bg-white border border-[#f2f3f7] rounded-[16px]">
          <div className="px-4 pt-4 pb-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Total spending</p>
                <p className="font-['Noontree:Bold'] text-[20px] leading-6 text-[#0e0e0e] tracking-[-0.2px] mt-1" style={{ fontFeatureSettings: '"case" 1' }}>{fmt(totalSpend)}</p>
              </div>
              <button
                onClick={onEditLimit}
                className="flex gap-1 items-center justify-center h-8 px-2.5 py-1.5 rounded-[8px] border border-[#ebebeb] cursor-pointer hover:bg-[#f5f5f5] transition-colors shrink-0 mt-0.5"
              >
                <img alt="" className="size-3.5" src={imgEditIcon} />
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Edit limit</p>
              </button>
            </div>
            <div className="bg-[#f2f3f7] flex h-2 rounded-full overflow-hidden w-full">
              <div className="h-full" style={{ width: `${autoPct}%`, background: '#0076ff' }} />
              <div className="h-full" style={{ width: `${manualPct}%`, background: '#96c6ff' }} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
                <span className="inline-block size-1.5 rounded-full bg-[#0076ff] mr-1 align-middle" />
                Auto-approved {fmt(autoSpend)}
              </p>
              <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px] text-right" style={{ fontFeatureSettings: '"case" 1' }}>
                <span className="inline-block size-1.5 rounded-full bg-[#96c6ff] mr-1 align-middle" />
                Manual {fmt(manualSpend)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Pending" value={pendingReqs.length} sub={fmt(pendingTotal)} iconBg="#fff7ed" icon={<ClockIcon />} borderColor="#fde7c7" />
          <StatCard label="Approved" value={approvedReqs.length} sub={fmt(approvedTotal)} iconBg="#e5faec" icon={<img alt="" className="size-5" src={imgCheckCircle} />} />
          <StatCard label="Rejected" value={rejectedReqs.length} sub={fmt(rejectedTotal)} iconBg="#fff5f5" icon={<XCircle />} borderColor="#fecaca" />
          <StatCard label="Auto-approved" value={autoOrders.length} sub="No request needed" iconBg="#eff7ff" icon={<img alt="" className="size-5" src={imgLightning} />} />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setReviewCollapsed(c => !c)}
            className="flex items-center justify-between px-1 cursor-pointer"
          >
            <p className="font-['Noontree:SemiBold'] text-[13px] leading-[16px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              Needs review · {pendingReqs.length}
            </p>
            <img alt="" className={`size-4 transition-transform ${reviewCollapsed ? '-rotate-90' : ''}`} src={imgCollapseIcon} />
          </button>
          {!reviewCollapsed && pendingReqs.map(req => (
            <ReviewRow key={req.id} req={req} onSelect={onSelectRequest} />
          ))}
        </div>
        <div className="h-2" />
      </div>

      <BottomNav role="owner" pendingCount={pendingReqs.length} />
    </div>
  );
}
