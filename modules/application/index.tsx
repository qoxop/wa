import "./before";
import ReactDom from 'react-dom';
import { MDXProvider } from '@mdx-js/react';
import * as meta from './.metadata';
import mdxComponents from './mdx-components';
import { AppFcProps } from './types'

function App(props: AppFcProps): JSX.Element {
    return <div>

    </div>
}

window.addEventListener('load', () => {
    ReactDom.render(
        <MDXProvider components={mdxComponents}>
            <App routes={meta.routes} metadata={meta.metadata} /> 
        </MDXProvider>,
        document.getElementById('root')
    )
})
