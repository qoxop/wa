import React from 'react'

export interface PageInfo {
    pageSize: number,
    pageIndex: number,
    curLength: number,
}

export interface State<D> {
    size: number,
    index: number,
    data: D[],
    loading: boolean,
    done: boolean
}

export interface PageActions<P> {
    load: () => Promise<any>,
    reset: (params: P) => Promise<any>,
    reload: (params: P) => Promise<any>,
    cacheState: () => void
}

export interface PageState<D> extends State<D> {
    searched: boolean,
    isEmpty: boolean
}
export type LoadAction<P, D> = (params: P & PageInfo) => Promise<{data: D[], done: boolean}>

export default function EnhancePageLoad<P = any, D = any>(pageSize: number, service: LoadAction<P, D>, initIndex = 0) {
    let cache: any = null
    return (Comp: any) => {
        return class EnhanceComp extends React.Component {
            syncLoading: boolean = false
            params: P | undefined;
            loadFn: LoadAction<P, D> = service;
            state: State<D> = {
                size: pageSize,
                index: initIndex,
                data: [],
                loading: false,
                done: false,
            }
            constructor(props: any) {
                super(props);
                if (cache && props.location && props.location.action === "POP") {
                    this.state = {
                        ...this.state,
                        ...(cache.state || {})
                    }
                    this.params = cache.params || undefined;
                }
                cache = null
            }
            cacheState = () => {
                cache = {
                    state: {...this.state},
                    params: this.params
                }
            }
            reset = (params?: P) => {
                this.params = params
                return new Promise((resolve => {
                    this.setState({
                        size: pageSize,
                        index: initIndex,
                        data: [],
                        loading: false,
                        done: false
                    }, () => {
                        resolve()
                    })
                }))
            }
            reload = (params?: P) => {
                this.reset(params).then(() => {
                    this.load()
                })
            }
            load = () => {
                const {index, size, done: isDone, data: oldData} = this.state;
                if (!this.syncLoading && !isDone && typeof this.loadFn === 'function') {
                    this.syncLoading = true;
                    this.setState({loading: true})
                    return this.loadFn(Object.assign({
                        pageIndex: index + 1,
                        pageSize: size,
                        curLength: oldData.length
                    }, this.params)).then(({data, done}) => {
                        this.setState({
                            done,
                            loading: false,
                            index: index + 1,
                            data: this.state.data.concat(data)
                        })
                        this.syncLoading = false
                    }).catch(() => {
                        this.syncLoading = false
                    })
                }
                return Promise.resolve()
            }
            render() {
                const {index, data} = this.state
                return <Comp
                    {...this.props}
                    pageState={{
                        ...this.state,
                        searched: index > initIndex,
                        isEmpty: data.length < 1 && index > initIndex
                    }}
                    pageActions={{
                        load: this.load,
                        reset: this.reset,
                        reload: this.reload,
                        cacheState: this.cacheState
                    }}
                />
            }
        }
    }
}
