const path = require('path')
const fs = require('fs')
const osPlatform = require('os').platform()
const Event = require('events');

class Emitter extends Event {}

let emitter = new Emitter();

const isWinOrMac = osPlatform === 'darwin' || osPlatform === 'win32';

const getIsFileAndName = (file, dir) => {
    let isFile, filename = '';
    if (typeof file === 'string') { // 兼容低版本node
        isFile = fs.statSync(path.join(dir, file)).isFile()
        filename = file
    } else {
        isFile = file.isFile()
        filename = file.name
    }
    return {isFile, filename}
}

const scanner = function (scanPath) {
    const fileList = [];
    const dirMap = {}
    const readdir = (dir) => {
        dirMap[dir] = 1;
        try {
            const files = fs.readdirSync(dir, {encoding: 'utf8', withFileTypes: true });
            files.forEach(file => {
                const {isFile, filename} = getIsFileAndName(file, dir);
                if (!isFile) {
                    readdir(path.join(dir, filename))
                } else {
                    fileList.push(path.join(dir, filename))
                }
            })
        } catch (err) {
            throw (err)
        }
    }
    readdir(scanPath);
    return {fileList, dirMap}
}

const watcher = function (scanPath) {
    let {fileList, dirMap} = scanner(scanPath)

    let lastFilename, lastEventType, cancel = '';
    const watchHandler = (dir, filename, eventType) => {
        if (lastFilename === filename && lastEventType === eventType) {
            clearTimeout(cancel)
        } else {
            lastEventType = eventType;
            lastFilename = filename;
        }
        cancel = setTimeout(() => {
            const absPath = path.join(dir, filename);
            const fIndex = fileList.indexOf(absPath);
            if (eventType === 'rename') {
                if (!!dirMap[absPath] || fIndex > -1) { // delete
                    if (fIndex > -1) {
                        fileList.splice(fIndex, 1);
                        emitter.emit('change', {fileList, type: 'delFile', file: absPath});
                    } else {
                        dirMap[absPath].close && dirMap[absPath].close()
                        delete dirMap[absPath]
                        fileList = fileList.filter(file => (file.indexOf(absPath) !== 0))
                        emitter.emit('change', {fileList, type: 'delDir', file: absPath});
                    }

                } else { // add
                    try {
                        if (fs.statSync(absPath).isFile()) {
                            fileList.push(absPath)
                            emitter.emit('change', { fileList, type: 'addFile', file: absPath });
                        } else {
                            if (isWinOrMac) {
                                dirMap[absPath] = 1;
                            } else {
                                dirMap[absPath] = fs.watch(absPath, { recursive: false}, (eventType, filename) => {
                                    watchHandler(absPath, filename, eventType)
                                })
                            }
                            emitter.emit('change', { fileList, type: 'addDir', file: absPath });
                        }
                    } catch(err) {
                        throw(err)
                    }
                }
            } else {
                emitter.emit('change', {fileList,type: 'change', file: absPath});
            }
        }, 50);
    }
    if (isWinOrMac) {
        dirMap[scanPath] = fs.watch(scanPath, {recursive: true}, (eventType, filename) => {
            watchHandler(scanPath, filename, eventType)
        })
    } else {
        for(const dir in dirMap) {
            dirMap[dir] = fs.watch(dir, { recursive: false}, (eventType, filename) => {
                watchHandler(dir, filename, eventType)
            })
        }
    }
    return {
        onFinish: (cb) => cb(fileList),
        onChange: (cb) => emitter.on('change', cb),
        close: function () {
            emitter.removeAllListeners('change');
            emitter = null;
            for (const dir in dirMap) {
                if (typeof dir.close === 'function') {
                    dir.close()
                }
            }
        },

    }
}
const clearDir = (dir) => {
    try {
        const DFs = fs.readdirSync(dir, {encoding: 'utf8', withFileTypes: true });
        DFs.forEach(DF => {
            const {isFile, filename} = getIsFileAndName(DF,dir)
            if (isFile) {
                fs.unlinkSync(path.join(dir, filename))
            } else {
                fs.rmdirSync(path.join(dir, filename))
            }
        })
    } catch (e) {
        throw e;
    }

}

module.exports = {
    scanner,
    watcher,
    clearDir
};