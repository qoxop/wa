const path = require('path');
const Watcher = require('../modules/fsHelper/watcher');
const args = require('../modules/args');
const fs = require('fs');

args.d = (args.d || './.docs');

const docsPath = path.resolve(path.resolve(process.cwd(), args.d));
const configPath= path.resolve(docsPath, './config.js');
const config = require(configPath);

const scannerDirs = config.docDirs.map(item => path.resolve(docsPath, './', item.path))

const watcher = new Watcher(scannerDirs)

// const doc = {
//     name: '',
//     pathname: '',
//     pages: [
//         {
//             name: '',
//             pathname: '',
//             pages: [{
//                 name: '',
//                 pathname: ''
//             }]
//         }
//     ]
// }

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
                routes.push(`   {
        path: "${pathname}",
        component: import("@docs/${filepath}")
    },`);
            } else { // 同步加载
                const componentName = filepath.replace(/\//g, '_').replace(/\.\w*$/, '');
                headers.push(`import ${componentName} from "@docs/${filepath}";\n`);
                routes.push(`   {
        path: "${pathname}"
        component: ${componentName}
    },`);
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

watcher.onChange((datas) => {
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
    const headerCode = codeData.headers.join('\n');
    const routesCode = `[\n${codeData.routes.join('\n')}\n]`;
    const metadataCode = JSON.stringify(codeData.metaTrees);
    const codeString = `
${headerCode}

export const routes = ${routesCode};

export const metadata = ${metadataCode};
`
    fs.writeFileSync(path.resolve(__dirname, './lll.js'), codeString);
})
