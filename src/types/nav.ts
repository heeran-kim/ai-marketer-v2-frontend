// src/types/nav.ts
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReactNode } from "react";

export interface Action {
  label: string;
  onClick: (router: AppRouterInstance) => void;
  disabled?: boolean;
}

export interface HeaderProps {
  title: string;
  description?: string;
  createAction?: (router: AppRouterInstance) => { onClick: () => void } | null;
  moreActions?: (router: AppRouterInstance) => Action[] | null;
}

export interface SubPage {
  name?: string;
  href: string;
  header?: HeaderProps;
}

export interface NavItem {
  name: string;
  href: string;
  header: HeaderProps;
  subPages?: SubPage[];
}

export interface FeatureItem {
  id: string;
  href: string;
  icon: ReactNode;
  name: string;
  shortDescription: string;
  longTitle: string;
  longDescription: string;
}
