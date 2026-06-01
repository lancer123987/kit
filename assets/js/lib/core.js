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
 * @description 數值處理
 *
 * ========================================================================*/
/**
 * 數值限制
 *
 * @access    public
 *
 * @param     {number}  min   最小值
 * @param     {number}  num   目標值
 * @param     {number}  max   最大值
 *
 * @return    {number}
 */
function clamp(min, num, max) {
    /* 參數型別檢查 */
    if ('number' !== typeof min || 'number' !== typeof num || 'number' !== typeof max) {
        devError('clamp error: All parameters (min, num, max) must be of type number.');
        return NaN;
    }

    /* 邊界邏輯檢查 */
    if (min > max) {
        devError(`clamp error: Minimum value (${min}) cannot be greater than Maximum value (${max}).`);
        return NaN;
    }

    let result = Math.min(Math.max(num, min), max);
    return result;
}




/**========================================================================
 *
 * @description DOM 屬性擴充
 *
 * ========================================================================*/

/**
 * 判斷 css sticky 元素是否釘住
 *
 * @access    public
 *
 * @return    {boolean}
 */
(function () {
    /* 定義核心判斷邏輯 */
    let checkStatus = function (el) {
        let rect = el.getBoundingClientRect();
        let style = window.getComputedStyle(el);
        let stickyTop = parseInt(style.top, 10) || 0;

        return (rect.top <= stickyTop + 10);
    };

    /* 注入原生 HTMLElement 原型 */
    if ('undefined' !== typeof HTMLElement && !HTMLElement.prototype.isSticky) {
        HTMLElement.prototype.isSticky = function () {
            return checkStatus(this);
        };
    }

    /* 注入 jQuery 插件原型 */
    if ('undefined' !== typeof jQuery && !jQuery.fn.isSticky) {
        jQuery.fn.isSticky = function () {
            if (0 === this.length) {
                return false;
            }
            return checkStatus(this[0]);
        };
    }
})();


/**
 * 滑動展開或收合元素
 *
 * @access    public
 *
 * @param     {HTMLElement}   el                  目標元素
 * @param     {boolean}       isOpen              true 為展開，false 為收合
 * @param     {object}        [options]           選項設定
 * @param     {number}        [options.duration]  動畫時長（毫秒），預設 300
 * @param     {string}        [options.display]   展開時的 display 類型，預設 'block'
 * @param     {Function}      [options.callback]  動畫結束後的 callback
 *
 * @return    {void}
 */
