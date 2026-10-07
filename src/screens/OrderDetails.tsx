import { useState } from 'react';
import { fmt, type OrgOrder, type ApprovalRequest, ORG_ORDERS, REQUESTS } from '../data';

export type OLTab = 'all' | 'processing' | 'delivered' | 'cancelled';
export type OrderApprovalTab = 'auto' | 'manual';
export type RequestDetailTab = 'pending' | 'approved' | 'rejected' | 'expired';

export function filterOrdersByTab(tab: OLTab): OrgOrder[] {
  if (tab === 'all') return ORG_ORDERS;
  if (tab === 'processing') return ORG_ORDERS.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'shipped');
  if (tab === 'delivered') return ORG_ORDERS.filter(o => o.orderStatus === 'delivered');
  return [];
}

export function filterOrdersByApproval(tab: OrderApprovalTab): OrgOrder[] {
  return ORG_ORDERS.filter(o => o.approvalType === tab);
}

export function filterRequestsByTab(tab: RequestDetailTab): ApprovalRequest[] {
  if (tab === 'pending') return REQUESTS.filter(r => r.status === 'pending');
  if (tab === 'approved') return REQUESTS.filter(r => r.status === 'approved');
  if (tab === 'rejected') return REQUESTS.filter(r => r.status === 'rejected');
  return REQUESTS.filter(r => r.status === 'expired' || r.status === 'approval_lapsed');
}

export function tabForRequest(req: ApprovalRequest): RequestDetailTab {
  if (req.status === 'pending') return 'pending';
  if (req.status === 'approved') return 'approved';
  if (req.status === 'rejected') return 'rejected';
  return 'expired';
}

export function tabForOrderApproval(order: OrgOrder): OrderApprovalTab {
  return order.approvalType === 'auto' ? 'auto' : 'manual';
}

export const ORDER_STATUS_NAV: { id: OrderApprovalTab; label: string }[] = [
  { id: 'auto', label: 'Auto approved' },
  { id: 'manual', label: 'Manually approved' },
];

export const REQUEST_STATUS_NAV: { id: RequestDetailTab; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'expired', label: 'Expired' },
];

