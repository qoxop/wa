import getComponents from '@rmdxbook/runtimes/components';


const {
    Dynamic
} = getComponents();

export const routes = [{
        path: "/common/app",
        component: Dynamic(() => import("@docs/common/app.mdx"))
    },
    {
        path: "/common/base/app",
        component: Dynamic(() => import("@docs/common/base/app.mdx"))
    },
    {
        path: "/common/form/app",
        component: Dynamic(() => import("@docs/common/form/app.mdx"))
    },
    {
        path: "/UI/app",
        component: Dynamic(() => import("@docs/UI/app.mdx"))
    },
    {
        path: "/UI/layout/app",
        component: Dynamic(() => import("@docs/UI/layout/app.mdx"))
    },
    {
        path: "/UI/layout/flexbox",
        component: Dynamic(() => import("@docs/UI/layout/flexbox.mdx"))
    },
    {
        path: "/UI/layout/xxx/app",
        component: Dynamic(() => import("@docs/UI/layout/xxx/app.mdx"))
    },
    {
        path: "/UI/layout/xxx/bbb",
        component: Dynamic(() => import("@docs/UI/layout/xxx/bbb.mdx"))
    },
    {
        path: "/UI/layout/xxx/test",
        component: Dynamic(() => import("@docs/UI/layout/xxx/test.mdx"))
    },
    {
        path: "/UI/reset/app",
        component: Dynamic(() => import("@docs/UI/reset/app.mdx"))
    },
];

export const metadata = [{
    "name": "通用文档",
    "pathname": "/common/app",
    "pages": [{
        "name": "base",
        "pathname": "/common/base/app",
        "pages": []
    }, {
        "name": "form",
        "pathname": "/common/form/app",
        "pages": []
    }]
}, {
    "name": "样式文档",
    "pathname": "/UI/app",
    "pages": [{
        "name": "layout",
        "pathname": "/UI/layout/app",
        "pages": [{
            "name": "flexbox",
            "pathname": "/UI/layout/flexbox"
        }, {
            "name": "xxx",
            "pathname": "/UI/layout/xxx/app",
            "pages": [{
                "name": "bbb",
                "pathname": "/UI/layout/xxx/bbb"
            }, {
                "name": "test",
                "pathname": "/UI/layout/xxx/test"
            }]
        }]
    }, {
        "name": "reset",
        "pathname": "/UI/reset/app",
        "pages": []
    }]
}];