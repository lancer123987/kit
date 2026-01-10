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

jQuery(document).ready(function () {
    /* Passive event listeners */
    jQuery.event.special.touchstart = {
        setup: function (_, ns, handle) {
            this.addEventListener("touchstart", handle, {
                passive: false
            });
        }
    };
    jQuery.event.special.touchmove = {
        setup: function (_, ns, handle) {
            this.addEventListener("touchmove", handle, {
                passive: false
            });
        }
    };
    jQuery.event.special.wheel = {
        setup: function (_, ns, handle) {
            this.addEventListener("wheel", handle, {
                passive: true
            });
        }
    };
    jQuery.event.special.mousewheel = {
        setup: function (_, ns, handle) {
            this.addEventListener("mousewheel", handle, {
                passive: true
            });
        }
    };

    /* wow.js 初始化 */
    new WOW().init();

    /* css animated 循環動畫節流 */
    observeInfAnim();

    /* header 滾動樣式偵測 */
    headerScroll();


    debounceScroll(function () {
        /* header 滾動樣式偵測 */
        headerScroll();
    });


    document.addEventListener('click', function (e) {
        const actions = {
            '.j-goToTop': () => scrollToTop(),
            '.j-scrollDown': () => scrollDown(),
            '.j-lightbox-open': () => actionLightbox(e, 'open'),
            '.j-lightbox-close': () => actionLightbox(e)
        };
        
        for (const [selector, action] of Object.entries(actions)) {
            if (e.target.closest(selector)) {
                action(e.target);
                break;
            }
        }
    });


    document.addEventListener('change', function (e) {
        const actions = {
            '.j-select-link': (target) => handleSelectLinkChange(target)
        };

        for (const [selector, action] of Object.entries(actions)) {
            if (e.target.matches(selector)) {
                action(e.target);
                break;
            }
        }
    });


    /* 當前分類偵測 */
    jQuery('.j-cid-target').each(function () {
        let $item = jQuery(this);
        let target = $item.val(),
            name = $item.attr('name');
        jQuery(`.j-cid-goal[data-${name}="${target}"]`).addClass('active');
    });


    /* 複製連結 */
    if (navigator.clipboard && window.isSecureContext) {
        jQuery('.j-copy').on('click', function () {
            let link = location.href;
            navigator.clipboard.writeText(link).then(function () {
                /* 代碼複製成功 */
                alert('已複製連結');
            }, function () {
                alert('複製連結失敗，請與我們聯繫');
            });
        });
    } else {
        /* 瀏覽器不支援移除該按鈕 */
        jQuery('.j-copy').remove();
    }

    /* 網頁分享 */
    if (!navigator.share || !isMobileDevice()) {
        /* 不支援原生分享裝置 or 非行動裝置 */
        jQuery('.j-share').removeClass('native');
    } else {
        /* 支援原生分享裝置 */
        jQuery('.j-share').addClass('native');
    }

    jQuery('.j-share-bt').on('click', function () {
        let title = jQuery(this).data('title');
        let link = location.href;
        if (navigator.share) {
            navigator.share({
                    title: title,
                    url: link,
                }).then(() => devWarn('Successful share'))
                .catch((error) => devWarn('Error sharing', error));
        }
    });

    /* 搜尋列按鈕disable判定 */
    jQuery('.j-search-input').on('input change __init', function () {
        let $input = jQuery(this);
        let $submit = $input.closest('.j-search').find('.j-search-submit');

        if (!/\S/.test($input.val())) {
            $submit.addClass('disable');
        } else {
            $submit.removeClass('disable');
        }
    }).on('keypress', function (e) {
        if (e.key === 'Enter' && !/\S/.test(jQuery(this).val())) {
            e.preventDefault();
        }
    }).trigger('__init');

    /* 頁碼小於10補0 */
    /* jQuery('.j-page-count a').each(function () {
         let count = parseInt(jQuery(this).html());
         if (count < 10) {
             jQuery(this).html('0' + count);
         }
    }); */

    /****文字編輯器 表格處理*****/
    jQuery('.c-edit table').each(function () {
        const $table = jQuery(this);
        $table.after('<div class="c-edit__table"></div>');
        $table.next('.c-edit__table').append(jQuery(this).clone());
        $table.remove();
    });

    /****文字編輯器 img最大寬度處理*****/
    jQuery('.c-edit img').each(function () {
        const $img = jQuery(this);
        let imgW = $img.attr('width');
        imgW = imgW ? imgW + 'px' : '100%';
        $img.css('max-width', `min(100%, ${imgW})`);
    });

    /****文字編輯器 移除禁用標籤處理*****/
    jQuery('.c-edit header').each(function () {
        if (!jQuery('.c-edit header').length) return;
        let $header = jQuery(this);
        $header.after($header.html());
        $header.remove();
    });

    /****文字編輯器 iframe處理*****/
    jQuery('.c-edit iframe').each(function () {
        let $iframe = jQuery(this);
        let iframeSrc = $iframe.attr('src'),
            iframeW = $iframe.attr('width'),
            iframeH = $iframe.attr('height');

        switch (true) {
            /* Instagram */
            case iframeSrc.startsWith('https://www.instagram.com'):
                break;

                /* Youtube */
            case iframeSrc.startsWith('https://www.youtube.com'):
                let iframeWNum = iframeW || '100%';
                $iframe.after('<div class="c-edit__youtube"></div>');
                $iframe.next('.c-edit__youtube').css('max-width', `min(100%, ${iframeW}px)`).css('padding', `min(${iframeWNum * .5625}px, 56.25%) 0 0 0`).append($iframe.clone());
                $iframe.remove();
                break;

                /* 預設處理 */
            default:
                $iframe.after(`<div class="c-edit__iframe" style="padding: min(${iframeH}px, ${iframeH / iframeW * 100}%) 0 0 0;max-width:${iframeW}px;max-height:${iframeH}px;"></div>`);
                $iframe.next('.c-edit__iframe').append($iframe.clone());
                $iframe.remove();
                break;
        }
    });

    jQuery('.instagram-media').each(function () {
        jQuery(this).css('min-width', '0px');
    });

    /****resize事件****/
    ResizeHandler.init(() => {});
});

