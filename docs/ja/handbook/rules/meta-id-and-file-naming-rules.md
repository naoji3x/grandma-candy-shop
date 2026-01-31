---
id: meta-id-and-file-naming-rules
type: meta
title: ドキュメントIDおよびファイル命名ルール
status: draft
---

Document ID and File Naming Rules

## 1. 目的

本ルールは、ドキュメント間の参照性・可読性・機械処理性・長期運用性を確保するために、

- **ドキュメントID**
- **ファイル名**

の命名規則と両者の関係を明確に定義することを目的とする。

本ルールにより、以下を同時に満たすことを目指す。

- 人間が見て意味を推測できること
- 機械（lint / CI / 生成AI）が安定して扱えること
- 構造変更や文書分割に耐えられること

## 2. 基本方針

### 2.1. IDとファイル名の役割分離

- **ドキュメントID**
  → 文書の**意味的・論理的な識別子**（参照・永続性の軸）

- **ファイル名**
  → 人間が扱いやすい**表示・管理上の名前**（配置・日本語表現を許容）

ID とファイル名は **一致させてもよいが、必須ではない**。

### 2.2. IDの不変性・ファイル名の可変性

- ドキュメントIDは **一意かつ原則変更不可**
- ファイル名は **表示改善・構成変更のために変更可**

## 3. クイックサマリー（要点）

### 3.1. ドキュメントID

- 形式：`<prefix>-<body>`
  - 種類がある場合は、`<prefix>-<kind>-<body>`
- `<body>`も含め`kebab-case`: 英小文字 + 数字 + `-`
- **名詞句**で表現（動詞開始は禁止）
- 一覧・構造文書：`<prefix>-index`
- 概説・前提文書：`<prefix>-overview`
- `main` は使用しない
- IDは原則変更不可。変更時は `supersedes` で置換関係を表現

### 3.2. ファイル名

- **日本語可**
- 表示用途として「全体構成」「共通」などの語を使用してよい
- IDとの対応関係はメタ情報で保証する

---

<details>
<summary>詳細ルール</summary>

## 4. ドキュメントIDの命名ルール

### 4.1. 使用可能文字

- 英小文字（a–z）
- 数字（0–9）
- ハイフン（`-`）

```plaintext
^[a-z0-9][a-z0-9-]*$
```

### 4.2. 表記形式

- **kebab-case**
- 大文字、アンダースコア、記号は使用しない

### 4.3. 基本構造

```plaintext
<prefix>-<body>
<prefix>-<kind>-<body>
```

- `prefix`：ドキュメント種別（固定）
- `kind` : prefixを拡張するカテゴリ（固定）
- `body`：内容を表す名詞句

例：

- `uts-index`
- `sf-product-register`
- `br-discount`
- `ifx-msg-stock-changed`

### 4.4. kind の命名原則

- `<kind>` は語彙を固定し、同義語の混在を禁止する
  - 例：`api`, `msg`, `file`
  - `message`, `messages`, `files` 等は使用しない
- `<prefix>-<kind>-<body>` 以上の多段 prefix は使用しない

OK

- `ifx-api-inventory`

NG

- `ifx-external-api-inventory`

### 4.5. body の命名原則

- 名詞句で表現する
- 動詞単体で始めない
- 「何についての文書か」が分かることを優先する

OK

- `product-register`
- `order-summary`
- `inventory-adjustment`

NG

- `register-product`
- `edit-order`
- `create-invoice`

### 4.6. index / overview / common の扱い（ID）

| 種別     | ID suffix   | 役割                             |
| -------- | ----------- | -------------------------------- |
| overview | `-overview` | 概念・前提の説明（構造ナビなし） |
| index    | `-index`    | 系列の全体構成・ナビゲーション   |
| common   | `-common`   | 横断的・共有定義（系列外）       |

## 5. ファイル命名ルール

### 5.1. 基本方針

- ファイル名は **人間向け**
- 日本語を使用してよい
- IDと1対1で対応させる

