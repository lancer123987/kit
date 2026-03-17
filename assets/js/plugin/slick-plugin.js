/**
 * @description jQuery Slick 擴充外掛
 * @version     1.0.1
 * @author      Lancer
 * @updated     2026-02-21
 * @dependency  jQuery 3.5.1+, slick 1.9, core.js
 *
 */

/* slick plugin lists */
const slickPlugin_SET = new Set([
    'count',
    'customArrow',
    'progress',
    'media'
]);

/* slick 事件列表 */
const slickEvents_SET = new Set([
    'afterChange',
    'beforeChange',
    'breakpoint',
    'destroy',
    'edge',
    'init',
    'lazyLoaded',
    'lazyLoadError',
    'reInit',
    'setPosition',
    'swipe'
]);

/**
 * jQuery Slick 擴充初始化
 *
 * @access    public
 * @param     {object}  config            配置物件
 * @param     {object}  config.settings   Slick 原生參數
 * @param     {object}  config.events     Slick 原生事件
 * @param     {object}  config.plugin     擴充功能控制
 *
 * @return    {jQuery}
 */
jQuery.fn.initSlick = function (config = {}) {
    const $slick = this;
    const { settings = {}, events = {}, plugin = {} } = config;

    if (!$slick.length) {
        const selector = $slick.selector || 'Unknown Selector';
        devError(`[Slick Init] Target element not found: "${selector}". Initialization aborted.`);
        return $slick;
    }

    /* 預設原生參數 */
    const baseSettings = {
        slidesToScroll: 1,
        touchThreshold: 100,
        pauseOnFocus: false,
        pauseOnHover: false,
        pauseOnDotsHover: false
    };

    $slick.each(function () {
        const $this = jQuery(this);

        /* 防止重複初始化 */
        if ($this.hasClass('slick-initialized')) {
            devWarn('[Slick Init] Element already initialized. Skipping.');
            return true;
        }

        const finalSettings = jQuery.extend({}, baseSettings, settings);
        const eventLists = (null !== events && 'object' === typeof events) ? events : {};

        /* 擴充功能設定 */
        const conf = jQuery.extend({
            count: null,
            countZero: false,
            customArrow: null
        }, plugin);

        /* 防呆機制：強制 slidesToShow >= slidesToScroll */
        const slidesToShow = finalSettings.slidesToShow || 1;
        const slidesToScroll = finalSettings.slidesToScroll || 1;

        if (slidesToScroll > slidesToShow) {
            devWarn(`[Slick Init] slidesToScroll (${slidesToScroll}) cannot be greater than slidesToShow (${slidesToShow}). Resetting slidesToScroll to ${slidesToShow}.`);
            finalSettings.slidesToScroll = slidesToShow;
        }

        /* 自動撥放data偵測(權重大於原生參數) */
        const dataAutoplay = $this.data('autoplay');
        if ('undefined' !== typeof dataAutoplay) {
            finalSettings.autoplay = (true === dataAutoplay || 'true' === dataAutoplay || 1 === dataAutoplay);
        }

        /* 綁定原生事件 */
        if (null !== events && 'object' === typeof events) {
            Object.keys(events).forEach((eventName) => {
                if (slickEvents_SET.has(eventName) && 'function' === typeof events[eventName]) {
                    $this.on(`${eventName}.slickExtend`, events[eventName]);
                }
            });
        }

        /* 擴充功能 */
        slickPlugin($this, conf, slickPlugin_SET);

        /* 啟動slick */
        $this.slick(finalSettings);
    });

    return $slick;
};


/**
 * slick 計數器處理
 *
 * @access    public
 *
 * @param     {object}   slick       slick 實例
 * @param     {jQuery}   $count      計數器 DOM
 * @param     {object}   info        狀態資訊 (包含 next 等)
 * @param     {boolean}  isZero      是否補零
 *
 * @return    {void}
 */
function handleSlickCount (slick, $count, info = {next: 0}, isZero = false) {
    if (!slick) return;

    const slideCount = slick.slideCount;
    const slidesToScroll = slick.options.slidesToScroll || 1;
    const slidesToShow = slick.options.slidesToShow || 1;

    let totalNum = 0;
    if (slidesToShow >= slideCount) {
        totalNum = 1;
    } else {
        /* 確保不滿一組捲動跨度的剩餘內容也能佔據一頁 */
        totalNum = Math.ceil((slideCount - slidesToShow) / slidesToScroll) + 1;
    }

    /* 當前頁碼計算：
     * 以當前索引值 info.next 除以捲動單位並無條件進位。
     */
    let currentNum = Math.ceil(info.next / slidesToScroll) + 1;

    /* 修正超過總頁數的情況（Slick 在最後一頁有時會因對齊調整索引） */
    if (currentNum > totalNum) {
        currentNum = totalNum;
    }

    /* 處理補零 */
    let displayTotal = totalNum;
    let displayCurrent = currentNum;

    if (isZero) {
        if (10 > displayTotal) {
            displayTotal = '0' + displayTotal;
        }
        if (10 > displayCurrent) {
            displayCurrent = '0' + displayCurrent;
        }
    }

    /* 更新 DOM 顯示 */
    $count.find('.j-slickCount-total').text(displayTotal);
    $count.find('.j-slickCount-current').text(displayCurrent);
};


