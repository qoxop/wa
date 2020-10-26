const path = require('path');
const fs = require('fs');

/** 
 *  @class Result
 *  @type {Object}
 *  @property {Array<string>} list 文件列表
 *  @property {Array<string>} dirList 目录列表
 *  @property {object} tree 文件树
 */
class Result { 
    list = ['']
    dirList = ['']
    tree = {}
}

/**
 * 扫描一个目录，返回文件列表，目录列表，和文件树
 * @param {string} absPath 绝对路径
 * @param {object} options 配置项
 * @param {Array<RegExp>} options.dirIgnores 不参与扫描的目录正则
 * @param {Array<RegExp>} options.fileIgnores 不参与扫描的目录正则
 * @returns {Result}
 * 
 */
module.exports = function scanner(absPath, options = {}) {
    const list = [];
    const dirList = [];
    const tree = {};
    const readdir = (dir, _tree) => {
        dirList.push(dir)
        try {
            const files = fs.readdirSync(dir, {encoding: 'utf8'});
            files.forEach(file => {
                const filepath = path.resolve(dir, file);
                const fileStat = fs.statSync(filepath);
                if (fileStat.isDirectory()) {
                    if (
                        options.dirIgnores &&
                        options.dirIgnores.every(ig => !ig.test(filepath)) ||
                        (options.dirIgnores.length === 0)
                    ) {
                        dirList.push(filepath)
                        _tree[file] = {};
                        readdir(filepath, _tree[file])
                    }
                } else if (fileStat.isFile()) {
                    if (
                        options.fileIgnores &&
                        options.fileIgnores.every(ig => !ig.test(filepath)) ||
                        (options.fileIgnores.length === 0)
                    ) {
                        list.push(filepath)
                        _tree[file] = file;
                    }
                } 
            })
        } catch (err) {
            throw (err)
        }
    }
    readdir(absPath, tree);
    return {list, dirList, tree}
}