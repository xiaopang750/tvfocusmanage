const keyMap = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

const focusManageLib = {
  last: {
    unactive() {}
  },
  cur: {},
  cubs: {}
};

const getBoundingClientRect = (el) => {
  if (!el) {
    return {};
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

const getWidgetRect = (el) => {
  let rect;
  let elRect = getBoundingClientRect(el);
  rect = {
    top: elRect.top || 0,
    bottom: elRect.bottom || 0,
    right: elRect.right || 0,
    left: elRect.left || 0,
    width: elRect.width || 0,
    height: elRect.height || 0,
    centerX: (elRect.width / 2 + elRect.left) || 0,
    centerY: (elRect.height / 2 + elRect.top) || 0
  };
  return rect;
};

const queryWidgetByShadowAlgorithm = (curWidget, widgetsRect, dir) => {
  let currentRect = getWidgetRect(curWidget);
  let resultWidget = null;
  let dis = Infinity;
  for (let i in widgetsRect) {
    let tempInfo = widgetsRect[i];
    let tempWidget = tempInfo.element;
    if (tempWidget === curWidget) {
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
  return resultWidget;
};

const queryWidgetByAreaAlgorithm = (curWidget, widgetsRect, dir) => {
  let currentRect = getWidgetRect(curWidget);
  let resultWidget = null;
  let dis = Infinity;
  for (let i in widgetsRect) {
    let tempInfo = widgetsRect[i];
    let tempWidget = tempInfo.element;
    if (tempWidget === curWidget) {
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
  let newFocusChildWidget = null;
  newFocusChildWidget = queryWidgetByShadowAlgorithm(curWidget, widgetsRect, dirName);
  if (!newFocusChildWidget) {
    newFocusChildWidget = queryWidgetByAreaAlgorithm(curWidget, widgetsRect, dirName);
  }
  return newFocusChildWidget;
};

document.addEventListener('keydown', (e) => {
  let code = e.keyCode;
  let dir = keyMap[code];
  let cur = focusManageLib.cur.element;
  if (!dir) return;
  let newInfo = doSwitch(cur, focusManageLib.cubs, dir);
  if (newInfo) {
    focusManageLib.cur = newInfo;
  }
  focusManageLib.last.unactive();
  focusManageLib.cur.active();
  focusManageLib.last = focusManageLib.cur;
});

export {
  focusManageLib,
  getWidgetRect
};