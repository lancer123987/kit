jQuery(document).ready(function () {
    /* Passive event listeners */
    (() => {
        const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
        passiveEvents.forEach((eventName) => {
            jQuery.event.special[eventName] = {
                setup: function (_, ns, handle) {
                    const isPassive = ('wheel' === eventName || 'mousewheel' === eventName);
                    this.addEventListener(eventName, handle, {
                        passive: isPassive
                    });
                }
            };
        });
    })();

    /* 進場動畫效果初始化 */
    observable.init({
        target: '.wow',
        onEnter: (el) => {
            el.style.visibility = 'visible';
            el.classList.add('animated');
        }
    });

    /* 循環動畫效能優化 (可視偵測) */
    observeInfAnim();

    /* header 滾動樣式偵測 */
    headerScroll();


    observeScroll(() => {
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
    ResizeHandler.init(() => {
        /* 頁碼上限處理 */
        pageMax();
    });
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