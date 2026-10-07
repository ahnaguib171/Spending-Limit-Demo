export type Role = 'owner' | 'admin' | 'buyer';

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'completed'
  | 'rejected'
  | 'expired'
  | 'approval_lapsed'
  | 'withdrawn'
  | 'validation_failed';

export type ScreenId =
  | 'dashboard'
  | 'checkout-overlimit'
  | 'checkout-confirmation'
  | 'approvals-queue'
  | 'my-requests'
  | 'governance-off'
  | 'governance-on'
  | 'members'
  | 'account'
  | 'orders-list'
  | 'order-details'
  | 'request-details';

export interface LineItem {
  id: string;
  title: string;
  seller: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  status?: 'ok' | 'unavailable' | 'price_increased';
  newPrice?: number;
}

export interface ApprovalRequest {
  id: string;
  reference: string;
  requester: { name: string; initials: string; email: string; role: 'admin' | 'buyer' };
  amount: number;
  orderLimit: number;
  monthlyLimit: number | null;
  monthlySpentAtSubmission: number;
  approvalReason: 'order_limit' | 'monthly_limit';
  itemCount: number;
  productCount: number;
  submittedAt: string;
  expiresAt: string;
  status: RequestStatus;
  buyerNote?: string;
  decisionBy?: string;
  decisionAt?: string;
  rejectionReason?: string;
  previouslyRejected?: boolean;
  previousRejectionReason?: string;
  lineItems: LineItem[];
  shipping: number;
  vat: number;
  discount: number;
  grandTotal: number;
  shipTo: string;
  paymentMethod: string;
  totalPendingExposure?: number;
}

export interface Member {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: 'owner' | 'admin' | 'buyer';
  monthlyLimit: number | null; // per-user: max cumulative monthly spend; null = no monthly cap
  monthlySpent: number;        // demo: current month's auto-approved spend
  status: 'active' | 'invited';
  lastOrder: string | null;
  pendingRequests?: number;
}

export interface OrgOrder {
  id: string;
  reference: string;
  buyer: string;
  buyerInitials: string;
  amount: number;
  date: string;
  orderStatus: 'delivered' | 'processing' | 'shipped';
  approvalType: 'auto' | 'manual' | 'pre_v1';
  approvedBy?: string;
  approvedAt?: string;
}

