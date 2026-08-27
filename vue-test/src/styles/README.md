# PawPuff 樣式分工規範

本目錄依 Vue 所有權拆分 CSS，新增或修改畫面時請遵守以下規則。

## 目錄用途

- `views/`：路由頁面專用樣式，檔名與 Vue 頁面一致。
- `components/`：可重複使用元件的專用樣式，檔名與 Vue 元件一致。
- `App.css`：只放 `App.vue` 外框與頁面轉場樣式。
- `../assets/main.css`：只放設計變數、CSS reset、全域可及性與共用基礎規則。

## 新增頁面

建立 `src/views/ExampleView.vue` 時，應同步建立：

```text
src/styles/views/ExampleView.css
```

並在 `ExampleView.vue` 最下方載入：

```vue
<style src="../styles/views/ExampleView.css"></style>
```

## 新增元件

建立 `src/components/example/ExampleCard.vue` 時，應同步建立：

```text
src/styles/components/ExampleCard.css
```

並依 Vue 檔案所在層級使用正確的相對路徑載入。

## 編輯原則

1. 頁面專用選擇器、動畫與響應式規則必須放在該頁面的 CSS。
2. 元件專用選擇器、動畫與響應式規則必須放在該元件的 CSS。
3. 不要將頁面或元件樣式新增回 `assets/main.css`。
4. 選擇器使用頁面或元件前綴，例如 `.faq-*`、`.team-*`、`.chat-*`，避免跨檔案衝突。
5. 只有確實被多個頁面使用的基礎規則才可提升為全域樣式。
