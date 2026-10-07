import type { RequestStatus, Role } from './data';

const assetPathPrefix = '/assets';
export const imgBack = `${assetPathPrefix}/cb52f.svg`;
export const imgEdit = `${assetPathPrefix}/836f7.svg`;
export const imgFilter = `${assetPathPrefix}/92b47.svg`;
export const imgArrowRight = `${assetPathPrefix}/eeb06.svg`;
export const imgCheckCircle = `${assetPathPrefix}/8eb36.svg`;
export const imgChevron = `${assetPathPrefix}/0ed2e.svg`;
export const imgHomeActive = `${assetPathPrefix}/4d950.svg`;
export const imgHomeInactive = `${assetPathPrefix}/472b4.svg`;
export const imgAccount = `${assetPathPrefix}/e32db.svg`;
export const imgCart = `${assetPathPrefix}/271bc.svg`;
export const imgCheck = `${assetPathPrefix}/58ff1.svg`;
export const imgHandle = `${assetPathPrefix}/ce303.svg`;
export const imgLightning = `${assetPathPrefix}/7cd06.svg`;

// ─── Icon SVGs ───────────────────────────────────────────────────────────────

export function ClockIcon({ size = 20, color = '#d97706' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.4" />
      <path d="M10 6v4l2.5 2.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function XCircleIcon({ size = 20, color = '#ef4444' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.4" />
      <path d="M7 7l6 6M13 7l-6 6" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function InfoIcon({ size = 20, color = '#0076ff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.5" stroke={color} strokeWidth="1.4" />
      <path d="M10 9v5M10 6.5v.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ size = 20, color = '#16a34a' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 10l4.5 4.5L16 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LockIcon({ size = 16, color = '#959595' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="2" stroke={color} strokeWidth="1.2" />
      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ size = 20, color = '#0076ff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M4 10h12" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AlertIcon({ size = 20, color = '#d97706' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 3L2 17h16L10 3z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M10 9v4M10 14.5v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ─── Status chip ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RequestStatus, { label: string; bg: string; text: string; border: string }> = {
  pending:          { label: 'Awaiting approval',        bg: '#fff7ed', text: '#d97706', border: '#fdba74' },
  approved:         { label: 'Approved – complete now',  bg: '#eff7ff', text: '#0076ff', border: '#96c6ff' },
  completed:        { label: 'Ordered',                  bg: '#e5faec', text: '#16a34a', border: '#86efac' },
  rejected:         { label: 'Rejected',                 bg: '#fff5f5', text: '#ef4444', border: '#fca5a5' },
  expired:          { label: 'Expired',                  bg: '#f5f5f5', text: '#6b7280', border: '#e5e7eb' },
  approval_lapsed:  { label: 'Approval lapsed',          bg: '#f5f5f5', text: '#6b7280', border: '#e5e7eb' },
  withdrawn:        { label: 'Withdrawn',                bg: '#f5f5f5', text: '#6b7280', border: '#e5e7eb' },
  validation_failed:{ label: "Couldn't complete",        bg: '#fff5f5', text: '#ef4444', border: '#fca5a5' },
};

export function StatusChip({ status, size = 'sm' }: { status: RequestStatus; size?: 'sm' | 'md' }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-['Noontree:SemiBold'] whitespace-nowrap`}
      style={{
        background: cfg.bg, color: cfg.text, borderColor: cfg.border,
        fontSize: size === 'sm' ? 10 : 12,
        lineHeight: size === 'sm' ? '14px' : '16px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        letterSpacing: '0.3px',
      }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Countdown chip ───────────────────────────────────────────────────────────

export function CountdownChip({ expiresAt, small = false }: { expiresAt: string; small?: boolean }) {
  const now = new Date('2026-04-09T12:00:00Z').getTime();
  const exp = new Date(expiresAt).getTime();
  const ms = exp - now;
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);

  let label = '';
  if (ms <= 0) label = 'Expired';
  else if (hours >= 24) { const d = Math.floor(hours / 24); label = `Expires in ${d}d ${hours % 24}h`; }
  else if (hours >= 1) label = `Expires in ${hours}h ${mins}m`;
  else label = `Expires in ${mins}m`;

  const isCritical = hours < 2 && ms > 0;
  const isWarning = hours < 12 && hours >= 2 && ms > 0;
  const bg = isCritical ? '#fff5f5' : isWarning ? '#fff7ed' : '#f5f5f5';
  const col = isCritical ? '#ef4444' : isWarning ? '#d97706' : '#6b7280';
  const brd = isCritical ? '#fca5a5' : isWarning ? '#fdba74' : '#e5e7eb';

  return (
    <span
      className="inline-flex items-center rounded-full border font-['Noontree:Medium'] whitespace-nowrap"
      style={{
        background: bg, color: col, borderColor: brd,
        fontSize: small ? 10 : 11, lineHeight: small ? '14px' : '16px',
        padding: small ? '2px 8px' : '3px 10px',
      }}
    >
      {label}
    </span>
  );
}

// ─── Top header ───────────────────────────────────────────────────────────────

export function TopHeader({
  title, subtitle, onBack, rightContent,
}: {
  title: string; subtitle?: string; onBack?: () => void; rightContent?: React.ReactNode;
}) {
  return (
    <div className="bg-white flex flex-col shrink-0 w-full" style={{ boxShadow: '0 1px 1.5px rgba(14,14,14,0.07)' }}>
      <div className="bg-white flex gap-3 items-center pb-3 pt-14 px-3 w-full">
        {onBack && (
          <button onClick={onBack} className="bg-white border border-[#ebebeb] rounded-[18px] shrink-0">
            <div className="flex items-center justify-center p-2 size-9">
              <img alt="" className="size-5" src={imgBack} />
            </div>
          </button>
        )}
        <p className="font-['Figtree:Bold'] text-[18px] leading-[26px] text-[#0e0e0e] flex-1" style={{ fontFeatureSettings: '"case" 1' }}>{title}</p>
        {rightContent}
      </div>
      {subtitle && (
        <div className="border-b border-[#ebebeb] flex items-center justify-between px-3 py-2 w-full bg-[rgba(14,14,14,0.01)]">
          <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{subtitle}</p>
        </div>
      )}
    </div>
  );
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

type NavItem = 'home' | 'account' | 'cart';

export function BottomNav({
  active = 'account', pendingCount = 0, myRequestsCount = 0,
  role = 'buyer',
}: {
  active?: NavItem; pendingCount?: number; myRequestsCount?: number; role?: Role;
}) {
  return (
    <div className="bg-white flex flex-col shrink-0" style={{ boxShadow: '0px -4px 4.5px rgba(0,0,0,0.04)' }}>
      <div className="flex h-[63px] items-center justify-center w-full">
        {/* Home */}
        <div className="flex flex-1 flex-col gap-2 items-center px-5">
          <div className="h-1 w-full" />
          <div className="flex flex-col gap-1 items-center">
            <div className="flex flex-col items-center justify-center size-8">
              <img alt="" className="w-6" style={{ height: 21.337 }} src={imgHomeInactive} />
            </div>
            <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] text-[#475067] tracking-[-0.12px]">Home</p>
          </div>
        </div>
        {/* Account */}
        <div className="flex flex-1 flex-col gap-2 items-center px-5 relative">
          {active === 'account' && <div className="h-1 w-full bg-[#1155cb] rounded-b-sm" />}
          {active !== 'account' && <div className="h-1 w-full" />}
          <div className="flex flex-col gap-1 items-center relative">
            <div className="flex flex-col items-center justify-center size-8 relative">
              <img alt="" className="size-5" src={imgAccount} />
              {(pendingCount > 0 || myRequestsCount > 0) && (
                <div className="absolute bg-[#0076ff] flex items-center justify-center overflow-clip px-1.5 py-0.5 right-[-9px] rounded-full top-[-6px]">
                  <p className="font-['Noontree:SemiBold'] text-[10px] leading-[12px] text-white tracking-[1px]">
                    {(role === 'buyer' ? myRequestsCount : pendingCount) || ''}
                  </p>
                </div>
              )}
            </div>
            <p className={`font-['Noontree:${active === 'account' ? 'Bold' : 'Medium'}'] text-[12px] leading-[14px] tracking-[-0.12px] ${active === 'account' ? 'text-[#1155cb]' : 'text-[#475067]'}`} style={{ fontFeatureSettings: '"case" 1' }}>Account</p>
          </div>
        </div>
        {/* Cart */}
        <div className="flex flex-1 flex-col gap-2 items-center px-5 relative">
          <div className="h-1 w-full" />
          <div className="flex flex-col gap-1 items-center relative">
            <div className="flex flex-col items-center justify-center size-8 relative">
              <img alt="" className="size-5" src={imgCart} />
              <div className="absolute bg-[#0076ff] flex items-center justify-center overflow-clip px-1.5 py-0.5 right-[-9px] rounded-full top-[-6px]">
                <p className="font-['Noontree:SemiBold'] text-[10px] leading-[12px] text-white tracking-[1px]">1</p>
              </div>
            </div>
            <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] text-[#475067] tracking-[-0.12px]">Cart</p>
          </div>
        </div>
      </div>
      <div className="bg-white flex flex-col items-center pb-2 pt-3 w-full">
        <div className="bg-[#404553] h-[5px] rounded-lg w-[124px]" />
      </div>
    </div>
  );
}

// ─── Sheet wrapper ─────────────────────────────────────────────────────────────

export function BottomSheet({ onDismiss, children }: { onDismiss: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-end" style={{ zIndex: 50 }}>
      <div className="absolute inset-0 bg-[#404553] opacity-75" onClick={onDismiss} />
      <div className="relative flex flex-col items-center w-full">
        <div className="flex flex-col items-center justify-center py-3 w-full">
          <div style={{ width: 36, height: 4 }}>
            <img alt="" className="block w-full" src={imgHandle} style={{ height: 4 }} />
          </div>
        </div>
        {children}
        <div className="flex flex-col items-center pb-2 pt-3 w-full">
          <div className="bg-white h-[5px] rounded-lg w-[124px]" />
        </div>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <div className="bg-[#eaecf0] flex items-center justify-center rounded-full shrink-0" style={{ width: size, height: size }}>
      <p className="font-['Noontree:Bold'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>{initials}</p>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider() {
  return <div className="bg-[#eaecf0] h-px w-full shrink-0" />;
}

// ─── Role chip ────────────────────────────────────────────────────────────────

export function RoleChip({ role }: { role: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    owner: { bg: '#eff7ff', text: '#0076ff' },
    admin: { bg: '#e5faec', text: '#16a34a' },
    buyer: { bg: '#f5f5f5', text: '#6b7280' },
  };
  const cfg = map[role] || map.buyer;
  return (
    <span className="font-['Noontree:SemiBold'] rounded px-1.5 py-0.5 text-[10px] leading-[14px] tracking-[0.5px] uppercase" style={{ background: cfg.bg, color: cfg.text }}>
      {role}
    </span>
  );
}

// ─── Primary / Secondary buttons ─────────────────────────────────────────────

export function PrimaryBtn({ label, onClick, disabled = false, fullWidth = true }: { label: string; onClick?: () => void; disabled?: boolean; fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex gap-1.5 h-12 items-center justify-center px-6 py-3.5 rounded-xl font-['Noontree:SemiBold'] text-[16px] leading-[20px] tracking-[-0.16px] transition-colors whitespace-nowrap ${fullWidth ? 'w-full' : ''} ${disabled ? 'bg-[rgba(14,14,14,0.08)] text-[rgba(14,14,14,0.25)] cursor-not-allowed' : 'bg-[#0076ff] text-white hover:bg-[#0068e6] cursor-pointer'}`}
      style={{ fontFeatureSettings: '"case" 1' }}
    >
      {label}
    </button>
  );
}

export function SecondaryBtn({ label, onClick, fullWidth = false }: { label: string; onClick?: () => void; fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex gap-1.5 h-12 items-center justify-center px-6 py-3.5 rounded-xl border border-[rgba(14,14,14,0.12)] font-['Noontree:SemiBold'] text-[16px] leading-[20px] text-[#0e0e0e] tracking-[-0.16px] transition-colors whitespace-nowrap cursor-pointer hover:bg-gray-50 ${fullWidth ? 'w-full' : ''}`}
      style={{ fontFeatureSettings: '"case" 1' }}
    >
      {label}
    </button>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
      {children}
    </p>
  );
}
