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