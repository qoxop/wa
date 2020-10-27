const args = process.argv.slice(2);

const getValue = (v) => {
    try {
        return JSON.parse(v)
    } catch(e) {
        return v;
    }
}
let skip = false;
module.exports = args.reduce((pre, cur, curIndex) => {
    if (skip === true) {
        skip = false;
        return pre;
    }
    if (/=/.test(cur)) {
        const arr = cur.split('=');
        pre[arr[0]] = getValue(arr[1]);
        return pre;
    }
    if (/^\-/.test(cur)) {
        const key = cur.replace(/^\-/, '');
        pre[key] = getValue(args[curIndex + 1]);
        skip = true;
        return pre;
    }
    pre[cur] = true;
}, {})
