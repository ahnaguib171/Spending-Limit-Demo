import { useState } from 'react';
import { REQUESTS, fmt, ORG_NAME, type ApprovalRequest, type RequestStatus } from '../data';
import {
  TopHeader, BottomNav, StatusChip, CountdownChip, Avatar,
  Divider, PrimaryBtn, SecondaryBtn, XCircleIcon, InfoIcon, AlertIcon,
} from '../components';

// ─── My Requests list ─────────────────────────────────────────────────────────

export function MyRequests({ onOpenRequest }: { onOpenRequest: (req: ApprovalRequest) => void }) {
  const [view, setView] = useState<'list' | 'complete' | 'validation-failed'>('list');
  const [selected, setSelected] = useState<ApprovalRequest | null>(null);

  const myRequests = REQUESTS; // In a real app, filtered by current user

  if (view === 'complete' && selected) {
    return <CompletePurchase req={selected} onBack={() => setView('list')} onPlace={() => setView('list')} />;
  }

  if (view === 'validation-failed' && selected) {
    return <ValidationFailed req={selected} onBack={() => setView('list')} />;
  }

  const approvedCount = myRequests.filter(r => r.status === 'approved').length;

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb]">
      <TopHeader title="My requests" subtitle={`${myRequests.length} requests`} />

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3" style={{ scrollbarWidth: 'none' }}>
        {myRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-16 gap-3">
            <div className="bg-[#f5f5f5] flex items-center justify-center rounded-full w-14 h-14">
              <InfoIcon color="#9ca3af" size={28} />
            </div>
            <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#959595] text-center tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              Orders above your limit appear here while they wait for approval. Your limit is AED 10,000.00.
            </p>
          </div>
        )}

        {myRequests.map(req => (
          <RequestRow
            key={req.id}
            req={req}
            onOpen={() => onOpenRequest(req)}
            onComplete={() => { setSelected(req); setView('complete'); }}
            onValidationFailed={() => { setSelected(req); setView('validation-failed'); }}
          />
        ))}
        <div className="h-4" />
      </div>

      <BottomNav role="buyer" myRequestsCount={approvedCount} />
    </div>
  );
}