function DetailTabBar<T extends string>({
  tabs, active, onChange,
}: {
  tabs: { id: T; label: string; badge?: number }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex items-start w-full bg-white drop-shadow-[0px_1px_1.5px_rgba(14,14,14,0.07)] overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="flex flex-col items-center justify-center shrink-0 cursor-pointer"
          >
            <div className="flex gap-1.5 items-center justify-center p-3">
              <p
                className="whitespace-nowrap tracking-[-0.14px]"
                style={{
                  fontFamily: isActive ? "'Noontree:SemiBold'" : "'Noontree:Medium'",
                  fontSize: 14,
                  lineHeight: '18px',
                  color: isActive ? '#0e0e0e' : '#959595',
                  fontFeatureSettings: '"case" 1',
                }}
              >
                {t.label}
              </p>
              {t.badge != null && t.badge > 0 && (
                <div className="flex items-center justify-center overflow-clip py-0.5 rounded-lg w-4 shrink-0" style={{ background: isActive ? 'rgba(0,118,255,0.1)' : 'rgba(14,14,14,0.04)' }}>
                  <p className="font-['Noontree:Regular'] text-[10px] leading-3 text-center whitespace-nowrap" style={{ color: isActive ? '#0076ff' : '#959595', fontFeatureSettings: '"case" 1' }}>{t.badge}</p>
                </div>
              )}
            </div>
            <div className="flex h-0.5 items-center justify-center px-2 w-full border-b border-[#ebebeb]">
              {isActive && <div className="bg-[#0076ff] flex-1 h-full rounded-t-[4px]" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DetailEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 px-6">
      <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#5d5d5d] text-center">{message}</p>
      <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#959595] text-center">Pick another status tab above</p>
    </div>
  );
}

import { assetPathPrefix } from '../assetPaths';

// icons from NB Consumer App design
const imgBackIcon        = `${assetPathPrefix}/b96c7.svg`;
const imgCopyIcon        = `${assetPathPrefix}/148b7.svg`;
const imgCheckFill       = `${assetPathPrefix}/42714.svg`;   // green completed step
const imgCircleActive    = `${assetPathPrefix}/6d510.svg`;   // blue current step
const imgCircleInactive  = `${assetPathPrefix}/ac666.svg`;   // gray future step
const imgOutlineUser     = `${assetPathPrefix}/3603a.svg`;
const imgOutlineCheck    = `${assetPathPrefix}/b317c.svg`;
const imgOutlineBuilding = `${assetPathPrefix}/68e1a.svg`;
const imgOutlinePhone    = `${assetPathPrefix}/11c2f.svg`;
const imgSolidCheckSm    = `${assetPathPrefix}/08246.svg`;
const imgOrderSummaryIcon = `${assetPathPrefix}/88cf9.svg`;
const imgChevronRight    = `${assetPathPrefix}/26124.svg`;
const imgReorderIcon     = `${assetPathPrefix}/76e67.svg`;
const imgProductPhoto    = `${assetPathPrefix}/191bf.png`;

// bottom-nav icons
const imgHomeInactive    = `${assetPathPrefix}/472b4.svg`;
const imgAccountActive   = `${assetPathPrefix}/e32db.svg`;
const imgCartInactive    = `${assetPathPrefix}/271bc.svg`;

// ─── Timeline ────────────────────────────────────────────────────────────────

type StepState = 'done' | 'active' | 'pending';

interface TimelineStep {
  label: string;
  sub?: string;
  date?: string;
  state: StepState;
}

function TimelineStepItem({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  const dot =
    step.state === 'done' ? (
      <div className="bg-[#62cb68] overflow-clip relative rounded-full shrink-0 size-7">
        <div className="absolute inset-0 flex items-center justify-center">
          <img alt="" className="size-[18px]" src={imgCheckFill} />
        </div>
      </div>
    ) : step.state === 'active' ? (
      <div className="bg-[#0076ff] overflow-clip relative rounded-full shrink-0 size-7">
        <div className="absolute inset-0 flex items-center justify-center">
          <img alt="" className="size-[18px]" src={imgCircleActive} />
        </div>
      </div>
    ) : (
      <div className="bg-[#f5f5f5] overflow-clip relative rounded-full shrink-0 size-7">
        <div className="absolute inset-0 flex items-center justify-center">
          <img alt="" className="size-[18px]" src={imgCircleInactive} />
        </div>
      </div>
    );

  const lineColor = step.state === 'done' ? 'bg-[#62cb68]' : 'bg-[#eaecf0]';

  return (
    <div className="flex gap-3 items-start w-full">
      {/* indicator column */}
      <div className="flex flex-col items-center gap-0.5 pt-0.5 self-stretch shrink-0">
        {dot}
        {!isLast && <div className={`${lineColor} flex-1 min-h-px rounded-full w-[2.5px]`} />}
      </div>
      {/* content */}
      <div className="flex flex-col gap-1 flex-1 min-w-0 pb-6">
        <div className="flex flex-col gap-1">
          <p className={`font-['Noontree:SemiBold'] text-[14px] leading-[18px] tracking-[-0.14px] ${step.state === 'active' ? 'text-[#0076ff]' : 'text-[#0e0e0e]'}`} style={{ fontFeatureSettings: '"case" 1' }}>
            {step.label}
          </p>
          {step.sub && (
            <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              {step.sub}
            </p>
          )}
        </div>
        {step.date && (
          <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
            {step.date}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Bottom nav ──────────────────────────────────────────────────────────────

function BottomNavBar() {
  return (
    <div className="bg-white shrink-0 w-full" style={{ boxShadow: '0px -4px 4.5px rgba(0,0,0,0.04)' }}>
      <div className="flex gap-1 h-[63px] items-center justify-center w-full">
        <div className="flex flex-1 flex-col gap-2 items-center px-5">
          <div className="h-1 w-full" />
          <div className="flex flex-col gap-1 items-center">
            <div className="flex flex-col items-center justify-center size-8">
              <img alt="" className="w-6 h-[21px]" src={imgHomeInactive} />
            </div>
            <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] text-[#475067] tracking-[-0.12px] whitespace-nowrap">Home</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 items-center px-5">
          <div className="h-1 w-full bg-[#1155cb] rounded-full" />
          <div className="flex flex-col gap-1 items-center">
            <div className="flex flex-col items-center justify-center size-8">
              <img alt="" className="size-5" src={imgAccountActive} />
            </div>
            <p className="font-['Noontree:Bold'] text-[12px] leading-[14px] text-[#1155cb] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Account</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 items-center px-5 relative">
          <div className="h-1 w-full" />
          <div className="flex flex-col gap-1 items-center relative">
            <div className="flex flex-col items-center justify-center size-8 relative">
              <img alt="" className="size-5" src={imgCartInactive} />
              <div className="absolute bg-[#0076ff] flex items-center justify-center overflow-clip px-1.5 py-0.5 right-[-9px] rounded-full top-[-6px]">
                <p className="font-['Noontree:SemiBold'] text-[10px] leading-3 text-white tracking-[1px] uppercase" style={{ fontFeatureSettings: '"case" 1' }}>1</p>
              </div>
            </div>
            <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] text-[#475067] tracking-[-0.12px] whitespace-nowrap">Cart</p>
          </div>
        </div>
      </div>
      <div className="bg-white flex flex-col items-center justify-center pb-2 pt-3 w-full">
        <div className="bg-[#404553] h-[5px] rounded-lg w-[124px]" />
      </div>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#f5f5f5] rounded-xl w-full ${className}`}>
      {children}
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function OrderDetails({ order, onBack }: { order: OrgOrder | null; onBack: () => void }) {
  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <div className="flex flex-col h-full bg-[#f9f9fb]">
        <div className="bg-white border-b border-[#ebebeb] flex items-center justify-between px-3 py-3 pt-14 shrink-0">
          <button
            onClick={onBack}
            className="bg-white border border-[#ebebeb] flex items-center justify-center p-2 rounded-[18px] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
          >
            <img alt="Back" className="size-5" src={imgBackIcon} />
          </button>
          <p className="font-['Noontree:Bold'] text-[16px] leading-5 text-[#0e0e0e] tracking-[-0.16px]" style={{ fontFeatureSettings: '"case" 1' }}>Order Details</p>
          <div className="w-9" />
        </div>
        <DetailEmptyState message="No orders in this status" />
        <BottomNavBar />
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(order.reference).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Build timeline based on order status + approval type
  const steps: TimelineStep[] = [
    {
      label: 'Order placed',
      date: order.date + ', 10:22 AM',
      state: 'done',
    },
  ];

  if (order.approvalType === 'manual' && order.approvedBy) {
    steps.push({
      label: 'Order approved',
      sub: `by ${order.approvedBy}`,
      date: order.approvedAt ?? order.date,
      state: 'done',
    });
  } else if (order.approvalType === 'auto') {
    steps.push({
      label: 'Auto-approved',
      sub: 'Below org limit — no approval needed',
      date: order.date + ', 10:22 AM',
      state: 'done',
    });
  }

  const statusStepMap: Record<OrgOrder['orderStatus'], { label: string; state: StepState }[]> = {
    processing: [
      { label: 'Being processed', state: 'active' },
      { label: 'Out for delivery', state: 'pending' },
      { label: 'Estimated delivery', state: 'pending' },
    ],
    shipped: [
      { label: 'Being processed', state: 'done' },
      { label: 'Out for delivery', state: 'active' },
      { label: 'Estimated delivery', state: 'pending' },
    ],
    delivered: [
      { label: 'Being processed', state: 'done' },
      { label: 'Out for delivery', state: 'done' },
      { label: 'Delivered', state: 'done' },
    ],
  };

  const laterSteps = statusStepMap[order.orderStatus];
  laterSteps.forEach((s, i) => {
    const isLast = i === laterSteps.length - 1;
    steps.push({
      ...s,
      date: isLast && order.orderStatus !== 'delivered' ? '6 May 2026' : undefined,
    });
  });

  const estimatedDelivery = order.orderStatus === 'delivered' ? undefined : '6 May 2026';

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb]">
      <div className="bg-white border-b border-[#ebebeb] flex items-center justify-between px-3 py-3 pt-14 shrink-0">
        <button
          onClick={onBack}
          className="bg-white border border-[#ebebeb] flex items-center justify-center p-2 rounded-[18px] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
        >
          <img alt="Back" className="size-5" src={imgBackIcon} />
        </button>
        <p className="font-['Noontree:Bold'] text-[16px] leading-5 text-[#0e0e0e] tracking-[-0.16px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>
          Order Details
        </p>
        <button type="button" className="cursor-pointer min-w-9 text-right">
          <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#1155cb] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Need help?</p>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex flex-col gap-3 p-3 pb-6">

          {/* Order ID */}
          <Card>
            <div className="flex items-center justify-between pl-4 pr-3 py-3">
              <div className="flex flex-col gap-1">
                <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Order ID</p>
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{order.reference}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[#f5f5f5] transition-colors"
              >
                <img alt="" className="shrink-0 size-[14px]" src={imgCopyIcon} />
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0076ff] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>
                  {copied ? 'Copied!' : 'Copy'}
                </p>
              </button>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <div className="flex flex-col gap-4 p-3">
              {estimatedDelivery && (
                <div className="flex flex-col gap-1">
                  <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Estimated Delivery</p>
                  <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#1155cb] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{estimatedDelivery}</p>
                </div>
              )}
              <div className="flex flex-col pl-3">
                {steps.map((step, i) => (
                  <TimelineStepItem key={i} step={step} isLast={i === steps.length - 1} />
                ))}
              </div>
            </div>
          </Card>

          {/* Order metadata — spending limits fields */}
          <Card>
            <div className="flex flex-col gap-6 p-3">
              <p className="font-['Noontree:SemiBold'] text-[10px] leading-3 text-[#5d5d5d] tracking-[1px] uppercase whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Order Details</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#f5f5f5] pb-4 pr-2">
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="relative shrink-0 size-4">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOutlineUser} />
                    </div>
                    <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Ordered by</p>
                  </div>
                  <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap">{order.buyer}</p>
                </div>
                {order.approvalType === 'manual' && order.approvedBy ? (
                  <div className="flex items-center justify-between pb-3 pr-2">
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="relative shrink-0 size-4">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOutlineCheck} />
                      </div>
                      <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Approved by</p>
                    </div>
                    <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap">{order.approvedBy}</p>
                  </div>
                ) : order.approvalType === 'auto' ? (
                  <div className="flex items-center justify-between pb-3 pr-2">
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="relative shrink-0 size-4">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOutlineCheck} />
                      </div>
                      <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Approval</p>
                    </div>
                    <span className="inline-flex items-center bg-[#e5faec] text-[#16a34a] border border-[#86efac] rounded-full px-2 py-0.5 font-['Noontree:SemiBold'] text-[10px] leading-3 tracking-[0.5px] uppercase">Auto-approved</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pb-3 pr-2">
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="relative shrink-0 size-4">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOutlineCheck} />
                      </div>
                      <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Approval</p>
                    </div>
                    <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px] whitespace-nowrap">—</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Delivery Address */}
          <Card>
            <div className="flex flex-col gap-4 p-3">
              <div className="flex items-center gap-1">
                <div className="relative shrink-0 size-4">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOutlineBuilding} />
                </div>
                <div className="flex items-center gap-1">
                  <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Delivery Address</p>
                  <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>(Office)</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Emaar</p>
                  <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Office 304, Al Quoz Industrial Area 4 Dubai, United Arab Emirates</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="relative shrink-0 size-3">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOutlinePhone} />
                  </div>
                  <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>+971-58-5011395</p>
                  <div className="relative shrink-0 size-3">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSolidCheckSm} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Summary link */}
          <Card>
            <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#fafafa] rounded-xl transition-colors">
              <div className="flex items-center gap-2">
                <div className="bg-[#eaecf0] flex items-center p-2 rounded-lg shrink-0">
                  <img alt="" className="size-5" src={imgOrderSummaryIcon} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px]" style={{ fontFeatureSettings: '"case" 1' }}>Order Summary</p>
                  <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>View complete order &amp; payment details</p>
                </div>
              </div>
              <img alt="" className="size-5 shrink-0" src={imgChevronRight} />
            </div>
          </Card>

          {/* Item Summary */}
          <Card>
            <div className="flex flex-col gap-4 p-3">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Item Summary</p>
              <div className="flex gap-4 items-start">
                <div className="bg-[#f9f9fb] border border-[#f2f3f7] flex flex-col items-center justify-center rounded-[6px] shrink-0 relative overflow-hidden" style={{ width: 60, height: 82 }}>
                  <img alt="Product" className="object-contain pointer-events-none" style={{ width: 60, height: 68 }} src={imgProductPhoto} />
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[rgba(116,116,116,0.8)] flex items-center gap-px px-1 py-0.5 rounded font-['Noontree:Medium'] text-[8px] text-white whitespace-nowrap">
                    <span>x</span><span>1</span>
                  </div>
                </div>
                <div className="flex flex-1 min-w-0 items-start justify-between gap-2">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      Laser MFP 135a Print/Copy/Scan/Multi-Functional All in One Office Printer
                    </p>
                    <div className="flex items-center gap-1">
                      <img alt="" className="size-3 shrink-0" src={imgSolidCheckSm} />
                      <p className="font-['Noontree:Regular'] text-[10px] leading-3 text-[#5d5d5d] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>1 year warranty</p>
                    </div>
                    <p className="font-['Noontree:Regular'] text-[10px] leading-3 text-[#959595] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Returnable for 7 days</p>
                  </div>
                  <p className="font-['Noontree:Bold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap shrink-0" style={{ fontFeatureSettings: '"case" 1' }}>
                    {fmt(order.amount)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Reorder CTA */}
          <button className="bg-[#0076ff] flex items-center justify-center gap-1.5 h-12 rounded-xl w-full cursor-pointer hover:bg-[#0068e6] transition-colors shrink-0">
            <img alt="" className="size-5 shrink-0" src={imgReorderIcon} />
            <p className="font-['Noontree:SemiBold'] text-[16px] leading-5 text-[#f5f5f5] tracking-[-0.16px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Reorder</p>
          </button>

        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}

