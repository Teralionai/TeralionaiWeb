# 安根創新 AiGenValue 官方網站

安根創新 AiGenValue 的官方網站，靜態 HTML/CSS/JS，部署於 GitHub Pages。

網站定位：**以指令驅動的 AI 建置平台**。用一句話描述需求，即可建置四種企業服務：

1. **官網建置**：品牌官網、產品頁、活動頁，含 SEO 與表單。
2. **公司內部資料系統**：客戶、訂單、庫存、報表與審核流程。
3. **Harness 超級助理與客服系統**：AI 客服前台對話介面，加上對話紀錄、工單與真人接手的後台管理系統。
4. **簽單與發票辨識**：信用卡簽單與發票照片的 AI 欄位辨識，以地端模型建置、資料不外流，線上 Demo 位於 https://invoice.teraliontest.online/ 。

合作廠商：御督科技 https://www.yudutek.com/ （頁尾連結）。

## 項目結構

```
AiGenValueWeb/
├── index.html            # 首頁：產品、運作方式、指令範例、關於我們、聯絡我們
├── styles.css            # 樣式（明亮簡潔主題，CSS 變數定義於 :root）
├── script.js             # 導航、表單、進場動畫、Hero 指令示範、文章篩選
├── aigenvalue-logo.png   # 完整標誌（含字樣，供 Open Graph 分享圖使用）
├── aigenvalue-mark.png   # 標誌圖示（去背，供導覽列與 favicon 使用）
├── CNAME                 # GitHub Pages 自訂網域
└── README.md
```

## 本地預覽

任何靜態伺服器皆可，例如：

```bash
python3 -m http.server 8080
```

然後開啟 http://localhost:8080 。

## 部署到 GitHub Pages

推送到 `main` 分支後，GitHub Pages 會以倉庫根目錄自動部署。自訂網域由 `CNAME` 檔案決定。

更換網域時需一併更新：

- `CNAME`
- `index.html` 中的 `canonical`、`og:url`、`og:image`、`twitter:*` 與結構化資料的網址

## 修改內容

- **公司與產品文案**：直接編輯 `index.html`。
- **指令示範文字**：`script.js` 中 `initHeroConsole` 的 `prompts` 陣列。
- **指令範例卡片**：`index.html` 中 `.example-card` 的 `data-prompt` 屬性。
- **主題色**：`styles.css` 的 `:root` 變數：

```css
:root {
    --accent: #0f5c8c;      /* 主色 */
    --accent-2: #1f8fb8;    /* 輔色（漸層用） */
    --accent-soft: #e8f1f8; /* 淡色背景 */
}
```

## 響應式斷點

- 桌面：1025px 以上
- 平板：769px 到 1024px
- 手機：768px 以下

## 技術棧

- HTML5、CSS3（Grid、Flexbox、CSS 變數）
- 原生 JavaScript（無框架、無建置步驟）
- Font Awesome 6 圖示
- Google Fonts：Inter、Noto Sans TC

## 授權

© 2026 安根創新 AiGenValue. 版權所有.
