export const routes = [{
        path: "/common/app",
        component: import("@docs/common/app.mdx")
    },
    {
        path: "/UI/app",
        component: import("@docs/UI/app.mdx")
    },
    {
        path: "/UI/layout/app",
        component: import("@docs/UI/layout/app.mdx")
    },
    {
        path: "/UI/layout/flexbox",
        component: import("@docs/UI/layout/flexbox.mdx")
    },
    {
        path: "/UI/layout/xxx/app",
        component: import("@docs/UI/layout/xxx/app.mdx")
    },
    {
        path: "/UI/layout/xxx/bbb",
        component: import("@docs/UI/layout/xxx/bbb.mdx")
    },
    {
        path: "/UI/layout/xxx/test",
        component: import("@docs/UI/layout/xxx/test.mdx")
    },
    {
        path: "/UI/reset/app",
        component: import("@docs/UI/reset/app.mdx")
    },
];

export const metadata = [{
    "name": "通用文档",
    "pathname": "/common/app",
    "pages": []
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