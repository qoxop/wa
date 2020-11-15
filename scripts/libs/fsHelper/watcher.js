const os = require('os');
const fs = require('fs');
const path = require('path');
const scanner = require('./scanner');

const isWinOrMac = os.platform() === 'darwin' || os.platform() === 'win32';

const deleteItem = (arr = [], item) => {
    const index = arr.indexOf(item);
    if (index > -1) {
        return arr.splice(index, 1);
    }
    return item;
}
const deleteMatched = (arr = [], str) => {
    return arr.filter(item => item.indexOf(str) !== 0)
}

const filterObj = (obj, arr = [], cb) => {
    Object.keys(obj).forEach(k => {
        if (!arr.includes(k)) {
            cb(obj[k])
            delete obj[k];
        }
    })
}
const filterTree = (tree, str = "") => {
    if (/^\//.test(str)) {
        str.replace(/^\//, '');
    }
    const ps = str.split('/');
    const lastKey = ps[ps.length - 1];
    let parent = tree;
    ps.forEach((item, i) => {
        if (i > 0 && i < ps.length - 1) {
            if (parent[item]) {
                parent = parent[item];
            }
        }
    })
    if (parent[lastKey]) {
        delete parent[lastKey];
    }
}
const appendTree = (tree, subTree, str) => {
    if (/^\//.test(str)) {
        str.replace(/^\//, '');
    }
    const ps = str.split('/');
    const lastKey = ps[ps.length - 1];
    let parent = tree;
    ps.forEach((item, i) => {
        if (i > 0 && i < ps.length - 1) {
            if (parent[item]) {
                parent = parent[item];
            }
        }
    })
    parent[lastKey] = subTree;

}

class Watcher {
    options = {
        dirIgnores: [],
        fileIgnores: [],
        throttle: 500,
        scanTimeSpan: 5000,
    }
    datas = [];
    dirPaths = [];
    subscribers = [];
    watchers = {};
    /**
     * 构造函数
     * @param {Array<string>} dirPaths 
     * @param {object} options
     * @param {Array<RegExp>} options.dirIgnores
     * @param {Array<RegExp>} options.fileIgnores
     * @param {number} options.throttle
     */
    constructor(dirPaths, options) {
        this.options = Object.assign({}, this.options, options);
        this.dirPaths = dirPaths;
        if (dirPaths.length) {
            this.datas = dirPaths.map(item => scanner(item, this.options));
            dirPaths.forEach((item, index) => {
                if (isWinOrMac) {
                    this.watchers[item] = fs.watch(item, {recursive: true}, (eventType, filename) => {
                        this._handleChange(eventType, filename, item, index)
                    })
                } else {
                    try {
                        (this.datas[index].dirList || []).forEach(p => {
                            this.watchers[p] = fs.watch(p, { recursive: false}, (eventType, filename) => {
                                this._handleChange(eventType, filename, p, index)
                            })
                        })
                    } catch (error) {
                        console.warn(error)
                    }
                }
            })
        }
    }
    _runSubscriber = (() => {
        const hashToId = new Map();
        const run = (file, type, index) => {
            this.subscribers.forEach(subscriber => {
                subscriber(this.datas, {file, type, dirIndex: index})
            })
        }
        return (file, type, index, delay = 0) => {
            switch(type) {
                case 'delete-file':
                    deleteItem(this.datas[index].list, file);
                    filterTree(this.datas[index].tree, file.replace(this.dirPaths[index], ''));
                    break;
                case 'create-file':
                    this.datas[index].list.push(file);
                    appendTree(this.datas[index].tree, path.basename(file), file.replace(this.dirPaths[index], ''))
                    break;
                case 'delete-dir':
                    // 删除文件
                    this.datas[index].list = deleteMatched(this.datas[index].list, file);
                    // 删除文件夹
                    this.datas[index].dirList = deleteMatched(this.datas[index].dirList, file);
                    filterObj(this.watchers, this.datas[index].dirList, w => w.close());
                    // 删除文件树
                    filterTree(this.datas[index].tree, file.replace(this.dirPaths[index], ''));
                    break;
                case 'create-dir':
                    const {list, dirList, tree} = scanner(file, this.options);
                    this.datas[index].list.push(...list);
                    this.datas[index].dirList.push(...dirList);
                    appendTree(this.datas[index].tree, tree, file.replace(this.dirPaths[index], ''))
                    if (!isWinOrMac) {
                        dirList.forEach(p => {
                            this.watchers[p] = fs.watch(p, { recursive: false}, (eventType, filename) => {
                                this._handleChange(eventType, filename, p, index)
                            })
                        })
                    }
                    break;
                default:
                    break;
            }
            if (delay) {
                const hash = `${type}--${file}`;
                let id = hashToId.get(hash);
                if (id) {
                    clearTimeout(id);
                }
                id = setTimeout(() => {
                    run(file, type, index);
                    hashToId.delete(hash);
                }, delay);
                hashToId.set(hash, id);
            } else {
                run(file, type, index);
            }
        }
    })()
    _handleChange(eventType, filename, baseDir, index) {
        const data = this.datas[index];
        // rename' 或 'change'
        const fileKey = path.resolve(baseDir, filename);
        if (eventType === 'change') {
            this._runSubscriber(fileKey, eventType, index, this.options.throttle);
        } else if (eventType === 'rename') {
            if ((data.dirList || []).includes(fileKey)) { // dir delete
                this._runSubscriber(fileKey, 'delete-dir', index)
            } else if ((data.list || []).includes(fileKey)) { // file delete
                this._runSubscriber(fileKey, 'delete-file', index)
            } else {
                try {
                    const fStat = fs.statSync(fileKey);
                    if (fStat.isDirectory()) { // create dir
                        this._runSubscriber(fileKey, 'create-dir', index);
                    } else if (fStat.isFile()) { // create file
                        this._runSubscriber(fileKey, 'create-file', index);
                    }
                } catch (error) {
                    
                }
                
            }
        }
    }
    _onSubDirChange(dirPath, action, index) {
        if (!isWinOrMac) {
            if (action === 'create') {
                // {list, dirList, tree}
                this.datas[index].dirList.push(dirPath);
                this.datas[index].list.push()
                this.watchers[dirPath] = fs.watch(dirPath, { recursive: false}, (eventType, filename) => {
                    this._handleChange(eventType, filename, dirPath, index)
                })
            }
            if (action === 'delete') {
                if (this.watchers[dirPath]) {
                    try {
                        this.watchers[dirPath].close();
                        delete this.watchers[dirPath];
                    } catch (error) {
                        delete this.watchers[dirPath];
                    }
                }
                
            }
            
        }
    }
    onChange(subscriber) {
        this.subscribers.push(subscriber);
        subscriber(this.datas, {});
        return this;
    }
    close() {
        Object.keys(this.watchers).forEach(wk => {
            try {
                this.watchers[wk].close();
                delete this.watchers[wk];
            } catch (error) {
                delete this.watchers[wk];
            }
        })
    }
}

module.exports = Watcher;