(function () {
    function slide(el, isOpen, options) {
        el = unwrapjQuery(el);

        if (!(el instanceof HTMLElement)) {
            devError('[slide] Invalid element: must be an HTMLElement or jQuery object.');
            return;
        }

        let {
            duration = 300,
            display  = 'block',
            callback
        } = options || {};

        /* 若動畫進行中，先凍結當前位置 */
        if ('function' === typeof el._slideStop) {
            el._slideStop();
        }

        function onEnd() {
            if (!isOpen) el.style.display = 'none';

            el.style.transition    = '';
            el.style.overflow      = '';
            el.style.height        = '';
            el.style.paddingTop    = '';
            el.style.paddingBottom = '';
            el._slideStop          = null;

            el.removeEventListener('transitionend', onEnd);
            if ('function' === typeof callback) callback();
        }

        el._slideStop = function () {
            let cs                 = getComputedStyle(el);
            el.style.height        = cs.height;
            el.style.paddingTop    = cs.paddingTop;
            el.style.paddingBottom = cs.paddingBottom;
            el.style.transition    = '';
            el.style.overflow      = '';
            el._slideStop          = null;
            el.removeEventListener('transitionend', onEnd);
        };

        el.addEventListener('transitionend', onEnd);

        if (isOpen) {
            el.style.display  = display;
            el.style.overflow = 'hidden';

            let computedStyle       = getComputedStyle(el);
            let targetPaddingTop    = computedStyle.paddingTop;
            let targetPaddingBottom = computedStyle.paddingBottom;
            let boxSizing           = computedStyle.boxSizing;

            el.style.paddingTop    = '0';
            el.style.paddingBottom = '0';
            el.style.height        = '0';

            let naturalHeight   = el.scrollHeight;
            let paddingTopPx    = parseFloat(targetPaddingTop)                || 0;
            let paddingBottomPx = parseFloat(targetPaddingBottom)             || 0;
            let borderTopPx     = parseFloat(computedStyle.borderTopWidth)    || 0;
            let borderBottomPx  = parseFloat(computedStyle.borderBottomWidth) || 0;

            let targetHeight = ('border-box' === boxSizing)
                ? naturalHeight + paddingTopPx + paddingBottomPx + borderTopPx + borderBottomPx
                : naturalHeight;

            el.style.transition = `height ${duration}ms ease, padding ${duration}ms ease`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.style.height        = targetHeight + 'px';
                    el.style.paddingTop    = targetPaddingTop;
                    el.style.paddingBottom = targetPaddingBottom;
                });
            });

        } else {
            el.style.overflow   = 'hidden';
            el.style.height     = el.scrollHeight + 'px';
            el.style.transition = `height ${duration}ms ease, padding ${duration}ms ease`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.style.height        = '0';
                    el.style.paddingTop    = '0';
                    el.style.paddingBottom = '0';
                });
            });
        }
    }

    /* 注入原生 HTMLElement 原型 */
    if ('undefined' !== typeof HTMLElement) {
        if (!HTMLElement.prototype.slide) {
            /**
             * @param     {boolean}   isOpen
             * @param     {object}    [options]
             * @return    {HTMLElement}
             */
            HTMLElement.prototype.slide = function (isOpen, options) {
                slide(this, isOpen, options);
                return this;
            };
        }

        if (!HTMLElement.prototype.slideStop) {
            /**
             * @return    {HTMLElement}
             */
            HTMLElement.prototype.slideStop = function () {
                if ('function' === typeof this._slideStop) {
                    this._slideStop();
                }
                return this;
            };
        }
    }

    /* 注入 jQuery 插件原型 */
    if ('undefined' !== typeof jQuery) {
        if (!jQuery.fn.slide) {
            /**
             * @param     {boolean}   isOpen
             * @param     {object}    [options]
             * @return    {jQuery}
             */
            jQuery.fn.slide = function (isOpen, options) {
                this.each(function () {
                    slide(this, isOpen, options);
                });
                return this;
            };
        }

        if (!jQuery.fn.slideStop) {
            /**
             * @return    {jQuery}
             */
            jQuery.fn.slideStop = function () {
                this.each(function () {
                    if ('function' === typeof this._slideStop) {
                        this._slideStop();
                    }
                });
                return this;
            };
        }
    }

})();




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
    if (!touchSupport) return false;
    const userAgent = navigator.userAgent;

    /* 基礎行動裝置偵測 */
    const mobileRegex = [/Android/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
    const isMobileUA = mobileRegex.some(device => device.test(userAgent));

    /* 確認是否多點觸碰 */
    const isIPad = (navigator.maxTouchPoints > 1 && /Macintosh/i.test(userAgent));

    /* 確認螢幕尺寸 */
    const isSmallScreen = Math.min(screen.width, screen.height) < 1024;

    return (isMobileUA || (isIPad && isSmallScreen));
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
 * 獲取 Domain Name
 *
 * @access    public
 *
 * @param     {string}  src       連結
 *
 * @return    {string|null}
 */
function getDomainName(src) {
    /* 返回不合法 src */
    if ('string' !== typeof src || !src) {
        devError('[getDomainName] Invalid input: src must be a non-empty string.');
        return '';
    }

    /* 返回絕對 & 相對路徑 */
    if (src.startsWith('/') && !src.startsWith('//')) {
        devWarn(`[getDomainName] Input "${src}" appears to be a path, not a URL. Skipping.`);
        return '';
    }

    /* 取得 domain name */
    let hostname = '';

    if ('function' === typeof window.URL && new URL('https://a.com').hostname) {
        /* 原生 API 執行區 */
        /* new URL 必須包含協定，否則會報錯 */
        const hasProtocol = src.includes('://') || src.startsWith('//');

        if (!hasProtocol) {
            devWarn(`[getDomainName] URL "${src}" missing protocol. Native "new URL" might fail.`);
            return '';
        }

        const target = src.startsWith('//') ? `https:${src}` : src;
        hostname = new URL(target).hostname;

    } else {
        /* 備案執行區 (Regex) */
        devWarn('[getDomainName] Browser does not support "new URL". Falling back to Regex.');

        const match = src.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/im);
        if (match && match[1]) {
            hostname = match[1];
        }
    }

    if (!hostname) {
        devWarn(`[getDomainName] Failed to extract hostname from: "${src}"`);
        return '';
    }

    return hostname.replace(/^www\./, '');
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
    return new URLSearchParams(location.search).get(search);
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
    if (null === value || undefined === value) {
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
function escapeHTML(str, maxLength = 1000) {
    const MAX_PREVIEW_LENGTH = 30;

    /* 空值處理 */
    if (null == str) {
        devWarn('escapeHTML received null or undefined str');
        return '';
    }

    const strType = typeof str;
    let safeStr;

    /* 非字串處理 */
    if ('string' !== strType) {
        safeStr = String(str);
        let preview = safeStr.length > MAX_PREVIEW_LENGTH ?
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
        let preview = safeStr.substring(0, MAX_PREVIEW_LENGTH) + '...';
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
    let timestamp = Date.now();
    let randomNum = Math.floor(Math.random() * 10000);
    return timestamp + '_' + randomNum;
}


/**
 * 解封 jQuery 物件以取得原生 DOM 元素
 *
 * @access    public
 *
 * @param     {HTMLElement|jQuery}  el  目標元素
 *
 * @return    {HTMLElement|null}
 */
function unwrapjQuery(el) {
    if ('undefined' !== typeof jQuery && el instanceof jQuery) {
        return el[0] || null;
    }

    return el;
}


/**
 * 確保回傳 jQuery 物件
 *
 * @access    public
 *
 * @param {HTMLElement|jQuery}  el  目標元素
 *
 * @return {jQuery}
 */
function wrapjQuery(el) {
    return (el instanceof jQuery) ? el : jQuery(el);
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
 * @return    {void}
 */
const ResizeHandler = (() => {
    /* 預設時間間隔 */
    const delayDefault = 400;

    /**
     * 初始化方法
     *
     * @access    public
     *
     * @param     {function}  customResizeEvent               自訂處理函式
     * @param     {Object}    options                         選項
     * @param     {string}    options.targetSelector          監控目標選擇器
     * @param     {number}    options.debounceDelay           防抖延遲時間
     * @param     {string}    options.direction               監控方向 ('x' | 'y' | 'both')
     *
     * @return    {void}
     */
    const init = (customResizeEvent, { targetSelector = 'body', debounceDelay = delayDefault, direction = 'x' } = {}) => {
        /* 防抖動功能是否存在 */
        if ('function' !== typeof debounce) {
            return devError('ResizeHandler: Required function "debounce" is missing.');
        }

        let targetEl = document.querySelector(targetSelector);
        if (!targetEl) return;

        /* 紀錄最後一次觸發時的尺寸 */
        let lastWidth = targetEl.offsetWidth;
        let lastHeight = targetEl.offsetHeight;

        /* 包裝回調函式 */
        let debouncedCustomEvent = debounce(() => {
            if ('function' === typeof customResizeEvent) {
                customResizeEvent();
            }
        }, debounceDelay);

        /* 初始觸發一次 */
        if ('function' === typeof customResizeEvent) {
            customResizeEvent();
        }

        /* 建立 Observer */
        let resizeObserver = new ResizeObserver((entries) => {
            let entry = entries[0];
            if (!entry) return;

            /* 取得目前尺寸 (浮點數精確度更高) */
            let {
                width: currentWidth,
                height: currentHeight
            } = entry.contentRect;
            let trigger = false;

            /* 方向判斷邏輯 */
            switch (direction) {
                case 'x':
                    if (currentWidth !== lastWidth) trigger = true;
                    break;
                case 'y':
                    if (currentHeight !== lastHeight) trigger = true;
                    break;
                case 'both':
                default:
                    if (currentWidth !== lastWidth || currentHeight !== lastHeight) trigger = true;
            }

            if (trigger) {
                lastWidth = currentWidth;
                lastHeight = currentHeight;
                debouncedCustomEvent();
            }
        });

        /* 開始監控 */
        resizeObserver.observe(targetEl);
    };

    return {
        init
    };
})();


/**
 * 監控元素進入/離開視窗
 *
 */
const observable = {
    /**
     * 初始化觀察器
     *
     * @access    public
     *
     * @param     {Object}    options           初始化參數
     * @param     {string}    options.target    CSS 選擇器 (例如: '.scroll-box')
     * @param     {number}    options.top       偵測區域頂部縮減的 px
     * @param     {number}    options.bottom    偵測區域底部縮減的 px
     * @param     {number}    options.threshold 觸發閾值 (0.0 ~ 1.0)
     * @param     {boolean}   options.once      是否只觸發一次進入動作 (預設 true)
     * @param     {function}  options.onEnter   進入偵測區的回調函數   (支援 async)
     * @param     {function}  options.onLeave   離開偵測區的回調函數
     *
     * @return    {function|null}               停止所有觀察的方法，方便手動銷毀
     */
    init({
        target,
        top = 0,
        bottom = 0,
        threshold = 0,
        once = true,
        onEnter,
        onLeave
    }) {
        /* 若定義了 onLeave，代表需要反覆執行，強制將 once 設為 false */
        let shouldOnce = onLeave ? false : once;

        /* 設定偵測邊界 (Top, Right, Bottom, Left) */
        let marginTop = 0 - top;
        let marginBottom = 0 - bottom;
        let rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;

        let observer = new IntersectionObserver((entries) => {
            entries.forEach(async (entry) => {
                let el = entry.target;

                if (entry.isIntersecting) {
                    /* --- 進入偵測區域 --- */
                    if (shouldOnce) {
                        observer.unobserve(el);
                    }

                    if ('function' === typeof onEnter) {
                        await onEnter(el);
                    }
                } else {
                    /* --- 離開偵測區域 --- */
                    if ('function' === typeof onLeave) {
                        await onLeave(el);
                    }
                }
            });
        }, {
            rootMargin: rootMargin,
            threshold: threshold
        });

        let elements = document.querySelectorAll(target);
        if (0 === elements.length) {
            return null;
        }

        elements.forEach((el) => {
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }
};


/**
 * 滾動效能優化
 *
 * @access   public
 *
 * @param    {Function} callback - () => {} (節能模式) 或 (data) => {} (詳細模式)
 *
 * @return   {Function} destroy - 解除監聽函式
 */
function observeScroll(callback) {
    if ('function' !== typeof callback) return;

    /* 滾動緩衝 */
    let buffer = 2;

    let ticking = false;

    /* 紀錄上一次捲動的位置 */
    let wasTop = false;
    let wasBottom = false;
    let lastScrollTop = (callback.length > 0) ? (window.scrollY || document.documentElement.scrollTop) : null;

    function handler(e) {
        if (ticking) return;

        ticking = true;
        window.requestAnimationFrame(() => {
            if (0 === callback.length) {
                callback();
            } else {
                let currentScrollTop = Math.max(0, window.scrollY || document.documentElement.scrollTop);
                let windowHeight = window.innerHeight;
                let docHeight = document.documentElement.scrollHeight;

                let direction = 'none';
                let delta = currentScrollTop - lastScrollTop;

                if (Math.abs(delta) > buffer) {
                    direction = delta > 0 ? 'down' : 'up';
                }

                let isTop = currentScrollTop <= 0;
                let isBottom = currentScrollTop + windowHeight >= docHeight - 1;

                let shouldCall = direction !== 'none' || (isTop && !wasTop) || (isBottom && !wasBottom);

                if (shouldCall) {
                    /* 回傳項目 */
                    callback({
                        event: e,
                        direction,
                        scrollTop: currentScrollTop,
                        prevScrollTop: lastScrollTop,
                        isTop: isTop,
                        isBottom: isBottom
                    });
                }

                lastScrollTop = currentScrollTop;
                wasTop = isTop;
                wasBottom = isBottom;
            }

            ticking = false;
        });
    }

    let options = {
        passive: true
    };
    let events = ['wheel', 'touchmove', 'scroll'];

    /* 綁定事件 */
    events.forEach(evt => window.addEventListener(evt, handler, options));

    /**
     * 解除監聽機制
     */
    return function destroy() {
        events.forEach(evt => window.removeEventListener(evt, handler, options));
        lastScrollTop = null;
        ticking = wasTop = wasBottom = false;
    };
}


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
        rootMargin: '0px',
        /* 可視邊界調整 */
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


/**
 * 視差滾動進度計算
 *
 * @access  public
 *
 * @param   {Object}              config
 * @param   {HTMLElement|jQuery}  config.childEl    偵測目標元素
 * @param   {string}              config.startMode  起始模式（預設 'bottom'
 *
 * @return  {number}                                progress 0~1
 */
function getParallaxPercent(config) {
    let {
        childEl,
        startMode = 'bottom'
    } = config;

    /* jQuery 確認 */
    childEl = unwrapjQuery(childEl);

    if (!(childEl instanceof HTMLElement)) {
        return devError('[getParallaxPercent] config.childEl must be a valid HTMLElement.');
    }

    let parentEl = childEl.parentElement;

    if (!(parentEl instanceof HTMLElement)) {
        return devError('[getParallaxPercent] childEl must have a valid parent HTMLElement.');
    }

    let stickyTop = parseFloat(getComputedStyle(childEl).top) || 0;
    let parentRect = parentEl.getBoundingClientRect();
    let vh = window.innerHeight;
    let parentH = parentEl.offsetHeight;
    let childH = childEl.offsetHeight;

    /* progress = 0 時，parentRect.top 的值 */
    let startY = 'top' === startMode ? -stickyTop : vh - stickyTop;

    /* progress = 1 時，parentRect.top 的值 */
    let endY = stickyTop + childH - parentH;
    let rate = clamp(0, (parentRect.top - startY) / (endY - startY), 1);

    return rate;
}




/**========================================================================
 *
 * @description 介面行為控制
 *
 * ========================================================================*/

/**
 * 平滑捲動至指定座標 (使用 requestAnimationFrame)
 *
 * @access    public
 *
 * @param     {number}  targetPos  目標 Y 軸座標
 * @param     {number}  duration   動畫持續時間 (ms)
 *
 * @return    {void}
 */
function smoothScrollTo(targetPos, duration = 1000) {
    if (smoothScrollTo._rafId) {
        cancelAnimationFrame(smoothScrollTo._rafId);
        smoothScrollTo._rafId = null;
    }

    let startPos = window.scrollY;
    let distance = targetPos - startPos;
    let startTime = null;

    /**
     * 二次方緩動公式 (Ease-in-out)
     *
     * @param {number} t - 當前時間
     * @param {number} b - 起始位置
     * @param {number} c - 總位移量
     * @param {number} d - 總持續時間
     * @return {number}
     */
    let easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) {
            return (c / 2) * t * t + b;
        }
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    };


    /**
     * 執行補間動畫幀
     *
     * @param {number} currentTime - 當前時間戳
     * @return {void}
     */
    let animation = (currentTime) => {
        if (null === startTime) {
            startTime = currentTime;
        }

        let timeElapsed = currentTime - startTime;
        let run = easeInOutQuad(timeElapsed, startPos, distance, duration);

        window.scrollTo(0, run);

        if (timeElapsed < duration) {
            smoothScrollTo._rafId = requestAnimationFrame(animation);
        } else {
            window.scrollTo(0, targetPos);
            smoothScrollTo._rafId = null;
        }
    };

    smoothScrollTo._rafId = requestAnimationFrame(animation);
}


/**
 * 返回頂部
 *
 * @access    public
 *
 * @param     {number}  speed       滾動時長(ms)
 *
 * @return    {void}
 */
function scrollToTop(speed = 1000) {
    smoothScrollTo(0, speed);
}


/**
 * scroll down
 *
 * @access    public
 *
 * @param     {boolean} isHeader    扣除頁首高度
 * @param     {number}  speed       捲動速度 (ms)
 *
 * @return    {void}
 */
function scrollDown(isHeader = false, speed = 800) {
    let offset = 0;

    if (isHeader) {
        let $header = jQuery('header');
        offset = (0 < $header.length) ? $header.outerHeight() : parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerHeight')) || 0;
    }

    let windowHeight = window.innerHeight;
    let targetPos = window.scrollY + windowHeight - offset;

    smoothScrollTo(targetPos, speed);
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
        let opener = e.target.closest('.j-lightbox-open');
        if (!opener) return;
        let target = opener.dataset.target;

        if (!target) {
            devError('The element with class "j-lightbox-open" has an undefined "data-target" attribute.');
            return;
        }

        let lightbox = document.querySelector(`.j-lightbox[data-lightbox="${target}"]`);
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
    let isBlank = +selectedOption.dataset.blank || 0;
    let isStop = +selectedOption.dataset.stop || 0;

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
function setDialog(type, setting = {}, callback1, callback2) {
    let lightbox = document.querySelector('.j-lightbox[data-lightbox="dialog"]');
    if (!lightbox) return;

    /* setting 預設值 */
    let {
        title = '', sub = '', icon = '', content = ''
    } = setting;

    /* 預先抓取 UI 元件 */
    let elTitle = lightbox.querySelector('.j-dialog-title');
    let elSub = lightbox.querySelector('.j-dialog-sub');
    let elIcon = lightbox.querySelector('.j-dialog-icon');
    let elContent = lightbox.querySelector('.j-dialog-content');
    let btn1 = lightbox.querySelector('.j-dialog-callback1');
    let btn2 = lightbox.querySelector('.j-dialog-callback2');

    /* 清除按鈕事件 */
    if (btn1) btn1.onclick = null;
    if (btn2) btn2.onclick = null;

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
    if (elTitle) elTitle.innerHTML = title;
    if (elSub) elSub.innerHTML = sub;
    if (elIcon) icon ? elIcon.setAttribute('data-icon', icon) : elIcon.removeAttribute('data-icon');

    /* 自訂訊息內容處理 */
    if (elContent) {
        let finalContent = content;
        if (Array.isArray(content)) {
            finalContent = content.length > 1 ?
                content.map((item, i) => `${i + 1}. ${item}`).join('<br>') :
                (content[0] || '');
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
            if (elTitle) elTitle.innerHTML = '';
            if (elSub) elSub.innerHTML = '';
            if (elContent) elContent.innerHTML = '';
            if (elIcon) elIcon.removeAttribute('data-icon');
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


/**
 * 複製功能
 * 偵測頁面上所有的 .j-copy 元素並綁定點擊事件
 * 若瀏覽器不支援剪貼簿 API 則移除該按鈕
 *
 * @access    public
 *
 * @return    {void}
 */
function initCopyAction() {
    /* 檢查瀏覽器支援度與安全環境 (HTTPS) */
    if (!navigator.clipboard || !window.isSecureContext) {
        /* 若不支援，按鈕移除 */
        let $staticButtons = document.querySelectorAll('.j-copy');
        $staticButtons.forEach(($btn) => $btn.remove());
        return;
    }

    /* 使用事件代理，確保動態產生的內容也能觸發 */
    document.addEventListener('click', (e) => {
        let $target = e.target.closest('.j-copy');

        if (null === $target) return;

        e.preventDefault();

        /* 優先取 data-copy 的值，若無則取當前網址 */
        let textToCopy = $target.getAttribute('data-copy') || location.href;

        navigator.clipboard.writeText(textToCopy).then(() => {
            /* 成功 */
            showCopyMessage('已複製連結');
        }, () => {
            /* 失敗 */
            showCopyMessage('複製連結失敗，請與我們聯繫');
        });
    });


    /**
     * 提示訊息
     *
     * @access    private
     *
     * @param     {string}  message  提示訊息
     *
     * @return    {void}
     */
    function showCopyMessage(message) {
        if ('function' === typeof setDialog) {
            setDialog('alert', {
                content: message
            });
        } else {
            alert(message);
        }
    }
}




/**========================================================================
 *
 * @description API呼叫
 *
 * ========================================================================*/

/**
 * 建立 Promise 封裝的非同步機制
 *
 * @access    public
 *
 * @param     {string}   url    請求網址
 * @param     {Object}   data   資料物件
 *
 * @return    {Promise}
 */
const makeFetchPromise = (url, data) => {
    let isFormData = data instanceof FormData;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: isFormData ? {} : { 'Content-Type': 'application/json' },
            body: isFormData ? data : JSON.stringify(data)
        }).then((response) => {
                if (!response.ok) {
                    throw new Error('連線失敗');
                }
                return response.json();
            })
            .then((respon) => {
                if (respon && respon.data) {
                    resolve(respon.data);
                } else {
                    reject(new Error('AJAX 錯誤：沒有取得有效資料'));
                }
            })
            .catch((error) => {
                /* 防止 Promise 懸掛 */
                reject(error);
            });
    });
};