/**========================================================================
 *
 * @description form-validator.js 說明書內容
 * @version     1.0.0
 * @dependency  manual-handle.js
 *
 * 新增項目：
 *   1. subs 陣列加一個 { sub, links } 物件
 *   2. links 陣列加 { id, anchor, label, keywords }
 *   3. TEMPLATES 加對應 key 與 HTML 內容
 *
 *========================================================================*/

(function () {

    /* ── 導覽資料 ── */
    const NAV = {
        group: 'form-validator.js',
        subs: [
            {
                sub: '表單驗證',
                links: [
                    { id: 'fv-overview',       anchor: '',               label: '概覽',            keywords: 'form validator 表單 驗證 概覽 validateFields' },
                    { id: 'fv-validateFields', anchor: 'validateFields', label: 'validateFields()', keywords: 'validateFields config form fields groups errorKey condition namePrefix errorKeyPrefix 動態 重複' }
                ]
            }
        ]
    };


    /* ── 頁面內容 ── */
    const TEMPLATES = {

        /* ════════════════════════════════════
           概覽
        ════════════════════════════════════ */
        'fv-overview': `
<article class="m-section">
    <span class="m-tag">form-validator.js</span>
    <h1 class="m-h1">概覽</h1>
    <p class="m-lead">以設定物件驅動的 jQuery 表單驗證工具。透過 <code class="m-code">validateFields()</code> 傳入欄位規則，回傳包含所有驗證失敗項目的 error 物件，不直接操作 DOM 樣式，便於與任何 UI 邏輯搭配使用。</p>

    <h2 class="m-h2">內建驗證器</h2>
    <p class="m-p">根據元素的 tag 或 input type 自動套用對應的驗證邏輯，無需手動指定。</p>
    <table class="m-table">
        <thead><tr><th>key</th><th>觸發條件</th><th>視為失敗</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">input</code></td><td><code class="m-code">&lt;input&gt;</code>（非 radio / checkbox）</td><td><code class="m-code">val().trim()</code> 為空字串。</td></tr>
            <tr><td><code class="m-code">textarea</code></td><td><code class="m-code">&lt;textarea&gt;</code></td><td><code class="m-code">val().trim()</code> 為空字串。</td></tr>
            <tr><td><code class="m-code">select</code></td><td><code class="m-code">&lt;select&gt;</code></td><td><code class="m-code">val()</code> 為 <code class="m-code">-1</code>。</td></tr>
            <tr><td><code class="m-code">radio</code></td><td><code class="m-code">type="radio"</code></td><td><code class="m-code">val()</code> 為 <code class="m-code">-1</code>（無選取）。</td></tr>
            <tr><td><code class="m-code">checkbox</code></td><td><code class="m-code">type="checkbox"</code></td><td>沒有任何項目被勾選。</td></tr>
        </tbody>
    </table>

    <h2 class="m-h2">載入方式</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">html</span></div>
        <pre class="m-codeblock__pre"><span class="t-cmt">&lt;!-- 需在 jQuery 載入後引入 --&gt;</span>
&lt;<span class="t-kw">script</span> <span class="t-prop">src</span>=<span class="t-str">"assets/js/lib/jquery.min.js"</span>&gt;&lt;/<span class="t-kw">script</span>&gt;
&lt;<span class="t-kw">script</span> <span class="t-prop">src</span>=<span class="t-str">"assets/js/lib/form-validator.js"</span>&gt;&lt;/<span class="t-kw">script</span>&gt;</pre>
    </div>
</article>`,


        /* ════════════════════════════════════
           validateFields()
        ════════════════════════════════════ */
        'fv-validateFields': `
<article class="m-section">
    <span class="m-tag">form-validator.js</span>
    <h1 class="m-h1">validateFields()</h1>
    <p class="m-lead">依據驗證設定物件執行表單驗證，回傳包含所有失敗項目的 error 物件。驗證通過時 error 為空物件 <code class="m-code">{}</code>；驗證失敗的欄位以 <code class="m-code">errorKey: true</code> 的形式寫入。</p>

    <h2 id="validateFields" class="m-h2">validateFields()</h2>
    <div class="m-signature"><span class="t-fn">validateFields</span>(<span class="t-prop">config</span>: <span class="t-kw">object</span>): <span class="t-kw">object</span></div>

    <h3 class="m-h3">config 物件</h3>
    <table class="m-table">
        <thead><tr><th>參數</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">config.form</code><span class="m-req">必填</span></td><td><span class="m-type">jQuery</span></td><td>表單的 jQuery 物件，作為欄位查找的根容器。</td></tr>
            <tr><td><code class="m-code">config.fields</code><span class="m-req">必填</span></td><td><span class="m-type">Array</span></td><td>一般欄位驗證規則陣列，詳見下方說明。</td></tr>
            <tr><td><code class="m-code">config.groups</code><span class="m-opt">選填</span></td><td><span class="m-type">Array</span></td><td>動態重複區塊的驗證規則陣列，詳見下方說明。</td></tr>
        </tbody>
    </table>

    <h3 class="m-h3">config.fields 項目結構</h3>
    <table class="m-table">
        <thead><tr><th>屬性</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">name</code><span class="m-req">必填</span></td><td><span class="m-type">string</span></td><td>欄位的 <code class="m-code">name</code> 屬性值，用於產生 <code class="m-code">[name="..."]</code> 選擇器。</td></tr>
            <tr><td><code class="m-code">errorKey</code><span class="m-req">必填</span></td><td><span class="m-type">string</span></td><td>驗證失敗時寫入 error 物件的 key 名稱。</td></tr>
            <tr><td><code class="m-code">condition</code><span class="m-opt">選填</span></td><td><span class="m-type">function</span></td><td>回傳 <code class="m-code">false</code> 時跳過此欄位，用於條件式必填。</td></tr>
        </tbody>
    </table>

    <h3 class="m-h3">config.groups 項目結構</h3>
    <p class="m-p">用於表單中重複出現的區塊（如多筆聯絡人、多項商品）。驗證時對每個符合 <code class="m-code">itemSelector</code> 的元素逐一執行，並以區塊索引（從 1 起算）自動補上 errorKey 後綴。</p>
    <table class="m-table">
        <thead><tr><th>屬性</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">itemSelector</code><span class="m-req">必填</span></td><td><span class="m-type">string</span></td><td>重複區塊的 CSS 選擇器。</td></tr>
            <tr><td><code class="m-code">fields</code><span class="m-req">必填</span></td><td><span class="m-type">Array</span></td><td>區塊內的欄位規則，以 <code class="m-code">namePrefix</code> / <code class="m-code">errorKeyPrefix</code> 取代 <code class="m-code">name</code> / <code class="m-code">errorKey</code>。</td></tr>
        </tbody>
    </table>

    <table class="m-table">
        <thead><tr><th>groups.fields 屬性</th><th>型別</th><th>說明</th></tr></thead>
        <tbody>
            <tr><td><code class="m-code">namePrefix</code><span class="m-req">必填</span></td><td><span class="m-type">string</span></td><td>欄位 name 的前綴，產生 <code class="m-code">[name^="prefix"]</code> 選擇器，查找範圍限定在各區塊容器內。</td></tr>
            <tr><td><code class="m-code">errorKeyPrefix</code><span class="m-req">必填</span></td><td><span class="m-type">string</span></td><td>error key 前綴，實際 key 為 <code class="m-code">errorKeyPrefix + 索引</code>（e.g. <code class="m-code">'name_'</code> → <code class="m-code">'name_1'</code>）。</td></tr>
            <tr><td><code class="m-code">condition</code><span class="m-opt">選填</span></td><td><span class="m-type">function</span></td><td>同 <code class="m-code">config.fields</code> 的 <code class="m-code">condition</code>。</td></tr>
        </tbody>
    </table>

    <h2 class="m-h2">基本用法</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-kw">const</span> error = <span class="t-fn">validateFields</span>({
    form: <span class="t-fn">$</span>(<span class="t-str">'#contactForm'</span>),
    fields: [
        { name: <span class="t-str">'name'</span>,    errorKey: <span class="t-str">'name'</span> },
        { name: <span class="t-str">'email'</span>,   errorKey: <span class="t-str">'email'</span> },
        { name: <span class="t-str">'message'</span>, errorKey: <span class="t-str">'message'</span> }
    ]
});

<span class="t-kw">if</span> (Object.<span class="t-fn">keys</span>(error).length) {
    <span class="t-cmt">/* 有失敗項目，error 形如 { name: true, email: true } */</span>
    <span class="t-fn">handleError</span>(error);
    <span class="t-kw">return</span>;
}

<span class="t-fn">submitForm</span>();</pre>
    </div>

    <h2 class="m-h2">條件式必填</h2>
    <p class="m-p"><code class="m-code">condition</code> 回傳 <code class="m-code">false</code> 時跳過驗證，用於只在特定情況下才必填的欄位。</p>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-kw">const</span> error = <span class="t-fn">validateFields</span>({
    form: <span class="t-fn">$</span>(<span class="t-str">'#orderForm'</span>),
    fields: [
        {
            name:     <span class="t-str">'delivery_address'</span>,
            errorKey: <span class="t-str">'delivery_address'</span>,
            condition: () => <span class="t-str">'delivery'</span> === <span class="t-fn">$</span>(<span class="t-str">'[name="shipping"]:checked'</span>).<span class="t-fn">val</span>()
        }
    ]
});</pre>
    </div>

    <h2 class="m-h2">重複區塊驗證（groups）</h2>
    <div class="m-codeblock">
        <div class="m-codeblock__header"><span class="m-codeblock__lang">javascript</span></div>
        <pre class="m-codeblock__pre"><span class="t-kw">const</span> error = <span class="t-fn">validateFields</span>({
    form: <span class="t-fn">$</span>(<span class="t-str">'#memberForm'</span>),
    fields: [
        { name: <span class="t-str">'title'</span>, errorKey: <span class="t-str">'title'</span> }
    ],
    groups: [
        {
            itemSelector: <span class="t-str">'.j-member-item'</span>,
            fields: [
                { namePrefix: <span class="t-str">'member_name_'</span>,  errorKeyPrefix: <span class="t-str">'member_name_'</span> },
                { namePrefix: <span class="t-str">'member_email_'</span>, errorKeyPrefix: <span class="t-str">'member_email_'</span> }
            ]
        }
    ]
});

<span class="t-cmt">/* 若有 3 個 .j-member-item，error 可能形如：
   { member_name_2: true, member_email_3: true } */</span></pre>
    </div>

    <div class="m-callout m-callout--info">
        <span class="m-callout__icon">ℹ</span>
        <p><code class="m-code">groups</code> 的欄位查找使用 <code class="m-code">[name^="prefix"]</code>，範圍限定在各自的 <code class="m-code">itemSelector</code> 容器內，各區塊互不干擾。</p>
    </div>
</article>`

    };


    /* ── 注入 window.DOCS_NAV 與 <template> 元素至 body ── */
    window.DOCS_NAV = window.DOCS_NAV || [];
    window.DOCS_NAV.push(NAV);

    Object.entries(TEMPLATES).forEach(([id, html]) => {
        const tpl = document.createElement('template');
        tpl.id = 'tpl-' + id;
        tpl.innerHTML = html.trim();
        document.body.appendChild(tpl);
    });

})();
