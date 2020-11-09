
import getComponents from '@inner-app/components/helpers';

const CustomApp = null;
const CustomMdxComponents = null;

const { Dynamic } = getComponents();

const routes = [
    {path: "/", component: Dynamic(() => import("@docs//app.mdx"))},
    {path: "/UI/app", component: Dynamic(() => import("@docs/UI/app.mdx"))},
    {path: "/UI/reset/app", component: Dynamic(() => import("@docs/UI/reset/app.mdx"))},
    {path: "/UI/layout/app", component: Dynamic(() => import("@docs/UI/layout/app.mdx"))},
    {path: "/UI/layout/flexbox", component: Dynamic(() => import("@docs/UI/layout/flexbox.mdx"))},
    {path: "/common/app", component: Dynamic(() => import("@docs/common/app.mdx"))},
    {path: "/common/base/app", component: Dynamic(() => import("@docs/common/base/app.mdx"))},
    {path: "/common/form/app", component: Dynamic(() => import("@docs/common/form/app.mdx"))},
];

const metadata = [{"name":"样式文档","root":false,"pathname":"/UI/app","pages":[{"name":"重置","pathname":"/UI/reset/app","pages":[]},{"name":"布局","pathname":"/UI/layout/app","pages":[{"name":"flexbox","pathname":"/UI/layout/flexbox"}]}]},{"name":"通用文档","root":false,"pathname":"/common/app","pages":[{"name":"base","pathname":"/common/base/app","pages":[]},{"name":"form","pathname":"/common/form/app","pages":[]}]}];

export {
    routes,
    metadata,
    CustomApp,
    CustomMdxComponents,
}