export const ORG_NAME = "Acme Distribution";
export const ORDER_LIMIT = 5000; // org-wide: any single order above this requires approval
export const CURRENCY = "AED";
export const fmt = (n: number) => `AED ${n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const REQUESTS: ApprovalRequest[] = [
  {
    id: 'r1', reference: 'APR-2026-001',
    requester: { name: 'Zeina Nossier', initials: 'ZN', email: 'zeina@acme.com', role: 'buyer' },
    amount: 36990, orderLimit: ORDER_LIMIT, monthlyLimit: 20000, monthlySpentAtSubmission: 4200, approvalReason: 'order_limit',
    itemCount: 20, productCount: 2,
    submittedAt: '2026-04-09T10:22:00Z', expiresAt: '2026-04-12T10:22:00Z',
    status: 'pending', totalPendingExposure: 55440,
    buyerNote: 'Urgent for Q2 project kick-off. Need delivery by Friday.',
    lineItems: [
      { id: 'l1', title: 'HP LaserJet Pro 4001dn', seller: 'TechHub UAE', unitPrice: 2499, qty: 5, lineTotal: 12495, status: 'ok' },
      { id: 'l2', title: 'Dell 27" Monitor P2723D', seller: 'ElectroCity', unitPrice: 1767, qty: 15, lineTotal: 26505, status: 'ok' },
    ],
    shipping: 150, vat: 1945, discount: 500, grandTotal: 36990,
    shipTo: '123 Business Bay, Dubai, UAE', paymentMethod: 'Corporate Card ****4521',
  },
  {
    id: 'r2', reference: 'APR-2026-002',
    requester: { name: 'Ahmed Hassan', initials: 'AH', email: 'ahmed@acme.com', role: 'buyer' },
    amount: 18450, orderLimit: ORDER_LIMIT, monthlyLimit: 15000, monthlySpentAtSubmission: 3500, approvalReason: 'order_limit',
    itemCount: 8, productCount: 3,
    submittedAt: '2026-04-08T14:30:00Z', expiresAt: '2026-04-11T14:30:00Z',
    status: 'pending', totalPendingExposure: 18450,
    previouslyRejected: true,
    previousRejectionReason: 'Budget not approved for Q2 yet. Please resubmit in May.',
    lineItems: [
      { id: 'l3', title: 'Logitech MX Keys Keyboard', seller: 'AccessoryHub', unitPrice: 450, qty: 5, lineTotal: 2250, status: 'ok' },
      { id: 'l4', title: 'Samsung T7 SSD 1TB', seller: 'StoragePro', unitPrice: 680, qty: 3, lineTotal: 2040, status: 'price_increased', newPrice: 750 },
    ],
    shipping: 60, vat: 875, discount: 0, grandTotal: 18450,
    shipTo: '456 DIFC Tower, Dubai, UAE', paymentMethod: 'Bank Transfer',
  },
  {
    id: 'r3', reference: 'APR-2026-003',
    requester: { name: 'Sara Al-Rashid', initials: 'SR', email: 'sara@acme.com', role: 'admin' },
    amount: 12000, orderLimit: ORDER_LIMIT, monthlyLimit: 30000, monthlySpentAtSubmission: 0, approvalReason: 'order_limit',
    itemCount: 5, productCount: 1,
    submittedAt: '2026-04-07T09:00:00Z', expiresAt: '2026-04-10T09:00:00Z',
    status: 'approved', decisionBy: 'Khalid Al-Mansoori', decisionAt: '2026-04-07T11:30:00Z',
    lineItems: [
      { id: 'l5', title: 'Apple MacBook Air M3 (16GB)', seller: 'iShop UAE', unitPrice: 2400, qty: 5, lineTotal: 12000, status: 'ok' },
    ],
    shipping: 0, vat: 600, discount: 0, grandTotal: 12000,
    shipTo: 'Office 12, Jumeirah Lakes Towers, Dubai', paymentMethod: 'Corporate Card ****4521',
  },
  {
    id: 'r4', reference: 'APR-2026-004',
    requester: { name: 'Mohammed Khalid', initials: 'MK', email: 'mk@acme.com', role: 'buyer' },
    amount: 8500, orderLimit: ORDER_LIMIT, monthlyLimit: 10000, monthlySpentAtSubmission: 2200, approvalReason: 'order_limit',
    itemCount: 10, productCount: 2,
    submittedAt: '2026-04-05T11:00:00Z', expiresAt: '2026-04-08T11:00:00Z',
    status: 'rejected', decisionBy: 'Khalid Al-Mansoori', decisionAt: '2026-04-06T09:00:00Z',
    rejectionReason: 'This equipment purchase should go through the procurement portal. Please raise a purchase order instead.',
    lineItems: [
      { id: 'l6', title: 'Ergonomic Office Chair (Mesh)', seller: 'FurniturePlus', unitPrice: 650, qty: 10, lineTotal: 6500, status: 'ok' },
      { id: 'l7', title: 'Standing Desk Converter', seller: 'OfficeSupply', unitPrice: 200, qty: 10, lineTotal: 2000, status: 'ok' },
    ],
    shipping: 0, vat: 0, discount: 0, grandTotal: 8500,
    shipTo: 'Warehouse 3, Al Quoz Industrial, Dubai', paymentMethod: 'Corporate Card ****4521',
  },
  {
    id: 'r5', reference: 'APR-2026-005',
    requester: { name: 'Lena Petrov', initials: 'LP', email: 'lena@acme.com', role: 'buyer' },
    amount: 22000, orderLimit: ORDER_LIMIT, monthlyLimit: 15000, monthlySpentAtSubmission: 11200, approvalReason: 'monthly_limit',
    itemCount: 15, productCount: 3,
    submittedAt: '2026-04-03T08:00:00Z', expiresAt: '2026-04-06T08:00:00Z',
    status: 'expired',
    lineItems: [
      { id: 'l8', title: 'Canon imagePROGRAF iPF780', seller: 'PrintTech', unitPrice: 5500, qty: 2, lineTotal: 11000, status: 'ok' },
      { id: 'l9', title: 'Ink Cartridge Set XL (pack of 5)', seller: 'PrintTech', unitPrice: 380, qty: 10, lineTotal: 3800, status: 'unavailable' },
    ],
    shipping: 0, vat: 1100, discount: 0, grandTotal: 22000,
    shipTo: 'Studio 5, Al Quoz Creative District, Dubai', paymentMethod: 'Corporate Card ****4521',
  },
  {
    id: 'r6', reference: 'APR-2026-006',
    requester: { name: 'James Wilson', initials: 'JW', email: 'james@acme.com', role: 'buyer' },
    amount: 15200, orderLimit: ORDER_LIMIT, monthlyLimit: 20000, monthlySpentAtSubmission: 4200, approvalReason: 'order_limit',
    itemCount: 12, productCount: 2,
    submittedAt: '2026-04-02T13:00:00Z', expiresAt: '2026-04-05T13:00:00Z',
    status: 'approval_lapsed',
    decisionBy: 'Sara Al-Rashid', decisionAt: '2026-04-03T10:00:00Z',
    lineItems: [
      { id: 'l10', title: 'Cisco IP Phone 8861', seller: 'NetGear UAE', unitPrice: 950, qty: 12, lineTotal: 11400, status: 'ok' },
      { id: 'l11', title: 'Cat6 Ethernet Cable 50m', seller: 'CableHub', unitPrice: 150, qty: 25, lineTotal: 3750, status: 'ok' },
    ],
    shipping: 0, vat: 760, discount: 500, grandTotal: 15200,
    shipTo: 'Server Room, Al Barsha, Dubai', paymentMethod: 'Corporate Card ****4521',
  },
];

export const MEMBERS: Member[] = [
  { id: 'm1', name: 'Khalid Al-Mansoori', initials: 'KM', email: 'khalid@acme.com', role: 'owner', monthlyLimit: null, monthlySpent: 0, status: 'active', lastOrder: '2026-04-09' },
  { id: 'm2', name: 'Sara Al-Rashid', initials: 'SR', email: 'sara@acme.com', role: 'admin', monthlyLimit: 30000, monthlySpent: 0, status: 'active', lastOrder: '2026-04-07' },
  { id: 'm3', name: 'Zeina Nossier', initials: 'ZN', email: 'zeina@acme.com', role: 'buyer', monthlyLimit: 20000, monthlySpent: 4200, status: 'active', lastOrder: '2026-04-09', pendingRequests: 1 },
  { id: 'm4', name: 'Ahmed Hassan', initials: 'AH', email: 'ahmed@acme.com', role: 'buyer', monthlyLimit: 15000, monthlySpent: 3500, status: 'active', lastOrder: '2026-04-08' },
  { id: 'm5', name: 'Mohammed Khalid', initials: 'MK', email: 'mk@acme.com', role: 'buyer', monthlyLimit: 10000, monthlySpent: 2200, status: 'active', lastOrder: '2026-04-05' },
  { id: 'm6', name: 'Lena Petrov', initials: 'LP', email: 'lena@acme.com', role: 'buyer', monthlyLimit: 15000, monthlySpent: 11200, status: 'active', lastOrder: '2026-04-03' },
  { id: 'm7', name: 'James Wilson', initials: 'JW', email: 'james@acme.com', role: 'buyer', monthlyLimit: 20000, monthlySpent: 0, status: 'invited', lastOrder: null },
];

export const ORG_ORDERS: OrgOrder[] = [
  { id: 'o1', reference: 'NEGI20036452280', buyer: 'Zeina Nossier', buyerInitials: 'ZN', amount: 4200, date: '2026-04-09', orderStatus: 'processing', approvalType: 'auto' },
  { id: 'o2', reference: 'NEGI20036452281', buyer: 'Sara Al-Rashid', buyerInitials: 'SR', amount: 12000, date: '2026-04-07', orderStatus: 'shipped', approvalType: 'manual', approvedBy: 'Khalid Al-Mansoori', approvedAt: '2026-04-07 11:30' },
  { id: 'o3', reference: 'NEGI20036452282', buyer: 'Ahmed Hassan', buyerInitials: 'AH', amount: 3500, date: '2026-04-06', orderStatus: 'delivered', approvalType: 'auto' },
  { id: 'o4', reference: 'NEGI20036452283', buyer: 'Mohammed Khalid', buyerInitials: 'MK', amount: 2200, date: '2026-04-05', orderStatus: 'delivered', approvalType: 'auto' },
  { id: 'o5', reference: 'NEGI20036452284', buyer: 'Lena Petrov', buyerInitials: 'LP', amount: 8900, date: '2026-04-02', orderStatus: 'delivered', approvalType: 'manual', approvedBy: 'Sara Al-Rashid', approvedAt: '2026-04-01 15:00' },
  { id: 'o6', reference: 'NEGI20036452285', buyer: 'Khalid Al-Mansoori', buyerInitials: 'KM', amount: 1800, date: '2026-03-28', orderStatus: 'delivered', approvalType: 'pre_v1' },
];
