export interface MetaTree {
    name: string,
    pathname?: string,
    root?: boolean,
    pages?: MetaTree[],
}
export interface RouteItem {
    path: string,
    component: (props: any) => JSX.Element
}
export interface AppFcProps {
    metadata: MetaTree | MetaTree[]
    routes: RouteItem[],

}
export interface AppFc {
    (props: AppFcProps): JSX.Element
}

export interface ApplicationData {
    metadata: MetaTree | MetaTree[]
    routes: RouteItem[],
    CustomApp: AppFc,
    CustomMdxComponents: any,
}