// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tampermonkey.net/faq.php?ext=dhdg#Q103
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

'use strict';
import Mark from 'mark.js'
// @ts-ignore
import * as MD5 from 'md5.js';

const getMd5 = (str: string) => new MD5().update(str).digest('hex');

/**
 * 持久化存储对象
 */
type StorageItem<T> = {
  get():T|null;
  set(t:T):void;
  merge(t: Partial<T>):void;
}
type MarkItem = {
    text: string;
    className: string;
}
/**
 * 创建一个 localStorage 的存取对象，
 * @param key 对应 localStorage 的 key 值，数据结构变更时需要修改 key 值
 * @param defVal 默认值
 */
const createStorageItem = <T>(storage: Storage, key: string, defVal: T):StorageItem<T> => {
    const atom = {
      get() {
        try {
          const str = storage.getItem(key);
          if (!str) return defVal;
          return JSON.parse(str).v;
        } catch (error) {
          return defVal;
        }
      },
      set(v: T|null) {
        if (v === null) {
          return storage.removeItem(key);
        }
        storage.setItem(key, JSON.stringify({ v }));
      },
      merge(v: Partial<T>) {
        atom.set(Object.assign({}, atom.get(), v));
      },
    };
    return atom;
};

function onReady(callback: Function) {
    let exected = false;
    const run = () => {
        if (!exected) {
            exected = true;
            callback();
        }
    }
    setTimeout(run, 3000);
    window.addEventListener('DOMContentLoaded', run);
}

onReady(async () => {
    const marker = new Mark(document.body);
    const id = getMd5(location.href);
    // 初始化渲染
    const markStoreItem = createStorageItem<MarkItem[]>(localStorage, `_monkey_mark_${id}`, []);
    const markItems = markStoreItem.get() || [];
    const classnameToTexts = markItems.reduce((prev, cur) => {
        if (!prev[cur.className]) prev[cur.className] = [];
        prev[cur.className].push(cur.text);
        return prev;
    }, {} as Record<string, string[]>);
    Object.keys(classnameToTexts).forEach((className) => {
        marker.mark(classnameToTexts[className], { className });
    });
    // 监听文本选择
    window.addEventListener('mouseup', event => {
        const curSelection = window.getSelection();
        const selectedText = curSelection?.toString();
        const hadSameText = markItems.some(item => item.text === selectedText);
        if (!hadSameText) {
            
        }
    });
    
})

