/**========================================================================
 *
 * @description 說明書主控邏輯
 * @version     2.0.0
 * @dependency  core.js, core-template.js, slick-plugi-template.js
 *
 * 負責：
 *   1. 讀取各 template JS 注入的 window.DOCS_NAV
 *   2. 渲染側欄導覽（group → sub → link）
 *   3. 切換主內容 + 錨點捲動
 *   4. 搜尋過濾（link 層級，box 為顯隱單位）
 *
 * ★ 新增頁面：不需修改本檔
 *   → 只需在對應 template JS 新增 NAV 資料與 HTML 內容
 *
 *========================================================================*/

(function () {

    /* 目前載入的頁面 id */
    let currentId = '';


    /**
     * 渲染側欄導覽
     * 依 window.DOCS_NAV 格式：[{ group, subs: [{ sub, links: [{ id, anchor, label, keywords }] }] }]
     *
     * @return {void}
     */
    function renderNav() {
        const $menu  = document.querySelector('.j-aside-menu');
        const navList = window.DOCS_NAV || [];

        navList.forEach((groupData) => {
            /* group title */
            const $title = document.createElement('p');
            $title.className   = 'c-aside__menu__title';
            $title.textContent = groupData.group;
            $menu.appendChild($title);

            /* subs */
            groupData.subs.forEach((subData) => {
                const $box = document.createElement('div');
                $box.className = 'c-aside__menu__box show';

                /* sub title */
                const $subTitle = document.createElement('p');
                $subTitle.className   = 'c-aside__menu__box__title';
                $subTitle.textContent = subData.sub;
                $box.appendChild($subTitle);

                /* links */
                subData.links.forEach((item) => {
                    const $link = document.createElement('a');
                    $link.className        = 'c-aside__menu__box__link c-aside__menu__link';
                    $link.href             = 'javascript:;';
                    $link.textContent      = item.label;
                    $link.dataset.id       = item.id;
                    $link.dataset.anchor   = item.anchor || '';
                    $link.dataset.keywords = item.keywords || '';

                    $link.addEventListener('click', () => {
                        showSection(item.id, item.anchor || '');
                    });

                    $box.appendChild($link);
                });

                $menu.appendChild($box);
            });
        });

        /* 預設顯示第一項 */
        const firstLink = navList[0] && navList[0].subs[0] && navList[0].subs[0].links[0];
        if (firstLink) {
            showSection(firstLink.id, firstLink.anchor || '');
        }
    }


    /**
     * 切換主內容並捲動至錨點
     * 同頁面只捲動，不重新 clone template
     *
     * @param {string} id      template id
     * @param {string} anchor  頁內錨點 id（可為空字串）
     * @return {void}
     */
    function showSection(id, anchor) {
        /* 同頁面 → 只捲動 + 更新 active */
        if (id === currentId) {
            if (anchor) {
                scrollToAnchor(anchor);
            } else {
                window.scrollTo(0, 0);
            }
            updateActive(id, anchor);
            return;
        }

        const $tpl = document.getElementById('tpl-' + id);
        if (!$tpl) {
            devWarn('[manual-handle] template not found: tpl-' + id);
            return;
        }

        /* clone template 渲染 */
        const $manual = document.querySelector('.j-manual');
        $manual.innerHTML = '';
        $manual.appendChild($tpl.content.cloneNode(true));

        currentId = id;
        updateActive(id, anchor);

        if (anchor) {
            /* 等 DOM 渲染後才捲 */
            setTimeout(() => { scrollToAnchor(anchor); }, 50);
        } else {
            window.scrollTo(0, 0);
        }
    }


    /**
     * 捲動至頁內錨點
     *
     * @param {string} anchor  目標元素 id
     * @return {void}
     */
    function scrollToAnchor(anchor) {
        const el = document.getElementById(anchor);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }


    /**
     * 更新側欄 active 狀態
     *
     * @param {string} id
     * @param {string} anchor
     * @return {void}
     */
    function updateActive(id, anchor) {
        document.querySelectorAll('.c-aside__menu__link').forEach((el) => {
            el.classList.remove('active');
        });

        let selector = '.c-aside__menu__link[data-id="' + id + '"][data-anchor="' + (anchor || '') + '"]';
        const $active = document.querySelector(selector);
        if ($active) $active.classList.add('active');
    }


    /**
     * 搜尋過濾
     * 逐 link 比對，box 為顯隱單位
     * 「找不到」由 CSS :not(:has(.show))::after 負責，JS 不處理
     *
     * @return {void}
     */
    function initSearch() {
        const $input = document.querySelector('.j-search');
        if (!$input) return;

        $input.addEventListener('input', function () {
            const query  = this.value.trim().toLowerCase();
            const $boxes = document.querySelectorAll('.c-aside__menu__box');

            /* 清空 → 全部顯示 */
            if (!query) {
                $boxes.forEach((box) => {
                    box.classList.add('show');
                    box.querySelectorAll('.c-aside__menu__box__link').forEach((link) => {
                        link.style.display = '';
                    });
                });
                return;
            }

            $boxes.forEach((box) => {
                let boxHit = false;

                box.querySelectorAll('.c-aside__menu__box__link').forEach((link) => {
                    const label    = link.textContent.toLowerCase();
                    const keywords = (link.dataset.keywords || '').toLowerCase();
                    const hit      = label.includes(query) || keywords.includes(query);
                    link.style.display = hit ? '' : 'none';
                    if (hit) boxHit = true;
                });

                /* .show 控制 box 顯隱，CSS :has() 依此判斷「找不到」 */
                box.classList.toggle('show', boxHit);
            });
        });
    }


    /* ── 初始化 ── */
    renderNav();
    initSearch();

})();
