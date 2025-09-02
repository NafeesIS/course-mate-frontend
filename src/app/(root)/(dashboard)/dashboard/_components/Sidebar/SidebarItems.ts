import {
  BarChart,
  Building,
  Building2,
  BuildingIcon,
  CalendarClock,
  ClipboardList,
  CreditCard,
  EyeOff,
  FilePlus,
  FileStack,
  FileText,
  Files,
  FolderGit2,
  Home,
  Image,
  List,
  LucideIcon,
  LucideTicketCheck,
  Megaphone,
  ReceiptText,
  ScanSearch,
  ShoppingBag,
  Ticket,
  TicketPlus,
  User,
  UserRoundSearch,
  UserSearch,
  Users,
} from 'lucide-react';

export type TSidebarNavItem = {
  href?: string;
  icon: LucideIcon;
  label: string;
  showInCollapsed: boolean;
  role: string;
  children?: TSidebarNavItem[];
};

export const navItems: TSidebarNavItem[] = [
  {
    href: '/dashboard',
    icon: Building2,
    label: 'Home',
    showInCollapsed: true,
    role: 'user',
  },
  {
    href: '/dashboard/director-contacts',
    label: 'Director Contacts',
    icon: UserRoundSearch,
    showInCollapsed: true,
    role: 'user',
    // children: [
    //   {
    //     href: '/dashboard/director-contacts/',
    //     icon: Contact,
    //     label: 'Unlock Contact',
    //     showInCollapsed: true,
    //     role: 'user',
    //   },
    //   {
    //     href: '/dashboard/director-contacts/',
    //     icon: FileStack,
    //     label: 'Purchase History',
    //     showInCollapsed: false,
    //     role: 'user',
    //   },
    // ],
  },
  {
    href: '/dashboard/unlock-companies',
    icon: Building,
    label: 'Unlock Companies',
    showInCollapsed: true,
    role: 'user',
  },
  {
    href: '/dashboard/new-company-alert',
    icon: CalendarClock,
    label: 'New Company Alert',
    showInCollapsed: true,
    role: 'user',
  },
  {
    label: 'Advanced Search',
    icon: ScanSearch,
    showInCollapsed: false,
    role: 'user',
    children: [
      {
        href: '/search/company',
        icon: Building,
        label: 'Company Search',
        showInCollapsed: false,
        role: 'user',
      },
      {
        href: '/search/director',
        icon: UserSearch,
        label: 'Director Search',
        showInCollapsed: false,
        role: 'user',
      },
    ],
  },
];

export const adminNavItems: TSidebarNavItem[] = [
  {
    href: '/dashboard/admin',
    icon: Building2,
    label: 'Admin Dashboard',
    showInCollapsed: true,
    role: 'admin',
  },
  {
    href: '/dashboard/admin/user-management',
    icon: Users,
    label: 'User Management',
    showInCollapsed: true,
    role: 'admin',
  },
  {
    href: '/dashboard/admin/order-management',
    icon: ShoppingBag,
    label: 'Order Management',
    showInCollapsed: true,
    role: 'admin',
  },
  {
    href: '/dashboard/admin/director-sales',
    icon: ReceiptText,
    label: 'Director Sales',
    showInCollapsed: true,
    role: 'admin',
  },
  {
    href: '/dashboard/admin/subscription-management',
    icon: CreditCard,
    label: 'Subscription Management',
    showInCollapsed: true,
    role: 'admin',
  },
  {
    label: 'Coupon Management',
    icon: Ticket,
    showInCollapsed: false,
    role: 'admin',
    children: [
      {
        href: '/dashboard/admin/coupon-management/create-coupon',
        icon: TicketPlus,
        label: 'Create Coupon',
        showInCollapsed: true,
        role: 'admin',
      },
      {
        href: '/dashboard/admin/coupon-management/coupon-list',
        icon: LucideTicketCheck,
        label: 'Coupon List',
        showInCollapsed: true,
        role: 'admin',
      },
    ],
  },
  {
    href: '/dashboard/admin/unlocked-companies',
    icon: BuildingIcon,
    label: 'Unlocked Companies',
    showInCollapsed: true,
    role: 'admin',
  },
  {
    href: '/dashboard/admin/mask-director-contacts',
    icon: EyeOff,
    label: 'Mask Director Contacts',
    showInCollapsed: true,
    role: 'admin',
  },
  {
    label: 'Manage Campaign',
    icon: Megaphone,
    showInCollapsed: false,
    role: 'admin',
    children: [
      {
        href: '/dashboard/admin/manage-campaign/campaign-overview',
        icon: BarChart,
        label: 'Campaign Overview',
        showInCollapsed: true,
        role: 'admin',
      },
      {
        href: '/dashboard/admin/manage-campaign/campaign-tracker',
        icon: ClipboardList,
        label: 'Campaign Tracker',
        showInCollapsed: true,
        role: 'admin',
      },
      {
        href: '/dashboard/admin/manage-campaign/campaign-list',
        icon: List,
        label: 'Campaign List',
        showInCollapsed: true,
        role: 'admin',
      },
      {
        href: '/dashboard/admin/manage-campaign/campaign-report',
        icon: FileText,
        label: 'Campaign Report',
        showInCollapsed: true,
        role: 'admin',
      },
    ],
  },
  {
    label: 'Docs Management',
    icon: FileStack,
    showInCollapsed: false,
    role: 'admin',
    children: [
      {
        href: '/dashboard/admin/docs-management/create-docs',
        icon: FilePlus,
        label: 'Create Docs',
        showInCollapsed: true,
        role: 'admin',
      },
      {
        href: '/dashboard/admin/docs-management/docs-list',
        icon: Files,
        label: 'Docs List',
        showInCollapsed: true,
        role: 'admin',
      },
      {
        href: '/dashboard/admin/docs-management/manage-media',
        icon: Image,
        label: 'Manage Media',
        showInCollapsed: true,
        role: 'admin',
      },
      {
        href: '/dashboard/admin/docs-management/tags-categories',
        icon: FolderGit2,
        label: 'Manage Tags & Categories',
        showInCollapsed: true,
        role: 'admin',
      },
      {
        href: '/dashboard/admin/docs-management/manage-profile',
        icon: User,
        label: 'Manage Profile',
        showInCollapsed: true,
        role: 'admin',
      },
      {
        href: '/dashboard/admin/docs-management/manage-docs-homepage',
        icon: Home,
        label: 'Docs Homepage',
        showInCollapsed: true,
        role: 'admin',
      },
    ],
  },
];