/****圖片載入判定****/
/* 非暫存寫入loading樣式 */
let $imgLoad = document.querySelectorAll('img');
[].forEach.call($imgLoad, el => {
    if (!el.complete) {
        el.classList.add('c-img-load');
    }
});

/* 載入完成移除loading樣式 */
document.querySelectorAll('.c-img-load').forEach(img => {
    img.addEventListener('load', function () {
        this.classList.remove('c-img-load');
    });
});


/* 防抖動 */
function debounce(func, delay = 1000) {
    let timer = null;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}


/* 滾動防抖動 */
function debounceScroll(callback) {
    let ticking = false;

    function handler(e) {
        if (!ticking) {
            requestAnimationFrame(() => {
                callback(e);
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('wheel', handler, {
        passive: true
    });
    window.addEventListener('touchmove', handler, {
        passive: true
    });
    window.addEventListener('scroll', handler, {
        passive: true
    });
}


/* resize事件 */
const ResizeHandler = ((direction = 'x') => {
    /* 預設時間間隔 */
    const delayDefault = 500;

    /* 防抖動 */
    const debounce = (func, delay = delayDefault) => {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    /* 預設的resize處理函式 */
    const defaultResizeEvent = () => {
        /* 頁碼上限處理 */
        pageMax();
    };

    /* 初始化方法 */
    const init = (customResizeEvent = defaultResizeEvent, debounceDelay = delayDefault) => {
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
 * css animated 循環動畫節流
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


/**
 * 開發模式警告訊息
 *
 * @access    public
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
 * @return    void
 */
function devError(message) {
    if (isDevMode) {
        console.error(message);
    }
}


/**
 * 判斷使否為IOS
 *
 * @access    public
 *
 * @return    void
 */
function isIOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPhone|iPad|iPod/.test(userAgent) && !window.MSStream;
}


/**
 * 偵測是否為行動裝置
 *
 * @access    public
 *
 * @return    void
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


/**
 * 標題等寬
 *
 * @access    public
 *
 * @return    void
 */
function sameWidth() {
    if (!jQuery('.j-sameWidth').length) return;

    jQuery('.j-sameWidth').each(function () {
        let width = [];
        jQuery(this).find('.j-sameWidth-item').removeAttr('style').each(function () {
            width.push(jQuery(this).outerWidth());
        });

        width = Math.max(...width);
        jQuery(this).find('.j-sameWidth-item').css('min-width', width);
    });
};


/**
 * 標題等高
 *
 * @access    public
 *
 * @return    void
 */
function sameHeight() {
    if (!jQuery('.j-sameHeight').length) return;

    jQuery('.j-sameHeight').each(function () {
        let height = [];
        jQuery(this).find('.j-sameHeight-item').removeAttr('style').each(function () {
            height.push(jQuery(this).outerHeight());
        });

        height = Math.max(...height);
        jQuery(this).find('.j-sameHeight-item').css('min-height', height);
    });
};


/**
 * header 滾動樣式偵測
 *
 * @access    public
 *
 * @return    void
 */
function headerScroll() {
    let $header = jQuery('header');
    let $target = jQuery('.j-headerDetect');
    let scrollVal = jQuery(window).scrollTop(),
        headerH = $header.outerHeight(),
        targetH = $target.length ? $target.outerHeight() : null;

    if (targetH !== null) {
        if (scrollVal >= targetH) {
            $header.addClass('active');
        } else {
            $header.removeClass('active');
        }
    } else {
        if (scrollVal >= headerH) {
            $header.addClass('active');
        } else {
            $header.removeClass('active');
        }
    }
}


/**
 * 頁碼上限處理
 *
 * @access    public
 *
 * @return    void
 */
function pageMax() {
    if (!jQuery('.j-page-count').length) return;
    let max = 5,
        maxPad = 5,
        maxMb = 3,
        winW = jQuery(window).width(),
        allPage = 1,
        nowPage = 1,
        show = 1,
        remainder = 0;

    if (991 < winW) {
        show = parseInt(max / 2);
        remainder = max % 2;
    } else if (991 >= winW && 575 < winW) {
        show = parseInt(maxPad / 2);
        remainder = maxPad % 2;
    } else {
        show = parseInt(maxMb / 2);
        remainder = maxMb % 2;
    }

    jQuery('.j-page-count').each(function () {
        let $count = jQuery(this);
        allPage = $count.find('a').length;
        nowPage = $count.find('a').index($count.find('a.active')) + 1;
        $count.find('a').addClass('hide');
        $count.find('a.active').removeClass('hide');

        let lastRepair = Math.max(0, show - nowPage + remainder),
            firstRepair = Math.max(0, nowPage + show - allPage);

        /* 基本狀態 */
        if (1 == remainder) {
            $count.find('a:nth-child(n+' + Math.max(1, nowPage - show - firstRepair) + '):nth-child(-n+' + Math.max(1, parseInt(nowPage + show + lastRepair)) + ')').removeClass('hide');
        } else {
            $count.find('a:nth-child(n+' + Math.max(1, nowPage - show + 1 - firstRepair) + '):nth-child(-n+' + Math.max(1, parseInt(nowPage + show + lastRepair)) + ')').removeClass('hide');
        }
    });
};


/**
 * 頁面標籤hash tag偵測
 *
 * @access    public
 *
 * @return    void
 */
function pageTag() {
    jQuery('.j-pageTag').each(function () {
        let hash = location.hash;
        let $pageTag = jQuery(this);

        jQuery('.j-pageSelect').on('change', function () {
            let link = jQuery(this).val();
            location.href = link;
        });

        if (-1 == hash.indexOf('#')) return;
        let target = hash.split('#')[1];

        if (target != $pageTag.attr('href').split('#')[1]) return;
        jQuery('.j-pageTag, .j-pageTag-box').removeClass('active');
        $pageTag.addClass('active');
        jQuery('.j-pageTag-box[data-box=\"' + target + '\"]').addClass('active');

        jQuery('.j-pageSelect').val(hash);
        jQuery('.j-pageInput').val(hash);
    });
}


/**
 * 檔案上傳
 *
 * @access    public
 *
 * @param     jQuery   target   動作目標
 *
 * @return    void
 */
function fileUploadStyle($target) {
    let file = $target.val();
    let $file = $target.closest('.j-file');
    if ('undefined' != file) {
        file = file.split('\\');
        let fileLength = file.length - 1;
        file = file[fileLength];
        $file.addClass('hasfile');
        $file.find('.j-file-item').attr('data-file', file);
    } else {
        $file.removeClass('hasfile');
        $file.find('.j-file-item').removeAttr('data-file');
    }
}


/**
 * 刪除上傳檔案樣式
 *
 * @access    public
 * @param     jQuery   target   動作目標
 *
 * @return    void
 */
function fileUploadDelStyle($target) {
    let $file = $target.closest('.j-file');
    $file.find('.j-file-input').val('');
    $file.removeClass('hasfile');
    $file.find('.j-file-item').removeAttr('data-file');
}


/**
 * 獲取網址search值
 *
 * @access    public
 * 
 * @param     string   $search      欲取得search值名稱
 *
 * @return    void
 */
function getSearch(search = '') {
    let url = new URL(location.href);
    let params = new URLSearchParams(url.search);
    let result = params.get(search);

    return result;
}


/**
 * 獲取網址hash值
 *
 * @access    public
 * 
 * @param     string   $key      欲取得hash值名稱
 *
 * @return    void
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
 * 寫入網址hash值
 *
 * @access    public
 * 
 * @param     string   $key      欲寫入hash值名稱
 * @param     string   $value    欲寫入hash值
 *
 * @return    void
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
 * HTML跳脫字元處理
 *
 * @access    public
 * 
 * @param     string   $str         編輯字串
 * @param     init     $maxLength   輸入最大長度限制
 *
 * @return    void
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
 * 非同步資料請求
 *
 * @access    public
 *
 * @return    void
 */
function makeAjaxPromise(url, data) {
    return new Promise(function (resolve, reject) {
        jQuery.makeAjax(url, data, function (respon) {
            if (respon) {
                resolve(respon);
            } else {
                reject(new Error('AJAX 錯誤：沒有取得有效資料'));
            }
        });
    });
}


/**
 * 取得雜湊值
 *
 * @access    public
 *
 * @return    hashKey
 */
function getHashKey() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return timestamp + '_' + randomNum;
}


/**
 * 返回頂部
 *
 * @access    public
 * 
 * @param     number      $speed         返回速度
 *
 * @return    void
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
 * @param     boolean      $isHeader         是否計算header高度
 *
 * @return    void
 */
function scrollDown(isHeader = false) {
    /* head高度 */
    let headHeight = 0;
    if (+isHeader) headHeight = jQuery('header').innerHeight();
    const position = jQuery('.j-scrollItem').outerHeight(true) - headHeight;
    jQuery('html, body').stop().animate({
        scrollTop: position
    }, 1000);
}


/**
 * 開關lightbox
 *
 * @access    public
 * 
 * @param     event       $e          事件物件
 * @param     string      $action     lightbox操作動作
 *
 * @return    void
 */
function actionLightbox(e, action = 'close') {
    e.preventDefault();
    if ('open' == action) {
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
 * 下拉選單連結
 *
 * @access    public
 * 
 * @param     element       $select     目標下拉選單
 *
 * @return    void
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
 * @param     string      $type         訊息類型
 * @param     object      $setting      自訂訊息
 * @param     mix         $callback1    回傳函式1
 * @param     mix         $callback2    回傳函式2
 *
 * @return    void
 */
function setDialog(type, setting, callback1, callback2) {
    const lightbox = jQuery('.j-lightbox[data-lightbox="dialog"]');

    let title = (setting && setting.title) ? setting.title : '',
        sub = (setting && setting.sub) ? setting.sub : '',
        icon = (setting && setting.icon) ? setting.icon : '',
        content = (setting && setting.content) ? setting.content : '';

    /* 開啟lightbox */
    lightbox.addClass('active');

    /* 事件綁定(確認) */
    jQuery('.j-dialog-callback1').off('click').one('click', function () {
        setDialog('clear');
        if ('function' == typeof callback1) callback1();
    });

    /* 事件綁定(取消) */
    jQuery('.j-dialog-callback2').off('click').one('click', function () {
        setDialog('clear');
        if ('function' == typeof callback2) callback2();
    });

    /* 自訂標題 */
    jQuery('.j-dialog-title').html(title);

    /* 自訂副標題 */
    jQuery('.j-dialog-sub').html(sub);

    /* 自訂icon */
    if (icon) {
        jQuery('.j-dialog-icon').attr('data-icon', icon);
    }

    /* 自訂訊息 */
    if (jQuery.isArray(content)) {
        let tempMessage = '';
        if (content.length > 1) {
            for (let i in content) {
                tempMessage += (parseInt(i, 10) + 1) + '. ' + content[i] + "<br>";
            }
        } else {
            tempMessage = content[0];
        }
        content = tempMessage;
    }
    jQuery('.j-dialog-content').html(content);

    /* 訊息框類型 */
    switch (type) {
        case 'confirm':
            jQuery('.j-dialog-callback1, .j-dialog-callback2').css('display', 'flex');
            break;
        case 'message':
            jQuery('.j-dialog-callback1, .j-dialog-callback2').hide();
            break;
        case 'alert':
            jQuery('.j-dialog-callback1').css('display', 'flex');
            jQuery('.j-dialog-callback2').hide();
            break;
        case 'loading':
            /* 初始重置 */
            setDialog('clear');
            break;
        case 'clear':
            lightbox.removeClass('active');
            /* 標題、文字訊息清空 */
            jQuery('.j-dialog-title, .j-dialog-sub, .j-dialog-text').html();
            /* icon樣式移除 */
            jQuery('.j-dialog-icon').removeAttr('data-icon');
            /* 移除事件並隱藏 */
            jQuery('.j-dialog-callback1').off('click').hide().find('span').html('確定');
            /* 移除事件並隱藏 */
            jQuery('.j-dialog-callback2').off('click').hide().find('span').html('取消');
            break;
        default:
            alert('指定錯誤彈跳視窗類型：' + type);
            break;
    }
}