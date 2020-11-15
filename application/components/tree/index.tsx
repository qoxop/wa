import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MetaTree } from '../../types';
import './tree.scss';

interface Props {
    pages: MetaTree[],
    level?: number,
    openLevel?: number,
}

function Tree(props: Props) {
    const location = useLocation();
    const {pages, level = 1} = props;
    const [openIndexs, setOpenIndexa] = useState(() => {
        
        return pages.map((item, index) => {
            if (!item?.pages?.length) {
                return -1;
            }
            let open = !!item.open;
            if (open === false) {
                if (location.pathname ===  item.pathname || location.pathname.indexOf(item.pathname.replace(/\/app$/, '') + '/') === 0) {
                    open = true;
                }
            }
            return open ? index : -1;
        }).filter(i => (i > -1));
    });
    const toggle = (index, item, isActive) => {
        if (item?.pages?.length) {
            if (openIndexs.includes(index) && isActive === true) {
                setOpenIndexa(openIndexs.filter(i => i !== index));
            } else {
                setOpenIndexa(openIndexs.concat([index]));
            }
        }
    }
    useEffect(() => {
        const newIndexs = openIndexs.concat(pages.map((item, index) => {
            if (!item?.pages?.length) {
                return -1;
            }
            let open = location.pathname ===  item.pathname || location.pathname.indexOf(item.pathname.replace(/\/app$/, '') + '/') === 0;
            return open ? index : -1;
        }).filter(i => (i > -1)))
        setOpenIndexa(newIndexs);
    }, [location.pathname])
    return <nav className={`level-${level} mg10`} onClick={e => {e.stopPropagation(); e.preventDefault(); return false}}>
        <ul>
            {pages.map((item, index) => {
                const isActive = location.pathname ===  item.pathname || location.pathname.indexOf(item.pathname.replace(/\/app$/, '') + '/') === 0;
                return <li 
                    className={`link-wrap-${level}`}
                    key={item.pathname}
                    onClick={() => toggle(index, item, isActive)}
                >
                    <NavLink
                        to={item.pathname}
                        className="unset-link"
                        activeClassName="c-skin"
                        isActive={() => isActive}
                    >
                        {item.name}
                    </NavLink>
                    {openIndexs.includes(index) &&
                        <Tree pages={item.pages} level={level + 1} />
                    }
                </li>
            })}
        </ul>
    </nav>
}

export default Tree;