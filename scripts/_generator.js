
const fs = require('fs');
const path = require('path');
const Watcher = require('./libs/fsHelper/watcher');
const args = require('./libs/args');

// 默认文档路径
args.d = (args.d || './.docs');

const docsPath = path.resolve(path.resolve(process.cwd(), args.d));
const configPath= path.resolve(docsPath, './config.js');
const config = require(configPath);
const scannerDirs = config.docDirs.map(item => path.resolve(docsPath, './', item.path))
const watcher = new Watcher(scannerDirs);

// 生成代码
const generateCodeStr = (headers, routes, metadata) => (`
import getComponents from '@inner-app/components/helpers';
${headers.join(';\n')}
${config.customApp ? `import CustomApp from "${config.customApp}";` : ''}
${config.customMdxComponents ? `import CustomMdxComponents from "${config.customMdxComponents}";` : ''}

const { Dynamic } = getComponents();

const routes = [
    ${routes.join('\n    ')}
];

const metadata = ${JSON.stringify(metadata)};

export {
    routes,
    metadata,
    ${config.customApp ? 'CustomApp,' : ''}
    ${config.customMdxComponents ? 'CustomMdxComponents,' : ''}
}
`)

function parseTreeToMeta(tree, metaTree, basePath, routes, headers) {
    const keys = Object.keys(tree).sort();
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
                })
            }
        } else {
            const subTree = tree[treeKey];
            const subTreeKeys = Object.keys(subTree);
            if (subTreeKeys.length) {
                const subMetaTree = {name: treeKey}
                parseTreeToMeta(subTree, subMetaTree, `${basePath}/${treeKey}`, routes, headers);
                metaPages.push(subMetaTree);
            }
        }
    })
    metaTree.pathname = metaPathname;
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
            const metaTree = {name: config.docDirs[index].name};
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
    
        // 生成代码
        const codeString =  generateCodeStr(
            codeData.headers,
            codeData.routes,
            codeData.metaTrees
        )
        // 写入代码
        fs.writeFileSync(
            path.resolve(__dirname, './application/.app-data/index.js'),
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
