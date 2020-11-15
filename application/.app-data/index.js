
import getComponents from '@inner-app/components/helpers';

const CustomApp = null;
const CustomMdxComponents = null;

const { Dynamic } = getComponents();

const routes = [
    {path: "/", component: Dynamic(() => import("@docs//app.mdx"))},
    {path: "/UI/app", component: Dynamic(() => import("@docs/UI/app.mdx"))},
    {path: "/UI/reset/app", component: Dynamic(() => import("@docs/UI/reset/app.mdx"))},
    {path: "/UI/reset/root", component: Dynamic(() => import("@docs/UI/reset/root.mdx"))},
    {path: "/UI/reset/xxxx", component: Dynamic(() => import("@docs/UI/reset/xxxx.mdx"))},
    {path: "/UI/layout/app", component: Dynamic(() => import("@docs/UI/layout/app.mdx"))},
    {path: "/UI/layout/flexbox", component: Dynamic(() => import("@docs/UI/layout/flexbox.mdx"))},
    {path: "/common/app", component: Dynamic(() => import("@docs/common/app.mdx"))},
    {path: "/common/base/app", component: Dynamic(() => import("@docs/common/base/app.mdx"))},
    {path: "/common/base/xxx/absx/app", component: Dynamic(() => import("@docs/common/base/xxx/absx/app.mdx"))},
    {path: "/common/base/xxx/app", component: Dynamic(() => import("@docs/common/base/xxx/app.mdx"))},
    {path: "/common/base/zzz", component: Dynamic(() => import("@docs/common/base/zzz.mdx"))},
    {path: "/common/form/app", component: Dynamic(() => import("@docs/common/form/app.mdx"))},
];

const metadata = [{"name":"CSS 重构","root":false,"pathname":"/UI/app","pages":[{"name":"重置","sort":1,"pathname":"/UI/reset/app","pages":[{"name":"root","pathname":"/UI/reset/root"},{"name":"xxxx","pathname":"/UI/reset/xxxx"}]},{"name":"布局","sort":2,"open":true,"pathname":"/UI/layout/app","pages":[{"name":"flexbox","pathname":"/UI/layout/flexbox"}]}]},{"name":"组件开发","root":false,"pathname":"/common/app","pages":[{"name":"base","pathname":"/common/base/app","pages":[{"name":"xxx","pathname":"/common/base/xxx/app","pages":[{"name":"absx","pathname":"/common/base/xxx/absx/app","pages":[]}]},{"name":"zzz","pathname":"/common/base/zzz"}]},{"name":"form","pathname":"/common/form/app","pages":[]}]}];

export {
    routes,
    metadata,
    CustomApp,
    CustomMdxComponents,
}