// ─── Orders list screen ───────────────────────────────────────────────────────

// New icons from order-listing design
const imgBackBtn       = `${assetPathPrefix}/50c39.svg`;
const imgUserOutline2  = `${assetPathPrefix}/0347b.svg`;
const imgCardChevron   = `${assetPathPrefix}/2de61.svg`;
const imgInvoiceActive = `${assetPathPrefix}/64672.svg`;
const imgInvoiceDisabled = `${assetPathPrefix}/34ace.svg`;
const imgReorderBtn    = `${assetPathPrefix}/4a774.svg`;
const imgFiltersIcon   = `${assetPathPrefix}/92b47.svg`;

const STATUS_COLOR: Record<string, string> = {
  processing: '#0076ff',
  shipped:    '#0076ff',
  delivered:  '#62cb68',
  cancelled:  '#f43333',
};
const STATUS_LABEL: Record<string, string> = {
  processing: 'PROCESSING',
  shipped:    'SHIPPED',
  delivered:  'DELIVERED',
  cancelled:  'CANCELLED',
};
const REQUEST_STATUS_COLOR: Record<string, string> = {
  pending:  '#d97706',
  approved: '#0076ff',
};

function OLOrderCard({ order, onSelect }: { order: OrgOrder; onSelect: (o: OrgOrder) => void }) {
  const isDelivered = order.orderStatus === 'delivered';
  const statusColor = STATUS_COLOR[order.orderStatus] ?? '#5d5d5d';
  const statusLabel = STATUS_LABEL[order.orderStatus] ?? order.orderStatus.toUpperCase();
  const dateLabel = isDelivered ? `on ${order.date}` : `Est. ${order.date}`;

  return (
    <div className="bg-[#f2f3f7] rounded-[12px] shrink-0 w-full overflow-clip">
      <button
        onClick={() => onSelect(order)}
        className="bg-white border border-[#ebebeb] flex flex-col gap-3 items-start p-3 rounded-[12px] w-full text-left cursor-pointer hover:bg-[#fafafa] transition-colors"
      >
        {/* Order ID */}
        <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>
          Order ID <span className="font-['Noontree:SemiBold']">{order.reference}</span>
        </p>

        {/* Product info */}
        <div className="flex gap-3 items-center w-full">
          {/* Product image */}
          <div className="bg-[#f9f9fb] border border-[#f2f3f7] flex flex-col items-center justify-center px-1 py-3 rounded-[6px] shrink-0 relative overflow-hidden" style={{ width: 60, height: 82 }}>
            <img alt="" className="object-contain pointer-events-none" style={{ width: 60, height: 68 }} src={imgProductPhoto} />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[rgba(116,116,116,0.8)] flex items-center gap-px px-1 py-0.5 rounded font-['Noontree:Medium'] text-[8px] text-white whitespace-nowrap">
              <span>x</span><span>1</span>
            </div>
          </div>
          {/* Details */}
          <div className="flex flex-1 min-w-0 flex-col gap-1">
            <div className="flex gap-3 items-start w-full">
              <p className="flex-1 min-w-0 font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] overflow-hidden text-ellipsis" style={{ fontFeatureSettings: '"case" 1', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                Laser MFP 135a Print/Copy/Scan/Multi-Functional All in One Office Printer [4ZB82A] White
              </p>
              <div className="relative shrink-0 size-5">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCardChevron} />
              </div>
            </div>
            <p className="font-['Noontree:SemiBold'] text-[10px] leading-3 tracking-[1px] whitespace-nowrap" style={{ color: statusColor, fontFeatureSettings: '"case" 1' }}>
              {statusLabel}
            </p>
            <p className="font-['Noontree:Regular'] text-[11px] leading-3 tracking-[-0.12px] whitespace-nowrap" style={{ color: 'rgba(14,14,14,0.45)', fontFeatureSettings: '"case" 1' }}>
              {dateLabel}
            </p>
          </div>
        </div>

        {/* Buyer + amount */}
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-1 items-center">
            <div className="relative shrink-0 size-3">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUserOutline2} />
            </div>
            <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{order.buyer}</p>
          </div>
          <p className="font-['Noontree:Bold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{fmt(order.amount)}</p>
        </div>
      </button>

      {/* Delivered actions */}
      {isDelivered && (
        <div className="flex gap-3 items-center justify-end p-3">
          <div className="bg-white border border-[rgba(14,14,14,0.07)] flex flex-1 min-w-0 gap-1 items-center justify-center max-h-9 px-3.5 py-2.5 rounded-[8px]">
            <div className="relative shrink-0 size-4">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgInvoiceActive} />
            </div>
            <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Invoice</p>
          </div>
          <div className="bg-white border border-[rgba(14,14,14,0.07)] flex flex-1 min-w-0 gap-1 items-center justify-center max-h-9 px-3.5 py-2.5 rounded-[8px] cursor-pointer hover:bg-[#f5f5f5] transition-colors">
            <div className="relative shrink-0 size-4">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgReorderBtn} />
            </div>
            <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Reorder</p>
          </div>
        </div>
      )}
    </div>
  );
}

