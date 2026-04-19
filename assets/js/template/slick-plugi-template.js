/**========================================================================
 *
 * @description slick-plugin.js 說明書內容
 * @dependency   manual-handle.js
 *
 * 新增項目：
 *   1. 在 NAV 陣列加一筆物件
 *   2. 在 TEMPLATES 物件加對應的 key 與 HTML 字串
 *
 *========================================================================*/

(function () {

    /* ── 導覽項目 ── */
    const NAV = [
        { id: 'slick-overview', label: '概覽 & 依賴', group: 'slick-plugin.js', keywords: 'slick 概覽 dependency initSlick 外掛' },
        { id: 'slick-init', label: 'initSlick()', group: 'slick-plugin.js', keywords: 'initSlick 初始化 settings events plugin config' },
        { id: 'slick-destroy', label: 'destroySlick()', group: 'slick-plugin.js', keywords: 'destroySlick 銷毀 destroy' },
        { id: 'slick-count', label: 'Plugin: count', group: 'slick-plugin.js', keywords: 'handleSlickCount count 計數器 頁碼 補零' },
        { id: 'slick-arrow', label: 'Plugin: customArrow', group: 'slick-plugin.js', keywords: 'handleCustomArrow customArrow 箭頭 prev next disable' },
        { id: 'slick-progress', label: 'Plugin: progress', group: 'slick-plugin.js', keywords: 'progress 進度條 autoplaySpeed' },
        { id: 'slick-media', label: 'Plugin: media', group: 'slick-plugin.js', keywords: 'handleMedia executeMediaAction media video audio iframe youtube vimeo 媒體 播放 暫停' },
    ];

    /* ── 頁面內容 ── */
    const TEMPLATES = {
        'slick-overview': `
<article class="m-section">

    <span class="m-tag">slick-plugin.js</span>
    <h1 class="m-h1">概覽 &amp; 依賴</h1>
    <p class="m-lead">基於 jQuery Slick 的擴充外掛，提供計數器、自訂箭頭、進度條與媒體自動播放等功能，統一透過 <code class="m-code">$.fn.initSlick()</code> 一次配置。</p>

    <h2 class="m-h2">依賴</h2>
    <table class="m-table">
        <thead><tr><th>套件</th><th>版本</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">jQuery</code></td><td><span class="m-type">3.5.1+</span></td><td>必須先於本檔載入。</td></tr>
            <tr><td><code class="m-code">slick</code></td><td><span class="m-type">1.9</span></td><td>必須先於本檔載入。</td></tr>
            <tr><td><code class="m-code">core.js</code></td><td>—</td><td><code class="m-code">devWarn</code>、<code class="m-code">devError</code>、<code class="m-code">getDomainName</code> 來源。</td></tr>
        </tbody>
    </table>

    <h2 class="m-h2">擴充 Plugin 列表</h2>
    <table class="m-table">
        <thead><tr><th>Plugin</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">count</code></td><td>顯示當前頁碼與總頁數，支援補零。</td></tr>
            <tr><td><code class="m-code">customArrow</code></td><td>自訂義前後箭頭，自動處理 disable / hide 狀態。</td></tr>
            <tr><td><code class="m-code">progress</code></td><td>自動播放進度條 CSS 動畫控制。</td></tr>
            <tr><td><code class="m-code">media</code></td><td>切換時自動播放/暫停 video、audio、YouTube、Vimeo iframe。</td></tr>
        </tbody>
    </table>
</article>
        `,
        'slick-init': `
<article class="m-section">

    <span class="m-tag">slick-plugin.js</span>
    <h1 class="m-h1">initSlick()</h1>
    <p class="m-lead"><code class="m-code">$.fn.initSlick(config)</code> 是本外掛的統一入口，取代直接呼叫 <code class="m-code">$.fn.slick()</code>，整合原生設定、事件綁定與擴充功能。</p>

    <h2 class="m-h2">config 物件</h2>

    <h3 class="m-h3">config.settings</h3>
    <p class="m-p">對應所有 Slick 原生參數。本外掛預設覆寫以下幾項：</p>
    <table class="m-table">
        <thead><tr><th>參數</th><th>預設值</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">slidesToScroll</code></td><td><code class="m-code">1</code></td></tr>
            <tr><td><code class="m-code">touchThreshold</code></td><td><code class="m-code">100</code></td></tr>
            <tr><td><code class="m-code">pauseOnFocus</code></td><td><code class="m-code">false</code></td></tr>
            <tr><td><code class="m-code">pauseOnHover</code></td><td><code class="m-code">false</code></td></tr>
            <tr><td><code class="m-code">pauseOnDotsHover</code></td><td><code class="m-code">false</code></td></tr>
        </tbody>
    </table>

    <div class="m-callout m-callout--info">
        <span class="m-callout__icon">ℹ</span>
        <p><code class="m-code">slidesToScroll</code> 不可大於 <code class="m-code">slidesToShow</code>，若違反此規則會自動修正並觸發 <code class="m-code">devWarn</code>。元素上的 <code class="m-code">data-autoplay</code> 屬性權重高於 settings 中的 <code class="m-code">autoplay</code>。</p>
    </div>

    <h3 class="m-h3">config.events</h3>
    <p class="m-p">Slick 原生事件的綁定物件，key 為事件名稱、value 為 handler。</p>
    <p class="m-p">支援事件：<code class="m-code">afterChange</code>、<code class="m-code">beforeChange</code>、<code class="m-code">breakpoint</code>、<code class="m-code">destroy</code>、<code class="m-code">edge</code>、<code class="m-code">init</code>、<code class="m-code">lazyLoaded</code>、<code class="m-code">lazyLoadError</code>、<code class="m-code">reInit</code>、<code class="m-code">setPosition</code>、<code class="m-code">swipe</code>。</p>

    <h3 class="m-h3">config.plugin</h3>
    <table class="m-table">
        <thead><tr><th>參數</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">count</code></td><td><span class="m-type">string | jQuery | null</span></td><td>計數器 DOM 選擇器或 jQuery 物件。</td></tr>
            <tr><td><code class="m-code">countZero</code></td><td><span class="m-type">boolean</span></td><td>計數器是否補零（<code class="m-code">01/09</code>）。預設 <code class="m-code">false</code>。</td></tr>
            <tr><td><code class="m-code">customArrow</code></td><td><span class="m-type">string | jQuery | null</span></td><td>自訂箭頭按鈕的選擇器或 jQuery 物件。需搭配 <code class="m-code">data-type="prev"</code>/<code class="m-code">"next"</code>。</td></tr>
            <tr><td><code class="m-code">progress</code></td><td><span class="m-type">string | jQuery | null</span></td><td>進度條 DOM 選擇器或 jQuery 物件。</td></tr>
        </tbody>
    </table>

    <div class="m-callout m-callout--info">
        <span class="m-callout__icon">ℹ</span>
        <p><code class="m-code">media</code> plugin 無須額外配置，設定後自動掛載。媒體元素需設定 <code class="m-code">data-autoplay</code> 才會被播放。</p>
    </div>

    <h2 class="m-h2">完整範例</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">$</span>(<span class="t-str">'.j-slider'</span>).<span class="t-fn">initSlick</span>({
    settings: {
        slidesToShow: <span class="t-num">1</span>,
        autoplay: <span class="t-bool">true</span>,
        autoplaySpeed: <span class="t-num">4000</span>,
        infinite: <span class="t-bool">true</span>,
        dots: <span class="t-bool">false</span>
    },
    events: {
        <span class="t-fn">afterChange</span>(event, slick, currentSlide) {
            console.<span class="t-fn">log</span>(<span class="t-str">'當前張數:'</span>, currentSlide);
        }
    },
    plugin: {
        count:       <span class="t-str">'.j-slider-count'</span>,
        countZero:   <span class="t-bool">true</span>,
        customArrow: <span class="t-str">'.j-slider-arrow'</span>,
        progress:    <span class="t-str">'.j-slider-progress'</span>
    }
});</pre>
    </div>

    <h2 class="m-h2">對應 HTML 結構</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">&lt;!-- 輪播容器 --&gt;</span>
&lt;<span class="t-kw">div</span> <span class="t-prop">class</span>=<span class="t-str">"j-slider"</span>&gt;
    &lt;<span class="t-kw">div</span>&gt;slide 1&lt;/<span class="t-kw">div</span>&gt;
    &lt;<span class="t-kw">div</span>&gt;slide 2&lt;/<span class="t-kw">div</span>&gt;
&lt;/<span class="t-kw">div</span>&gt;

<span class="t-cmt">&lt;!-- 計數器 --&gt;</span>
&lt;<span class="t-kw">div</span> <span class="t-prop">class</span>=<span class="t-str">"j-slider-count"</span>&gt;
    &lt;<span class="t-kw">span</span> <span class="t-prop">class</span>=<span class="t-str">"j-slickCount-current"</span>&gt;&lt;/<span class="t-kw">span</span>&gt; /
    &lt;<span class="t-kw">span</span> <span class="t-prop">class</span>=<span class="t-str">"j-slickCount-total"</span>&gt;&lt;/<span class="t-kw">span</span>&gt;
&lt;/<span class="t-kw">div</span>&gt;

<span class="t-cmt">&lt;!-- 自訂箭頭 --&gt;</span>
&lt;<span class="t-kw">button</span> <span class="t-prop">class</span>=<span class="t-str">"j-slider-arrow"</span> <span class="t-prop">data-type</span>=<span class="t-str">"prev"</span>&gt;prev&lt;/<span class="t-kw">button</span>&gt;
&lt;<span class="t-kw">button</span> <span class="t-prop">class</span>=<span class="t-str">"j-slider-arrow"</span> <span class="t-prop">data-type</span>=<span class="t-str">"next"</span>&gt;next&lt;/<span class="t-kw">button</span>&gt;

<span class="t-cmt">&lt;!-- 進度條 --&gt;</span>
&lt;<span class="t-kw">div</span> <span class="t-prop">class</span>=<span class="t-str">"j-slider-progress"</span>&gt;&lt;/<span class="t-kw">div</span>&gt;</pre>
    </div>
</article>
        `,
        'slick-destroy': `
<article class="m-section">

    <span class="m-tag">slick-plugin.js</span>
    <h1 class="m-h1">destroySlick()</h1>
    <p class="m-lead">安全銷毀 Slick 實例，同時解除所有擴充事件與自訂箭頭的監聽綁定。</p>

    <div class="m-signature"><span class="t-fn">$element</span>.<span class="t-fn">destroySlick</span>(): <span class="t-kw">jQuery</span></div>
    <p class="m-p">只對已初始化（具有 <code class="m-code">.slick-initialized</code>）的元素執行銷毀；若元素尚未初始化則觸發 <code class="m-code">devWarn</code>。</p>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">$</span>(<span class="t-str">'.j-slider'</span>).<span class="t-fn">destroySlick</span>();

<span class="t-cmt">/* RWD：依據視窗寬度決定是否初始化 */</span>
<span class="t-fn">ResizeHandler</span>.<span class="t-fn">init</span>(() => {
    <span class="t-kw">if</span> (<span class="t-num">768</span> > window.innerWidth) {
        <span class="t-fn">$</span>(<span class="t-str">'.j-slider'</span>).<span class="t-fn">initSlick</span>({ <span class="t-cmt">/* ... */</span> });
    } <span class="t-kw">else</span> {
        <span class="t-fn">$</span>(<span class="t-str">'.j-slider'</span>).<span class="t-fn">destroySlick</span>();
    }
});</pre>
    </div>
</article>
        `,
        'slick-count': `
<article class="m-section">

    <span class="m-tag">slick-plugin.js</span>
    <h1 class="m-h1">Plugin: count</h1>
    <p class="m-lead">在指定 DOM 顯示目前頁碼與總頁數，計算邏輯考量 <code class="m-code">slidesToShow</code> 與 <code class="m-code">slidesToScroll</code>，確保頁數呈現符合視覺上的「一組一頁」概念。</p>

    <h2 class="m-h2">配置方式</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre">plugin: {
    count:     <span class="t-str">'.j-count'</span>,  <span class="t-cmt">/* 計數器容器選擇器 */</span>
    countZero: <span class="t-bool">true</span>          <span class="t-cmt">/* 補零：01 / 09 */</span>
}</pre>
    </div>

    <h2 class="m-h2">DOM 結構</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre">&lt;<span class="t-kw">div</span> <span class="t-prop">class</span>=<span class="t-str">"j-count"</span>&gt;
    &lt;<span class="t-kw">span</span> <span class="t-prop">class</span>=<span class="t-str">"j-slickCount-current"</span>&gt;&lt;/<span class="t-kw">span</span>&gt;
    &lt;<span class="t-kw">span</span> <span class="t-prop">class</span>=<span class="t-str">"j-slickCount-total"</span>&gt;&lt;/<span class="t-kw">span</span>&gt;
&lt;/<span class="t-kw">div</span>&gt;</pre>
    </div>

    <div class="m-callout m-callout--info">
        <span class="m-callout__icon">ℹ</span>
        <p>總頁數計算公式：<code class="m-code">Math.ceil((slideCount - slidesToShow) / slidesToScroll) + 1</code>。當 <code class="m-code">slidesToShow ≥ slideCount</code> 時固定顯示 1 頁。</p>
    </div>
</article>
        `,
        'slick-arrow': `
<article class="m-section">

    <span class="m-tag">slick-plugin.js</span>
    <h1 class="m-h1">Plugin: customArrow</h1>
    <p class="m-lead">取代 Slick 原生箭頭，由外掛統一管理箭頭的點擊、<code class="m-code">disable</code>（第一/最後張）與 <code class="m-code">hide</code>（滑數 ≥ 總數）狀態。</p>

    <h2 class="m-h2">配置方式</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre">plugin: {
    customArrow: <span class="t-str">'.j-arrow'</span>   <span class="t-cmt">/* 包含 prev 和 next 按鈕的選擇器 */</span>
}</pre>
    </div>

    <h2 class="m-h2">DOM 結構</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre">&lt;<span class="t-kw">button</span> <span class="t-prop">class</span>=<span class="t-str">"j-arrow"</span> <span class="t-prop">data-type</span>=<span class="t-str">"prev"</span>&gt;←&lt;/<span class="t-kw">button</span>&gt;
&lt;<span class="t-kw">button</span> <span class="t-prop">class</span>=<span class="t-str">"j-arrow"</span> <span class="t-prop">data-type</span>=<span class="t-str">"next"</span>&gt;→&lt;/<span class="t-kw">button</span>&gt;</pre>
    </div>

    <table class="m-table">
        <thead><tr><th>class</th><th>條件</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">.disable</code></td><td><code class="m-code">infinite: false</code> 時，已到第一張（prev）或最後一張（next）。</td></tr>
            <tr><td><code class="m-code">.hide</code></td><td><code class="m-code">slidesToShow ≥ slideCount</code>，所有滑塊同時可見，箭頭隱藏。</td></tr>
        </tbody>
    </table>
</article>
        `,
        'slick-progress': `
<article class="m-section">

    <span class="m-tag">slick-plugin.js</span>
    <h1 class="m-h1">Plugin: progress</h1>
    <p class="m-lead">自動播放進度條控制。透過 CSS 自訂屬性 <code class="m-code">--autoplaySpeedTime</code> 傳遞播放速度，以 <code class="m-code">.run</code> class 驅動 CSS animation。</p>

    <h2 class="m-h2">配置方式</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre">plugin: {
    progress: <span class="t-str">'.j-progress'</span>
}</pre>
    </div>

    <h2 class="m-h2">CSS 實作範例</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">css</span></div>
        <pre class="m-codeblock__pre">.j-progress::after {
    content: <span class="t-str">''</span>;
    position: absolute;
    bottom: <span class="t-num">0</span>; left: <span class="t-num">0</span>;
    width: <span class="t-num">0</span>; height: <span class="t-num">3px</span>;
    background: var(--mainColor);
}

.j-progress.run::after {
    animation: progress-bar var(--autoplaySpeedTime) linear forwards;
}

@keyframes progress-bar {
    from { width: <span class="t-num">0</span>; }
    to   { width: <span class="t-num">100%</span>; }
}</pre>
    </div>
</article>
        `,
        'slick-media': `
<article class="m-section">

    <span class="m-tag">slick-plugin.js</span>
    <h1 class="m-h1">Plugin: media</h1>
    <p class="m-lead">切換輪播時自動暫停離開的媒體、播放進入的媒體。支援 HTML5 video/audio 及 YouTube、Vimeo iframe。</p>

    <h2 class="m-h2">配置方式</h2>
    <p class="m-p">無需額外傳入 DOM，media plugin 會自動在輪播容器中尋找媒體元素。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">/* slickPlugin_SET 預設已包含 'media'，無需額外 plugin 配置 */</span>
<span class="t-fn">$</span>(<span class="t-str">'.j-slider'</span>).<span class="t-fn">initSlick</span>({ settings: { slidesToShow: <span class="t-num">1</span> } });</pre>
    </div>

    <h2 class="m-h2">媒體元素設定</h2>
    <p class="m-p">需在媒體元素加上 <code class="m-code">data-autoplay</code> 屬性，外掛才會觸發播放。未設定的媒體僅會執行暫停動作。</p>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">&lt;!-- HTML5 video --&gt;</span>
&lt;<span class="t-kw">video</span> <span class="t-prop">data-autoplay</span> <span class="t-prop">loop</span> <span class="t-prop">playsinline</span>&gt;
    &lt;<span class="t-kw">source</span> <span class="t-prop">src</span>=<span class="t-str">"video.mp4"</span>&gt;
&lt;/<span class="t-kw">video</span>&gt;

<span class="t-cmt">&lt;!-- YouTube（需加 enablejsapi=1）--&gt;</span>
&lt;<span class="t-kw">iframe</span> <span class="t-prop">data-autoplay</span>
    <span class="t-prop">src</span>=<span class="t-str">"https://www.youtube.com/embed/VIDEO_ID?enablejsapi=1"</span>&gt;
&lt;/<span class="t-kw">iframe</span>&gt;

<span class="t-cmt">&lt;!-- Vimeo --&gt;</span>
&lt;<span class="t-kw">iframe</span> <span class="t-prop">data-autoplay</span>
    <span class="t-prop">src</span>=<span class="t-str">"https://player.vimeo.com/video/VIDEO_ID"</span>&gt;
&lt;/<span class="t-kw">iframe</span>&gt;</pre>
    </div>

    <div class="m-callout m-callout--warn">
        <span class="m-callout__icon">⚠</span>
        <p>YouTube iframe 需在 src 加上 <code class="m-code">enablejsapi=1</code> 才能透過 postMessage 控制播放，否則外掛只能暫停但無法播放，並觸發 <code class="m-code">devWarn</code>。</p>
    </div>

    <h2 class="m-h2">行為說明</h2>
    <table class="m-table">
        <thead><tr><th>事件</th><th>動作</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">beforeChange</code></td><td>暫停所有媒體（含非可視項目）。</td></tr>
            <tr><td><code class="m-code">setPosition / afterChange</code></td><td>播放當前可視項目中有 <code class="m-code">data-autoplay</code> 的媒體（僅 <code class="m-code">slidesToShow = 1</code> 時）。</td></tr>
        </tbody>
    </table>
</article>
        `,
    };

    /* ── 注入 window.DOCS_NAV 與 <template> 元素至 body ── */
    window.DOCS_NAV = window.DOCS_NAV || [];
    NAV.forEach((item) => { window.DOCS_NAV.push(item); });

    Object.entries(TEMPLATES).forEach(([id, html]) => {
        const tpl = document.createElement('template');
        tpl.id = 'tpl-' + id;
        tpl.innerHTML = html.trim();
        document.body.appendChild(tpl);
    });

})();