### 5.2. ファイル名の基本構成（推奨）

```plaintext
<日本語文書名>.md
```

例：

| ドキュメントID  | ファイル名例                 |
| --------------- | ---------------------------- |
| `uts-index`     | `単体テスト仕様-全体構成.md` |
| `uts-inventory` | `単体テスト仕様-在庫管理.md` |
| `bdd-common`    | `業務データ辞書-共通.md`     |
| `tsp-overview`  | `テスト戦略・方針.md`        |

### 5.3. suffix 表記ルール（ファイル名）

| ID種別      | ファイル名での表現         |
| ----------- | -------------------------- |
| `-index`    | `-全体構成`                |
| `-common`   | `-共通`                    |
| `-overview` | **原則 suffix を付けない** |

> overview は「派生がある」ように見せないため、
> ファイル名そのものに意味語（戦略・方針・概要など）を含める。

## 6. IDとファイル名の対応ルール

- すべてのドキュメントは **IDをメタ情報として保持**する
- ファイル名変更時も ID は不変
- 参照・リンク・トレースは **必ずIDで行う**

## 7. 参照構造ルール

| 種別     | 構造的参照                  |
| -------- | --------------------------- |
| overview | 下位 → overview             |
| index    | index ⇄ 下位                |
| common   | 他 → common（構造親子なし） |

## 8. IDの変更・置換ルール

- IDは原則変更不可
- 変更が必要な場合は、新IDを作成し、旧IDに `supersedes` を記載する

```yaml
supersedes:
  - api-order-get-v1
```

## 9. NGパターン

| パターン            | 理由                      |
| ------------------- | ------------------------- |
| `Order_API_v1`      | 大文字・記号              |
| `create-order-api`  | 動詞主導                  |
| `uts-list`          | 一覧は `index`            |
| `bdd-main`          | 役割が曖昧（非推奨）      |
| `ifx-inventory-api` | kind は prefix 直後に置く |

## 10. 運用指針

- 迷ったら **「これは何についての文書か？」を名詞で考える**
- 構造は index、前提説明は overview、横断定義は common
- IDは設計資産、ファイル名は表示資産として扱う
- lint / CI / 生成AI が ID を正として扱うことを前提にする

## 11. 付録：ドキュメント種別と prefix 対応（抜粋）

</details>

---

## 12. 用語の対応表

日本語の用語と英語の予約語・用語は以下のように対応させてください。

### 12.1. 予約語と日本語名称との対応

| 予約語          | 日本語名称             | 意味・役割                     |
| --------------- | ---------------------- | ------------------------------ |
| **index**       | **全体構成**           | 系列の全体構成・ナビゲーション |
| **common**      | **共通**               | 横断的・共有定義               |
| **overview**    | **概要、方針、戦略等** | 概念・前提の説明               |
| **rules**       | **ルール**             | 強制ルール・規約（逸脱不可）   |
| **instruction** | **指示テンプレート**   | 作成手順・生成AI向け指示       |
| **guide**       | **ガイド**             | 案内・読み物・使い方           |

## 13. 主要な英語用語と日本語用語との対応

| 英語用語                | 日本語用語   | 意味                                               |
| ----------------------- | ------------ | -------------------------------------------------- |
| **need**                | **要求**     | ユーザー・業務の目的・欲求・困りごと               |
| **requirement**         | **要件**     | システムとして満たすべき条件                       |
| **specification**       | **仕様**     | システムに守らせるルール（テストで合否判定できる） |
| **design**              | **設計**     | 構造・方式・構成としてどう実現するか               |
| **implementation**      | **実装**     | コード・設定としての実現                           |
| **definition**          | **定義**     | 世界の言葉・概念（正誤や合否を判定しない）         |
| **constraint**          | **制約**     | 設計・実装に課される制限条件                       |
| **acceptance criteria** | **受入条件** | 利用者視点での合格基準                             |

## 14. ドキュメント種別とプレフィックスの対応表

