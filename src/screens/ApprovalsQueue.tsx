import { useState } from 'react';
import { REQUESTS, ORG_ORDERS, fmt, type ApprovalRequest, type OrgOrder, type RequestStatus } from '../data';
import {
  TopHeader, BottomNav, BottomSheet, StatusChip, CountdownChip, Avatar,
  Divider, PrimaryBtn, SecondaryBtn, RoleChip, imgFilter, imgEdit, imgArrowRight, imgCheck, XCircleIcon, InfoIcon, AlertIcon, CheckIcon,
} from '../components';
import type { Role } from '../data';

type Tab = 'pending' | 'approved' | 'rejected' | 'expired';
type ApprovedFilter = 'all' | 'auto' | 'manual';

type ApprovedListItem =
  | { kind: 'request'; data: ApprovalRequest; sortKey: string }
  | { kind: 'order'; data: OrgOrder; sortKey: string };

function buildApprovedItems(filter: ApprovedFilter): ApprovedListItem[] {
  const items: ApprovedListItem[] = [];
  const includeManual = filter === 'all' || filter === 'manual';
  const includeAuto = filter === 'all' || filter === 'auto';

  if (includeManual) {
    for (const r of REQUESTS.filter(r => r.status === 'approved')) {
      items.push({ kind: 'request', data: r, sortKey: r.decisionAt ?? r.submittedAt });
    }
    for (const o of ORG_ORDERS.filter(o => o.approvalType === 'manual')) {
      items.push({ kind: 'order', data: o, sortKey: o.approvedAt ?? o.date });
    }
  }
  if (includeAuto) {
    for (const o of ORG_ORDERS.filter(o => o.approvalType === 'auto')) {
      items.push({ kind: 'order', data: o, sortKey: o.date });
    }
  }

  return items.sort((a, b) => new Date(b.sortKey).getTime() - new Date(a.sortKey).getTime());
}

const APPROVED_FILTERS: { id: ApprovedFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'auto', label: 'Auto-approved' },
  { id: 'manual', label: 'Manually approved' },
];

// ─── Queue list ───────────────────────────────────────────────────────────────

