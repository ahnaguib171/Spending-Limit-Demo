import { useState } from 'react';
import { MEMBERS, ORG_NAME, ORDER_LIMIT, fmt, type Member } from '../data';
import {
  TopHeader, BottomNav, BottomSheet, Avatar, PrimaryBtn, SecondaryBtn,
  RoleChip, LockIcon, PlusIcon, imgEdit,
} from '../components';
import type { Role } from '../data';

const LIMIT_RULES = [
  { label: 'Order above the auto-approve limit', result: 'Always needs approval', color: '#ef4444' },
  { label: 'Person reaches their monthly total', result: 'Needs approval until the month resets', color: '#d97706' },
  { label: 'Within both limits', result: 'Auto-approved', color: '#16a34a' },
];

function OrgLimitCard({
  limit, canEdit, saved, rulesOpen, onToggleRules, onEdit,
}: {
  limit: number; canEdit: boolean; saved: boolean; rulesOpen: boolean;
  onToggleRules: () => void; onEdit: () => void;
}) {
  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-['Noontree:SemiBold'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[0.4px] uppercase" style={{ fontFeatureSettings: '"case" 1' }}>
            Total auto-approve limit
          </p>
          <p className="font-['Figtree:Bold'] text-[26px] leading-[30px] text-[#0e0e0e] tracking-[-0.5px] mt-1" style={{ fontFeatureSettings: '"case" 1' }}>
            {fmt(limit)}
          </p>
          <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d] tracking-[-0.12px] mt-0.5" style={{ fontFeatureSettings: '"case" 1' }}>
            per order · applies to everyone{saved ? ' · Saved' : ''}
          </p>
        </div>
        {canEdit ? (
          <button
            onClick={onEdit}
            className="bg-white border border-[#ebebeb] flex items-center justify-center h-11 px-3.5 rounded-xl cursor-pointer hover:bg-[#f5f5f5] transition-colors shrink-0"
          >
            <p className="font-['Noontree:SemiBold'] text-[13px] leading-[16px] text-[#0e0e0e] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>
              Edit
            </p>
          </button>
        ) : (
          <div className="flex items-center gap-1 shrink-0 h-11">
            <LockIcon size={14} />
            <p className="font-['Noontree:Medium'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Owner only</p>
          </div>
        )}
      </div>

      <button
        onClick={onToggleRules}
        aria-expanded={rulesOpen}
        className="flex items-center justify-between gap-2 min-h-11 -mx-1 px-1 rounded-lg cursor-pointer text-left"
      >
        <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0076ff] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
          How these limits work together
        </p>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`shrink-0 transition-transform ${rulesOpen ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M4 6.5 8 10.5 12 6.5" stroke="#0076ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {rulesOpen && (
        <div className="flex flex-col gap-2.5 border-t border-[#f2f3f7] pt-3">
          <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
            An order needs approval if it is over this amount, or if that person has used up their monthly total.
          </p>
          {LIMIT_RULES.map(row => (
            <div key={row.label} className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: row.color }} />
              <div className="min-w-0">
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{row.label}</p>
                <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] mt-0.5" style={{ fontFeatureSettings: '"case" 1' }}>{row.result}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LimitEditSheet({ limit, onSave, onClose }: { limit: number; onSave: (n: number) => void; onClose: () => void }) {
  const [orderLimitVal, setOrderLimitVal] = useState(
    limit.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }),
  );
  const parsedLimit = parseFloat(orderLimitVal.replace(/,/g, '')) || 0;

  return (
    <BottomSheet onDismiss={onClose}>
      <div className="bg-white border border-[#f9f9fb] flex flex-col overflow-clip rounded-2xl mx-3 w-[calc(100%-24px)]">
        <div className="border-b border-[#f5f5f5] flex items-center justify-between p-4">
          <p className="font-['Noontree:Bold'] text-[16px] leading-[20px] text-[#0e0e0e] tracking-[-0.16px]" style={{ fontFeatureSettings: '"case" 1' }}>Auto-approve limit</p>
          <button onClick={onClose} className="font-['Noontree:Regular'] text-[14px] leading-[18px] text-[#959595] cursor-pointer min-h-11">Cancel</button>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
            Applies to every person in the org. Monthly totals for each person are set on their row.
          </p>
          <div>
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] mb-2" style={{ fontFeatureSettings: '"case" 1' }}>Per-order limit</p>
            <div className="bg-white border border-[#dfdfdf] flex gap-2 h-12 items-center pl-3.5 pr-2.5 rounded-xl focus-within:border-[#0076ff] transition-colors">
              <p className="font-['Noontree:Bold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px] whitespace-nowrap shrink-0">AED</p>
              <input
                type="text"
                inputMode="decimal"
                aria-label="Per-order auto-approve limit in AED"
                value={orderLimitVal}
                onChange={e => setOrderLimitVal(e.target.value)}
                onBlur={e => {
                  const n = parseFloat(e.target.value.replace(/,/g, ''));
                  if (!isNaN(n)) setOrderLimitVal(n.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));
                }}
                className="flex-1 font-['Noontree:Medium'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px] outline-none min-w-0 bg-transparent"
                style={{ fontFeatureSettings: '"case" 1' }}
              />
            </div>
          </div>
        </div>
        <div className="border-t border-[#f5f5f5] flex gap-2 p-4">
          <SecondaryBtn label="Cancel" onClick={onClose} />
          <PrimaryBtn label="Save" onClick={() => onSave(parsedLimit)} disabled={parsedLimit <= 0} />
        </div>
      </div>
    </BottomSheet>
  );
}

// ─── Users & limits ────────────────────────────────────────────────────────────

export function Members({ role }: { role: Role }) {
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [orderLimit, setOrderLimit] = useState(ORDER_LIMIT);
  const [limitOpen, setLimitOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [limitSaved, setLimitSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);

  const editingMember = members.find(m => m.id === editingId);
  const activeCount = members.filter(m => m.status === 'active').length;
  const canEditOrgLimit = role === 'owner';

  const canEditRole = (viewer: Role, target: Member) => {
    if (viewer === 'owner') return target.role !== 'owner';
    if (viewer === 'admin') return target.role === 'buyer';
    return false;
  };

  const canEditLimit = (viewer: Role, target: Member) => {
    if (viewer === 'owner') return target.role !== 'owner';
    return false; // only owners can adjust limits
  };

  const handleSaveLimit = (next: number) => {
    setOrderLimit(next);
    setLimitOpen(false);
    setLimitSaved(true);
    window.setTimeout(() => setLimitSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9fb] relative">
      <TopHeader
        title="Users & limits"
        subtitle={`${activeCount} active`}
        rightContent={
          (role === 'owner' || role === 'admin') ? (
            <button
              onClick={() => setInviteOpen(true)}
              className="bg-[#0076ff] flex items-center gap-1.5 h-11 px-3 rounded-xl cursor-pointer hover:bg-[#0068e6] transition-colors"
            >
              <PlusIcon size={16} color="white" />
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-white tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Invite</p>
            </button>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="p-3 flex flex-col gap-3">
          <OrgLimitCard
            limit={orderLimit}
            canEdit={canEditOrgLimit}
            saved={limitSaved}
            rulesOpen={rulesOpen}
            onToggleRules={() => setRulesOpen(o => !o)}
            onEdit={() => setLimitOpen(true)}
          />

          <div className="flex items-end justify-between px-1 pt-1">
            <div className="min-w-0">
              <p className="font-['Noontree:SemiBold'] text-[13px] leading-[16px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>People</p>
              <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px] mt-0.5" style={{ fontFeatureSettings: '"case" 1' }}>
                Monthly total for each person, on top of the order limit
              </p>
            </div>
          </div>

          <div className="flex flex-col divide-y divide-[#ebebeb] bg-white rounded-2xl border border-[#ebebeb] overflow-hidden">
            {members.map(member => (
              <MemberRow
                key={member.id}
                member={member}
                viewerRole={role}
                canEditRole={canEditRole(role, member)}
                canEditLimit={canEditLimit(role, member)}
                onEdit={() => setEditingId(member.id)}
                onRemove={() => setRemoveTarget(member)}
              />
            ))}
          </div>
        </div>
        <div className="h-24" />
      </div>

      <BottomNav role={role} />

      {limitOpen && (
        <LimitEditSheet
          limit={orderLimit}
          onSave={handleSaveLimit}
          onClose={() => setLimitOpen(false)}
        />
      )}

      {/* Inline edit bottom sheet */}
      {editingId && editingMember && (
        <EditMemberSheet
          member={editingMember}
          viewerRole={role}
          canEditRole={canEditRole(role, editingMember)}
          canEditLimit={canEditLimit(role, editingMember)}
          onSave={updated => {
            setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
            setEditingId(null);
          }}
          onClose={() => setEditingId(null)}
        />
      )}

      {/* Invite modal */}
      {inviteOpen && (
        <InviteSheet viewerRole={role} onClose={() => setInviteOpen(false)} />
      )}

      {/* Remove confirmation */}
      {removeTarget && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 60 }}>
          <div className="absolute inset-0 bg-[#404553] opacity-60" onClick={() => setRemoveTarget(null)} />
          <div className="relative bg-white rounded-2xl p-5 mx-4 w-full flex flex-col gap-4">
            <p className="font-['Figtree:Bold'] text-[16px] leading-[22px] text-[#0e0e0e]" style={{ fontFeatureSettings: '"case" 1' }}>Remove {removeTarget.name}?</p>
            {removeTarget.pendingRequests && removeTarget.pendingRequests > 0 ? (
              <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#5d5d5d]" style={{ fontFeatureSettings: '"case" 1' }}>
                <span className="font-['Noontree:SemiBold'] text-[#0e0e0e]">{removeTarget.name}</span> has{' '}
                <span className="font-['Noontree:SemiBold'] text-[#0e0e0e]">{removeTarget.pendingRequests} request{removeTarget.pendingRequests > 1 ? 's' : ''}</span>{' '}
                waiting for approval. Removing them will withdraw these requests.
              </p>
            ) : (
              <p className="font-['Noontree:Regular'] text-[13px] leading-[18px] text-[#5d5d5d]" style={{ fontFeatureSettings: '"case" 1' }}>
                They'll lose access to {ORG_NAME} immediately.
              </p>
            )}
            <div className="flex gap-2">
              <SecondaryBtn label="Cancel" onClick={() => setRemoveTarget(null)} />
              <button onClick={() => { setMembers(p => p.filter(m => m.id !== removeTarget.id)); setRemoveTarget(null); }} className="flex-1 h-12 flex items-center justify-center bg-[#ef4444] rounded-xl font-['Noontree:SemiBold'] text-[16px] text-white cursor-pointer hover:bg-[#dc2626]" style={{ fontFeatureSettings: '"case" 1' }}>
                {removeTarget.pendingRequests ? 'Remove & withdraw' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MemberRow({ member, canEditRole, canEditLimit, onEdit }: {
  member: Member; viewerRole: Role; canEditRole: boolean; canEditLimit: boolean; onEdit: () => void; onRemove: () => void;
}) {
  const cap = member.monthlyLimit;
  const capped = cap !== null && cap > 0;
  const usedPct = capped ? Math.min(100, (member.monthlySpent / cap) * 100) : 0;
  const atLimit = capped && member.monthlySpent >= cap;
  const compact = (n: number) => n.toLocaleString('en-AE', { maximumFractionDigits: 0 });

  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <div className="relative shrink-0">
        <Avatar initials={member.initials} />
        {member.status === 'invited' && (
          <div className="absolute -bottom-0.5 -right-0.5 bg-[#f59e0b] rounded-full w-3 h-3 border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="font-['Noontree:SemiBold'] text-[13px] leading-[16px] text-[#0e0e0e] tracking-[-0.12px] truncate" style={{ fontFeatureSettings: '"case" 1' }}>{member.name}</p>
          <RoleChip role={member.role} />
          {member.status === 'invited' && (
            <span className="inline-flex items-center bg-[#fff7ed] text-[#d97706] border border-[#fdba74] rounded-full px-1.5 py-0.5 font-['Noontree:Medium'] text-[10px] leading-[12px]">Invited</span>
          )}
        </div>
        <p className="font-['Noontree:Regular'] text-[11px] leading-[12px] text-[#5d5d5d] tracking-[-0.12px] truncate">{member.email}</p>
        {member.role !== 'owner' && (
          <div className="mt-1.5 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <p className="flex-1 min-w-0 font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
                {cap === null
                  ? 'No monthly cap'
                  : `AED ${compact(member.monthlySpent)} of ${compact(cap)} this month`}
              </p>
              {!canEditLimit && <LockIcon size={12} />}
            </div>
            {capped && (
              <div
                className="bg-[#eaecf0] rounded-full h-1.5 w-full overflow-hidden"
                role="meter"
                aria-label={`${member.name} monthly spend`}
                aria-valuemin={0}
                aria-valuemax={cap ?? 0}
                aria-valuenow={member.monthlySpent}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${usedPct}%`, background: atLimit ? '#d97706' : '#0076ff' }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {(canEditRole || canEditLimit) && (
        <button onClick={onEdit} aria-label={`Edit ${member.name}`} className="bg-[#f5f5f5] flex items-center justify-center size-11 rounded-lg cursor-pointer hover:bg-[#ebebeb] shrink-0">
          <img alt="" className="size-4" src={imgEdit} />
        </button>
      )}
    </div>
  );
}

function LimitInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>{label}</p>
      <div className="bg-white border border-[#dfdfdf] flex gap-2 h-12 items-center pl-3.5 pr-2.5 rounded-xl focus-within:border-[#0076ff] transition-colors">
        <p className="font-['Noontree:Bold'] text-[14px] text-[#0e0e0e] whitespace-nowrap shrink-0">AED</p>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="0"
          className="flex-1 font-['Noontree:Medium'] text-[14px] text-[#0e0e0e] outline-none min-w-0 bg-transparent"
          style={{ fontFeatureSettings: '"case" 1' }}
        />
      </div>
    </div>
  );
}

function EditMemberSheet({ member, viewerRole, canEditRole, canEditLimit, onSave, onClose }: {
  member: Member; viewerRole: Role; canEditRole: boolean; canEditLimit: boolean;
  onSave: (m: Member) => void; onClose: () => void;
}) {
  const [role, setRole] = useState<'admin' | 'buyer'>(member.role === 'owner' ? 'admin' : member.role);
  const [monthlyLimitVal, setMonthlyLimitVal] = useState(member.monthlyLimit !== null ? String(member.monthlyLimit) : '');

  const monthlyLimitNum = parseFloat(monthlyLimitVal) || 0;

  const handleSave = () => {
    const updated: Member = {
      ...member,
      role: canEditRole ? (role as 'owner' | 'admin' | 'buyer') : member.role,
      monthlyLimit: monthlyLimitVal === '' ? null : monthlyLimitNum,
    };
    onSave(updated);
  };

  return (
    <BottomSheet onDismiss={onClose}>
      <div className="bg-white border border-[#f9f9fb] flex flex-col overflow-clip rounded-2xl mx-3 w-[calc(100%-24px)]">
        <div className="border-b border-[#f5f5f5] flex items-center justify-between p-4">
          <p className="font-['Noontree:Bold'] text-[16px] leading-[20px] text-[#0e0e0e] tracking-[-0.16px]" style={{ fontFeatureSettings: '"case" 1' }}>Edit member</p>
          <button onClick={onClose} className="font-['Noontree:Regular'] text-[14px] leading-[18px] text-[#959595] cursor-pointer">Cancel</button>
        </div>

        <div className="flex items-center gap-3 p-4 border-b border-[#f5f5f5]">
          <Avatar initials={member.initials} size={36} />
          <div>
            <p className="font-['Noontree:SemiBold'] text-[14px] leading-[18px] text-[#0e0e0e]" style={{ fontFeatureSettings: '"case" 1' }}>{member.name}</p>
            <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#5d5d5d]">{member.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-4">
          {/* Role */}
          {canEditRole && (
            <div className="flex flex-col gap-3">
              <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Role</p>
              <div className="flex bg-[#f5f5f5] rounded-xl p-1 gap-1">
                {(['buyer', 'admin'] as const).map(r => (
                  <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 rounded-lg font-['Noontree:SemiBold'] text-[13px] leading-[16px] tracking-[-0.12px] transition-colors cursor-pointer capitalize ${role === r ? 'bg-white text-[#0e0e0e] shadow-sm' : 'text-[#959595]'}`} style={{ fontFeatureSettings: '"case" 1' }}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
              {role === 'buyer' && member.role === 'admin' && (
                <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#5d5d5d]" style={{ fontFeatureSettings: '"case" 1' }}>
                  They'll lose access to Pending approvals immediately.
                </p>
              )}
            </div>
          )}

          {/* Monthly limit */}
          <div className="flex flex-col gap-3">
            {canEditLimit ? (
              <div className="flex flex-col gap-2">
                <LimitInput label="Monthly total limit" value={monthlyLimitVal} onChange={setMonthlyLimitVal} />
                <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#959595]" style={{ fontFeatureSettings: '"case" 1' }}>
                  Once this member's cumulative monthly spend hits this value, all further orders require approval until the month resets. Leave blank for no monthly cap.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Monthly total limit</p>
                  <LockIcon size={14} />
                </div>
                <div className="bg-[#f5f5f5] rounded-xl p-3 flex items-center gap-2">
                  <p className="font-['Noontree:Regular'] text-[12px] leading-[16px] text-[#5d5d5d]" style={{ fontFeatureSettings: '"case" 1' }}>
                    Only the Owner can adjust spending limits.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[#f5f5f5] flex gap-2 p-4">
          <SecondaryBtn label="Cancel" onClick={onClose} />
          <PrimaryBtn label="Save" onClick={handleSave} />
        </div>
      </div>
    </BottomSheet>
  );
}

function InviteSheet({ viewerRole, onClose }: { viewerRole: Role; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'buyer' | 'admin'>('buyer');
  const [monthlyLimitVal, setMonthlyLimitVal] = useState('');
  const alreadyInOrg = email.includes('@acme.com') && email.length > 10;

  return (
    <BottomSheet onDismiss={onClose}>
      <div className="bg-white border border-[#f9f9fb] flex flex-col overflow-clip rounded-2xl mx-3 w-[calc(100%-24px)]">
        <div className="border-b border-[#f5f5f5] flex items-center justify-center p-4">
          <p className="font-['Noontree:Bold'] text-[16px] leading-[20px] text-[#0e0e0e] tracking-[-0.16px]" style={{ fontFeatureSettings: '"case" 1' }}>Invite member</p>
        </div>
        <div className="flex flex-col gap-5 p-4">
          <div>
            <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] mb-2" style={{ fontFeatureSettings: '"case" 1' }}>Email address</p>
            <div className={`bg-white border flex h-12 items-center px-3.5 rounded-xl transition-colors ${alreadyInOrg ? 'border-[#ef4444]' : 'border-[#dfdfdf] focus-within:border-[#0076ff]'}`}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="flex-1 font-['Noontree:Medium'] text-[14px] text-[#0e0e0e] outline-none bg-transparent placeholder:text-[#959595]"
                style={{ fontFeatureSettings: '"case" 1' }}
              />
            </div>
            {alreadyInOrg && (
              <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#ef4444] mt-1" style={{ fontFeatureSettings: '"case" 1' }}>
                This person already belongs to another organization.
              </p>
            )}
          </div>

          {(viewerRole === 'owner' || viewerRole === 'admin') && (
            <>
              <div>
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#0e0e0e] tracking-[-0.12px] mb-2" style={{ fontFeatureSettings: '"case" 1' }}>Role</p>
                <div className="flex bg-[#f5f5f5] rounded-xl p-1 gap-1">
                  {(['buyer', 'admin'] as const).map(r => (
                    <button key={r} onClick={() => setRole(r)} className={`flex-1 py-2 rounded-lg font-['Noontree:SemiBold'] text-[13px] leading-[16px] tracking-[-0.12px] cursor-pointer capitalize transition-colors ${role === r ? 'bg-white text-[#0e0e0e] shadow-sm' : 'text-[#959595]'}`} style={{ fontFeatureSettings: '"case" 1' }}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <LimitInput label="Monthly total limit" value={monthlyLimitVal} onChange={setMonthlyLimitVal} />
                <p className="font-['Noontree:Regular'] text-[11px] leading-[14px] text-[#959595]" style={{ fontFeatureSettings: '"case" 1' }}>
                  Optional. Once this member's cumulative monthly spend hits this value, further orders require approval. Leave blank for no monthly cap.
                </p>
              </div>
            </>
          )}
        </div>
        <div className="border-t border-[#f5f5f5] flex gap-2 p-4">
          <SecondaryBtn label="Cancel" onClick={onClose} />
          <PrimaryBtn label="Send invite" onClick={onClose} disabled={!email || alreadyInOrg} />
        </div>
      </div>
    </BottomSheet>
  );
}
