export interface NavigationItem {
  label: string;
  route?: string;
  url?: string;
  children?: NavigationItem[];
  icon?: string;
  isExternal?: boolean;
  target?: '_blank' | '_self';
}

export interface MenuItem extends NavigationItem {
  id: string;
  order?: number;
  isVisible?: boolean;
  permissions?: string[];
}

export interface Breadcrumb {
  label: string;
  route?: string;
  isActive?: boolean;
}