| 種別                 | English                                 | prefix    | 例                             |
| -------------------- | --------------------------------------- | --------- | ------------------------------ |
| 概念データフロー図   | Conceptual Data Flow Diagram            | cdfd-     | cdfd-overview                  |
| 概念クラス図         | Conceptual Class Diagram                | ccd-      | ccd-customer                   |
| 業務データ辞書       | Business Data Dictionary                | bdd-      | bdd-common, bdd-sales          |
| 概念データストア定義 | Conceptual Data Store Definition        | cdsd-     | cdsd-common, cdsd-sales        |
| 保管場所定義         | Storage Location Definition             | sld-      | sld-common, sld-sales          |
| ステータス定義       | Status Definition                       | stsd-     | stsd-product                   |
| 分類定義             | Classification Definition               | cld-      | cld-product                    |
| 概念状態遷移図       | Conceptual State Transition Diagram     | cstd-     | cstd-product                   |
| 業務プロセス仕様     | Business Process Specification          | bps-      | bps-order-flow                 |
| ビジネスルール       | Business Rule                           | br-       | br-discount                    |
| 画面仕様             | UI Specification                        | uis-      | uis-order-edit                 |
| 帳票仕様             | Business Document Specification         | bds-      | bds-order-summary              |
| システム化機能       | System Function                         | sf-       | sf-index, sf-product-register  |
| 業務イベント仕様     | Business Event Specification            | bes-      | bes-index, bes-order-approved  |
| 業務受入条件         | Business Acceptance Criteria            | bac-      | bac-order-approved             |
| 用語集               | Glossary                                | gl-       | gl-sales                       |
| 用語集の用語         | Glossary Term                           | tm-       | tm-reorder-point               |
| 外部システムI/F      | External System Interface               | ifx-      | ifx-index                      |
| 外部API仕様          | External API Specification              | ifx-api-  | ifx-api-inventory              |
| 外部ファイル連携仕様 | External File Exchange Specification    | ifx-file- | ifx-file-order                 |
| 外部メッセージ仕様   | External Message Specification          | ifx-msg-  | ifx-msg-stock-changed          |
| コンテキスト図       | Context Diagram                         | cxd-      | cxd-customer                   |
| コンテナ図           | Container Diagram                       | cnd-      | cnd-customer                   |
| コンポーネント図     | Component Diagram                       | cpd-      | cpd-inventory                  |
| インフラ構成図       | Infrastructure Diagram                  | ifd-      | ifd-overview                   |
| 技術スタック定義     | Technology Stack Definition             | tsd-      | tsd-overview                   |
| 非機能要件           | Non-Functional Requirements             | nfr-      | nfr-performance                |
| システム受入条件     | System Acceptance Criteria              | sac-      | sac-performance                |
| テスト戦略・方針     | Test Strategy and Policy                | tsp-      | tsp-overview                   |
| テスト観点・条件     | Test Perspectives and Conditions        | tpc-      | tpc-order-process              |
| 単体テスト仕様       | Unit Test Specification                 | uts-      | uts-index, uts-product-service |
| 単体テスト設計       | Unit Test Design                        | utd-      | utd-index, utd-product-service |
| 内部結合テスト仕様   | Internal Integration Test Specification | its-      | its-index, its-order-api       |
| 内部結合テスト設計   | Internal Integration Test Design        | itd-      | itd-index, itd-order-api       |
| 外部結合テスト仕様   | External Integration Test Specification | ets-      | ets-index, ets-order-process   |
| 外部結合テスト設計   | External Integration Test Design        | etd-      | etd-index, etd-order-process   |
| 総合テスト仕様       | System Test Specification               | sts-      | sts-index, sts-order-flow      |
| 総合テスト設計       | System Test Design                      | std-      | std-index, std-order-flow      |
| 受入テスト仕様       | Acceptance Test Specification           | ats-      | ats-index, ats-order-payment   |
| 受入テスト設計       | Acceptance Test Design                  | atd-      | atd-index, atd-order-payment   |
