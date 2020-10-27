export interface MetaTree {
    name: string,
    pathname?: string,
    pages?: MetaTree[],
}
export interface RouteItem {
    path: string,
    component: Function
}
export interface AppFcProps {
    metadata: MetaTree | MetaTree[]
    routes: RouteItem[],

}
export interface AppFc {
    (props: AppFcProps): JSX.Element
}