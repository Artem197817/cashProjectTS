export interface RouteType {

        route: string;
        title?: string;
        template?: string;
        useLayout?: string;
        useSecondLayout?: string;
        requiresAuth?: boolean;
        load?: () => void;
        unload?: () => void;
        styles?: string[];

}
