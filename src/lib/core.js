const keyMap = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  13: 'ok'
};

const defaultFunc = {
  active() {},
  unactive() {},
  onBeforeLeave() {}
};

const findWidgets = (element, cb) => {
  let parent = element.parentNode;
  if (!parent) return;
  if (parent.dataset && parent.dataset.focusScrollId) {
    if (cb) cb(parent.dataset.focusScrollId);
  }
  findWidgets(parent, cb);
};

const focusManageLib = {
  cur: {
    ...defaultFunc
  },
  last: {
    ...defaultFunc
  },
  cubs: {},
  foIndexs: {},
  zIndex: 1,
  widgets: {}
};

const zIndexChange = (type) => {
  let nowIndex = focusManageLib.zIndex;
  if (type === 'up') {
    focusManageLib.zIndex = nowIndex + 1;
  } else if (type === 'down') {
    if (nowIndex === 1) return;
    focusManageLib.zIndex = nowIndex - 1;
  } else if (type && typeof type === 'number') {
    focusManageLib.zIndex = type;
  } else {
    focusManageLib.zIndex = 1;
  }
};

const getBoundingClientRect = (el) => {
  // TODO: 原生js 实现的getBoundingClientRect 没有解决滚动条的问题
  if (!el) {
    return {};
  }
  if (el.getBoundingClientRect) {
    return el.getBoundingClientRect();
  }
  let result = {
    left: 0,
    top: 0
  };
  let get = (element) => {
    result.top = element.offsetTop + result.top + element.scrollTop;
    result.left = element.offsetLeft + result.left + element.scrollLeft;
    if (!element.offsetParent) {
      return;
    }
    get(element.offsetParent);
  };
  get(el);
  result.width = el.offsetWidth;
  result.height = el.offsetHeight;
  result.right = result.width + result.left;
  result.bottom = result.height + result.top;
  return result;
};

const getWidgetRect = (el, offset = {top: 0, left: 0}) => {
  let rect;
  let elRect = getBoundingClientRect(el);
  let top = (elRect.top || 0) + offset.top;
  let bottom = (elRect.bottom || 0) + offset.top;
  let right = (elRect.right || 0) + offset.left;
  let left = (elRect.left || 0) + offset.left;
  rect = {
    top,
    bottom,
    right,
    left,
    width: elRect.width || 0,
    height: elRect.height || 0,
    centerX: (elRect.width / 2 + left) || 0,
    centerY: (elRect.height / 2 + top) || 0
  };
  return rect;
};

const refreshLocInfo = (els) => {
  els.forEach((el) => {
    let id = el.getAttribute('data-focus-id');
    let zIndex = el.getAttribute('data-focus-index');
    focusManageLib.cubs[zIndex][id].rect = getWidgetRect(el);
  });
};

// 创建Focus组件的id
const careteId = () => Math.random() * 100000000000000000 + new Date().getTime();

// 方向转换
// 0;0;0;0 => {top: 0, right: 0, down: 0, left: 0}
const changeGoto = (foGoto) => {
  let result = {};
  if (foGoto) {
    let gotos = foGoto.split(';');
    let indexMap = {
      0: 'up',
      1: 'right',
      2: 'down',
      3: 'left'
    };
    gotos.forEach((goto, index) => {
      let dir = indexMap[index];
      result[dir] = goto;
    });
  }
  return result;
};

const queryWidgetByShadowAlgorithm = (curWidget, widgetsRect, dir) => {
  let resultWidget = null;
  if (curWidget.goto && curWidget.goto[dir] && focusManageLib.foIndexs[curWidget.goto[dir]]) {
    // 指定方向的情况
    resultWidget = focusManageLib.foIndexs[curWidget.goto[dir]];
  } else {
    let currentRect = curWidget.rect;
    let dis = Infinity;
    for (let i in widgetsRect) {
      let tempInfo = widgetsRect[i];
      let tempWidget = tempInfo.element;
      if (tempWidget === curWidget.element) {
        continue;
      }
      // disabled 属性
      if (tempWidget.disabled) {
        continue;
      }
      let tempWidgetRect = tempInfo.rect;
      if (dir === 'left' && tempWidgetRect.right < currentRect.right && tempWidgetRect.left < currentRect.left && tempWidgetRect.top < currentRect.bottom && tempWidgetRect.bottom > currentRect.top && currentRect.right - tempWidgetRect.right < dis) {
        resultWidget = tempInfo;
        dis = currentRect.right - tempWidgetRect.right;
      } else if (dir === 'right' && tempWidgetRect.left > currentRect.left && tempWidgetRect.right > currentRect.right && tempWidgetRect.top < currentRect.bottom && tempWidgetRect.bottom > currentRect.top && tempWidgetRect.left - currentRect.left < dis) {
        resultWidget = tempInfo;
        dis = tempWidgetRect.left - currentRect.left;
      } else if (dir === 'up' && tempWidgetRect.bottom < currentRect.bottom && tempWidgetRect.top < currentRect.top && tempWidgetRect.left < currentRect.right && tempWidgetRect.right > currentRect.left && currentRect.bottom - tempWidgetRect.bottom < dis) {
        resultWidget = tempInfo;
        dis = currentRect.bottom - tempWidgetRect.bottom;
      } else if (dir === 'down' && tempWidgetRect.top > currentRect.top && tempWidgetRect.bottom > currentRect.bottom && tempWidgetRect.left < currentRect.right && tempWidgetRect.right > currentRect.left && tempWidgetRect.top - currentRect.top < dis) {
        resultWidget = tempInfo;
        dis = tempWidgetRect.top - currentRect.top;
      }
    }
  }
  return resultWidget;
};

