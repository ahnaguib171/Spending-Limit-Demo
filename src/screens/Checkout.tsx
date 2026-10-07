import { useState } from 'react';
import { fmt, ORG_NAME } from '../data';
import { PrimaryBtn, SecondaryBtn, InfoIcon, TopHeader, BottomNav, Divider } from '../components';

// ─── Over-limit checkout screen ───────────────────────────────────────────────

export function CheckoutOverLimit({ onSubmit }: { onSubmit: () => void }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [addressChanged, setAddressChanged] = useState(false);

  const orderTotal = addressChanged ? 19250 : 18450;
  const limit = 10000;
  const gap = orderTotal - limit;
  const CHAR_LIMIT = 500;

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb]">
      <TopHeader title="Review order" onBack={() => {}} />

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {/* Order items */}
        <div className="bg-white mx-3 mt-3 rounded-2xl border border-[#ebebeb]">
          <div className="p-3 flex flex-col gap-3">
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Order items (3 products · 8 items)</p>
            {[
              { title: 'Logitech MX Keys Keyboard', qty: 5, price: 450 },
              { title: 'Samsung T7 SSD 1TB', qty: 3, price: 680 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f5f5f5] rounded-lg shrink-0 flex items-center justify-center">
                  <p className="text-[18px]">{i === 0 ? '⌨️' : '💾'}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] truncate" style={{ fontFeatureSettings: '"case" 1' }}>{item.title}</p>
                  <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595] tracking-[-0.12px]">Qty: {item.qty}</p>
                </div>
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap">{fmt(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ship-to */}
        <div className="bg-white mx-3 mt-2 rounded-2xl border border-[#ebebeb] p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Deliver to</p>
            <button onClick={() => setAddressChanged(a => !a)} className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0076ff] tracking-[-0.12px] cursor-pointer">
              {addressChanged ? 'Original' : 'Change'}
            </button>
          </div>
          <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
            {addressChanged ? '789 Sheikh Zayed Road, Dubai, UAE' : '456 DIFC Tower, Dubai, UAE'}
          </p>
          {addressChanged && (
            <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#d97706] tracking-[-0.12px] mt-1">Shipping cost updated</p>
          )}
        </div>

        {/* Payment — label changes when over limit */}
        <div className="bg-white mx-3 mt-2 rounded-2xl border border-[#ebebeb] p-3">
          <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] mb-2" style={{ fontFeatureSettings: '"case" 1' }}>
            Payment method <span className="text-[#d97706]">(charged only after approval)</span>
          </p>
          <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d]">Corporate Card ****4521</p>
        </div>

        {/* Order summary */}
        <div className="bg-white mx-3 mt-2 rounded-2xl border border-[#ebebeb] p-3 flex flex-col gap-2">
          <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Order summary</p>
          {[
            ['Subtotal', fmt(17580)],
            ['Shipping', fmt(60)],
            ['VAT (5%)', fmt(810)],
            ['Discount', `–${fmt(0)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{k}</p>
              <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]">{v}</p>
            </div>
          ))}
          <Divider />
          <div className="flex items-center justify-between">
            <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px]" style={{ fontFeatureSettings: '"case" 1' }}>Total</p>
            <p className="font-['Noontree:Bold'] text-[16px] leading-[20px] text-[#0e0e0e] tracking-[-0.16px]">{fmt(orderTotal)}</p>
          </div>
        </div>

        {/* ✦ Approval banner */}
        <div className="mx-3 mt-3 bg-[#fff7ed] border border-[#fdba74] rounded-2xl p-3 flex gap-2">
          <div className="shrink-0 mt-0.5"><InfoIcon color="#d97706" size={18} /></div>
          <div className="flex-1">
            <p className="font-['Noontree:SemiBold'] text-[13px] leading-[18px] text-[#d97706] tracking-[-0.12px] mb-1" style={{ fontFeatureSettings: '"case" 1' }}>This order needs approval</p>
            <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#92400e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              Your order total is <span className="font-['Noontree:SemiBold']">{fmt(orderTotal)}</span>. Your limit is <span className="font-['Noontree:SemiBold']">{fmt(limit)}</span> (over by <span className="font-['Noontree:SemiBold']">{fmt(gap)}</span>). An Owner or Admin in <span className="font-['Noontree:SemiBold']">{ORG_NAME}</span> will review it.
            </p>
          </div>
        </div>

        {/* Note to approvers */}
        <div className="mx-3 mt-2 mb-1">
          {!noteOpen ? (
            <button onClick={() => setNoteOpen(true)} className="font-['Noontree:SemiBold'] text-[13px] leading-[18px] text-[#0076ff] tracking-[-0.12px] cursor-pointer" style={{ fontFeatureSettings: '"case" 1' }}>
              + Add a note for approvers
            </button>
          ) : (
            <div className="bg-white border border-[#ebebeb] rounded-xl p-3">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] mb-2" style={{ fontFeatureSettings: '"case" 1' }}>Note for approvers</p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value.slice(0, CHAR_LIMIT))}
                placeholder="Add context or urgency for the approver…"
                rows={3}
                className="w-full font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#0e0e0e] tracking-[-0.12px] outline-none resize-none placeholder:text-[#959595]"
                style={{ fontFeatureSettings: '"case" 1' }}
              />
              {note.length >= 400 && (
                <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#959595] mt-1 text-right">{note.length} / {CHAR_LIMIT}</p>
              )}
            </div>
          )}
        </div>

        <div className="h-6" />
      </div>

      {/* Sticky footer */}
      <div className="bg-white border-t border-[#ebebeb] p-3">
        <PrimaryBtn label="Submit for approval" onClick={onSubmit} />
      </div>
    </div>
  );
}

// ─── Confirmation screen ──────────────────────────────────────────────────────

export function CheckoutConfirmation({ onViewRequest, onContinue }: { onViewRequest: () => void; onContinue: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#f9f9fb]">
      <div className="bg-white border-b border-[#ebebeb] flex gap-3 items-center pb-3 pt-14 px-3 w-full" style={{ boxShadow: '0 1px 1.5px rgba(14,14,14,0.07)' }}>
        <p className="font-['Figtree:Bold'] text-[18px] leading-[26px] text-[#0e0e0e]" style={{ fontFeatureSettings: '"case" 1' }}>Order submitted</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        {/* Icon */}
        <div className="bg-[#eff7ff] flex items-center justify-center rounded-full" style={{ width: 80, height: 80 }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 22l9 9L32 11" stroke="#0076ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Heading */}
        <div className="text-center">
          <p className="font-['Figtree:Bold'] text-[20px] leading-[28px] text-[#0e0e0e] mb-2" style={{ fontFeatureSettings: '"case" 1' }}>Request sent for approval</p>
          <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
            Nothing has been charged. Your cart has been cleared while the request is open.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-4 w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Reference</p>
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]">APR-2026-002</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Order total</p>
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]">{fmt(18450)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Items</p>
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]">8 items · 3 products</p>
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Expires</p>
            <span className="inline-flex items-center rounded-full border font-['Noontree:SemiBold'] text-[11px] leading-[16px] px-2.5 py-0.5 bg-[#fff7ed] text-[#d97706] border-[#fdba74]">
              Expires in 72h
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <PrimaryBtn label="View request" onClick={onViewRequest} />
          <SecondaryBtn label="Continue shopping" onClick={onContinue} fullWidth />
        </div>
      </div>

      <BottomNav role="buyer" myRequestsCount={1} />
    </div>
  );
}
