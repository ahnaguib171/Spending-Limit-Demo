import type { Role, ScreenId } from '../data';
import { ORG_NAME } from '../data';

const assetPathPrefix = '/assets';

const imgLines = `${assetPathPrefix}/ed2a8.svg`;
const imgLIneRaw = `${assetPathPrefix}/ff89a.svg`;
const imgSolidCheckBadge = `${assetPathPrefix}/52db6.svg`;
const imgShield4 = `${assetPathPrefix}/470ab.svg`;
const imgLine = `${assetPathPrefix}/eda7d.png`;
const imgMIconSystemIconOrderBox = `${assetPathPrefix}/35f92.svg`;
const imgMIconSystemIconNotepad = `${assetPathPrefix}/472c1.svg`;
const imgMIconSystemIconReturnPackage = `${assetPathPrefix}/e0f49.svg`;
const imgMIconSystemIconLocationBase = `${assetPathPrefix}/441e8.svg`;
const imgChevronRight = `${assetPathPrefix}/0c528.svg`;
const imgChevronLine1 = `${assetPathPrefix}/9ee59.svg`;
const imgChevronLine2 = `${assetPathPrefix}/a85b8.svg`;
const imgMIconSystemIconPaymentCards = `${assetPathPrefix}/c1799.svg`;
const imgMIconSystemIconCountry = `${assetPathPrefix}/0fca5.svg`;
const imgContents = `${assetPathPrefix}/154dd.svg`;
const imgMIconSystemIconLanguage = `${assetPathPrefix}/b02f7.svg`;
const imgMIconSystemIconPreferences = `${assetPathPrefix}/4a414.svg`;
const imgMIconSystemIconNotification = `${assetPathPrefix}/3d6b6.svg`;
const imgOutlineSquares2X2 = `${assetPathPrefix}/89e00.svg`;
const imgOutlineClipboardDocumentCheck = `${assetPathPrefix}/100fe.svg`;
const imgGroupUsers = `${assetPathPrefix}/146c0.svg`;
const imgMIconSystemIconCall = `${assetPathPrefix}/ff058.svg`;
const imgMIconSystemIconUserShield = `${assetPathPrefix}/57b3d.svg`;
const imgMIconSystemIconSignIn = `${assetPathPrefix}/ca70b.svg`;
const imgMiniArrowLeft = `${assetPathPrefix}/437fb.svg`;
const imgSocialFb = `${assetPathPrefix}/22a43.svg`;
const imgSocialX = `${assetPathPrefix}/52a7d.svg`;
const imgSocialXOverlay1 = `${assetPathPrefix}/9b862.svg`;
const imgSocialXOverlay2 = `${assetPathPrefix}/4d102.svg`;
const imgSocialLi = `${assetPathPrefix}/fe783.svg`;
const imgSocialIg = `${assetPathPrefix}/d42db.svg`;
const imgNeedHelpAvatar = `${assetPathPrefix}/e1399.svg`;
const imgAccountIcon = `${assetPathPrefix}/e32db.svg`;
const imgHomeInactive = `${assetPathPrefix}/472b4.svg`;
const imgCartInactive = `${assetPathPrefix}/271bc.svg`;

const ROLE_LABELS: Record<Role, string> = { owner: 'Owner', admin: 'Admin', buyer: 'Buyer' };

// ─── Helpers ────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="relative shrink-0 w-full" style={{ height: 1 }}>
      <img alt="" className="block w-full" style={{ height: 1 }} src={imgLine} />
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-4">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight} />
      <div className="absolute" style={{ bottom: '25%', left: '41.66%', right: '33.34%', top: '25%' }}>
        <div className="absolute" style={{ inset: '-9.38% -18.75%' }}>
          <img alt="" className="block max-w-none size-full" src={imgChevronLine2} />
        </div>
      </div>
    </div>
  );
}

function ListItem({ icon, label, right, onClick }: {
  icon: string; label: string; right?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 items-center w-full rounded-xl text-left cursor-pointer"
    >
      <div className="relative shrink-0 size-6">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={icon} />
      </div>
      <p className="flex-1 min-w-0 font-['Noontree:Medium'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px]" style={{ fontFeatureSettings: '"case" 1' }}>
        {label}
      </p>
      {right ?? <ChevronRight />}
    </button>
  );
}

function SettingsGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white flex flex-col gap-4 items-start px-3 py-4 rounded-2xl w-full">
      {children}
    </div>
  );
}

