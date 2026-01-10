/**========================================================================
 *
 * @description 核心設定
 *
 * ========================================================================*/
/* 使否為開發模式 */
const isDevMode = true;

/* 是否支援處控功能 */
const touchSupport = 'ontouchend' in document;

/* css是否支援 :has() */
const cssSupportHas = CSS.supports('selector(:has(*))');

/*  HTML跳脫字元表 */
const escapeMap = new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#39;'],
    ['`', '&#96;']
]);


/**========================================================================
 *
 * @description 訊息封裝
 *
 * ========================================================================*/

/**
 * 開發模式警告訊息
 *
 * @access    public
 *
 * @param     {string}  message   警告訊息內容
 *
 * @return    void
 */
function devWarn(message) {
    if (isDevMode) {
        console.warn(message);
    }
}


/**
 * 開發模式錯誤訊息
 *
 * @access    public
 *
 * @param     {string}  message   錯誤訊息內容
 *
 * @return    void
 */
function devError(message) {
    if (isDevMode) {
        console.error(message);
    }
}




/**========================================================================
 *
 * @description 環境偵測
 *
 * ========================================================================*/

/**
 * 判斷是否為 IOS 裝置
 *
 * @access    public
 *
 * @return    {boolean}
 */
function isIOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPhone|iPad|iPod/.test(userAgent) && !window.MSStream;
}


/**
 * 判斷是否為行動裝置
 *
 * @access    public
 *
 * @return    {boolean}
 */
function isMobileDevice() {
    let mobileDevices = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'];
    for (let i = 0; i < mobileDevices.length; i++) {
        if (navigator.userAgent.match(mobileDevices[i])) {
            return true;
        }
    }
    return false
}




/**========================================================================
 *
 * @description 通用工具
 *
 * ========================================================================*/

/**
 * 防抖動
 *
 * @access    public
 *
 * @param     {function}  func      預計執行的函式
 * @param     {number}    delay     延遲時間 (毫秒)，預設為 500
 *
 * @return    {function}
 */
function debounce(func, delay = 500) {
    let timer = null;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}


/**
 * 獲取網址 Search 參數值
 *
 * @access    public
 *
 * @param     {string}  search    參數鍵名
 *
 * @return    {string|null}
 */
function getSearch(search = '') {
    let url = new URL(location.href);
    let params = new URLSearchParams(url.search);
    let result = params.get(search);

    return result;
}


/**
 * 獲取網址 Hash 參數值
 *
 * @access    public
 *
 * @param     {string}  key       目標鍵名 (選填)
 *
 * @return    {string|object|null}
 */
function getHash(key = '') {
    let hash = location.hash;
    if (!hash || hash.length <= 1) return null;

    /* 清理hash，只保留['字母', '數字', '=', '-', '&'] */
    let cleanedHash = hash.substring(1).replace(/[^a-zA-Z0-9=&-]/g, '');
    if (!cleanedHash) return null;

    let hashParts = cleanedHash.split('#');
    let result = {};

    hashParts.forEach(part => {
        let params = new URLSearchParams(part);
        for (let [key, value] of params) {
            result[key] = encodeURIComponent(value);
        }
    });

    if (!key) {
        return Object.keys(result).length > 0 ? result : null;
    }

    return result[key] ? decodeURIComponent(result[key]) : null;
}


/**
 * 寫入網址 Hash 參數值
 *
 * @access    public
 *
 * @param     {string}  key       目標鍵名
 * @param     {string}  value     欲寫入之值
 *
 * @return    {boolean}
 */
