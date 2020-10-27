import ReactDom from 'react-dom';
import { MDXProvider } from '@mdx-js/react';
import * as appdata from './.app-data';
import mdxComponents from './mdx-components';
import App from './app';

const Main = appdata.CustomApp || App;
const components = Object.assign(
    {},
    mdxComponents,
    (appdata.CustomMdxComponents || {})
)

window.addEventListener('load', () => {
    ReactDom.render(
        <MDXProvider components={components}>
            <Main routes={appdata.routes} metadata={appdata.metadata} /> 
        </MDXProvider>,
        document.getElementById('root')
    )
})