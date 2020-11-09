import React from 'react';
import { Router } from 'react-router';
import { createHashHistory } from 'history';

const history = createHashHistory();

function MyRouter({children}) {
    return <Router history={history}>
        {children}
    </Router>
}

export default MyRouter;