function setHash(key, value) {
    /* 獲取當前的 hash 物件 */
    let currentHash = getHash() || {};

    /* 清理hash，只保留['字母', '數字', '=', '-', '&'] */
    let cleanedKey = key.replace(/[^a-zA-Z0-9=&-]/g, '');
    if (!cleanedKey) return false;

    /* 如果 value 是 null 或 undefined，則移除該 key */
    if (value === null || value === undefined) {
        delete currentHash[cleanedKey];
    } else {
        /* 清理value，移除危險字元並編碼 */
        let cleanedValue = String(value).replace(/[^a-zA-Z0-9=&-]/g, '');
        currentHash[cleanedKey] = encodeURIComponent(cleanedValue);
    }

    /* 將物件轉換成 hash 字串 */
    let params = new URLSearchParams();
    for (let [k, v] of Object.entries(currentHash)) {
        params.append(k, decodeURIComponent(v));
    }
    let hashString = params.toString();

    /* 更新 URL hash */
    if (hashString) {
        location.hash = hashString;
    } else {
        /* 如果 hash 為空，移除 hash */
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    return true;
}


/**
 * HTML 跳脫字元處理 (預防 XSS)
 *
 * @access    public
 *
 * @param     {string}  str         字串內容
 * @param     {number}  maxLength   字數上限
 *
 * @return    {string}
 */
function escapeHTML(str, maxLength = 5000) {
    const MAX_PREVIEW_LENGTH = 30;

    /* 空值處理 */
    if (str == null) {
        devWarn('escapeHTML received null or undefined str');
        return '';
    }

    let safeStr;
    const strType = typeof str;

    /* 非字串處理 */
    if (strType !== 'string') {
        safeStr = String(str);
        const preview = safeStr.length > MAX_PREVIEW_LENGTH ?
            safeStr.substring(0, MAX_PREVIEW_LENGTH) + '...' :
            safeStr;
        devWarn(`escapeHTML: Non-string str (${strType}) "${preview}"`);
    } else {
        safeStr = str;
    }

    /* maxLength 驗證 */
    let parsedLength = Number(maxLength);
    if (!Number.isInteger(parsedLength) || parsedLength <= 0) {
        devWarn(`escapeHTML: invalid maxLength ${maxLength}, falling back to default 1000`);
        parsedLength = 1000;
    }

    /* 最大長度限制 */
    if (safeStr.length > parsedLength) {
        const preview = safeStr.substring(0, MAX_PREVIEW_LENGTH) + '...';
        throw new Error(`escapeHTML str too long (${safeStr.length} chars): "${preview}"`);
    }

    return safeStr.replace(/[&<>"'`]/g, s => escapeMap.get(s));
}


/**
 * 取得雜湊值
 *
 * @access    public
 *
 * @return    {string}
 */
function getHashKey() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return timestamp + '_' + randomNum;
}




/**========================================================================
 *
 * @description 監聽與效能優化
 *
 * ========================================================================*/

/**
 * resize事件
 *
 * @access    public
 *
 * @param     {string}  direction   偵測方向
 *
 * @return    void
 */
const ResizeHandler = ((direction = 'x') => {
    /* 預設時間間隔 */
    const delayDefault = 500;

    /* 預設的resize處理函式 */
    const defaultResizeEvent = () => {};

    /* 初始化方法 */
    const init = (customResizeEvent = defaultResizeEvent, debounceDelay = delayDefault) => {
        /* 防抖動功能是否存在 */
        if (typeof debounce !== 'function') return devError('ResizeHandler: Required function "debounce" is missing.');

        const debouncedDefaultResizeEvent = debounce(defaultResizeEvent, debounceDelay);
        const debouncedCustomResizeEvent = debounce(customResizeEvent, debounceDelay);

        /* 初始觸發 */
        defaultResizeEvent();
        customResizeEvent();

        let lastWidth = window.innerWidth;
        let lastHeight = window.innerHeight;

        /* 綁定resize事件 */
        const resizeHandler = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            let trigger = false;

            switch (direction) {
                case 'x':
                    if (newWidth !== lastWidth) trigger = true;
                    break;
                case 'y':
                    if (newHeight !== lastHeight) trigger = true;
                    break;
                case 'both':
                default:
                    if (newWidth !== lastWidth || newHeight !== lastHeight) trigger = true;
            }

            if (trigger) {
                lastWidth = newWidth;
                lastHeight = newHeight;
                debouncedDefaultResizeEvent();
                debouncedCustomResizeEvent();
            }
        };

        window.addEventListener('resize', resizeHandler);

        /* 綁定orientation change事件 */
        if (screen.orientation && screen.orientation.addEventListener) {
            screen.orientation.addEventListener('change', resizeHandler);
        } else {
            /* 如果不支援screen.orientation */
            devWarn('Device does not support orientation.');
        }
    };

    return {
        init
    };
})();


/**
 * 循環動畫效能優化 (可視偵測)
 *
 * @access    public
 *
 * @return    void
 */
function observeInfAnim() {
    let el = document.querySelectorAll('[data-animated-infinite="1"], [data-animated-infinite="true"]');
    if (!el.length) return;

    /* Observer 設定 */
    let options = {
        root: null,
        rootMargin: '0px', /* 可視邊界調整 */
        threshold: 0 /* 進入觸發比例 */
    };

    /* Observer 動作 */
    let observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('play', entry.isIntersecting);
        });
    };

    /* 建立 Observer */
    let observer = new IntersectionObserver(observerCallback, options);

    /* 處理元素 */
    el.forEach(element => {
        observer.observe(element);
    });
}



