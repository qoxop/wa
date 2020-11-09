import React from 'react';
import { AppFcProps, MetaTree } from "./types";
import MyRouter from './components/myRouter';
import { Route, NavLink } from 'react-router-dom'
import './assets/styles/index.scss';

function AppHeader({metadata}: {metadata: MetaTree[]}) {
    return (
        <header className="app-header">
            <div className="app-header-bar">
                <nav className="l-max-container flexbox">
                    <div className="flex-1">logo</div>
                    <ul className="unset-ul flexbox pr22">
                        {metadata.map(item => {
                            return (<li key={item.pathname} className="plr8 bold t3">
                                <NavLink
                                    className="nav-link inline-block pd10"
                                    to={item.pathname}
                                    activeClassName="nav-link-selected"
                                    isActive={(match, location) => {
                                        if (match) {
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


export default function App(props: AppFcProps): JSX.Element {
    console.log(props)
    const metadata = props.metadata as MetaTree[];
    const { routes } = props;
    return <MyRouter>
        <div className="flexbox f-colunm min-height-100 bg-page">
            <AppHeader metadata={metadata} />
            <main className="flex-1">
                <section className="l-max-container ">
                    {routes.map(item => {
                        const {path, component} = item;
                        return <Route path={path} component={component} key={path} exact={true}  />
                    })}
                </section>
            </main>
            <footer>
                sddd
            </footer>
        </div>
    </MyRouter>
}