const queryWidgetByAreaAlgorithm = (curWidget, widgetsRect, dir) => {
  let currentRect = curWidget.rect;
  let resultWidget = null;
  let dis = Infinity;
  for (let i in widgetsRect) {
    let tempInfo = widgetsRect[i];
    let tempWidget = tempInfo.element;
    if (tempWidget === curWidget.element) {
      continue;
    }
    if (tempWidget.disabled) {
      continue;
    }
    let tempWidgetRect = tempInfo.rect;
    if (dir === 'left' && tempWidgetRect.right <= currentRect.left) {
      let tempDis = Infinity;
      if (tempWidgetRect.bottom < currentRect.top) {
        tempDis = Math.sqrt(Math.pow(currentRect.left - tempWidgetRect.right, 2) + Math.pow(currentRect.top - tempWidgetRect.bottom, 2));
      } else if (tempWidgetRect.top > currentRect.bottom) {
        tempDis = Math.sqrt(Math.pow(currentRect.left - tempWidgetRect.right, 2) + Math.pow(tempWidgetRect.top - currentRect.bottom, 2));
      } else {
        tempDis = currentRect.left - tempWidgetRect.right;
      }
      if (tempDis < dis) {
        resultWidget = tempInfo;
        dis = tempDis;
      }
    } else if (dir === 'right' && tempWidgetRect.left >= currentRect.right) {
      let tempDis = Infinity;
      if (tempWidgetRect.bottom < currentRect.top) {
        tempDis = Math.sqrt(Math.pow(tempWidgetRect.left - currentRect.right, 2) + Math.pow(currentRect.top - tempWidgetRect.bottom, 2));
      } else if (tempWidgetRect.top > currentRect.bottom) {
        tempDis = Math.sqrt(Math.pow(tempWidgetRect.left - currentRect.right, 2) + Math.pow(tempWidgetRect.top - currentRect.bottom, 2));
      } else {
        tempDis = tempWidgetRect.left - currentRect.right;
      }
      if (tempDis < dis) {
        resultWidget = tempInfo;
        dis = tempDis;
      }
    } else if (dir === 'up' && tempWidgetRect.bottom <= currentRect.top) {
      let tempDis = Infinity;
      if (tempWidgetRect.right < currentRect.left) {
        tempDis = Math.sqrt(Math.pow(currentRect.top - tempWidgetRect.bottom, 2) + Math.pow(currentRect.left - tempWidgetRect.right, 2));
      } else if (tempWidgetRect.left > currentRect.right) {
        tempDis = Math.sqrt(Math.pow(currentRect.top - tempWidgetRect.bottom, 2) + Math.pow(tempWidgetRect.left - currentRect.right, 2));
      } else {
        tempDis = currentRect.top - tempWidgetRect.bottom;
      }
      if (tempDis < dis) {
        resultWidget = tempInfo;
        dis = tempDis;
      }
    } else if (dir === 'down' && tempWidgetRect.top >= currentRect.bottom) {
      let tempDis = Infinity;
      if (tempWidgetRect.right < currentRect.left) {
        tempDis = Math.sqrt(Math.pow(tempWidgetRect.top - currentRect.bottom, 2) + Math.pow(currentRect.left - tempWidgetRect.right, 2));
      } else if (tempWidgetRect.left > currentRect.right) {
        tempDis = Math.sqrt(Math.pow(tempWidgetRect.top - currentRect.bottom, 2) + Math.pow(tempWidgetRect.left - currentRect.right, 2));
      } else {
        tempDis = tempWidgetRect.top - currentRect.bottom;
      }
      if (tempDis < dis) {
        resultWidget = tempInfo;
        dis = tempDis;
      }
    }
  }
  return resultWidget;
};

const doSwitch = (curWidget, widgetsRect, dirName) => {
  if (!curWidget.rect) curWidget.rect = getWidgetRect();
  let newFocusChildWidget = null;
  newFocusChildWidget = queryWidgetByShadowAlgorithm(curWidget, widgetsRect, dirName);
  if (!newFocusChildWidget) {
    newFocusChildWidget = queryWidgetByAreaAlgorithm(curWidget, widgetsRect, dirName);
  }
  return newFocusChildWidget;
};

document.addEventListener('keydown', (e) => {
  let code = e.keyCode;
  let eventType = keyMap[code];
  if (!eventType) return;
  focusManageLib.cur.eventType = eventType;
  focusManageLib.cur.onBeforeLeave(focusManageLib.cur);
  if (eventType !== 'ok') {
    let newInfo = doSwitch(focusManageLib.cur, focusManageLib.cubs[focusManageLib.zIndex], eventType);
    if (newInfo) {
      // 可以移动的情况
      newInfo.eventType = eventType;
      focusManageLib.cur = newInfo;
      // 这两个调用是为了使得className 变化
      focusManageLib.last.unactive();
      focusManageLib.cur.active();
      if (focusManageLib.last.onLeave) {
        focusManageLib.last.onLeave(focusManageLib.last);
      }
      focusManageLib.cur.onAcitve(focusManageLib.cur);
    } else if (focusManageLib.cur.element && !newInfo) {
      focusManageLib.cur.onEdge(focusManageLib.cur);
    }
  } else {
    focusManageLib.cur.onOk(focusManageLib.cur);
  }
  findWidgets(focusManageLib.cur.element, (widgetId) => {
    let paretWidget = focusManageLib.widgets[widgetId];
    if (paretWidget) {
      paretWidget.action(focusManageLib.cur);
    }
  });
  focusManageLib.last = focusManageLib.cur;
});

window.focusManageLib = focusManageLib;

export {
  focusManageLib,
  getWidgetRect,
  careteId,
  changeGoto,
  zIndexChange,
  refreshLocInfo
};
