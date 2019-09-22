import { message } from 'antd';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

/**
 * 判断为空
 */
export const isEmpty = (value: any) =>
  value === null ||
  value === undefined ||
  value === '' ||
  value === {} ||
  value === [] ||
  value.length === 0;

/**
 * 判断不为空
 */
export const isNotEmpty = (value: any) => !isEmpty(value);

const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

/**
 * 嵌套JSON数组转平级
 */
export const setJsonArray = (data: any[]) => {
  let result: any[] = [];
  data.forEach(json => {
    if (json) {
      if (isNotEmpty(json.subMenu)) {
        result = result.concat(setJsonArray(json.subMenu));
      }
      result.push(json);
    }
  });
  return result;
};

const findRootParentIds = (data: any[], levelParam: string) => {
  const rootParentIds: string[] = [];
  let minLevel: number = -1;
  let isFirst = true;
  for (const item of data) {
    const levelData = parseInt(item[levelParam]);
    if (isNaN(levelData)) {
    } else if (isFirst) {
      minLevel = levelData;
      isFirst = false;
    } else if (minLevel > levelData) {
      minLevel = levelData;
    }
  }
  if (isNotEmpty(minLevel)) {
    const dataByMinLevel = data.filter(item => item[levelParam] && parseInt(item[levelParam]) === minLevel);
    for (const dataItem of dataByMinLevel) {
      const {parentId} = dataItem;
      if (parentId && !rootParentIds.includes(parentId)) {
        rootParentIds.push(parentId);
      }
    }
  }
  return rootParentIds;
};

/**
 * 通用将平级JSON数组转嵌套
 * @param {*} data
 * @param {*} parentId
 * @param {*} subParam
 * @param {*} dataId
 */
export const setCommonJsonArrayNest = (
  data: any[],
  parentId: string = '0',
  subParam: string = 'subMenu',
  dataId: string = 'menuId',
): any[] => {
  const result: any[] = [];
  let temp;
  if (data) {
    data.forEach(json => {
      if (json.parentId === parentId) {
        temp = setCommonJsonArrayNest(data, json[dataId], subParam, dataId);
        if (isNotEmpty(temp)) {
          json[subParam] = temp;
        }
        result.push(json);
      }
    });
  }
  return result;
};

export const convertListToTreeJson = (
  data: any[],
  parentId: string = '0',
  subParam: string = 'subMenu',
  dataId: string = 'menuId',
  levelParam: string = 'menuLevel',
) => {
  const result = [];
  if (data) {
    const rootParentIds = findRootParentIds(data, levelParam);
    if (rootParentIds.length > 0) {
      for (const rootParentId of rootParentIds) {
        const tempResultArray = setCommonJsonArrayNest(data, rootParentId, subParam, dataId);
        for (const tempResult of tempResultArray) {
          result.push(tempResult);
        }
      }
    }
  }
  return result;
};

/**
 * 获取会话存储
 */
export const getSession = (key: string) => sessionStorage.getItem(key);

/**
 * 设置会话存储
 */
export const setSession = (key: string, value: string, check = false) => {
  if (check) {
    // 判断是否重复存在
    if (isEmpty(getSession(key))) {
      sessionStorage.setItem(key, value);
    }
  } else {
    sessionStorage.setItem(key, value);
  }
};

/**
 * 删除会话存储
 * @param key
 */
export const removeSession = (key: string) => sessionStorage.removeItem(key);

/**
 * 设置网站的Title
 * @param {*} title
 */
export const setDocumentTitle = (title: string) => {
  document.title = title;
};

/**
 * 设置页面的Title
 * @param sysName
 * @param sysVersion
 */
export const setAppTitle = (sysName: string, sysVersion: string) => {
  let title;
  const whitespace = ' ';
  if (sysName.includes('V') || sysName.includes('v')) {
    title = sysName;
  } else if (sysVersion.includes('V') || sysVersion.includes('v')) {
    title = `${sysName}${whitespace}${sysVersion}`;
  } else {
    title = `${sysName}${whitespace}v${sysVersion}`;
  }
  setDocumentTitle(title);
};

/**
 * 加载外部js资源
 */
export function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    if (document.head) {
      document.head.appendChild(script);
    }
  });
}

/**
 * 设置页面的主题
 * @param obj
 * @param func
 * @param set
 */
let lessLoaded = false;
export const setThemes = (obj: object, func: Function, set: boolean = true) => {
  const changeColor = () => {
    window.less.modifyVars(obj).then((e: any) => {
      if (set) {
        message.destroy(); // 过快弹出多个
        message.success('预览主题成功.');
      }
      if (func) func(e);
    });
  };

  const lessUrl = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js';

  if (lessLoaded) {
    changeColor();
  } else {
    window.less = {
      async: true,
      javascriptEnabled: true,
    };
    loadScript(lessUrl).then(() => {
      lessLoaded = true;
      changeColor();
    });
  }
};

/**
 * 解析页面的主题
 * @param str
 * @return {any}
 */
export const parseThemes = (str: string) => {
  let obj = {};
  if (isNotEmpty(str)) {
    try {
      obj = JSON.parse(
        str
          .replace('@header', '@head-back_color')
          .replace('@sider', '@sider-back_color')
          .replace('@font', '@sider-select_color')
          .replace('@button', '@select-color')
          .replace('@table', '@table_header_color'),
      );
    } catch (e) {
    }
  }
  return obj;
};

export const getNodeHandle = (): (json: any[], nodeId: string) => object => {
  let parentNode: any[] = [];
  let node: any = null;
  const getNode = (json: any[], nodeId: string): object => {
    // 1.第一层 root 深度遍历整个JSON
    for (let i = 0; i < json.length; i++) {
      if (node) {
        break;
      }
      const obj = json[i];
      // 没有就下一个
      if (!obj || !obj.menuId) {
        continue;
      }
      // 2.有节点就开始找，一直递归下去
      if (obj.menuId === nodeId) {
        // 找到了与nodeId匹配的节点，结束递归
        node = obj;
        break;
      } else {
        // 3.如果有子节点就开始找
        if (obj.subMenu) {
          // 4.递归前，记录当前节点，作为parent 父亲
          parentNode.push(obj);
          // 递归往下找
          getNode(obj.subMenu, nodeId);
        }
        // else {
        //   // 跳出当前递归，返回上层递归
        //   continue;
        // }
      }
    }
    // 5.如果木有找到父节点，置为null，因为没有父亲
    if (!node) {
      parentNode = [];
    }
    let path = '';
    parentNode.map(item => {
      path += `${item.menuName}/`;
    });
    if (node) {
      path += `${node.menuName}`;
    }
    // 6.返回结果obj
    return {
      ...node,
      path,
    };
  };
  return getNode;
};

export const getLocalstorage = (key: string) => {
  const str = localStorage.getItem(key);
  try {
    if (str) {
      return JSON.parse(str);
    }
  } catch (e) {
    console.error(e);
  }
  return {};
};

export const setLocalstorag = (key: string, content: object) => {
  localStorage.setItem(key, JSON.stringify(content));
};

export { isAntDesignPro, isUrl };