function RequestRow({ req, onOpen, onComplete, onValidationFailed }: {
  req: ApprovalRequest;
  onOpen: () => void;
  onComplete: () => void;
  onValidationFailed: () => void;
}) {
  const [withdrawn, setWithdrawn] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const effectiveStatus: RequestStatus = withdrawn ? 'withdrawn' : req.status;

  const actionMap: Record<RequestStatus, { primary?: { label: string; action: () => void; danger?: boolean }; secondary?: { label: string; action: () => void } }> = {
    pending: {
      secondary: { label: 'Withdraw', action: () => setShowWithdrawConfirm(true) },
    },
    approved: {
      primary: { label: 'Complete purchase', action: onComplete },
      secondary: { label: 'View details', action: onOpen },
    },
    completed: {
      secondary: { label: 'View order', action: onOpen },
    },
    rejected: {
      secondary: { label: 'View reason', action: onOpen },
    },
    expired: {
      primary: { label: 'Restore to cart', action: () => {} },
    },
    approval_lapsed: {
      primary: { label: 'Restore to cart', action: () => {} },
    },
    withdrawn: {
      primary: { label: 'Restore to cart', action: () => {} },
    },
    validation_failed: {
      primary: { label: 'Restore to cart', action: () => {} },
      secondary: { label: 'See what changed', action: onValidationFailed },
    },
  };

  const actions = actionMap[effectiveStatus] || {};

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
      className="bg-white border border-[#ebebeb] rounded-2xl p-3 flex flex-col gap-3 cursor-pointer hover:border-[#c9c9c9] transition-colors"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar initials={req.requester.initials} />
          <div>
            <p className="font-['Noontree:SemiBold'] text-[13px] leading-[16px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{req.reference}</p>
            <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595] tracking-[-0.12px]">
              {new Date(req.submittedAt).toLocaleDateString('en-AE', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-['Noontree:Bold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px]">{fmt(req.grandTotal)}</p>
          <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595] tracking-[-0.12px]">{req.productCount} products · {req.itemCount} items</p>
        </div>
      </div>

      <Divider />

      {/* Status + countdown */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusChip status={effectiveStatus} />
          {effectiveStatus === 'pending' && <CountdownChip expiresAt={req.expiresAt} small />}
          {effectiveStatus === 'approved' && (
            <span className="inline-flex items-center rounded-full border font-['Noontree:Medium'] text-[10px] leading-[14px] px-2 py-0.5 bg-[#eff7ff] text-[#0076ff] border-[#96c6ff] whitespace-nowrap">
              24h to complete
            </span>
          )}
        </div>
        {effectiveStatus === 'rejected' && req.rejectionReason && (
          <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#959595] tracking-[-0.12px] italic flex-1 min-w-0 truncate" style={{ fontFeatureSettings: '"case" 1' }}>
            "{req.rejectionReason}"
          </p>
        )}
      </div>

      {/* Actions */}
      {(actions.primary || actions.secondary) && (
        <div className="flex gap-2">
          {actions.secondary && (
            <button
              onClick={e => { e.stopPropagation(); actions.secondary?.action(); }}
              className="flex-1 h-9 flex items-center justify-center border border-[rgba(14,14,14,0.12)] rounded-xl font-['Noontree:SemiBold'] text-[13px] leading-[18px] text-[#0e0e0e] tracking-[-0.12px] cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ fontFeatureSettings: '"case" 1' }}
            >
              {actions.secondary.label}
            </button>
          )}
          {actions.primary && (
            <button
              onClick={e => { e.stopPropagation(); actions.primary?.action(); }}
              className={`flex-1 h-9 flex items-center justify-center rounded-xl font-['Noontree:SemiBold'] text-[13px] leading-[18px] tracking-[-0.12px] cursor-pointer transition-colors whitespace-nowrap ${
                actions.primary.danger
                  ? 'bg-[#fff5f5] text-[#ef4444] border border-[#fca5a5] hover:bg-[#fef2f2]'
                  : effectiveStatus === 'approved'
                  ? 'bg-[#0076ff] text-white hover:bg-[#0068e6]'
                  : 'bg-[#f5f5f5] text-[#0e0e0e] hover:bg-[#ebebeb]'
              }`}
              style={{ fontFeatureSettings: '"case" 1' }}
            >
              {actions.primary.label}
            </button>
          )}
        </div>
      )}

      {/* Withdraw confirm inline */}
      {showWithdrawConfirm && (
        <div className="bg-[#fff5f5] border border-[#fca5a5] rounded-xl p-3 flex flex-col gap-3" onClick={e => e.stopPropagation()}>
          <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d]" style={{ fontFeatureSettings: '"case" 1' }}>
            Withdraw this request? The items will be available to restore for 30 days.
          </p>
          <div className="flex gap-2">
            <button onClick={() => setShowWithdrawConfirm(false)} className="flex-1 h-9 flex items-center justify-center border border-[rgba(14,14,14,0.12)] rounded-xl font-['Noontree:SemiBold'] text-[13px] text-[#0e0e0e] cursor-pointer hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={() => { setWithdrawn(true); setShowWithdrawConfirm(false); }}
              className="flex-1 h-9 flex items-center justify-center bg-[#ef4444] rounded-xl font-['Noontree:SemiBold'] text-[13px] text-white cursor-pointer hover:bg-[#dc2626]"
            >
              Withdraw
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Complete purchase ─────────────────────────────────────────────────────────

export function CompletePurchase({ req, onBack, onPlace }: { req: ApprovalRequest; onBack: () => void; onPlace: () => void }) {
  const priceDrop = req.grandTotal > 11800; // simulate price drop scenario
  const finalTotal = priceDrop ? req.grandTotal - 550 : req.grandTotal;

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb]">
      <div className="bg-white flex flex-col shrink-0" style={{ boxShadow: '0 1px 1.5px rgba(14,14,14,0.07)' }}>
        <div className="flex gap-3 items-center pb-3 pt-14 px-3">
          <button onClick={onBack} className="bg-white border border-[#ebebeb] rounded-[18px] shrink-0">
            <div className="flex items-center justify-center p-2 size-9">
              <svg viewBox="0 0 20 20" fill="none" className="size-5"><path d="M12 4l-6 6 6 6" stroke="#0e0e0e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </button>
          <p className="font-['Figtree:Bold'] text-[18px] leading-[26px] text-[#0e0e0e]" style={{ fontFeatureSettings: '"case" 1' }}>Complete purchase</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24" style={{ scrollbarWidth: 'none' }}>
        <div className="p-3 flex flex-col gap-3">
          {/* Approval badge */}
          <div className="bg-[#e5faec] border border-[#86efac] rounded-2xl p-3 flex items-start gap-2">
            <InfoIcon color="#16a34a" size={18} />
            <div className="flex-1">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#16a34a] mb-1" style={{ fontFeatureSettings: '"case" 1' }}>Approved by {req.decisionBy ?? 'Khalid Al-Mansoori'}</p>
              {priceDrop && (
                <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#166534]" style={{ fontFeatureSettings: '"case" 1' }}>
                  Good news: the total dropped to <span className="font-['Noontree:SemiBold']">{fmt(finalTotal)}</span> since approval.
                </p>
              )}
            </div>
          </div>

          {/* Items - read only */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl">
            <div className="p-3 border-b border-[#ebebeb] flex items-center justify-between">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Items ({req.itemCount})</p>
              <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595]">Read-only — items can't be changed</p>
            </div>
            <div className="p-3 flex flex-col gap-3">
              {req.lineItems.map(li => (
                <div key={li.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#f5f5f5] rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] truncate" style={{ fontFeatureSettings: '"case" 1' }}>{li.title}</p>
                    <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595]">Qty {li.qty}</p>
                  </div>
                  <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] whitespace-nowrap shrink-0">{fmt(li.lineTotal)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-3 flex flex-col gap-2">
            {[
              ['Subtotal', fmt(req.grandTotal - req.shipping - req.vat + req.discount)],
              ['Shipping', fmt(req.shipping)],
              ['VAT (5%)', fmt(req.vat)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{k}</p>
                <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]">{v}</p>
              </div>
            ))}
            <Divider />
            <div className="flex items-center justify-between">
              <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px]" style={{ fontFeatureSettings: '"case" 1' }}>Total</p>
              <div className="text-right">
                {priceDrop && <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#959595] line-through">{fmt(req.grandTotal)}</p>}
                <p className="font-['Noontree:Bold'] text-[16px] leading-[20px] text-[#0e0e0e] tracking-[-0.16px]">{fmt(finalTotal)}</p>
              </div>
            </div>
          </div>

          {/* Ship-to + payment */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-3 flex flex-col gap-3">
            <div>
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px] mb-1">Deliver to</p>
              <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{req.shipTo}</p>
            </div>
            <Divider />
            <div>
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px] mb-1">Payment</p>
              <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{req.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3">
        <PrimaryBtn label="Place order" onClick={onPlace} />
      </div>
    </div>
  );
}

// ─── Validation failed ─────────────────────────────────────────────────────────

export function ValidationFailed({ req, onBack }: { req: ApprovalRequest; onBack: () => void }) {
  const failedItems = req.lineItems.filter(li => li.status !== 'ok');

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb]">
      <div className="bg-white flex flex-col shrink-0" style={{ boxShadow: '0 1px 1.5px rgba(14,14,14,0.07)' }}>
        <div className="flex gap-3 items-center pb-3 pt-14 px-3">
          <button onClick={onBack} className="bg-white border border-[#ebebeb] rounded-[18px] shrink-0">
            <div className="flex items-center justify-center p-2 size-9">
              <svg viewBox="0 0 20 20" fill="none" className="size-5"><path d="M12 4l-6 6 6 6" stroke="#0e0e0e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </button>
          <p className="font-['Figtree:Bold'] text-[18px] leading-[26px] text-[#0e0e0e]" style={{ fontFeatureSettings: '"case" 1' }}>Couldn't complete</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24" style={{ scrollbarWidth: 'none' }}>
        <div className="p-3 flex flex-col gap-3">
          {/* Error header */}
          <div className="bg-[#fff5f5] border border-[#fca5a5] rounded-2xl p-4 flex flex-col items-center gap-3 text-center">
            <div className="bg-[#fef2f2] flex items-center justify-center rounded-full" style={{ width: 56, height: 56 }}>
              <XCircleIcon size={28} color="#ef4444" />
            </div>
            <div>
              <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#ef4444] mb-1" style={{ fontFeatureSettings: '"case" 1' }}>Order couldn't be completed</p>
              <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d]" style={{ fontFeatureSettings: '"case" 1' }}>
                Something changed since approval. The approval no longer applies — you'll need to resubmit.
              </p>
            </div>
          </div>

          {/* Failed checks */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl">
            <div className="p-3 border-b border-[#ebebeb]">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>What changed</p>
            </div>
            <div className="p-3 flex flex-col gap-3">
              {failedItems.map(li => (
                <div key={li.id} className={`flex items-start gap-3 p-2.5 rounded-xl ${li.status === 'unavailable' ? 'bg-[#f5f5f5]' : 'bg-[#fff7ed]'}`}>
                  <div className="w-8 h-8 bg-white rounded-lg shrink-0 border border-[#ebebeb]" />
                  <div className="flex-1 min-w-0">
                    <p className={`font-['Noontree:Regular'] text-[12px] leading-[14px] tracking-[-0.12px] truncate ${li.status === 'unavailable' ? 'text-[#959595] line-through' : 'text-[#0e0e0e]'}`} style={{ fontFeatureSettings: '"case" 1' }}>
                      {li.title}
                    </p>
                    {li.status === 'unavailable' && (
                      <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#ef4444] mt-0.5">No longer available</p>
                    )}
                    {li.status === 'price_increased' && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595] line-through">{fmt(li.unitPrice)}</p>
                        <p className="font-['Noontree:SemiBold'] text-[11px] leading-[12px] text-[#d97706]">{fmt(li.newPrice!)}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {failedItems.length === 0 && (
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#fff7ed]">
                  <AlertIcon size={18} color="#d97706" />
                  <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#92400e]" style={{ fontFeatureSettings: '"case" 1' }}>
                    Prices went up after approval, so it needs a new approval.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recovery */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-3 flex flex-col gap-3">
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>What to do next</p>
            <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              Restore the available items to your cart and submit a new request with the updated prices. Unavailable items won't be added.
            </p>
            <PrimaryBtn label="Restore to cart" onClick={onBack} />
          </div>
        </div>
      </div>
    </div>
  );
}