/**========================================================================
 *
 * @description 介面行為控制
 *
 * ========================================================================*/

/**
 * 返回頂部
 *
 * @access    public
 *
 * @param     {number}  speed       滾動時長
 *
 * @return    {void}
 */
function scrollToTop(speed = 1000) {
    const start = window.scrollY;
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / speed, 1);
        window.scrollTo(0, start * (1 - progress));

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(step);
        } else {
            removeWheelListener();
        }
    }

    function onWheel() {
        cancelAnimationFrame(animationFrameId);
        removeWheelListener();
    }

    function removeWheelListener() {
        window.removeEventListener('wheel', onWheel, {
            passive: true
        });
    }

    window.addEventListener('wheel', onWheel, {
        passive: true
    });
    let animationFrameId = requestAnimationFrame(step);
}


/**
 * scroll down
 *
 * @access    public
 *
 * @param     {boolean} isHeader    扣除頁首高度
 *
 * @return    {void}
 */
function scrollDown(isHeader = false) {
    /* head高度 */
    let headHeight = 0;

    if (isHeader) {
        const header = document.querySelector('header');
        headHeight = header ? header.offsetHeight : 0;
    }

    /* 取得目標元素 (第一個區塊) */
    const scrollItem = document.querySelector('.j-scrollItem');
    if (!scrollItem) return;

    /* 計算捲動位置：元素底部位置 - 頁首高度 */
    const position = scrollItem.offsetHeight - headHeight;

    /* 原生平滑捲動 API */
    window.scrollTo({
        top: position,
        behavior: 'smooth'
    });
}


/**
 * 開關lightbox
 *
 * @access    public
 *
 * @param     {event}   e           事件物件
 * @param     {string}  action      操作行為 (open / close)
 *
 * @return    {void}
 */
function actionLightbox(e, action = 'close') {
    e.preventDefault();
    if ('open' === action) {
        const target = e.target.closest('.j-lightbox-open').dataset.target;

        if (!target) {
            devError('The element with class "j-lightbox-open" has an undefined "data-target" attribute.');
            return;
        }

        const lightbox = document.querySelector(`.j-lightbox[data-lightbox="${target}"]`);
        if (!lightbox) {
            devError(`Lightbox Error: Target lightbox not found. No element matches the selector: .j-lightbox[data-lightbox="${target}"]`);
            return;
        }

        lightbox.classList.add('active');
    } else {
        const lightbox = e.target.closest('.j-lightbox');
        lightbox.classList.remove('active');
    }
}


/**
 * 下拉選單網址跳轉
 *
 * @access    public
 *
 * @param     {HTMLElement} select    目標選單元素
 *
 * @return    {void}
 */