function OLRequestCard({ req, onSelect }: { req: ApprovalRequest; onSelect: (r: ApprovalRequest) => void }) {
  const statusColor = REQUEST_STATUS_COLOR[req.status] ?? '#5d5d5d';
  const statusLabel = req.status === 'pending' ? 'PENDING APPROVAL' : 'APPROVED';
  const dateLabel = `Submitted ${req.submittedAt.slice(0, 10)}`;

  return (
    <div className="bg-[#f2f3f7] rounded-[12px] shrink-0 w-full overflow-clip">
      <button onClick={() => onSelect(req)} className="bg-white border border-[#ebebeb] flex flex-col gap-3 items-start p-3 rounded-[12px] w-full text-left cursor-pointer hover:bg-[#fafafa] transition-colors">
        {/* Reference */}
        <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>
          Request <span className="font-['Noontree:SemiBold']">{req.reference}</span>
        </p>

        {/* Product placeholder */}
        <div className="flex gap-3 items-center w-full">
          <div className="bg-[#f9f9fb] border border-[#f2f3f7] flex flex-col items-center justify-center rounded-[6px] shrink-0" style={{ width: 60, height: 82 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="2" y="2" width="24" height="24" rx="4" stroke="#d1d5db" strokeWidth="1.5"/><path d="M7 10h14M7 14h9" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div className="flex flex-1 min-w-0 flex-col gap-1">
            <p className="flex-1 min-w-0 font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              {req.itemCount} items · {req.productCount} products
            </p>
            <p className="font-['Noontree:SemiBold'] text-[10px] leading-3 tracking-[1px] whitespace-nowrap" style={{ color: statusColor, fontFeatureSettings: '"case" 1' }}>
              {statusLabel}
            </p>
            <p className="font-['Noontree:Regular'] text-[11px] leading-3 tracking-[-0.12px] whitespace-nowrap" style={{ color: 'rgba(14,14,14,0.45)', fontFeatureSettings: '"case" 1' }}>
              {dateLabel}
              {req.status === 'pending' && (req.approvalReason === 'monthly_limit' ? ' · Monthly cap hit' : ` · ${fmt(req.grandTotal - req.orderLimit)} over limit`)}
            </p>
          </div>
        </div>

        {/* Buyer + amount */}
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-1 items-center">
            <div className="relative shrink-0 size-3">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUserOutline2} />
            </div>
            <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{req.requester.name}</p>
          </div>
          <p className="font-['Noontree:Bold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{fmt(req.grandTotal)}</p>
        </div>
      </button>
      {req.status === 'approved' && req.decisionBy && (
        <div className="px-3 pb-2 pt-1">
          <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Approved by {req.decisionBy}</p>
        </div>
      )}
    </div>
  );
}

export function OrdersList({
  onBack, onSelect, onSelectRequest, tab, onTabChange,
}: {
  onBack: () => void;
  onSelect: (o: OrgOrder) => void;
  onSelectRequest: (r: ApprovalRequest) => void;
  tab: OLTab;
  onTabChange: (tab: OLTab) => void;
}) {
  const filteredOrders = filterOrdersByTab(tab);
  const totalCount = filteredOrders.length;

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb]">
      {/* Header */}
      <div className="bg-white flex flex-col items-start shrink-0 w-full">
        {/* Title row */}
        <div className="bg-white flex gap-3 items-center pb-3 pt-[62px] px-3 w-full">
          <button
            onClick={onBack}
            className="bg-white border border-[#ebebeb] flex items-center justify-center p-2 rounded-[18px] cursor-pointer hover:bg-[#f5f5f5] transition-colors shrink-0"
          >
            <div className="relative shrink-0 size-5">
              <img alt="Back" className="absolute block inset-0 max-w-none size-full" src={imgBackBtn} />
            </div>
          </button>
          <p className="font-['Figtree:Bold'] text-[18px] leading-[26px] text-[#0e0e0e] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Orders</p>
        </div>

        <DetailTabBar
          tabs={[
            { id: 'all' as const, label: 'All' },
            { id: 'processing' as const, label: 'Processing', badge: ORG_ORDERS.filter(o => o.orderStatus === 'processing').length || undefined },
            { id: 'delivered' as const, label: 'Delivered' },
            { id: 'cancelled' as const, label: 'Cancelled' },
          ]}
          active={tab}
          onChange={onTabChange}
        />

        {/* Filter bar */}
        <div className="bg-[rgba(14,14,14,0.01)] border-b border-[#ebebeb] flex items-center justify-between px-3 py-2 w-full">
          <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] tracking-[-0.12px] whitespace-nowrap" style={{ color: 'rgba(14,14,14,0.65)', fontFeatureSettings: '"case" 1' }}>
            Showing {totalCount} order{totalCount !== 1 ? 's' : ''}
          </p>
          <div className="border border-[rgba(14,14,14,0.07)] flex gap-1 items-center justify-center px-2.5 py-1.5 rounded-[8px] shrink-0">
            <div className="relative shrink-0 size-3">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFiltersIcon} />
            </div>
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Filters</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex flex-col gap-3 p-3">
          {filteredOrders.map(order => (
            <OLOrderCard key={order.id} order={order} onSelect={onSelect} />
          ))}

          {totalCount === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#5d5d5d]">No orders here</p>
              <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#959595]">Try a different tab or filter</p>
            </div>
          )}
        </div>
        <div className="h-4" />
      </div>

      <BottomNavBar />
    </div>
  );
}

