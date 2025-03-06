// src/components/navigation/types.ts
export interface MenuItem {
    label: string;
    href: string;
    submenu?: MenuItem[];
  }