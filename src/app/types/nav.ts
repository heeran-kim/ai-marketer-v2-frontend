// src/types/nav.ts
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface Action {
    label: string;
    onClick: (router: AppRouterInstance) => void;
    disabled?: boolean;
}

export interface HeaderProps {
    title: string;
    description: string;
    createAction?: (router: AppRouterInstance) => { onClick: () => void } | null;
    moreActions?: (router: AppRouterInstance) => Action[] | null;
    backTo?: string;
}

export interface SubPage {
    href: string;
    header: HeaderProps;
}

export interface NavItem {
    name: string;
    href: string;
    header: HeaderProps;
    subPages?: SubPage[];
}