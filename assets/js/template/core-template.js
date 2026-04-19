/**========================================================================
 *
 * @description core.js 說明書內容
 * @dependency   manual-handle.js
 *
 * 新增項目：
 *   1. 在 NAV 陣列加一筆物件
 *   2. 在 TEMPLATES 物件加對應的 key 與 HTML 內容
 *
 *========================================================================*/

(function () {

    /* ── 導覽項目 ── */
    const NAV = [
        { id: 'core-overview',  label: '概覽 & 全域變數', group: 'core.js', keywords: 'core 概覽 說明 全域 isDevMode touchSupport cssSupportHas escapeMap' },
        { id: 'core-log',       label: '訊息封裝',         group: 'core.js', keywords: 'devWarn devError 訊息 警告 錯誤 console log' },
        { id: 'core-number',    label: '數值處理',         group: 'core.js', keywords: 'clamp 數值 限制 min max' },
        { id: 'core-dom',       label: 'DOM 屬性擴充',     group: 'core.js', keywords: 'isSticky sticky jQuery HTMLElement DOM 屬性' },
        { id: 'core-env',       label: '環境偵測',         group: 'core.js', keywords: 'isIOS isMobileDevice 環境 裝置 行動' },
        { id: 'core-util',      label: '通用工具',         group: 'core.js', keywords: 'debounce getDomainName getSearch getHash setHash escapeHTML getHashKey unwrapjQuery wrapjQuery 工具' },
        { id: 'core-observer',  label: '監聽與效能優化',   group: 'core.js', keywords: 'ResizeHandler observable observeScroll observeInfAnim getParallaxPercent resize scroll 監聽 效能 視差' },
        { id: 'core-ui',        label: '介面行為控制',     group: 'core.js', keywords: 'scrollToTop scrollDown actionLightbox handleSelectLinkChange setDialog initCopyAction 介面 UI lightbox' },
    ];

    /* ── 頁面內容 ── */
    const TEMPLATES = {

        /* ════════════════════════════════════
           概覽 & 全域變數
        ════════════════════════════════════ */
        'core-overview': `
<article class="m-section">
    <span class="m-tag">core.js</span>
    <h1 class="m-h1">概覽 &amp; 全域變數</h1>
    <p class="m-lead"><code class="m-code">core.js</code> 是整個前端專案的核心工具庫，提供訊息封裝、數值處理、DOM 擴充、環境偵測、URL 操作、監聽效能優化及介面行為控制等功能，需在所有頁面最先載入。</p>

    <h2 class="m-h2">全域常數</h2>
    <table class="m-table">
        <thead><tr><th>名稱</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">isDevMode</code></td><td><span class="m-type">boolean</span></td><td>是否為開發模式。<code class="m-code">true</code> 時 <code class="m-code">devWarn</code> / <code class="m-code">devError</code> 才會輸出至 console。上線前設為 <code class="m-code">false</code>。</td></tr>
            <tr><td><code class="m-code">touchSupport</code></td><td><span class="m-type">boolean</span></td><td>瀏覽器是否支援觸控事件，依 <code class="m-code">ontouchend in document</code> 判斷。</td></tr>
            <tr><td><code class="m-code">cssSupportHas</code></td><td><span class="m-type">boolean</span></td><td>CSS 是否支援 <code class="m-code">:has()</code> 選擇器。</td></tr>
            <tr><td><code class="m-code">escapeMap</code></td><td><span class="m-type">Map</span></td><td>HTML 跳脫字元對照表，供 <code class="m-code">escapeHTML()</code> 使用。包含 <code class="m-code">&amp; &lt; &gt; " ' \`</code>。</td></tr>
        </tbody>
    </table>

    <h2 class="m-h2">載入順序</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">&lt;!-- 1. core.js 必須最先載入 --&gt;</span>
&lt;<span class="t-kw">script</span> <span class="t-prop">src</span>=<span class="t-str">"assets/js/lib/core.js"</span>&gt;&lt;/<span class="t-kw">script</span>&gt;

<span class="t-cmt">&lt;!-- 2. 有用到 Slick 才需要這兩支 --&gt;</span>
&lt;<span class="t-kw">script</span> <span class="t-prop">src</span>=<span class="t-str">"assets/js/lib/jquery.min.js"</span>&gt;&lt;/<span class="t-kw">script</span>&gt;
&lt;<span class="t-kw">script</span> <span class="t-prop">src</span>=<span class="t-str">"assets/js/lib/slick.min.js"</span>&gt;&lt;/<span class="t-kw">script</span>&gt;
&lt;<span class="t-kw">script</span> <span class="t-prop">src</span>=<span class="t-str">"assets/js/template/slick-plugi-template.js"</span>&gt;&lt;/<span class="t-kw">script</span>&gt;</pre>
    </div>
</article>
        `,

        /* ════════════════════════════════════
           訊息封裝
        ════════════════════════════════════ */
        'core-log': `
<article class="m-section">
    <span class="m-tag">core.js</span>
    <h1 class="m-h1">訊息封裝</h1>
    <p class="m-lead">統一管理開發模式下的 console 輸出，正式環境設定 <code class="m-code">isDevMode = false</code> 即可全部靜音。</p>

    <h2 class="m-h2">devWarn()</h2>
    <div class="m-signature"><span class="t-fn">devWarn</span>(<span class="t-prop">message</span>: <span class="t-kw">string</span>): <span class="t-kw">void</span></div>
    <p class="m-p">輸出 <code class="m-code">console.warn</code>，用於非致命性的提示（如參數不符預期、略過初始化等）。</p>

    <h2 class="m-h2">devError()</h2>
    <div class="m-signature"><span class="t-fn">devError</span>(<span class="t-prop">message</span>: <span class="t-kw">string</span>): <span class="t-kw">void</span></div>
    <p class="m-p">輸出 <code class="m-code">console.error</code>，用於需要立即注意的錯誤（如找不到 DOM、型別錯誤等）。</p>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">devWarn</span>(<span class="t-str">'找不到目標元素，略過初始化'</span>);
<span class="t-fn">devError</span>(<span class="t-str">'必要參數未傳入'</span>);</pre>
    </div>
</article>
        `,

        /* ════════════════════════════════════
           數值處理
        ════════════════════════════════════ */
        'core-number': `
<article class="m-section">
    <span class="m-tag">core.js</span>
    <h1 class="m-h1">數值處理</h1>
    <p class="m-lead">數值邊界控制工具。</p>

    <h2 class="m-h2">clamp()</h2>
    <div class="m-signature"><span class="t-fn">clamp</span>(<span class="t-prop">min</span>: <span class="t-kw">number</span>, <span class="t-prop">num</span>: <span class="t-kw">number</span>, <span class="t-prop">max</span>: <span class="t-kw">number</span>): <span class="t-kw">number</span></div>
    <p class="m-p">將 <code class="m-code">num</code> 限制在 <code class="m-code">min</code> 至 <code class="m-code">max</code> 的範圍內並回傳。若參數型別不正確或 <code class="m-code">min &gt; max</code>，會觸發 <code class="m-code">devError</code>。</p>

    <table class="m-table">
        <thead><tr><th>參數</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">min</code><span class="m-req">必填</span></td><td><span class="m-type">number</span></td><td>最小允許值。</td></tr>
            <tr><td><code class="m-code">num</code><span class="m-req">必填</span></td><td><span class="m-type">number</span></td><td>目標值。</td></tr>
            <tr><td><code class="m-code">max</code><span class="m-req">必填</span></td><td><span class="m-type">number</span></td><td>最大允許值。</td></tr>
        </tbody>
    </table>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">clamp</span>(<span class="t-num">0</span>, <span class="t-num">150</span>, <span class="t-num">100</span>); <span class="t-cmt">/* → 100 */</span>
<span class="t-fn">clamp</span>(<span class="t-num">0</span>, <span class="t-num">-5</span>,  <span class="t-num">100</span>); <span class="t-cmt">/* → 0   */</span>
<span class="t-fn">clamp</span>(<span class="t-num">0</span>, <span class="t-num">42</span>,  <span class="t-num">100</span>); <span class="t-cmt">/* → 42  */</span></pre>
    </div>
</article>
        `,

        /* ════════════════════════════════════
           DOM 屬性擴充
        ════════════════════════════════════ */
        'core-dom': `
<article class="m-section">
    <span class="m-tag">core.js</span>
    <h1 class="m-h1">DOM 屬性擴充</h1>
    <p class="m-lead">注入原生 <code class="m-code">HTMLElement</code> 與 jQuery 原型，提供額外的 DOM 判斷能力。</p>

    <h2 class="m-h2">isSticky()</h2>
    <div class="m-signature">element.<span class="t-fn">isSticky</span>(): <span class="t-kw">boolean</span>
$element.<span class="t-fn">isSticky</span>(): <span class="t-kw">boolean</span></div>
    <p class="m-p">判斷一個設定了 <code class="m-code">position: sticky</code> 的元素是否目前處於釘住狀態（已超出其 <code class="m-code">top</code> 偏移值）。</p>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">/* 原生 DOM */</span>
<span class="t-kw">const</span> header = document.<span class="t-fn">querySelector</span>(<span class="t-str">'header'</span>);
<span class="t-kw">if</span> (header.<span class="t-fn">isSticky</span>()) { <span class="t-cmt">/* 已釘住 */</span> }

<span class="t-cmt">/* jQuery */</span>
<span class="t-kw">if</span> (<span class="t-fn">$</span>(<span class="t-str">'header'</span>).<span class="t-fn">isSticky</span>()) { <span class="t-cmt">/* 已釘住 */</span> }</pre>
    </div>
</article>
        `,

        /* ════════════════════════════════════
           環境偵測
        ════════════════════════════════════ */
        'core-env': `
<article class="m-section">
    <span class="m-tag">core.js</span>
    <h1 class="m-h1">環境偵測</h1>
    <p class="m-lead">判斷裝置類型，用於差異化行為控制。</p>

    <h2 class="m-h2">isIOS()</h2>
    <div class="m-signature"><span class="t-fn">isIOS</span>(): <span class="t-kw">boolean</span></div>
    <p class="m-p">透過 <code class="m-code">userAgent</code> 判斷是否為 iPhone / iPad / iPod 裝置。</p>

    <h2 class="m-h2">isMobileDevice()</h2>
    <div class="m-signature"><span class="t-fn">isMobileDevice</span>(): <span class="t-kw">boolean</span></div>
    <p class="m-p">綜合 <code class="m-code">userAgent</code>、多點觸控與螢幕尺寸（&lt; 1024px）三個條件判斷是否為行動裝置。裝置不支援觸控時直接回傳 <code class="m-code">false</code>。</p>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-kw">if</span> (<span class="t-fn">isIOS</span>()) {
    <span class="t-cmt">/* iOS 專屬處理 */</span>
}

<span class="t-kw">if</span> (<span class="t-fn">isMobileDevice</span>()) {
    <span class="t-cmt">/* 行動裝置專屬處理 */</span>
}</pre>
    </div>
</article>
        `,

        /* ════════════════════════════════════
           通用工具
        ════════════════════════════════════ */
        'core-util': `
<article class="m-section">
    <span class="m-tag">core.js</span>
    <h1 class="m-h1">通用工具</h1>
    <p class="m-lead">URL 操作、字串處理、jQuery 轉換與防抖工具集。</p>

    <h2 class="m-h2">debounce()</h2>
    <div class="m-signature"><span class="t-fn">debounce</span>(<span class="t-prop">func</span>: <span class="t-kw">function</span>, <span class="t-prop">delay</span>?: <span class="t-kw">number</span> = <span class="t-num">500</span>): <span class="t-kw">function</span></div>
    <p class="m-p">防抖動包裝器。在 <code class="m-code">delay</code> 毫秒內若再次觸發則重置計時，常用於 resize、input 等高頻事件。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre">window.<span class="t-fn">addEventListener</span>(<span class="t-str">'resize'</span>, <span class="t-fn">debounce</span>(() => {
    <span class="t-cmt">/* 停止調整視窗 500ms 後才執行 */</span>
}, <span class="t-num">500</span>));</pre>
    </div>

    <h2 class="m-h2">getDomainName()</h2>
    <div class="m-signature"><span class="t-fn">getDomainName</span>(<span class="t-prop">src</span>: <span class="t-kw">string</span>): <span class="t-kw">string</span></div>
    <p class="m-p">從完整 URL 擷取 domain name（移除 <code class="m-code">www.</code> 前綴）。傳入相對路徑或非合法 URL 時回傳空字串並觸發 <code class="m-code">devWarn</code>。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">getDomainName</span>(<span class="t-str">'https://www.youtube.com/watch?v=xxx'</span>); <span class="t-cmt">/* → "youtube.com" */</span>
<span class="t-fn">getDomainName</span>(<span class="t-str">'https://player.vimeo.com/video/1'</span>);      <span class="t-cmt">/* → "player.vimeo.com" */</span></pre>
    </div>

    <h2 class="m-h2">getSearch()</h2>
    <div class="m-signature"><span class="t-fn">getSearch</span>(<span class="t-prop">search</span>?: <span class="t-kw">string</span> = <span class="t-str">''</span>): <span class="t-kw">string | null</span></div>
    <p class="m-p">讀取當前 URL 的 query string 參數值。找不到對應 key 時回傳 <code class="m-code">null</code>。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">/* URL: https://example.com?page=2&lang=zh */</span>
<span class="t-fn">getSearch</span>(<span class="t-str">'page'</span>); <span class="t-cmt">/* → "2"   */</span>
<span class="t-fn">getSearch</span>(<span class="t-str">'foo'</span>);  <span class="t-cmt">/* → null  */</span></pre>
    </div>

    <h2 class="m-h2">getHash()</h2>
    <div class="m-signature"><span class="t-fn">getHash</span>(<span class="t-prop">key</span>?: <span class="t-kw">string</span> = <span class="t-str">''</span>): <span class="t-kw">string | object | null</span></div>
    <p class="m-p">讀取當前 URL 的 hash 參數。傳入 <code class="m-code">key</code> 回傳對應字串值；不傳則回傳整個參數物件。Hash 內容只允許字母、數字、<code class="m-code">= - &amp;</code>，其餘字元會被清除。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">/* URL: https://example.com#tab=gallery&id=5 */</span>
<span class="t-fn">getHash</span>(<span class="t-str">'tab'</span>); <span class="t-cmt">/* → "gallery"               */</span>
<span class="t-fn">getHash</span>();      <span class="t-cmt">/* → { tab: "gallery", id: "5" } */</span></pre>
    </div>

    <h2 class="m-h2">setHash()</h2>
    <div class="m-signature"><span class="t-fn">setHash</span>(<span class="t-prop">key</span>: <span class="t-kw">string</span>, <span class="t-prop">value</span>: <span class="t-kw">string | null</span>): <span class="t-kw">boolean</span></div>
    <p class="m-p">寫入或移除 URL hash 參數。傳入 <code class="m-code">value = null</code> 時刪除該 key。Key 與 value 均會清理危險字元。回傳 <code class="m-code">false</code> 代表 key 清理後為空字串。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">setHash</span>(<span class="t-str">'tab'</span>, <span class="t-str">'gallery'</span>); <span class="t-cmt">/* URL → #tab=gallery */</span>
<span class="t-fn">setHash</span>(<span class="t-str">'tab'</span>, <span class="t-kw">null</span>);        <span class="t-cmt">/* 移除 tab 參數       */</span></pre>
    </div>

    <h2 class="m-h2">escapeHTML()</h2>
    <div class="m-signature"><span class="t-fn">escapeHTML</span>(<span class="t-prop">str</span>: <span class="t-kw">string</span>, <span class="t-prop">maxLength</span>?: <span class="t-kw">number</span> = <span class="t-num">5000</span>): <span class="t-kw">string</span></div>
    <p class="m-p">轉義 HTML 特殊字元，預防 XSS。超過 <code class="m-code">maxLength</code> 時拋出 Error。可轉義字元：<code class="m-code">&amp; &lt; &gt; " ' \`</code>。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">escapeHTML</span>(<span class="t-str">'&lt;script&gt;alert("xss")&lt;/script&gt;'</span>);
<span class="t-cmt">/* → "&amp;lt;script&amp;gt;alert(&amp;quot;xss&amp;quot;)&amp;lt;/script&amp;gt;" */</span></pre>
    </div>

    <h2 class="m-h2">getHashKey()</h2>
    <div class="m-signature"><span class="t-fn">getHashKey</span>(): <span class="t-kw">string</span></div>
    <p class="m-p">產生基於時間戳與亂數的唯一 key 字串，格式 <code class="m-code">{timestamp}_{randomNum}</code>，可用於動態 DOM 的 id 產生。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">getHashKey</span>(); <span class="t-cmt">/* → "1718000000000_4271" */</span></pre>
    </div>

    <h2 class="m-h2">unwrapjQuery()</h2>
    <div class="m-signature"><span class="t-fn">unwrapjQuery</span>(<span class="t-prop">el</span>: <span class="t-kw">HTMLElement | jQuery</span>): <span class="t-kw">HTMLElement | null</span></div>
    <p class="m-p">若傳入的是 jQuery 物件，回傳其第一個原生 DOM 元素（<code class="m-code">el[0]</code>）；若已是原生元素則直接回傳。找不到元素時回傳 <code class="m-code">null</code>。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-kw">const</span> el = <span class="t-fn">unwrapjQuery</span>(<span class="t-fn">$</span>(<span class="t-str">'.j-box'</span>));
<span class="t-cmt">/* el 為原生 HTMLElement，可直接使用 DOM API */</span>
el.<span class="t-fn">getBoundingClientRect</span>();</pre>
    </div>

    <h2 class="m-h2">wrapjQuery()</h2>
    <div class="m-signature"><span class="t-fn">wrapjQuery</span>(<span class="t-prop">el</span>: <span class="t-kw">HTMLElement | jQuery</span>): <span class="t-kw">jQuery</span></div>
    <p class="m-p">若傳入的是原生 DOM 元素，以 <code class="m-code">jQuery(el)</code> 包裝後回傳；若已是 jQuery 物件則直接回傳。確保後續可安全呼叫 jQuery 方法。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-kw">const</span> $el = <span class="t-fn">wrapjQuery</span>(document.<span class="t-fn">querySelector</span>(<span class="t-str">'.j-box'</span>));
<span class="t-cmt">/* $el 為 jQuery 物件，可安全呼叫 jQuery 方法 */</span>
$el.<span class="t-fn">addClass</span>(<span class="t-str">'active'</span>);</pre>
    </div>

    <div class="m-callout m-callout--info">
        <span class="m-callout__icon">ℹ</span>
        <p><code class="m-code">unwrapjQuery</code> 與 <code class="m-code">wrapjQuery</code> 主要用於接受 <code class="m-code">HTMLElement | jQuery</code> 兩種型別的函式內部，用來統一轉換後再操作，避免重複的型別判斷。</p>
    </div>
</article>
        `,

        /* ════════════════════════════════════
           監聽與效能優化
        ════════════════════════════════════ */
        'core-observer': `
<article class="m-section">
    <span class="m-tag">core.js</span>
    <h1 class="m-h1">監聽與效能優化</h1>
    <p class="m-lead">基於 <code class="m-code">ResizeObserver</code>、<code class="m-code">IntersectionObserver</code> 與 <code class="m-code">requestAnimationFrame</code> 的高效事件監聽工具，避免主執行緒過載。</p>

    <h2 class="m-h2">ResizeHandler.init()</h2>
    <div class="m-signature"><span class="t-prop">ResizeHandler</span>.<span class="t-fn">init</span>(<span class="t-prop">customResizeEvent</span>, <span class="t-prop">targetSelector</span>?, <span class="t-prop">debounceDelay</span>?): <span class="t-kw">void</span></div>
    <p class="m-p">以 <code class="m-code">ResizeObserver</code> 監控指定元素的尺寸變化，並在初始化時立即觸發一次 callback。建構時可指定監聽方向（<code class="m-code">'x'</code> / <code class="m-code">'y'</code> / <code class="m-code">'both'</code>，預設 <code class="m-code">'x'</code>）。</p>

    <table class="m-table">
        <thead><tr><th>參數</th><th>型別</th><th>預設</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">customResizeEvent</code><span class="m-req">必填</span></td><td><span class="m-type">function</span></td><td>—</td><td>尺寸改變時執行的回調函式。</td></tr>
            <tr><td><code class="m-code">targetSelector</code><span class="m-opt">選填</span></td><td><span class="m-type">string</span></td><td><code class="m-code">'body'</code></td><td>監控目標 CSS 選擇器。</td></tr>
            <tr><td><code class="m-code">debounceDelay</code><span class="m-opt">選填</span></td><td><span class="m-type">number</span></td><td><code class="m-code">400</code></td><td>防抖延遲毫秒數。</td></tr>
        </tbody>
    </table>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">/* 預設監聽 body 寬度變化 */</span>
<span class="t-prop">ResizeHandler</span>.<span class="t-fn">init</span>(() => {
    console.<span class="t-fn">log</span>(<span class="t-str">'寬度改變'</span>, window.innerWidth);
});

<span class="t-cmt">/* 指定元素、防抖 200ms */</span>
<span class="t-prop">ResizeHandler</span>.<span class="t-fn">init</span>(() => { <span class="t-cmt">/* ... */</span> }, <span class="t-str">'.j-container'</span>, <span class="t-num">200</span>);</pre>
    </div>

    <h2 class="m-h2">observable.init()</h2>
    <div class="m-signature"><span class="t-prop">observable</span>.<span class="t-fn">init</span>(<span class="t-prop">options</span>): <span class="t-kw">function | null</span></div>
    <p class="m-p">以 <code class="m-code">IntersectionObserver</code> 監控元素進入/離開視窗。若傳入 <code class="m-code">onLeave</code>，<code class="m-code">once</code> 會強制為 <code class="m-code">false</code>。回傳 <code class="m-code">destroy()</code> 函式可手動停止監控；找不到目標元素則回傳 <code class="m-code">null</code>。</p>

    <table class="m-table">
        <thead><tr><th>參數</th><th>型別</th><th>預設</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">target</code><span class="m-req">必填</span></td><td><span class="m-type">string</span></td><td>—</td><td>CSS 選擇器，可同時選取多個元素。</td></tr>
            <tr><td><code class="m-code">top</code><span class="m-opt">選填</span></td><td><span class="m-type">number</span></td><td><code class="m-code">0</code></td><td>偵測區域頂部縮減 px。</td></tr>
            <tr><td><code class="m-code">bottom</code><span class="m-opt">選填</span></td><td><span class="m-type">number</span></td><td><code class="m-code">0</code></td><td>偵測區域底部縮減 px。</td></tr>
            <tr><td><code class="m-code">threshold</code><span class="m-opt">選填</span></td><td><span class="m-type">number</span></td><td><code class="m-code">0</code></td><td>觸發閾值（0.0 ~ 1.0）。</td></tr>
            <tr><td><code class="m-code">once</code><span class="m-opt">選填</span></td><td><span class="m-type">boolean</span></td><td><code class="m-code">true</code></td><td>只觸發一次進入動作。</td></tr>
            <tr><td><code class="m-code">onEnter</code><span class="m-opt">選填</span></td><td><span class="m-type">function</span></td><td>—</td><td>進入偵測區時的回調，支援 async。</td></tr>
            <tr><td><code class="m-code">onLeave</code><span class="m-opt">選填</span></td><td><span class="m-type">function</span></td><td>—</td><td>離開偵測區時的回調，支援 async。</td></tr>
        </tbody>
    </table>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-kw">const</span> stop = <span class="t-prop">observable</span>.<span class="t-fn">init</span>({
    target: <span class="t-str">'.js-section'</span>,
    bottom: <span class="t-num">100</span>,
    once: <span class="t-bool">true</span>,
    <span class="t-fn">onEnter</span>(el) {
        el.classList.<span class="t-fn">add</span>(<span class="t-str">'is-visible'</span>);
    }
});

<span class="t-cmt">/* 需要時手動銷毀 */</span>
<span class="t-kw">if</span> (stop) <span class="t-fn">stop</span>();</pre>
    </div>

    <h2 class="m-h2">observeScroll()</h2>
    <div class="m-signature"><span class="t-fn">observeScroll</span>(<span class="t-prop">callback</span>: <span class="t-kw">function</span>): <span class="t-kw">function</span></div>
    <p class="m-p">以 <code class="m-code">requestAnimationFrame</code> 節流的滾動監聽器，支援兩種模式：</p>
    <p class="m-p"><strong>節能模式</strong>（無參數 <code class="m-code">() => {}</code>）：每次捲動皆觸發，不計算方向。<br><strong>詳細模式</strong>（有參數 <code class="m-code">(data) => {}</code>）：回傳方向、位置、是否到頂底等資訊。</p>
    <p class="m-p">回傳 <code class="m-code">destroy()</code> 函式可解除所有監聽。</p>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-kw">const</span> stopScroll = <span class="t-fn">observeScroll</span>(({ direction, scrollTop, isTop, isBottom }) => {
    <span class="t-kw">if</span> (<span class="t-str">'down'</span> === direction) { <span class="t-cmt">/* 向下捲動 */</span> }
    <span class="t-kw">if</span> (isBottom) { <span class="t-cmt">/* 已到底部 */</span> }
});

<span class="t-fn">stopScroll</span>(); <span class="t-cmt">/* 解除監聽 */</span></pre>
    </div>

    <h3 class="m-h3">callback data 物件</h3>
    <table class="m-table">
        <thead><tr><th>欄位</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">direction</code></td><td><span class="m-type">'up' | 'down' | 'none'</span></td><td>捲動方向（位移 &lt; 2px 為 none）。</td></tr>
            <tr><td><code class="m-code">scrollTop</code></td><td><span class="m-type">number</span></td><td>當前捲動位置（px）。</td></tr>
            <tr><td><code class="m-code">prevScrollTop</code></td><td><span class="m-type">number</span></td><td>上一幀捲動位置（px）。</td></tr>
            <tr><td><code class="m-code">isTop</code></td><td><span class="m-type">boolean</span></td><td>是否捲到頂部。</td></tr>
            <tr><td><code class="m-code">isBottom</code></td><td><span class="m-type">boolean</span></td><td>是否捲到底部。</td></tr>
            <tr><td><code class="m-code">event</code></td><td><span class="m-type">Event</span></td><td>原始事件物件。</td></tr>
        </tbody>
    </table>

    <h2 class="m-h2">observeInfAnim()</h2>
    <div class="m-signature"><span class="t-fn">observeInfAnim</span>(): <span class="t-kw">void</span></div>
    <p class="m-p">對所有帶有 <code class="m-code">data-animated-infinite="1"</code> 或 <code class="m-code">"true"</code> 屬性的元素自動套用可視範圍節流，進入畫面時加上 <code class="m-code">.play</code>，離開時移除。搭配 <code class="m-code">public.css</code> 中的 <code class="m-code">[data-animated-infinite]</code> 樣式使用。</p>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre">&lt;<span class="t-kw">div</span> <span class="t-prop">class</span>=<span class="t-str">"my-anim"</span> <span class="t-prop">data-animated-infinite</span>=<span class="t-str">"1"</span>&gt;&lt;/<span class="t-kw">div</span>&gt;</pre>
    </div>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">observeInfAnim</span>(); <span class="t-cmt">/* 初始化後自動處理所有符合的元素 */</span></pre>
    </div>

    <h2 class="m-h2">getParallaxPercent()</h2>
    <div class="m-signature"><span class="t-fn">getParallaxPercent</span>(<span class="t-prop">config</span>: <span class="t-kw">object</span>): <span class="t-kw">number</span></div>
    <p class="m-p">計算 <code class="m-code">position: sticky</code> 子元素的視差滾動進度，回傳 <code class="m-code">0</code>（起點）到 <code class="m-code">1</code>（終點）之間的數值。依賴 <code class="m-code">unwrapjQuery</code> 與 <code class="m-code">clamp</code>。</p>

    <table class="m-table">
        <thead><tr><th>參數</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">config.childEl</code><span class="m-req">必填</span></td><td><span class="m-type">HTMLElement | jQuery</span></td><td>偵測目標的 sticky 子元素。</td></tr>
            <tr><td><code class="m-code">config.startMode</code><span class="m-opt">選填</span></td><td><span class="m-type">'bottom' | 'top'</span></td><td>起始觸發模式。<code class="m-code">'bottom'</code>（預設）：元素底部進入視窗時開始；<code class="m-code">'top'</code>：元素頂部到達 sticky top 時開始。</td></tr>
        </tbody>
    </table>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-kw">const</span> stopScroll = <span class="t-fn">observeScroll</span>(() => {
    <span class="t-kw">const</span> progress = <span class="t-fn">getParallaxPercent</span>({
        childEl: document.<span class="t-fn">querySelector</span>(<span class="t-str">'.j-sticky-child'</span>),
        startMode: <span class="t-str">'bottom'</span>
    });

    <span class="t-cmt">/* progress: 0 → 1，用於驅動動畫或樣式 */</span>
    document.<span class="t-fn">querySelector</span>(<span class="t-str">'.j-bar'</span>).style.width = (progress * <span class="t-num">100</span>) + <span class="t-str">'%'</span>;
});</pre>
    </div>

    <div class="m-callout m-callout--warn">
        <span class="m-callout__icon">⚠</span>
        <p><code class="m-code">childEl</code> 必須是設定了 <code class="m-code">position: sticky</code> 的元素，且需要有父層容器作為捲動範圍。若傳入非 <code class="m-code">HTMLElement</code> 的值，會觸發 <code class="m-code">devError</code> 並回傳 <code class="m-code">undefined</code>。</p>
    </div>
</article>
        `,

        /* ════════════════════════════════════
           介面行為控制
        ════════════════════════════════════ */
        'core-ui': `
<article class="m-section">
    <span class="m-tag">core.js</span>
    <h1 class="m-h1">介面行為控制</h1>
    <p class="m-lead">頁面捲動、Lightbox、Dialog 等常用 UI 行為的統一介面。</p>

    <h2 class="m-h2">scrollToTop()</h2>
    <div class="m-signature"><span class="t-fn">scrollToTop</span>(<span class="t-prop">speed</span>?: <span class="t-kw">number</span> = <span class="t-num">1000</span>): <span class="t-kw">void</span></div>
    <p class="m-p">平滑捲回頁面頂部。若已在頂部則不執行。使用者主動介入（滾輪/觸控）時立即中止動畫。</p>

    <h2 class="m-h2">scrollDown()</h2>
    <div class="m-signature"><span class="t-fn">scrollDown</span>(<span class="t-prop">isHeader</span>?: <span class="t-kw">boolean</span> = <span class="t-bool">false</span>, <span class="t-prop">speed</span>?: <span class="t-kw">number</span> = <span class="t-num">800</span>): <span class="t-kw">void</span></div>
    <p class="m-p">捲動至 <code class="m-code">.j-scrollItem</code> 元素底部。傳入 <code class="m-code">isHeader = true</code> 時自動扣除 <code class="m-code">header</code> 高度。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">scrollToTop</span>(<span class="t-num">600</span>);        <span class="t-cmt">/* 600ms 捲回頂部                         */</span>
<span class="t-fn">scrollDown</span>(<span class="t-bool">true</span>, <span class="t-num">800</span>); <span class="t-cmt">/* 扣除 header 高度後捲到 .j-scrollItem 底部 */</span></pre>
    </div>

    <h2 class="m-h2">actionLightbox()</h2>
    <div class="m-signature"><span class="t-fn">actionLightbox</span>(<span class="t-prop">e</span>: <span class="t-kw">Event</span>, <span class="t-prop">action</span>?: <span class="t-kw">string</span> = <span class="t-str">'close'</span>): <span class="t-kw">void</span></div>
    <p class="m-p">開啟或關閉 Lightbox。開啟時需在觸發元素上設定 <code class="m-code">data-target</code> 指向對應的 <code class="m-code">.j-lightbox</code>。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">&lt;!-- 觸發按鈕 --&gt;</span>
&lt;<span class="t-kw">button</span> <span class="t-prop">class</span>=<span class="t-str">"j-lightbox-open"</span> <span class="t-prop">data-target</span>=<span class="t-str">"gallery"</span>
        <span class="t-prop">onclick</span>=<span class="t-str">"actionLightbox(event, 'open')"</span>&gt;開啟&lt;/<span class="t-kw">button</span>&gt;

<span class="t-cmt">&lt;!-- Lightbox 容器 --&gt;</span>
&lt;<span class="t-kw">div</span> <span class="t-prop">class</span>=<span class="t-str">"j-lightbox"</span> <span class="t-prop">data-lightbox</span>=<span class="t-str">"gallery"</span>&gt;
    &lt;<span class="t-kw">button</span> <span class="t-prop">onclick</span>=<span class="t-str">"actionLightbox(event, 'close')"</span>&gt;關閉&lt;/<span class="t-kw">button</span>&gt;
&lt;/<span class="t-kw">div</span>&gt;</pre>
    </div>

    <h2 class="m-h2">setDialog()</h2>
    <div class="m-signature"><span class="t-fn">setDialog</span>(<span class="t-prop">type</span>: <span class="t-kw">string</span>, <span class="t-prop">setting</span>?: <span class="t-kw">object</span>, <span class="t-prop">callback1</span>?: <span class="t-kw">function</span>, <span class="t-prop">callback2</span>?: <span class="t-kw">function</span>): <span class="t-kw">void</span></div>
    <p class="m-p">統一的提示視窗控制介面，依 <code class="m-code">type</code> 呈現不同的按鈕組合。</p>

    <table class="m-table">
        <thead><tr><th>type</th><th>按鈕顯示</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">'confirm'</code></td><td>確定 + 取消</td><td>需要使用者確認的操作。</td></tr>
            <tr><td><code class="m-code">'alert'</code></td><td>確定</td><td>單純告知的提示。</td></tr>
            <tr><td><code class="m-code">'message'</code></td><td>無按鈕</td><td>顯示訊息，不需互動。</td></tr>
            <tr><td><code class="m-code">'clear'</code></td><td>—</td><td>關閉並清空 Dialog。</td></tr>
        </tbody>
    </table>

    <h3 class="m-h3">setting 物件</h3>
    <table class="m-table">
        <thead><tr><th>欄位</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">title</code></td><td><span class="m-type">string</span></td><td>標題文字（支援 HTML）。</td></tr>
            <tr><td><code class="m-code">sub</code></td><td><span class="m-type">string</span></td><td>副標題文字（支援 HTML）。</td></tr>
            <tr><td><code class="m-code">content</code></td><td><span class="m-type">string | string[]</span></td><td>內文。傳入陣列時自動轉為編號清單。</td></tr>
            <tr><td><code class="m-code">icon</code></td><td><span class="m-type">string</span></td><td>圖示識別值，寫入 <code class="m-code">data-icon</code> 屬性。</td></tr>
        </tbody>
    </table>

    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-fn">setDialog</span>(<span class="t-str">'confirm'</span>, {
    title: <span class="t-str">'確定刪除？'</span>,
    content: <span class="t-str">'此操作無法復原。'</span>
}, () => {
    <span class="t-fn">deleteItem</span>(); <span class="t-cmt">/* 確定 callback */</span>
}, () => {
    <span class="t-cmt">/* 取消 callback */</span>
});</pre>
    </div>

    <h2 class="m-h2">handleSelectLinkChange()</h2>
    <div class="m-signature"><span class="t-fn">handleSelectLinkChange</span>(<span class="t-prop">$select</span>: <span class="t-kw">HTMLSelectElement</span>): <span class="t-kw">void</span></div>
    <p class="m-p">下拉選單跳轉網址。選取值即為目標 URL。Option 可設定 <code class="m-code">data-blank="1"</code> 新分頁開啟，或 <code class="m-code">data-stop="1"</code> 阻止跳轉。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre">&lt;<span class="t-kw">select</span> <span class="t-prop">onchange</span>=<span class="t-str">"handleSelectLinkChange(this)"</span>&gt;
    &lt;<span class="t-kw">option</span> <span class="t-prop">value</span>=<span class="t-str">""</span>       <span class="t-prop">data-stop</span>=<span class="t-str">"1"</span>&gt;請選擇&lt;/<span class="t-kw">option</span>&gt;
    &lt;<span class="t-kw">option</span> <span class="t-prop">value</span>=<span class="t-str">"/about"</span>&gt;關於我們&lt;/<span class="t-kw">option</span>&gt;
    &lt;<span class="t-kw">option</span> <span class="t-prop">value</span>=<span class="t-str">"https://example.com"</span> <span class="t-prop">data-blank</span>=<span class="t-str">"1"</span>&gt;外部連結&lt;/<span class="t-kw">option</span>&gt;
&lt;/<span class="t-kw">select</span>&gt;</pre>
    </div>

    <h2 class="m-h2">initCopyAction()</h2>
    <div class="m-signature"><span class="t-fn">initCopyAction</span>(): <span class="t-kw">void</span></div>
    <p class="m-p">初始化全頁面複製功能。使用事件代理監聽 <code class="m-code">.j-copy</code> 元素，複製 <code class="m-code">data-copy</code> 的值（未設定時複製當前 URL）。若瀏覽器不支援 Clipboard API 或非 HTTPS，則移除所有 <code class="m-code">.j-copy</code> 元素。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">&lt;!-- 複製指定文字 --&gt;</span>
&lt;<span class="t-kw">button</span> <span class="t-prop">class</span>=<span class="t-str">"j-copy"</span> <span class="t-prop">data-copy</span>=<span class="t-str">"https://example.com/share"</span>&gt;複製連結&lt;/<span class="t-kw">button</span>&gt;

<span class="t-cmt">&lt;!-- 複製當前 URL --&gt;</span>
&lt;<span class="t-kw">button</span> <span class="t-prop">class</span>=<span class="t-str">"j-copy"</span>&gt;分享此頁&lt;/<span class="t-kw">button</span>&gt;</pre>
    </div>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">/* DOM ready 後呼叫一次 */</span>
<span class="t-fn">initCopyAction</span>();</pre>
    </div>
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
