
export type RouteType =
    | {
    template: string;
    requiresAuth?: boolean;
    useLayout: string;
    route: string;
    useSecondLayout: string;
    load?: () => void;
    unload?: () => void;
    styles?: any[];
    title?: string;
}
    | {
    template: string;
    route: string;
    title?: string;
    requiresAuth?: boolean;
    unload?: () => void;
    load?: () => void;
    styles?: any[];
}
    | {
    template: string;
    route: string;
    load?: () => void;
    unload?: () => void;
    styles?: any[];
    title?: string;
    requiresAuth?: boolean;
}
    | {
    route: string;
    load?: () => void;
    requiresAuth?: boolean;
    unload?: () => void;
    styles?: any[];
    title?: string;
};