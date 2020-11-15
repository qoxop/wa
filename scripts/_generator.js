
const fs = require('fs');
const path = require('path');
const Watcher = require('./libs/fsHelper/watcher');
const args = require('./libs/args');

// 默认文档路径
args.d = (args.d || './.docs');

const docsPath = path.resolve(path.resolve(process.cwd(), args.d));
const configPath = path.resolve(docsPath, './config.js');
const config = require(configPath);
const scannerDirs = config.docDirs.map(item => path.resolve(docsPath, './', item.path))

const watcher = new Watcher(scannerDirs);

// 生成代码
const generateCodeStr = (headers, routes, metadata) => (`
import getComponents from '@inner-app/components/helpers';
${headers.join(';\n')}
${config.customApp ? `import CustomApp from "${config.customApp}";` : 'const CustomApp = null;'}
${config.customMdxComponents ? `import CustomMdxComponents from "${config.customMdxComponents}";` : 'const CustomMdxComponents = null;'}

const { Dynamic } = getComponents();

const routes = [
    ${routes.join('\n    ')}
];

const metadata = ${JSON.stringify(metadata)};

export {
    routes,
    metadata,
    CustomApp,
    CustomMdxComponents,
}
`)

function parseTreeToMeta(tree, metaTree, basePath, routes, headers) {
    const keys = Object.keys(tree).filter(k => {
        // 获取其他后缀的文件
        if (typeof tree[k] === 'string' && !/\.(mdx|md|js|ts|jsx|tsx)$/.test(k)) {
            return false;
        }
        // 过滤空文件夹
        if (Object.keys(tree[k]).length < 1) {
            return false;
        }
        return true;
    });
    let info = {};
    if (tree["info.json"]) { // 排序
        info = require(path.resolve(docsPath, './', basePath, './info.json'));
        keys.sort((a, b) => {
            return (info[a] || {sort: 0}).sort - (info[b] || {sort: 0}).sort
        });
    }
    let metaPages = [];
    let metaPathname = null;
    keys.map(treeKey => {
        if (typeof tree[treeKey] === 'string') { // 文件
            const filepath = `${basePath}/${treeKey}`;
            const basename = treeKey.replace(/\.\w*$/, '');
            const pathname = `/${basePath}/${basename}`
            if (config.asyncImport) { // 异步加载
                routes.push(`{path: "${pathname}", component: Dynamic(() => import("@docs/${filepath}"))},`);
            } else { // 同步加载
                const componentName = filepath.replace(/\//g, '_').replace(/\.\w*$/, '');
                headers.push(`import ${componentName} from "@docs/${filepath}";`);
                routes.push(`{path: "${pathname}", component: ${componentName}},`);
            }
            if (/^app\.w*/.test(treeKey)) {
                metaPathname = pathname;
            } else {
                metaPages.push({
                    name: basename,
                    pathname,
                    ...(info[treeKey] || {}),
                })
            }
        } else {
            const subTree = tree[treeKey];
            const subTreeKeys = Object.keys(subTree);
            if (subTreeKeys.length) {
                const subMetaTree = {
                    name: treeKey,
                    ...(info[treeKey] || {}),
                }
                parseTreeToMeta(subTree, subMetaTree, `${basePath}/${treeKey}`, routes, headers);
                metaPages.push(subMetaTree);
            }
        }
    })
    metaTree.pathname = metaPathname || metaPages[0].pathname;
    metaTree.pages = metaPages;
    return metaPages;
}

const once = (cb) => {
    return (...args) => {
        if (cb) {
            cb(...args);
            cb = false;
        }
    }
}
module.exports = function(callback) {
    const cbOnce = once(callback)
    watcher.onChange((datas) => {
        // 解析文件树
        const codeData = datas.map((data, index) => {
            const {tree} = data;
            const headers = [];
            const routes = [];
            const metaTree = {name: config.docDirs[index].name, root: !config.homePage && index === 0};
            parseTreeToMeta(
                tree,
                metaTree,
                config.docDirs[index].path,
                routes,
                headers
            );
            return {metaTree, routes, headers}
        }).reduce((pre, cur) => {
            const {metaTree, routes, headers} = cur;
            pre.metaTrees.push(metaTree);
            pre.routes.push(...routes);
            pre.headers.push(...headers);
            return pre;
        }, {metaTrees: [], routes: [], headers: []});
        // 设置根路由
        if (config.homePage) {
            const homePagePath =  path.resolve(docsPath, config.homePage).replace(docsPath, '');
            codeData.routes.unshift(`{path: "/", component: Dynamic(() => import("@docs/${homePagePath}"))},`)
        }
        // 生成代码
        const codeString =  generateCodeStr(
            codeData.headers,
            codeData.routes,
            codeData.metaTrees
        )
        // 写入代码
        fs.writeFileSync(
            path.resolve(__dirname, '../application/.app-data/index.js'),
            codeString
        );
        cbOnce({
            aliasObj: {
                "@inner-app": path.resolve(__dirname, '../application'),
                "@docs": docsPath,
            }
        })
    })
}