// ─── Pending request details (buyer view) ─────────────────────────────────────

function CountdownBadge({ expiresAt }: { expiresAt: string }) {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return <span className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#ef4444]">Expired</span>;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const isUrgent = h < 24;
  const label = h >= 48 ? `${Math.floor(h / 24)}d left` : h > 0 ? `${h}h ${m}m left` : `${m}m left`;
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 font-['Noontree:SemiBold'] text-[10px] leading-3 whitespace-nowrap" style={{ background: isUrgent ? '#fff5f5' : '#fff7ed', color: isUrgent ? '#ef4444' : '#d97706' }}>
      {label}
    </span>
  );
}

function PRDCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-clip">
      {children}
    </div>
  );
}

function PRDRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{label}</p>
      <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{value}</p>
    </div>
  );
}

export function PendingRequestDetails({ req, onBack }: { req: ApprovalRequest | null; onBack: () => void }) {
  const [withdrawn, setWithdrawn] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!req) {
    return (
      <div className="flex flex-col h-full bg-[#f9f9fb] relative">
        <div className="bg-white shrink-0" style={{ boxShadow: '0 1px 1.5px rgba(14,14,14,0.07)' }}>
          <div className="flex gap-3 items-center pb-3 pt-[62px] px-3">
            <button onClick={onBack} className="bg-white border border-[#ebebeb] flex items-center justify-center p-2 rounded-[18px] cursor-pointer hover:bg-[#f5f5f5] transition-colors shrink-0">
              <div className="relative shrink-0 size-5">
                <img alt="Back" className="absolute block inset-0 max-w-none size-full" src={imgBackBtn} />
              </div>
            </button>
            <p className="font-['Figtree:Bold'] text-[18px] leading-[26px] text-[#0e0e0e]" style={{ fontFeatureSettings: '"case" 1' }}>Request details</p>
          </div>
        </div>
        <DetailEmptyState message="No requests in this status" />
        <BottomNavBar />
      </div>
    );
  }

  const isPending = req.status === 'pending' && !withdrawn;
  const isApproved = req.status === 'approved';
  const isRejected = req.status === 'rejected';
  const isExpired = req.status === 'expired' || req.status === 'approval_lapsed';

  const statusColor = withdrawn ? '#959595' : isPending ? '#d97706' : isApproved ? '#0076ff' : isRejected ? '#ef4444' : '#5d5d5d';
  const statusLabel = withdrawn ? 'WITHDRAWN' : isPending ? 'PENDING APPROVAL' : isApproved ? 'APPROVED' : isRejected ? 'REJECTED' : 'EXPIRED';

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb] relative">
      <div className="bg-white shrink-0" style={{ boxShadow: '0 1px 1.5px rgba(14,14,14,0.07)' }}>
        <div className="flex gap-3 items-center pb-3 pt-[62px] px-3">
          <button onClick={onBack} className="bg-white border border-[#ebebeb] flex items-center justify-center p-2 rounded-[18px] cursor-pointer hover:bg-[#f5f5f5] transition-colors shrink-0">
            <div className="relative shrink-0 size-5">
              <img alt="Back" className="absolute block inset-0 max-w-none size-full" src={imgBackBtn} />
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-['Figtree:Bold'] text-[16px] leading-[22px] text-[#0e0e0e] truncate" style={{ fontFeatureSettings: '"case" 1' }}>{req.reference}</p>
              <span className="font-['Noontree:SemiBold'] text-[10px] leading-3 tracking-[1px] whitespace-nowrap" style={{ color: statusColor, fontFeatureSettings: '"case" 1' }}>{statusLabel}</span>
            </div>
            {isPending && <CountdownBadge expiresAt={req.expiresAt} />}
            {isApproved && req.decisionAt && (
              <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#5d5d5d] mt-0.5">Approved {req.decisionAt.slice(0, 10)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: 'none' }}>
        <div className="p-3 flex flex-col gap-3">

          {(isPending || isApproved || isRejected || isExpired || withdrawn) && (
            <PRDCard>
              <div className="p-3">
                {isPending && (
                  <div className="flex items-start gap-2.5">
                    <div className="bg-[#fff7ed] flex items-center justify-center rounded-full shrink-0 size-8">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#d97706" strokeWidth="1.5"/><path d="M8 5v3.5M8 10.5v.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <div>
                      <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Waiting for approval</p>
                      <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] mt-0.5" style={{ fontFeatureSettings: '"case" 1' }}>
                        Your org admin will review and respond before the request expires.
                      </p>
                    </div>
                  </div>
                )}
                {isApproved && (
                  <div className="flex items-start gap-2.5">
                    <div className="bg-[#e5faec] flex items-center justify-center rounded-full shrink-0 size-8">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-6" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#16a34a] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Approved{req.decisionBy ? ` by ${req.decisionBy}` : ''}</p>
                      <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] mt-0.5" style={{ fontFeatureSettings: '"case" 1' }}>
                        You can complete your purchase. Prices are re-checked at checkout.
                      </p>
                    </div>
                  </div>
                )}
                {isRejected && (
                  <div className="flex items-start gap-2.5">
                    <div className="bg-[#fff5f5] flex items-center justify-center rounded-full shrink-0 size-8">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#ef4444" strokeWidth="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <div>
                      <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#ef4444] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Rejected{req.decisionBy ? ` by ${req.decisionBy}` : ''}</p>
                      <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] mt-0.5" style={{ fontFeatureSettings: '"case" 1' }}>
                        {req.rejectionReason ?? 'This request was rejected. You can restore the items to your cart.'}
                      </p>
                    </div>
                  </div>
                )}
                {isExpired && (
                  <div className="flex items-start gap-2.5">
                    <div className="bg-[#f5f5f5] flex items-center justify-center rounded-full shrink-0 size-8">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#5d5d5d" strokeWidth="1.5"/><path d="M8 5v3.2l2 1.3" stroke="#5d5d5d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
                        {req.status === 'approval_lapsed' ? 'Approval expired' : 'Request expired'}
                      </p>
                      <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] mt-0.5" style={{ fontFeatureSettings: '"case" 1' }}>
                        {req.status === 'approval_lapsed'
                          ? 'The approval window closed before checkout. Add the items to your cart to try again.'
                          : 'Nobody approved this in time. Add the items to your cart to submit again.'}
                      </p>
                    </div>
                  </div>
                )}
                {withdrawn && (
                  <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>This request was withdrawn.</p>
                )}
              </div>
            </PRDCard>
          )}

          {req.previouslyRejected && (
            <div className="bg-[#fff5f5] border border-[#fca5a5] rounded-2xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#ef4444" strokeWidth="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#ef4444] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Previously rejected</p>
              </div>
              <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d] tracking-[-0.12px] italic" style={{ fontFeatureSettings: '"case" 1' }}>"{req.previousRejectionReason}"</p>
            </div>
          )}

          {req.buyerNote && (
            <PRDCard>
              <div className="p-3">
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] mb-2" style={{ fontFeatureSettings: '"case" 1' }}>Your note to approver</p>
                <div className="border-l-2 border-[#0076ff] pl-3">
                  <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#5d5d5d] tracking-[-0.12px] italic" style={{ fontFeatureSettings: '"case" 1' }}>"{req.buyerNote}"</p>
                </div>
              </div>
            </PRDCard>
          )}

          <PRDCard>
            <div className="p-3 border-b border-[#ebebeb] flex items-center justify-between">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Order items</p>
              <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#959595] tracking-[-0.12px]">{req.itemCount} items · {req.productCount} products</p>
            </div>
            <div className="p-3 flex flex-col gap-3">
              {req.lineItems.map(li => (
                <div key={li.id} className={`flex items-start gap-3 ${li.status === 'unavailable' ? 'opacity-40' : ''}`}>
                  <div className="bg-[#f9f9fb] border border-[#f2f3f7] flex items-center justify-center rounded-lg shrink-0" style={{ width: 40, height: 40 }}>
                    <img alt="" className="object-contain pointer-events-none size-7" src={imgProductPhoto} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] truncate" style={{ fontFeatureSettings: '"case" 1' }}>{li.title}</p>
                    <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#959595] tracking-[-0.12px] mt-0.5">{li.seller} · Qty {li.qty}</p>
                    {li.status === 'unavailable' && <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#ef4444] mt-0.5">No longer available</p>}
                    {li.status === 'price_increased' && (
                      <p className="font-['Noontree:Regular'] text-[11px] leading-3 mt-0.5">
                        <span className="text-[#959595] line-through">{fmt(li.unitPrice)}</span>
                        <span className="text-[#ef4444] ml-1">{fmt(li.newPrice!)}</span>
                      </p>
                    )}
                  </div>
                  <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap shrink-0">{fmt(li.lineTotal)}</p>
                </div>
              ))}
              <div className="h-px bg-[#ebebeb]" />
              {req.shipping > 0 && <PRDRow label="Shipping" value={fmt(req.shipping)} />}
              {req.vat > 0 && <PRDRow label="VAT (5%)" value={fmt(req.vat)} />}
              {req.discount > 0 && <PRDRow label="Discount" value={`–${fmt(req.discount)}`} />}
              <div className="flex items-center justify-between pt-1">
                <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px]" style={{ fontFeatureSettings: '"case" 1' }}>Grand total</p>
                <p className="font-['Noontree:Bold'] text-[16px] leading-5 text-[#0e0e0e] tracking-[-0.16px]" style={{ fontFeatureSettings: '"case" 1' }}>{fmt(req.grandTotal)}</p>
              </div>
            </div>
          </PRDCard>

          <PRDCard>
            <div className="p-3 flex flex-col gap-3">
              <div>
                <p className="font-['Noontree:SemiBold'] text-[11px] leading-3 text-[#959595] tracking-[-0.12px] mb-1 uppercase" style={{ fontFeatureSettings: '"case" 1' }}>Deliver to</p>
                <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{req.shipTo}</p>
              </div>
              <div className="h-px bg-[#ebebeb]" />
              <div>
                <p className="font-['Noontree:SemiBold'] text-[11px] leading-3 text-[#959595] tracking-[-0.12px] mb-1 uppercase" style={{ fontFeatureSettings: '"case" 1' }}>Payment</p>
                <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{req.paymentMethod}</p>
              </div>
            </div>
          </PRDCard>

        </div>
        <div className="h-4" />
      </div>

      {isApproved && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3">
          <button className="bg-[#0076ff] flex items-center justify-center gap-2 h-12 rounded-xl w-full cursor-pointer hover:bg-[#0068e6] transition-colors">
            <p className="font-['Noontree:SemiBold'] text-[16px] leading-5 text-white tracking-[-0.16px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Complete purchase</p>
          </button>
        </div>
      )}
      {isPending && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3">
          <button onClick={() => setShowWithdrawConfirm(true)} className="bg-white border border-[rgba(14,14,14,0.10)] flex items-center justify-center h-12 rounded-xl w-full cursor-pointer hover:bg-[#f5f5f5] transition-colors">
            <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[rgba(14,14,14,0.5)] tracking-[-0.14px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Withdraw request</p>
          </button>
        </div>
      )}
      {isExpired && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#ebebeb] p-3 flex flex-col gap-2">
          {addedToCart ? (
            <div className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#e5faec]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8l3 3 6-6" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#16a34a] tracking-[-0.14px]" style={{ fontFeatureSettings: '"case" 1' }}>
                {req.lineItems.filter(li => li.status !== 'unavailable').length} items added to cart
              </p>
            </div>
          ) : (
            <button
              onClick={() => setAddedToCart(true)}
              className="bg-[#0076ff] flex items-center justify-center gap-2 h-12 rounded-xl w-full cursor-pointer hover:bg-[#0068e6] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2h1.5l2.3 9.2a1.5 1.5 0 0 0 1.45 1.3h6.5a1.5 1.5 0 0 0 1.45-1.12L16 6H5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7.5" cy="15.5" r="1" fill="white"/><circle cx="13.5" cy="15.5" r="1" fill="white"/></svg>
              <p className="font-['Noontree:SemiBold'] text-[15px] leading-5 text-white tracking-[-0.14px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Add items to cart again</p>
            </button>
          )}
          {req.lineItems.some(li => li.status === 'unavailable') && !addedToCart && (
            <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#d97706] text-center" style={{ fontFeatureSettings: '"case" 1' }}>
              {req.lineItems.filter(li => li.status === 'unavailable').length} item{req.lineItems.filter(li => li.status === 'unavailable').length > 1 ? 's are' : ' is'} no longer available and will be skipped
            </p>
          )}
        </div>
      )}

      {showWithdrawConfirm && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 60 }}>
          <div className="absolute inset-0 bg-[#404553] opacity-60" onClick={() => setShowWithdrawConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-5 mx-4 w-full flex flex-col gap-4">
            <p className="font-['Figtree:Bold'] text-[16px] leading-[22px] text-[#0e0e0e]" style={{ fontFeatureSettings: '"case" 1' }}>Withdraw this request?</p>
            <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>The request will be cancelled and your approver will be notified. You can resubmit at any time.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowWithdrawConfirm(false)} className="flex-1 h-12 flex items-center justify-center rounded-xl border border-[rgba(14,14,14,0.10)] font-['Noontree:SemiBold'] text-[16px] leading-5 text-[#0e0e0e] cursor-pointer hover:bg-[#f5f5f5] transition-colors" style={{ fontFeatureSettings: '"case" 1' }}>Cancel</button>
              <button onClick={() => { setWithdrawn(true); setShowWithdrawConfirm(false); }} className="flex-1 h-12 flex items-center justify-center rounded-xl bg-[#ef4444] font-['Noontree:SemiBold'] text-[16px] leading-5 text-white cursor-pointer hover:bg-[#dc2626] transition-colors" style={{ fontFeatureSettings: '"case" 1' }}>Withdraw</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