// ─── Account screen ─────────────────────────────────────────────────────────

export function Account({ role, onNavigate }: { role: Role; onNavigate: (screen: ScreenId) => void }) {
  const initials = role === 'owner' ? 'KM' : role === 'admin' ? 'SR' : 'ZN';
  const name = role === 'owner' ? 'Khalid Al-Mansoori' : role === 'admin' ? 'Sara Al-Rashid' : 'Zeina Nossier';
  const email = role === 'owner' ? 'khalid@acme.com' : role === 'admin' ? 'sara@acme.com' : 'zeina@acme.com';
  const isOrgMember = role === 'owner' || role === 'admin';

  return (
    <div className="flex flex-col h-full bg-[#f3f4f8] relative">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex flex-col gap-4 px-3 pt-14 pb-6">

          {/* ── Profile card ── */}
          <div
            className="flex flex-col gap-2 items-center overflow-clip p-1 rounded-2xl w-full"
            style={{
              backgroundImage: "linear-gradient(90deg, rgb(216,234,255) 0%, rgb(216,234,255) 100%), linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
            }}
          >
            {/* Decorative lines */}
            <div className="absolute h-[180px] left-3 right-3 top-14 overflow-hidden pointer-events-none rounded-2xl">
              <img alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" src={imgLines} />
            </div>

            {/* User info row */}
            <div className="bg-white flex gap-3 items-center overflow-clip p-3 rounded-xl w-full relative">
              {/* Avatar */}
              <div
                className="flex items-center justify-center rounded-full shrink-0 size-12"
                style={{ background: 'linear-gradient(90deg, #eaecf0, #f2f3f7)' }}
              >
                <span className="font-['Noontree:Bold'] text-[20px] leading-7 text-[#5d5d5d] tracking-[-0.2px]" style={{ fontFeatureSettings: '"case" 1' }}>
                  {initials[0]}
                </span>
              </div>
              {/* Name + email */}
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="font-['Noontree:Bold'] text-[16px] leading-5 text-[#0e0e0e] tracking-[-0.16px] truncate" style={{ fontFeatureSettings: '"case" 1' }}>{name}</p>
                <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px] truncate">{email}</p>
              </div>
              {/* Edit button */}
              <div className="bg-[#fcfcfd] border border-[#f2f3f7] flex items-center justify-center p-[9px] rounded-full shrink-0">
                <div className="relative size-[18px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLIneRaw} />
                </div>
              </div>
            </div>

            {/* Org row */}
            <div className="flex gap-3 items-center px-2 py-1 w-full relative">
              <div className="relative shrink-0 size-6">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSolidCheckBadge} />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <p className="font-['Noontree:Bold'] text-[14px] leading-[18px] text-[#0e0e0e] tracking-[-0.14px]" style={{ fontFeatureSettings: '"case" 1' }}>{ORG_NAME}</p>
                <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#5d5d5d] tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Corporation</p>
              </div>
              {/* Role badge */}
              <div className="bg-[#eff7ff] flex gap-1 items-center overflow-clip px-1.5 py-1 rounded">
                <div className="relative shrink-0 size-3">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShield4} />
                </div>
                <p className="font-['Noontree:SemiBold'] text-[10px] leading-3 text-[#0076ff] tracking-[1px] uppercase" style={{ fontFeatureSettings: '"case" 1' }}>{ROLE_LABELS[role]}</p>
              </div>
            </div>
          </div>

          {/* ── Quick actions: Orders / Quotes / Returns ── */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full">
              <button onClick={() => onNavigate('orders-list')} className="bg-white flex flex-1 flex-col gap-2 items-start px-4 py-5 rounded-lg cursor-pointer hover:bg-[#fafafa] transition-colors">
                <div className="relative shrink-0 size-6">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMIconSystemIconOrderBox} />
                </div>
                <div>
                  <p className="font-['Proxima Nova:Semibold'] text-[16px] leading-[22.4px] text-[#0e0e0e]">Orders</p>
                  <p className="font-['Proxima Nova:Regular'] text-[12px] leading-[16.8px] text-[#5d5d5d]">Manage &amp; track</p>
                </div>
              </button>
              <button className="bg-white flex flex-1 flex-col gap-2 items-start px-4 py-5 rounded-lg cursor-pointer hover:bg-[#fafafa] transition-colors">
                <div className="relative shrink-0 size-6">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMIconSystemIconNotepad} />
                </div>
                <div>
                  <p className="font-['Proxima Nova:Semibold'] text-[16px] leading-[22.4px] text-[#0e0e0e]">Quotes</p>
                  <p className="font-['Proxima Nova:Regular'] text-[12px] leading-[16.8px] text-[#5d5d5d]">2 active requests</p>
                </div>
              </button>
            </div>
            <div className="flex gap-2 w-full">
              <button className="bg-white flex flex-1 flex-col gap-2 items-start px-4 py-5 rounded-lg cursor-pointer hover:bg-[#fafafa] transition-colors">
                <div className="relative shrink-0 size-6">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMIconSystemIconReturnPackage} />
                </div>
                <div>
                  <p className="font-['Proxima Nova:Semibold'] text-[16px] leading-[22.4px] text-[#0e0e0e]">Returns</p>
                  <p className="font-['Proxima Nova:Regular'] text-[12px] leading-[16.8px] text-[#5d5d5d]">2 active requests</p>
                </div>
              </button>
              {(role === 'buyer' || role === 'admin') && (
                <button onClick={() => onNavigate('my-requests')} className="bg-white flex flex-1 flex-col gap-2 items-start px-4 py-5 rounded-lg cursor-pointer hover:bg-[#fafafa] transition-colors">
                  <div className="relative shrink-0 size-6">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOutlineClipboardDocumentCheck} />
                  </div>
                  <div>
                    <p className="font-['Proxima Nova:Semibold'] text-[16px] leading-[22.4px] text-[#0e0e0e]">Order Requests</p>
                    <p className="font-['Proxima Nova:Regular'] text-[12px] leading-[16.8px] text-[#5d5d5d]">View &amp; manage</p>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* ── Personal settings ── */}
          <SettingsGroup>
            <ListItem icon={imgMIconSystemIconLocationBase} label="Addresses" />
            <Divider />
            <ListItem icon={imgMIconSystemIconPaymentCards} label="Payment Methods" />
            <Divider />
            <ListItem
              icon={imgMIconSystemIconCountry}
              label="Country"
              right={
                <div className="flex items-center gap-2 shrink-0">
                  <div className="drop-shadow-[0px_1.5px_1.125px_rgba(0,0,0,0.1)] h-[18px] overflow-clip relative rounded-sm w-6">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgContents} />
                  </div>
                  <ChevronRight />
                </div>
              }
            />
            <Divider />
            <ListItem
              icon={imgMIconSystemIconLanguage}
              label="Language"
              right={
                <div className="flex h-[38px] items-center p-1 relative rounded-full shrink-0 w-[127px]" style={{ background: '#f9f9fb', boxShadow: 'inset 0px 1px 4px 0px rgba(36,36,36,0.04)' }}>
                  <div className="bg-white border border-[#fcfcfd] flex h-full items-center justify-center px-2.5 py-2 rounded-2xl shrink-0 shadow-sm">
                    <p className="font-['Noontree:SemiBold'] text-[12px] leading-[14px] text-[#1d2539] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>English</p>
                  </div>
                  <div className="flex items-center justify-center px-2.5 py-2 rounded-xl shrink-0">
                    <p className="font-['Cairo:Medium'] font-medium text-[14px] leading-[14px] text-[#666d85] tracking-[-0.14px] whitespace-nowrap" dir="rtl" style={{ fontFeatureSettings: '"case" 1' }}>العربية</p>
                  </div>
                </div>
              }
            />
          </SettingsGroup>

          {/* ── App & Settings ── */}
          <SettingsGroup>
            <ListItem icon={imgMIconSystemIconPreferences} label="Preferences" />
            <Divider />
            <ListItem icon={imgMIconSystemIconNotification} label="Notifications" />
          </SettingsGroup>

          {/* ── Organization section (owner / admin only) ── */}
          {isOrgMember && (
            <SettingsGroup>
              <ListItem
                icon={imgOutlineSquares2X2}
                label="Dashboard"
                onClick={() => onNavigate('dashboard')}
              />
              <Divider />
              <ListItem
                icon={imgOutlineClipboardDocumentCheck}
                label="Approvals"
                onClick={() => onNavigate('approvals-queue')}
              />
              <Divider />
              <ListItem
                icon={imgGroupUsers}
                label="Users & limits"
                onClick={() => onNavigate('members')}
              />
            </SettingsGroup>
          )}

          {/* ── Support & auth ── */}
          <SettingsGroup>
            <ListItem icon={imgMIconSystemIconCall} label="Contact Us" />
            <Divider />
            <ListItem icon={imgMIconSystemIconUserShield} label="Account Security" />
            <Divider />
            <ListItem icon={imgMIconSystemIconSignIn} label="Sign Out" />
          </SettingsGroup>

          {/* ── Footer ── */}
          <div className="bg-white flex flex-col gap-4 items-center px-3 py-4 rounded-2xl w-full">
            <div className="flex items-center justify-between w-full">
              <p className="flex-1 font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#666d85] text-center tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>Policies</p>
              <div className="flex flex-1 items-center justify-center gap-0.5">
                <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#666d85] text-center tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Sell on noon</p>
                <div className="flex items-center justify-center size-[17px]">
                  <div className="rotate-135">
                    <div className="relative size-3">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMiniArrowLeft} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex items-center justify-between px-15 w-full">
              {[
                { src: imgSocialFb, label: 'Facebook' },
                { src: imgSocialX, label: 'X (Twitter)' },
                { src: imgSocialLi, label: 'LinkedIn' },
                { src: imgSocialIg, label: 'Instagram' },
              ].map(s => (
                <div key={s.label} className="relative shrink-0 size-10">
                  <img alt={s.label} className="absolute block inset-0 max-w-none size-full" src={s.src} />
                </div>
              ))}
            </div>
            <p className="font-['Noontree:Regular'] text-[11px] leading-3 text-[#959595] text-center tracking-[-0.12px]" style={{ fontFeatureSettings: '"case" 1' }}>
              © 2025 noon. All Rights Reserved
            </p>
          </div>

          <div className="text-center">
            <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>You joined the noon app in June 2022.</p>
            <p className="font-['Noontree:Regular'] text-[12px] leading-[14px] text-[#959595] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Version 4.63.0 designed with care in every detail.</p>
          </div>
        </div>
      </div>

      {/* ── Bottom navigation ── */}
      <div className="bg-white shrink-0 w-full" style={{ boxShadow: '0px -4px 4.5px rgba(0,0,0,0.04)' }}>
        <div className="flex gap-1 h-[63px] items-center justify-center w-full">
          {/* Home */}
          <div className="flex flex-1 flex-col gap-2 items-center px-5">
            <div className="h-1 w-full" />
            <div className="flex flex-col gap-1 items-center">
              <div className="flex flex-col items-center justify-center size-8">
                <img alt="" className="size-5" src={imgHomeInactive} />
              </div>
              <p className="font-['Noontree:Medium'] text-[12px] leading-[14px] text-[#475067] tracking-[-0.12px] whitespace-nowrap">Home</p>
            </div>
          </div>
          {/* Account (active) */}
          <div className="flex flex-1 flex-col gap-2 items-center px-5">
            <div className="h-1 w-full bg-[#1155cb] rounded-full" />
            <div className="flex flex-col gap-1 items-center">
              <div className="flex flex-col items-center justify-center size-8">
                <img alt="" className="size-5" src={imgAccountIcon} />
              </div>
              <p className="font-['Noontree:Bold'] text-[12px] leading-[14px] text-[#1155cb] tracking-[-0.12px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Account</p>
            </div>
          </div>
          {/* Cart */}
          <div className="flex flex-1 flex-col gap-2 items-center px-5">
            <div className="h-1 w-full" />
            <div className="flex flex-col gap-1 items-center relative">
              <div className="flex flex-col items-center justify-center size-8 relative">
                <img alt="" className="size-5" src={imgCartInactive} />
                <div className="absolute bg-[#0076ff] flex gap-1 items-center justify-center overflow-clip px-1.5 py-0.5 right-[-9px] rounded-full top-[-6px]">
                  <p className="font-['Noontree:SemiBold'] text-[10px] leading-3 text-white text-center tracking-[1px] uppercase whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>1</p>
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

      {/* ── Need help? FAB ── */}
      <div className="absolute bottom-[104px] right-[27px]">
        <div className="bg-white border-2 border-[#bbdaff] flex gap-2 items-center justify-center px-3 py-3 rounded-[36px] shadow-[0px_-4px_32px_0px_rgba(34,34,34,0.12)] cursor-pointer">
          <div className="relative shrink-0 size-5">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNeedHelpAvatar} />
          </div>
          <p className="font-['Noontree:SemiBold'] text-[16px] leading-5 text-[#1d2539] tracking-[-0.16px] whitespace-nowrap" style={{ fontFeatureSettings: '"case" 1' }}>Need help?</p>
        </div>
      </div>
    </div>
  );
}
