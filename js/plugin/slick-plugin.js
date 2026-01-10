/**
 * 計數器初始化
 *
 * @access    public
 *
 * @param     mix         $box         計數器容器
 * @param     number      current      slick當前項目
 * @param     number      total        slick項目總數
 * @param     boolean     isZero       是否補零
 *
 * @return    void
 */
function slickCountInit($box, current, total, isZero = false) {
    let currentNum = current + 1;
    let totalNum = total;

    if (isZero) {
        /* 若要補零，則在小於10時補上前導零 */
        if (total < 10) totalNum = '0' + total;
        if (currentNum < 10) currentNum = '0' + currentNum;
    }

    $box.find('.j-slickCount-total').text(totalNum);
    $box.find('.j-slickCount-current').text(currentNum);
}


/**
 * 計數器切換
 *
 * @access    public
 *
 * @param     mix         $box     計數器容器
 * @param     number      next     slick下一個項目
 * @param     boolean     isZero   是否補零
 *
 * @return    void
 */
function slickCountChange($box, next, isZero = false) {
    $box.find('.j-slickCount-current').text(
        isZero && next < 9 ? '0' + (next + 1) : next + 1
    );
}


/**
 * 箭頭事件綁定&初始化disable判定
 *
 * @access    public
 *
 * @param     mix       $slick     目標輪播
 * @param     mix       $btn       切換按鈕
 *
 * @return    void
 */
function initSlickArrowEvent($slick, $btn) {
    /* 輪播是否循環 */
    let isInfinite = $slick.slick('slickGetOption', 'infinite');
    /* 當前輪播序 */
    let current = $slick.slick('slickCurrentSlide') || 0;

    /* 綁定事件 */
    $btn.off('click').on('click', function () {
        if ('prev' == jQuery(this).data('type')) {
            $slick.slick('slickPrev');
        } else {
            $slick.slick('slickNext');
        }
    });

    /* 總數量小於顯示數量不顯示箭頭 */
    let show = $slick.slick('slickGetOption', 'slidesToShow') || 1;
    let totalSlides = $slick.find('.slick-slide').length;

    if (show >= totalSlides) {
        $btn.addClass('hide');
    } else {
        $btn.removeClass('hide');
    }

    if (isInfinite) return;
    if (!current) $btn.filter('[data-type="prev"]').addClass('disable');
}


/**
 * 箭頭disable判斷
 *
 * @access    public
 *
 * @param     mix       $slick     目標輪播
 * @param     mix       $btn       切換按鈕
 * @param     number    nextSlide  下一則輪播序
 *
 * @return    void
 */
function slickArrowDisable($slick, $btn, nextSlide) {
    /* 輪播是否循環 */
    let isInfinite = $slick.slick('slickGetOption', 'infinite');
    if (isInfinite) return;

    /* 輪播每次滑動顯示數量 */
    let show = $slick.slick('slickGetOption', 'slidesToShow') || 1;
    let totalSlides = $slick.find('.slick-slide').length;

    $btn.filter('[data-type="prev"]').toggleClass('disable', nextSlide === 0);
    $btn.filter('[data-type="next"]').toggleClass('disable', nextSlide + show === totalSlides);
}