export function ApprovalsQueue({ role, onSelectOrder }: { role: Role; onSelectOrder?: (order: OrgOrder) => void }) {
  const [tab, setTab] = useState<Tab>('pending');
  const [approvedFilter, setApprovedFilter] = useState<ApprovedFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const tabMap: Record<Tab, RequestStatus[]> = {
    pending: ['pending'],
    approved: ['approved'],
    rejected: ['rejected'],
    expired: ['expired', 'approval_lapsed'],
  };

  const filtered = REQUESTS.filter(r => tabMap[tab].includes(r.status));
  const approvedItems = tab === 'approved' ? buildApprovedItems(approvedFilter) : [];
  const pendingCount = REQUESTS.filter(r => r.status === 'pending').length;
  const listEmpty = tab === 'approved' ? approvedItems.length === 0 : filtered.length === 0;

  if (selectedId) {
    const req = REQUESTS.find(r => r.id === selectedId)!;
    return (
      <RequestDetail
        req={req}
        role={role}
        isSelf={req.requester.email === 'sara@acme.com' && role === 'admin'}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'expired', label: 'Expired' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb] relative">
      <TopHeader
        title="Approvals"
        subtitle="Review and action team order requests"
        rightContent={
          <button onClick={() => setFilterOpen(true)} className="border border-[rgba(14,14,14,0.07)] flex gap-1 items-center justify-center px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50">
            <img alt="" className="size-3" src={imgFilter} />
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Filters</p>
          </button>
        }
      />

      {/* Tabs */}
      <div className="bg-white border-b border-[#ebebeb] flex shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id === 'approved') setApprovedFilter('all');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 cursor-pointer transition-colors ${tab === t.id ? 'border-b-2 border-[#0076ff]' : ''}`}
          >
            <p className={`font-['Noontree:${tab === t.id ? 'SemiBold' : 'Regular'}'] text-[12px] leading-[14px] tracking-[-0.12px] whitespace-nowrap ${tab === t.id ? 'text-[#0076ff]' : 'text-[#5d5d5d]'}`} style={{ fontFeatureSettings: '"case" 1' }}>
              {t.label}
            </p>
            {t.id === 'pending' && pendingCount > 0 && (
              <span className="bg-[#f36302] flex items-center justify-center overflow-clip py-0.5 rounded-lg w-4">
                <p className="font-['Noontree:Regular'] text-[10px] leading-[12px] text-white text-center">{pendingCount}</p>
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'approved' && (
        <div className="bg-white border-b border-[#ebebeb] flex gap-2 px-3 py-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
          {APPROVED_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setApprovedFilter(f.id)}
              className={`flex h-8 items-center justify-center px-3 rounded-lg font-['Noontree:Medium'] text-[12px] leading-[14px] tracking-[-0.12px] whitespace-nowrap cursor-pointer transition-colors ${approvedFilter === f.id ? 'bg-[#0076ff] text-white' : 'bg-[#f5f5f5] text-[#5d5d5d] hover:bg-[#ebebeb]'}`}
              style={{ fontFeatureSettings: '"case" 1' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3" style={{ scrollbarWidth: 'none' }}>
        {listEmpty && (
          <div className="flex flex-col items-center justify-center flex-1 py-16 gap-3">
            <div className="bg-[#f5f5f5] flex items-center justify-center rounded-full w-14 h-14">
              <CheckIcon color="#9ca3af" size={28} />
            </div>
            <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#959595] text-center tracking-[-0.12px] whitespace-pre-line" style={{ fontFeatureSettings: '"case" 1' }}>
              {tab === 'approved'
                ? approvedFilter === 'auto'
                  ? 'No auto-approved orders yet.'
                  : approvedFilter === 'manual'
                    ? 'No manually approved orders or requests yet.'
                    : 'No approved orders or requests yet.'
                : "Nothing waiting for you.\nNew requests show up here and in your email."}
            </p>
          </div>
        )}
        {tab === 'approved'
          ? approvedItems.map(item =>
            item.kind === 'request'
              ? <QueueRow key={`req-${item.data.id}`} req={item.data} onClick={() => setSelectedId(item.data.id)} />
              : (
                <ApprovedOrderRow
                  key={`ord-${item.data.id}`}
                  order={item.data}
                  onClick={() => onSelectOrder?.(item.data)}
                />
              ),
            )
          : filtered.map(req => (
            <QueueRow key={req.id} req={req} onClick={() => setSelectedId(req.id)} />
          ))}
        <div className="h-4" />
      </div>

      <BottomNav role={role} pendingCount={pendingCount} />

      {filterOpen && <FiltersSheet onClose={() => setFilterOpen(false)} />}
    </div>
  );
}

function ApprovedOrderRow({ order, onClick }: { order: OrgOrder; onClick: () => void }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    delivered: { bg: '#e5faec', text: '#16a34a' },
    shipped: { bg: '#eff7ff', text: '#0076ff' },
    processing: { bg: '#fff7ed', text: '#d97706' },
  };
  const sc = statusColors[order.orderStatus];
  const isAuto = order.approvalType === 'auto';

  return (
    <button
      onClick={onClick}
      className="bg-white border border-[#ebebeb] rounded-2xl p-3 w-full text-left hover:border-[#d4d4d4] transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar initials={order.buyerInitials} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] truncate" style={{ fontFeatureSettings: '"case" 1' }}>{order.buyer}</p>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-['Noontree:Medium'] text-[10px] leading-[12px] capitalize`} style={{ background: sc.bg, color: sc.text }}>
                {order.orderStatus}
              </span>
            </div>
            <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              {order.date} · {order.reference}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <p className="font-['Noontree:Bold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{fmt(order.amount)}</p>
          {isAuto ? (
            <span className="inline-flex items-center bg-[#e5faec] text-[#16a34a] border border-[#86efac] rounded-full px-2 py-0.5 font-['Noontree:SemiBold'] text-[10px] leading-3 tracking-[0.5px] uppercase">Auto</span>
          ) : order.approvedBy ? (
            <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#0076ff] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>
              By {order.approvedBy}
            </p>
          ) : null}
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-between mt-2.5">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-['Noontree:Medium'] text-[10px] leading-[12px] ${isAuto ? 'bg-[#eff7ff] text-[#0076ff]' : 'bg-[#f5f3ff] text-[#7c3aed]'}`}>
          {isAuto ? 'Auto-approved order' : 'Manually approved order'}
        </span>
        <div className="flex items-center gap-1 text-[#959595]">
          <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] tracking-[-0.12px]">View order</p>
          <div className="rotate-90 size-4 flex items-center justify-center">
            <img alt="" className="size-3.5" src={imgArrowRight} />
          </div>
        </div>
      </div>
    </button>
  );
}

function QueueRow({ req, onClick }: { req: ApprovalRequest; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-[#ebebeb] rounded-2xl p-3 w-full text-left hover:border-[#d4d4d4] transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar initials={req.requester.initials} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{req.requester.name}</p>
              {req.requester.role === 'admin' && <RoleChip role="admin" />}
            </div>
            <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              {new Date(req.submittedAt).toLocaleDateString('en-AE', { month: 'short', day: 'numeric', year: 'numeric' })} · {new Date(req.submittedAt).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <p className="font-['Noontree:Bold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{fmt(req.grandTotal)}</p>
          {req.status === 'pending' ? (
            <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#ef4444] tracking-[-0.12px] whitespace-nowrap">
              {req.approvalReason === 'monthly_limit' ? 'Monthly cap hit' : `+${fmt(req.grandTotal - req.orderLimit)} over limit`}
            </p>
          ) : req.status === 'approved' && req.decisionBy ? (
            <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#0076ff] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>
              By {req.decisionBy}
            </p>
          ) : null}
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusChip status={req.status} />
          {req.status === 'pending' && <CountdownChip expiresAt={req.expiresAt} small />}
          {req.previouslyRejected && (
            <span className="inline-flex items-center gap-1 bg-[#fff5f5] text-[#ef4444] border border-[#fca5a5] rounded-full px-2 py-0.5 font-['Noontree:Medium'] text-[10px] leading-[14px]">
              Re-submitted
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[#959595]">
          <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] tracking-[-0.12px]">{req.productCount}p · {req.itemCount} items</p>
          <div className="rotate-90 size-4 flex items-center justify-center">
            <img alt="" className="size-3.5" src={imgArrowRight} />
          </div>
        </div>
      </div>
      {req.buyerNote && (
        <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] mt-2 truncate italic" style={{ fontFeatureSettings: '"case" 1' }}>
          "{req.buyerNote}"
        </p>
      )}
    </button>
  );
}

// ─── Request detail ───────────────────────────────────────────────────────────

function RequestDetail({ req, role, isSelf, onBack }: { req: ApprovalRequest; role: Role; isSelf: boolean; onBack: () => void }) {
  const [action, setAction] = useState<'none' | 'approve' | 'reject' | 'done'>('none');
  const [rejectReason, setRejectReason] = useState('');
  const [decided, setDecided] = useState<'approved' | 'rejected' | null>(null);

  const canDecide = (role === 'owner' || role === 'admin') && !isSelf && req.status === 'pending';

  const doApprove = () => {
    setDecided('approved');
    setAction('done');
  };

  const doReject = () => {
    if (rejectReason.length < 10) return;
    setDecided('rejected');
    setAction('done');
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb] relative">
      <div className="bg-white flex flex-col shrink-0" style={{ boxShadow: '0 1px 1.5px rgba(14,14,14,0.07)' }}>
        <div className="flex gap-3 items-center pb-3 pt-14 px-3">
          <button onClick={onBack} className="bg-white border border-[#ebebeb] rounded-[18px] shrink-0">
            <div className="flex items-center justify-center p-2 size-9">
              <img alt="" className="size-5 rotate-180" style={{ filter: 'none' }} src={imgArrowRight} />
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-['Figtree:Bold'] text-[16px] leading-[22px] text-[#0e0e0e] truncate" style={{ fontFeatureSettings: '"case" 1' }}>{req.reference}</p>
              <StatusChip status={decided ? decided : req.status} />
            </div>
            {req.status === 'pending' && !decided && <CountdownChip expiresAt={req.expiresAt} />}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24" style={{ scrollbarWidth: 'none' }}>
        <div className="p-3 flex flex-col gap-3">
          {/* Requester + limit context */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-3 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar initials={req.requester.initials} size={40} />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px]" style={{ fontFeatureSettings: '"case" 1' }}>{req.requester.name}</p>
                  <RoleChip role={req.requester.role} />
                </div>
                <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]">{req.requester.email}</p>
              </div>
            </div>
            <Divider />
            <div className="grid grid-cols-3 gap-2">
              {(req.approvalReason === 'monthly_limit'
                ? [
                    { label: 'Order total', value: fmt(req.grandTotal) },
                    { label: 'Monthly limit', value: req.monthlyLimit !== null ? fmt(req.monthlyLimit) : '—' },
                    { label: 'Spent so far', value: fmt(req.monthlySpentAtSubmission), accent: true },
                  ]
                : [
                    { label: 'Order total', value: fmt(req.grandTotal) },
                    { label: 'Order limit', value: fmt(req.orderLimit) },
                    { label: 'Over by', value: fmt(req.grandTotal - req.orderLimit), accent: true },
                  ]
              ).map(item => (
                <div key={item.label} className="flex flex-col gap-1">
                  <p className="font-['Noontree:Regular'] text-[10px] leading-[12px] text-[#959595] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{item.label}</p>
                  <p className={`font-['Noontree:Bold'] text-[13px] leading-[16px] tracking-[-0.12px] ${item.accent ? 'text-[#ef4444]' : 'text-[#0e0e0e]'}`} style={{ fontFeatureSettings: '"case" 1' }}>{item.value}</p>
                </div>
              ))}
            </div>
            {req.totalPendingExposure && req.totalPendingExposure > req.grandTotal && (
              <>
                <Divider />
                <div className="bg-[#fff7ed] border border-[#fdba74] rounded-xl p-2.5 flex items-start gap-2">
                  <AlertIcon size={16} color="#d97706" />
                  <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#92400e] tracking-[-0.12px] flex-1" style={{ fontFeatureSettings: '"case" 1' }}>
                    Total pending exposure from this buyer: <span className="font-['Noontree:SemiBold']">{fmt(req.totalPendingExposure)}</span> across {2} open requests.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Previously rejected callout */}
          {req.previouslyRejected && (
            <div className="bg-[#fff5f5] border border-[#fca5a5] rounded-2xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <XCircleIcon size={16} color="#ef4444" />
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#ef4444] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Previously rejected</p>
              </div>
              <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d] tracking-[-0.12px] italic" style={{ fontFeatureSettings: '"case" 1' }}>
                "{req.previousRejectionReason}"
              </p>
            </div>
          )}

          {/* Buyer note */}
          {req.buyerNote && (
            <div className="bg-white border border-[#ebebeb] rounded-2xl p-3">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] mb-2" style={{ fontFeatureSettings: '"case" 1' }}>Note from {req.requester.name.split(' ')[0]}</p>
              <div className="border-l-2 border-[#0076ff] pl-3">
                <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#5d5d5d] tracking-[-0.12px] italic" style={{ fontFeatureSettings: '"case" 1' }}>
                  "{req.buyerNote}"
                </p>
              </div>
            </div>
          )}

          {/* Snapshot: line items */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl">
            <div className="p-3 border-b border-[#ebebeb]">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Order snapshot</p>
            </div>
            <div className="p-3 flex flex-col gap-3">
              {req.lineItems.map(li => (
                <div key={li.id} className={`flex items-start gap-3 ${li.status === 'unavailable' ? 'opacity-50' : ''}`}>
                  <div className="w-8 h-8 bg-[#f5f5f5] rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] truncate" style={{ fontFeatureSettings: '"case" 1' }}>{li.title}</p>
                    <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595] tracking-[-0.12px]">{li.seller} · Qty {li.qty}</p>
                    {li.status === 'unavailable' && <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#ef4444]">No longer available</p>}
                    {li.status === 'price_increased' && (
                      <p className="font-['Noontree:Regular'] text-[11px] leading-[12px]">
                        <span className="text-[#959595] line-through">{fmt(li.unitPrice)}</span>
                        <span className="text-[#ef4444] ml-1">{fmt(li.newPrice!)}</span>
                      </p>
                    )}
                  </div>
                  <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap shrink-0">{fmt(li.lineTotal)}</p>
                </div>
              ))}
              <Divider />
              {[
                ['Shipping', req.shipping],
                ['VAT', req.vat],
                ...(req.discount ? [['Discount', -req.discount]] : []),
              ].map(([k, v]) => (
                <div key={String(k)} className="flex items-center justify-between">
                  <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{k}</p>
                  <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]">{Number(v) < 0 ? `–${fmt(-Number(v))}` : fmt(Number(v))}</p>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px]" style={{ fontFeatureSettings: '"case" 1' }}>Grand total</p>
                <p className="font-['Noontree:Bold'] text-[16px] leading-[20px] text-[#0e0e0e] tracking-[-0.16px]">{fmt(req.grandTotal)}</p>
              </div>
            </div>
          </div>

          {/* Ship-to + payment */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-3 flex flex-col gap-3">
            <div>
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px] mb-1" style={{ fontFeatureSettings: '"case" 1' }}>Deliver to</p>
              <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{req.shipTo}</p>
            </div>
            <Divider />
            <div>
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px] mb-1" style={{ fontFeatureSettings: '"case" 1' }}>Payment method</p>
              <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{req.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      {req.status === 'pending' && !decided && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3">
          {isSelf ? (
            <div className="bg-[#f5f5f5] rounded-xl p-3 text-center">
              <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Waiting for another approver</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <SecondaryBtn label="Reject" onClick={() => setAction('reject')} />
              <PrimaryBtn label="Approve" onClick={() => setAction('approve')} />
            </div>
          )}
        </div>
      )}

      {req.status === 'approved' && req.decisionBy && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3">
          <div className="bg-[#e5faec] border border-[#86efac] rounded-xl p-3 flex items-center gap-2">
            <InfoIcon color="#16a34a" size={18} />
            <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#16a34a] flex-1" style={{ fontFeatureSettings: '"case" 1' }}>
              Approved by <span className="font-['Noontree:SemiBold']">{req.decisionBy}</span>
            </p>
          </div>
        </div>
      )}

      {req.status === 'rejected' && req.rejectionReason && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3">
          <div className="bg-[#fff5f5] border border-[#fca5a5] rounded-xl p-3">
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#ef4444] mb-1" style={{ fontFeatureSettings: '"case" 1' }}>Rejected by {req.decisionBy}</p>
            <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d]" style={{ fontFeatureSettings: '"case" 1' }}>"{req.rejectionReason}"</p>
          </div>
        </div>
      )}

      {decided === 'approved' && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3">
          <div className="bg-[#e5faec] border border-[#86efac] rounded-xl p-3 flex items-center gap-2">
            <InfoIcon color="#16a34a" size={18} />
            <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#16a34a] flex-1" style={{ fontFeatureSettings: '"case" 1' }}>
              Approved. {req.requester.name.split(' ')[0]} has 24 hours to complete.
            </p>
          </div>
        </div>
      )}

      {decided === 'rejected' && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3">
          <div className="bg-[#fff5f5] border border-[#fca5a5] rounded-xl p-3">
            <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#ef4444]" style={{ fontFeatureSettings: '"case" 1' }}>
              Rejected. {req.requester.name.split(' ')[0]} will see your reason.
            </p>
          </div>
        </div>
      )}

      {/* Approve dialog */}
      {action === 'approve' && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 60 }}>
          <div className="absolute inset-0 bg-[#404553] opacity-60" onClick={() => setAction('none')} />
          <div className="relative bg-white rounded-2xl p-5 mx-4 w-full flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <InfoIcon color="#0076ff" size={22} />
              <p className="font-['Figtree:Bold'] text-[16px] leading-[22px] text-[#0e0e0e]" style={{ fontFeatureSettings: '"case" 1' }}>Approve this request?</p>
            </div>
            <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              Approving <span className="font-['Noontree:SemiBold'] text-[#0e0e0e]">{fmt(req.grandTotal)}</span> for <span className="font-['Noontree:SemiBold'] text-[#0e0e0e]">{req.requester.name}</span>. They will have 24 hours to complete the purchase. Prices are re-checked at that point.
            </p>
            <div className="flex gap-2">
              <SecondaryBtn label="Cancel" onClick={() => setAction('none')} />
              <PrimaryBtn label="Approve" onClick={doApprove} />
            </div>
          </div>
        </div>
      )}

      {/* Reject dialog */}
      {action === 'reject' && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 60 }}>
          <div className="absolute inset-0 bg-[#404553] opacity-60" onClick={() => setAction('none')} />
          <div className="relative bg-white rounded-2xl p-5 mx-4 w-full flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <XCircleIcon size={22} color="#ef4444" />
              <p className="font-['Figtree:Bold'] text-[16px] leading-[22px] text-[#0e0e0e]" style={{ fontFeatureSettings: '"case" 1' }}>Reject this request?</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Reason <span className="text-[#ef4444]">*</span></p>
                <p className={`font-['Noontree:Regular'] text-[11px] leading-[12px] ${rejectReason.length > 230 ? 'text-[#ef4444]' : 'text-[#959595]'}`}>{rejectReason.length} / 250</p>
              </div>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value.slice(0, 250))}
                placeholder={`${req.requester.name.split(' ')[0]} will see this reason…`}
                rows={4}
                className={`w-full bg-white border rounded-xl p-3 font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#0e0e0e] tracking-[-0.12px] outline-none resize-none placeholder:text-[#959595] ${rejectReason.length > 0 && rejectReason.length < 10 ? 'border-[#ef4444]' : 'border-[#ebebeb]'}`}
                style={{ fontFeatureSettings: '"case" 1' }}
              />
              {rejectReason.length > 0 && rejectReason.length < 10 && (
                <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#ef4444] mt-1">Minimum 10 characters</p>
              )}
              <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595] mt-1" style={{ fontFeatureSettings: '"case" 1' }}>{req.requester.name.split(' ')[0]} will see this reason.</p>
            </div>
            <div className="flex gap-2">
              <SecondaryBtn label="Cancel" onClick={() => setAction('none')} />
              <button
                onClick={doReject}
                disabled={rejectReason.length < 10}
                className={`flex-1 h-12 flex items-center justify-center rounded-xl font-['Noontree:SemiBold'] text-[16px] leading-[20px] tracking-[-0.16px] transition-colors ${rejectReason.length < 10 ? 'bg-[rgba(14,14,14,0.06)] text-[rgba(14,14,14,0.25)] cursor-not-allowed' : 'bg-[#ef4444] text-white hover:bg-[#dc2626] cursor-pointer'}`}
                style={{ fontFeatureSettings: '"case" 1' }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Filters sheet ─────────────────────────────────────────────────────────────

function FiltersSheet({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState('All');
  const [dateRange, setDateRange] = useState('All Time');
  const [minAmt, setMinAmt] = useState('');
  const [maxAmt, setMaxAmt] = useState('');

  const statuses = ['All', 'Pending', 'Approved', 'Auto-Approved', 'Rejected'];
  const dateRanges = ['All Time', 'Today', 'This Week', 'This Month'];

  return (
    <BottomSheet onDismiss={onClose}>
      <div className="bg-white border border-[#f9f9fb] flex flex-col overflow-clip rounded-2xl mx-3 w-[calc(100%-24px)]">
        <div className="border-b border-[#f5f5f5] flex items-center justify-center p-4">
          <p className="font-['Noontree:Bold'] text-[16px] leading-[20px] text-[#0e0e0e] tracking-[-0.16px]" style={{ fontFeatureSettings: '"case" 1' }}>Filters</p>
        </div>
        <div className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-3">
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Status</p>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map(s => (
                <button key={s} onClick={() => setStatus(s)} className={`flex gap-2 h-9 items-center justify-center rounded-lg px-3 transition-colors ${status === s ? 'bg-[#eff7ff] border-[1.5px] border-[#0076ff]' : 'bg-white border border-[#ebebeb]'}`}>
                  {status === s && <img alt="" className="size-4" src={imgCheck} />}
                  <p className={`font-['Noontree:Medium'] text-[14px] leading-[18px] tracking-[-0.14px] whitespace-nowrap ${status === s ? 'text-[#0076ff]' : 'text-[#0e0e0e]'}`} style={{ fontFeatureSettings: '"case" 1' }}>{s}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Date Range</p>
            <div className="grid grid-cols-2 gap-2">
              {dateRanges.map(d => (
                <button key={d} onClick={() => setDateRange(d)} className={`flex h-9 items-center justify-center rounded-lg px-3 transition-colors ${dateRange === d ? 'bg-[#eff7ff] border-[1.5px] border-[#0076ff]' : 'bg-white border border-[#ebebeb]'}`}>
                  <p className={`font-['Noontree:Medium'] text-[14px] leading-[18px] tracking-[-0.14px] whitespace-nowrap ${dateRange === d ? 'text-[#0076ff]' : 'text-[#0e0e0e]'}`} style={{ fontFeatureSettings: '"case" 1' }}>{d}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Amount Range</p>
            <div className="flex gap-3 items-center">
              {[{ val: minAmt, set: setMinAmt, ph: 'Min' }, { val: maxAmt, set: setMaxAmt, ph: 'Max' }].map((f, i) => (
                <>
                  {i > 0 && <p key="to" className="font-['Noontree:Medium'] text-[14px] text-[#959595] whitespace-nowrap">to</p>}
                  <div key={f.ph} className="flex-1 bg-white border border-[#dfdfdf] flex gap-1.5 h-12 items-center pl-3.5 pr-2.5 rounded-xl">
                    <p className="font-['Noontree:Bold'] text-[13px] text-[#0e0e0e] whitespace-nowrap shrink-0">AED</p>
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} className="flex-1 font-['Noontree:Medium'] text-[13px] text-[#0e0e0e] outline-none placeholder:text-[#959595] bg-transparent min-w-0" />
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white border-t border-[#f5f5f5] flex gap-2 items-center p-3">
          <SecondaryBtn label="Reset" onClick={() => { setStatus('All'); setDateRange('All Time'); setMinAmt(''); setMaxAmt(''); }} />
          <PrimaryBtn label="Apply Filters" onClick={onClose} />
        </div>
      </div>
    </BottomSheet>
  );
}