/**
 * slick 自定義箭頭
 *
 * @access    public
 *
 * @param     {object}     slick       slick 實例
 * @param     {jQuery}     $btn        切換按鈕
 * @param     {number}     nextSlide   下一則輪播序 (選填)
 *
 * @return    {void}
 */
function handleCustomArrow (slick, $btn, nextSlide) {
    let current = ('undefined' !== typeof nextSlide) ? nextSlide : (slick.currentSlide || 0);
    let isInfinite = slick.options.infinite;
    let show = slick.options.slidesToShow || 1;
    let totalSlides = slick.slideCount;

    /* 顯示數量 >= 總量 時隱藏按鈕 */
    $btn.toggleClass('hide', show >= totalSlides);

    /* infinite 不觸發 disable */
    if (isInfinite) {
        $btn.removeClass('disable');
        return;
    }

    /* 更新前後箭頭的 disable 狀態 */
    $btn.filter('[data-type="prev"]').toggleClass('disable', 0 === current);
    $btn.filter('[data-type="next"]').toggleClass('disable', current + show >= totalSlides);
};


/**
 * slick 媒體控制 (播放/暫停)
 *
 * @access    public
 *
 * @param     {object}   slick        slick 實例
 * @param     {string}   action       動作類型 ('play' | 'pause')
 *
 * @return    {void}
 */
function handleMedia(slick, action) {
    if (!slick) return;

    const $container = slick.$slider;

    /* 所有媒體項目 */
    const $allMedia = $container.find('video, audio, iframe');

    /* 沒有媒體項目返回 */
    if (!$allMedia.length) return;

    const isPlay = ('play' === action);
    const slidesToShow = slick.options.slidesToShow || 1;

    /* 暫停動作 */
    if (!isPlay) {
        executeMediaAction($allMedia, 'pause');
        return;
    }

    /* 可視項目 */
    const $activeSlides = $container.find('.slick-active');
    /* 可視項目媒體 */
    const $activeMedia = $activeSlides.find('video, audio, iframe');

    /* 檢查可視項目下是否有媒體，如果是播放動作但沒媒體就返回 */
    if (!$activeMedia.length) return;

    /* 針對當前項目自動撥放 */
    if (1 === slidesToShow && isPlay) {
        executeMediaAction($activeMedia, 'play');
    }
}


/**
 * 執行媒體動作 (播放/暫停)
 *
 * @access    public
 *
 * @param     {jQuery|Element}  slide    動作目標
 * @param     {string}          action   動作類型 ('play' | 'pause')
 */
function executeMediaAction(target, action) {
    if (!target || !action) return;

    const $target = jQuery(target);
    const isPlay = ('play' === action);

    /* 取得所有符合條件的媒體項目 */
    const $mediaElements = $target.find('video, audio, iframe').addBack('video, audio, iframe');


    $mediaElements.each(function () {
        const media = this;
        const $this = jQuery(media);
        const tag = media.tagName.toLowerCase();

        /* 是否需要觸發自動播放 */
        const shouldAutoplay = !!$this.data('autoplay');

        /* 如果是執行播放，但該媒體沒有自動播放意圖，直接跳過 */
        if (isPlay && !shouldAutoplay) return true;

        /* HTML5 媒體 (video / audio) */
        if ('video' === tag || 'audio' === tag) {
            if (isPlay) {
                /* 自動補完：靜音與行內播放 */
                media.muted = true;
                if ('video' === tag) {
                    $this.attr('playsinline', 'true');
                }
            }

            if ('function' === typeof media[action]) {
                media[action]();
            }
        }

        /* iframe --- */
        if ('iframe' === tag) {
            const src = $this.attr('src');
            const domain = getDomainName(src);
            if (!src || !domain) return true;

            const commands = {
                youtube: isPlay ? 'playVideo' : 'pauseVideo',
                vimeo: isPlay ? 'play' : 'pause'
            };

            let message = null;

            switch (domain) {
                case 'youtube.com':
                case 'youtube-nocookie.com':
                case 'youtu.be':
                    if (src.includes('enablejsapi=1')) {
                        /* 播放時補一個靜音，確保能成功播放 */
                        if (isPlay) {
                            media.contentWindow.postMessage(JSON.stringify({
                                event: 'command',
                                func: 'mute',
                                args: ''
                            }), '*');
                        }
                        message = { event: 'command', func: commands.youtube, args: '' };
                    } else if (!isPlay) {
                        devWarn(`[Media Action] YouTube iframe missing "enablejsapi=1": ${src}`);
                    }
                    break;

                case 'vimeo.com':
                case 'player.vimeo.com':
                    message = { method: commands.vimeo };
                    break;
            }

            if (message && media.contentWindow) {
                media.contentWindow.postMessage(JSON.stringify(message), '*');
            }
        }
    });
}