function handleSelectLinkChange($select) {
    let selectedOption = $select.options[$select.selectedIndex];
    let value = $select.value;
    let isBlank = selectedOption.dataset.blank || 0;
    let isStop = selectedOption.dataset.stop || 0;

    if (isStop) return;

    if (isBlank) {
        window.open(value, '_blank');
    } else {
        document.location.href = value;
    }
}


/**
 * 提示視窗
 *
 * @access    public
 *
 * @param     {string}    type        訊息類型     (confirm / message / alert / loading / clear)
 * @param     {object}    setting     自訂訊息內容 {title, sub, icon, content}
 * @param     {function}  callback1   回傳函式1    (確定)
 * @param     {function}  callback2   回傳函式2    (取消)
 *
 * @return    {void}
 */
function setDialog(type, setting, callback1, callback2) {
const lightbox = document.querySelector('.j-lightbox[data-lightbox="dialog"]');
    if (!lightbox) return;

    /* setting 預設值 */
    const { title = '', sub = '', icon = '', content = '' } = setting;

    /* 預先抓取 UI 元件 */
    const elTitle   = lightbox.querySelector('.j-dialog-title');
    const elSub     = lightbox.querySelector('.j-dialog-sub');
    const elIcon    = lightbox.querySelector('.j-dialog-icon');
    const elContent = lightbox.querySelector('.j-dialog-content');
    const btn1      = lightbox.querySelector('.j-dialog-callback1');
    const btn2      = lightbox.querySelector('.j-dialog-callback2');

    /* 開啟 Lightbox */
    if ('clear' !== type) lightbox.classList.add('active');

    /* 事件綁定 - 確定 */
    if (btn1) {
        btn1.onclick = () => {
            setDialog('clear');
            if ('function' === typeof callback1) callback1();
        };
    }

    /* 事件綁定 - 取消 */
    if (btn2) {
        btn2.onclick = () => {
            setDialog('clear');
            if ('function' === typeof callback2) callback2();
        };
    }

    /* 自訂 UI 內容填充 */
    if (elTitle)   elTitle.innerHTML = title;
    if (elSub)     elSub.innerHTML   = sub;
    if (elIcon)    icon ? elIcon.setAttribute('data-icon', icon) : elIcon.removeAttribute('data-icon');

    /* 自訂訊息內容處理 */
    if (elContent) {
        let finalContent = content;
        if (Array.isArray(content)) {
            finalContent = content.length > 1
                ? content.map((item, i) => `${i + 1}. ${item}`).join('<br>')
                : (content[0] || '');
        }
        elContent.innerHTML = finalContent;
    }

    /* 訊息框類型控制 (Sith Logic) */
    switch (type) {
        case 'confirm':
            if (btn1) btn1.style.display = 'flex';
            if (btn2) btn2.style.display = 'flex';
            break;

        case 'message':
            if (btn1) btn1.style.display = 'none';
            if (btn2) btn2.style.display = 'none';
            break;

        case 'alert':
            if (btn1) btn1.style.display = 'flex';
            if (btn2) btn2.style.display = 'none';
            break;

        case 'loading':
            setDialog('clear');
            break;

        case 'clear':
            lightbox.classList.remove('active');
            /* 清空內容與狀態 */
            if (elTitle)   elTitle.innerHTML = '';
            if (elSub)     elSub.innerHTML = '';
            if (elContent) elContent.innerHTML = '';
            if (elIcon)    elIcon.removeAttribute('data-icon');
            if (btn1) {
                btn1.style.display = 'none';
                btn1.onclick = null;
                const span = btn1.querySelector('span');
                if (span) span.innerHTML = '確定';
            }
            if (btn2) {
                btn2.style.display = 'none';
                btn2.onclick = null;
                const span = btn2.querySelector('span');
                if (span) span.innerHTML = '取消';
            }
            break;

        default:
            devError(`Invalid dialog type specified: "${type}"`);
            break;
    }
}