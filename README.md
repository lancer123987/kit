# 專案開發規範 (Development Standards)

---

## 🟨 JavaScript 規範

### 1. 邏輯判斷 (Yoda Conditions)
為了避免在判斷式中發生賦值錯誤（例如將 `==` 誤寫為 `=`），必須將**常量放在左側**。

* **正確寫法**：`if ('string' === type)`
* **錯誤寫法**：`if (type === 'string')`

> [!TIP]
> **Yoda Conditions 的例外情況：**
> 當判斷式僅涉及變數的真假值（Truthy/Falsy）時，允許直接使用變數簡寫：
> * `if (variable)` 或 `if (!variable)`
> * `if (el.classList.contains('active'))`


### 2. 註解規範
請統一使用標準塊狀註解，並針對函式參數進行說明，禁止使用過於簡略的單行註解。

* **註解風格**：統一採用 `/* ... */` 格式。
* **函式註解**：須包含 `@param` 與 `@return` 說明。

<br><br><br><br>

## 🟩 css 規範

### 1. BEM 命名架構
* 全域採用 BEM (Block, Element, Modifier) 命名法，嚴格區隔元件結構與狀態。
* 範例：.index (Block), .index__box (Element)

### 2. 前綴說明
為了快速識別作用範圍，請務必遵循前綴規則：
* c- (Common)：跨頁面使用的共用項目/元件。
* p- (Page)：僅限該頁面使用的專屬共用項目。

### 3. 保留 Class 使用限制
特定顏色敘述之 Class（如 .red）為保留名稱，僅允許用於定義 color 或 background 等視覺狀態，禁止用於結構佈局。

### 4. 數值撰寫規範 (小數點省略)
* **正確寫法**：`opacity: .5; / margin: .25em;`
* **錯誤寫法**：`opacity: 0.5;`