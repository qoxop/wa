import React, { useEffect, useRef } from 'react';
import { AppFcProps, MetaTree } from "./types";
import MyRouter from './components/myRouter';
import Tree from './components/tree';
import { Route, NavLink, useLocation, Link } from 'react-router-dom';
// @ts-ignore
import logo from './assets/imgs/logo.png';
import './assets/styles/index.scss';


function useSetMinHeightRef(initMinHeight: number = 0) {
    const ref = useRef<HTMLDivElement>();
    function updateMinHeight() {
        const pos = ref.current.getBoundingClientRect();
        const height = Math.min(window.innerHeight,  pos.height);
        (ref.current.firstElementChild as HTMLDivElement).style.minHeight = `${height}px`;
    }
    useEffect(() => {
        updateMinHeight();
        window.addEventListener('resize', updateMinHeight)
        return () => window.removeEventListener('resize',updateMinHeight);
    }, [])
    return ref
}

function AppHeader({metadata}: {metadata: MetaTree[]}) {
    const location = useLocation();
    return (
        <header className="app-header">
            <div className="app-header-bar">
                <nav className="l-max-container flexbox middle">
                    <div className="flex-1 flexbox">
                        <Link to="/" className="block ml20">
                            <img className="h45" src={logo} alt="" />
                        </Link>
                    </div>
                    <ul className="unset-ul flexbox pr22">
                        {metadata.map(item => {
                            const isActive = location.pathname.indexOf(item.pathname.replace(/\/app$/, '')) === 0;
                            return (<li key={item.pathname} className="plr8 bold t3">
                                <NavLink
                                    className="nav-link inline-block pd10"
                                    to={item.pathname}
                                    activeClassName="nav-link-selected"
                                    isActive={(match) => {
                                        if (match || isActive) {
                                            return true
                                        }
                                        return item.root && location.pathname === '/'
                                    }}
                                >
                                    {item.name}
                                </NavLink>
                            </li>)
                        })}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

function AppSider({metadata, className}) {
    // const matched = useRouteMatch();
    const location = useLocation();
    const prefix = location.pathname.replace(/^\/+/g, '').split('/')[0];
    const sub = metadata.find((item) => ((item.pathname as string).indexOf(prefix) === 1))
    if (sub && sub.pages) {
        return <aside className={`c-aside-nav-tree ${className}`}>
            <Tree pages={sub.pages} level={1} />
        </aside>
    }
    return null;
    
}

export default function App(props: AppFcProps): JSX.Element {
    console.log(props)
    const metadata = props.metadata as MetaTree[];
    const { routes } = props;
    const mainRef = useSetMinHeightRef()
    return <MyRouter>
        <div className="flexbox f-colunm min-height-100 bg-page">
            <AppHeader metadata={metadata} />
            <main className="flex-1" ref={mainRef}>
                <section className="l-max-container flexbox">
                    <AppSider metadata={metadata} className="" />
                    <div className="flex-4 pd10">
                        {routes.map(item => {
                            const {path, component} = item;
                            return <Route path={path} component={component} key={path} exact={true}  />
                        })}
                    </div>
                </section>
            </main>
            <footer>
                sddd
            </footer>
        </div>
    </MyRouter>
}