/**
 * slick 擴充功能控制
 *
 * @param {jQuery} $this     slick 實體
 * @param {object} conf      擴充功能配置
 * @param {array}  active    要啟用的功能列表
 */
function slickPlugin($this, conf, active = []) {
    const plugins = {
        /* 計數器功能 */
        count: () => {
            if (!conf.count) return;
            const $count = (conf.count instanceof jQuery) ? conf.count : jQuery(conf.count);

            /* 沒有指定 DOM 返回 */
            if (!$count || 0 === $count.length) {
                devWarn('[Slick Init] Count target element not found.');
                return;
            }

            $this.on('init.slickExtend breakpoint.slickExtend', (event, slick) => {
                handleSlickCount(slick, $count, {next: slick.currentSlide}, conf.countZero);
            }).on('beforeChange.slickExtend', (event, slick, currentSlide, nextSlide) => {
                handleSlickCount(slick, $count, {next: nextSlide}, conf.countZero);
            });
        },
        /* 進度條 */
        progress: () => {
            if (!conf.progress) return;
            const $progress = (conf.progress instanceof jQuery) ? conf.progress : jQuery(conf.progress);

            /* 沒有指定 DOM 返回 */
            if (!$progress || 0 === $progress.length) {
                devWarn('[Slick Init] Progress target element not found.');
                return;
            } 

            $this.on('init.slickExtend breakpoint.slickExtend', (event, slick) => {
                let speed = slick.options.autoplaySpeed ?? 3000;
                let autoplaySpeedTime = speed / 1000;
                $progress.css('--autoplaySpeedTime', `${autoplaySpeedTime}s`).addClass('run');              
            }).on('beforeChange.slickExtend', (event, slick, currentSlide, nextSlide) => {
               $progress.removeClass('run');
            }).on('afterChange.slickExtend', (event, slick, currentSlide, nextSlide) => {
               $progress.addClass('run');
            });
        },
        /* 自訂義箭頭 */
        customArrow: () => {
            if (!conf.customArrow) return;
            const $btn = (conf.customArrow instanceof jQuery) ? conf.customArrow : jQuery(conf.customArrow);

            /* 沒有指定 DOM 返回 */
            if (!$btn || 0 === $btn.length) {
                devWarn('[Slick Media] Custom arrow buttons not found in DOM.');
                return;
            }

            /* 紀錄關聯箭頭資訊 */
            $this.data('slick-custom-btns', $btn);

            /* 綁定事件 */
            $btn.off('click.slickExtend').on('click.slickExtend', function () {
                if ('prev' === jQuery(this).data('type')) {
                    $this.slick('slickPrev');
                } else {
                    $this.slick('slickNext');
                }
            });

            $this.on('init.slickExtend breakpoint.slickExtend', (event, slick) => {
                handleCustomArrow(slick, $btn);
            }).on('beforeChange.slickExtend', (event, slick, currentSlide, nextSlide) => {
                handleCustomArrow(slick, $btn, nextSlide);
            });
        },
        /* 媒體自動撥放 */
        media: () => {
            $this.on('beforeChange.slickExtend', (event, slick) => {
                handleMedia(slick, 'pause');
            }).on('setPosition.slickExtend afterChange.slickExtend', (event, slick) => {
                handleMedia(slick, 'play');
            });
        }
    };

    /* 啟用擴充功能 */
    active.forEach((pluginName) => {
        if ('function' === typeof plugins[pluginName]) {
            plugins[pluginName]();
        }
    });
};


/**
 * 銷毀 slick 與擴充功能綁定
 *
 * @access    public
 *
 * @return    {jQuery}
 */
jQuery.fn.destroySlick = function () {
    return this.each(function () {
        const $this = jQuery(this);

        /* 僅針對已初始化的元素進行銷毀 */
        if ($this.hasClass('slick-initialized')) {
            /* 移除關聯箭頭 */
            const $btn = $this.data('slick-custom-btns');
            if ($btn && $btn.length) {
                $btn.off('.slickExtend');
            }

            /* 移除 slick 擴充事件 & 原生銷毀 */
            $this.off('.slickExtend').slick('unslick');
        } else {
            devWarn('[Slick Destroy] Target element is not a slick instance or already destroyed.');
        }
    });
};