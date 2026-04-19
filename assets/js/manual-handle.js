/**========================================================================
 *
 * @description 說明書主控邏輯
 * @version     1.0.0
 * @dependency  core.js, core-template.js, slick-plugi-template.js
 *
 * 本檔負責：
 *   1. 讀取各 template JS 注入的 window.DOCS_NAV
 *   2. 渲染側欄導覽
 *   3. 切換主內容（clone <template> 元素）
 *   4. 搜尋過濾
 *
 *
 * ★ 新增頁面：不需修改本檔
 *   → 只需在對應的 template JS 新增 nav 項目與 HTML 內容
 *
 *========================================================================*/

(function () {

    /* 目前顯示的頁面 id */
    let currentId = '';


    /**
     * 渲染側欄導覽
     * 依 window.DOCS_NAV 順序產生群組與連結，相同 group 自動合併
     *
     * @return {void}
     */
    function renderNav() {
        const $menu  = document.querySelector('.j-aside-menu');
        const navList = window.DOCS_NAV || [];

        /* 依 group 合併，保留順序 */
        const groups     = {};
        const groupOrder = [];

        navList.forEach((item) => {
            if (!groups[item.group]) {
                groups[item.group] = [];
                groupOrder.push(item.group);
            }
            groups[item.group].push(item);
        });

        /* 產生 DOM */
        groupOrder.forEach((groupName) => {
            const $box = document.createElement('div');
            $box.className = 'c-aside__menu__box show';

            const $title = document.createElement('p');
            $title.className   = 'c-aside__menu__title';
            $title.textContent = groupName;
            $box.appendChild($title);

            groups[groupName].forEach((item) => {
                const $link = document.createElement('a');
                $link.className        = 'c-aside__menu__link';
                $link.dataset.target   = item.id;
                $link.dataset.keywords = item.keywords || '';
                $link.textContent      = item.label;
                $link.href             = 'javascript:;';

                $link.addEventListener('click', () => {
                    showSection(item.id);
                });

                $box.appendChild($link);
            });

            $menu.appendChild($box);
        });

        /* 預設顯示第一項 */
        if (navList.length) {
            currentId = navList[0].id;
            showSection(currentId);
        }
    }


    /**
     * 切換主內容
     * 從 <template id="tpl-{targetId}"> clone 內容後渲染至 .j-manual
     *
     * @param {string} targetId
     * @return {void}
     */
    function showSection(targetId) {
        const $tpl = document.getElementById('tpl-' + targetId);
        if (!$tpl) {
            devWarn('[manual-handle] template not found: tpl-' + targetId);
            return;
        }

        /* 渲染內容 */
        const $manual = document.querySelector('.j-manual');
        $manual.innerHTML = '';
        $manual.appendChild($tpl.content.cloneNode(true));

        /* 更新 nav 狀態 */
        document.querySelectorAll('.c-aside__menu__link').forEach((el) => {
            el.classList.remove('active');
        });

        const $activeLink = document.querySelector('.c-aside__menu__link[data-target="' + targetId + '"]');
        if ($activeLink) $activeLink.classList.add('active');

        currentId = targetId;
        window.scrollTo(0, 0);
    }


    /**
     * 搜尋過濾
     * 符合條件的群組加 .show，link 用 display 控制顯隱
     * 「找不到」訊息由 CSS :not(:has(.show))::after 負責，JS 不處理
     *
     * @return {void}
     */
    function initSearch() {
        const $input = document.querySelector('.j-search');
        if (!$input) return;

        $input.addEventListener('input', function () {
            const query   = this.value.trim().toLowerCase();
            const $groups = document.querySelectorAll('.c-aside__menu__box');

            /* 清空狀態 */
            if (!query) {
                $groups.forEach((g) => {
                    g.classList.add('show');
                    g.querySelectorAll('.c-aside__menu__link').forEach((el) => {
                        el.style.display = '';
                    });
                });
                return;
            }

            $groups.forEach((group) => {
                let groupHit = false;

                group.querySelectorAll('.c-aside__menu__link').forEach((item) => {
                    const label    = item.textContent.toLowerCase();
                    const keywords = (item.dataset.keywords || '').toLowerCase();
                    const hit      = label.includes(query) || keywords.includes(query);
                    item.style.display = hit ? '' : 'none';
                    if (hit) groupHit = true;
                });

                /* .show 控制群組顯隱，CSS :has() 依此判斷是否顯示「找不到」 */
                group.classList.toggle('show', groupHit);
            });
        });
    }


    /* ── 初始化 ── */
    renderNav();
    initSearch();

})();
