# ドキュメントID命名ルール

（ID Naming Rules）

## 1. 目的

本ルールは、ドキュメント間の参照性・機械可読性・長期運用性を確保するため、
ドキュメントIDの命名規則を統一することを目的とする。

- 人間が見て意味を推測できること
- 機械（lint / CI / 生成AI）が安定して扱えること
- 将来的な追加・変更に耐えられること

## 2. 基本方針

- ドキュメントIDは **一意で永続的** な識別子とする
- IDは **内容の本質（何についての文書か）** を表し、構造や配置には依存しない
- IDの変更は原則禁止とし、変更が必要な場合は置換関係で表現する

## 3. クイックサマリー（要点）

- ドキュメントIDは `prefix-body` の形式とする
- prefix はドキュメント種別を表す
- body は名詞句で表現し、動詞で始めない
- 一覧・集約文書は `<prefix>-index`
- 概説・入口文書は `<prefix>-overview`
- `main` は使用しない
- ID は原則変更不可。変更時は `supersedes` で置換関係を表す

---

<details>
<summary>詳細ルール：文字・構造・命名</summary>

## 4. 文字・形式ルール

### 4.1. 使用可能文字

- 英小文字（a–z）
- 数字（0–9）
- ハイフン（`-`）

正規表現：

```plaintext
^[a-z0-9][a-z0-9-]*$
```

### 4.2. 表記形式

- **kebab-case**（小文字・ハイフン区切り）を使用する
- 大文字、アンダースコア、記号は使用しない

## 5. IDの構造

### 5.1. 基本構造

```plaintext
<prefix>-<body>
```

- `prefix`：ドキュメントの**種別**を表す（固定）
- `body`：ドキュメントの**識別部**を表す

例：

- `uts-index`
- `sf-product-register`
- `api-order-get-v1`

## 6. prefix のルール

- prefix は **ドキュメント種別を表す略語**とする
- prefix 一覧は別途定義された表に従う
- prefix は **意味が一意で衝突しないこと**を保証する

例：

- `sf`：System Function
- `uts`：Unit Test Specification
- `utd`：Unit Test Design
- `api`：API Specification

## 7. body の命名ルール

### 7.1. 原則

- `<body>` は **名詞句**で表現する
- **動詞単体で始めない**
- 「何についての文書か」が分かることを優先する

#### 7.1.1. OK

- `product-register`
- `order-summary`
- `inventory-adjustment`

#### 7.1.2. NG

- `register-product`
- `edit-order`
- `create-invoice`

### 7.2. 一覧・親文書（Index）

- 一覧・集約・親文書は **`index` を使用する**
- prefix ごとに 1 つを原則とする

```plaintext
<prefix>-index
```

例：

- `uts-index`
- `sf-index`
- `api-index`

### 7.3. 概説・入口文書（Overview）

- 全体説明・導入目的の文書には `overview` を使用する

```plaintext
<prefix>-overview
```

例：

- `tsp-overview`
- `cdfd-overview`

### 7.4. 対象別文書

```plaintext
<prefix>-<domain>-<subject>
```

- `domain`：業務・技術上の大分類
- `subject`：対象・機能・関心事

例：

- `sf-product-register`
- `uts-inventory`
- `api-order-get`

#### 7.4.1. 階層が必要な場合

```plaintext
<prefix>-<domain>-<subject>-<qualifier>
```

例：

- `api-order-get-v1`
- `sf-payment-refund-manual`

## 8. 予約語

以下の語は **特別な意味を持つ予約語**とし、意図なく使用しない。

- `index`
- `overview`
- `rules`
- `instruction`
- `guide`

`main` は役割が曖昧なため、ドキュメントIDには使用しない。

例：

- `sf-index`（◯）
- `sf-index-feature`（×：index は予約語）

## 9. 略語の使用ルール

- 略語は以下に限定する
  1. 一般的に広く認知されているもの
     （例：`api`, `ui`, `db`, `id`, `json`, `yaml`）
  2. 本リポジトリで prefix として定義されたもの

- 新しい略語を導入する場合は、略語一覧に追加しレビューで承認する

</details>

---

<details>
<summary>詳細ルール：運用・変更・例</summary>

## 10. IDの変更・置換ルール

- IDは原則 **変更不可**
- 内容変更により ID を変える必要がある場合は、新IDを作成し、
  旧ドキュメントに `supersedes` を設定する

例：

```yaml
supersedes:
  - api-order-get-v1
```

## 11. NGパターンまとめ

| パターン               | 理由                   |
| ---------------------- | ---------------------- |
| `Order_API_v1`         | 大文字・アンダースコア |
| `create-order-api`     | 動詞主導で不安定       |
| `sf-rules-instruction` | 予約語の誤用           |
| `uts-list`             | 一覧は `index` を使用  |

## 12. OK例まとめ

- `sf-index`
- `sf-product-register`
- `uts-index`
- `uts-product-service`
- `api-order-get-v2`

## 13. 補足（運用指針）

- 迷ったら「**これは何についての文書か？**」を名詞で表現する
- 判断に迷う ID はレビューで確定させ、後出し変更を避ける
- 機械チェック（lint/CI）で違反を検出することを前提とする

</details>

---

## 14. 用語の対応表

日本語の用語と英語の予約語・用語は以下のように対応させてください。

### 14.1. 予約語と日本語名称との対応

| 予約語          | 日本語名称           | 意味・役割                           |
| --------------- | -------------------- | ------------------------------------ |
| **index**       | **一覧**             | 一覧・集約・親文書（ナビゲーション） |
| **overview**    | **全体概要**         | 概説・入口文書（読むための導線）     |
| **rules**       | **ルール**           | 強制ルール・規約（逸脱不可）         |
| **instruction** | **指示テンプレート** | 作成手順・生成AI向け指示             |
| **guide**       | **ガイド**           | 案内・読み物・使い方                 |

## 15. 主要な英語用語と日本語用語との対応

| 英語用語                | 日本語用語   | 意味                                               |
| ----------------------- | ------------ | -------------------------------------------------- |
| **need**                | **要求**     | ユーザー・業務の目的・欲求・困りごと               |
| **requirement**         | **要件**     | システムとして満たすべき条件                       |
| **definition**          | **定義**     | 世界の言葉・概念（正誤や合否を判定しない）         |
| **specification**       | **仕様**     | システムに守らせるルール（テストで合否判定できる） |
| **design**              | **設計**     | 構造・方式・構成としてどう実現するか               |
| **implementation**      | **実装**     | コード・設定としての実現                           |
| **constraint**          | **制約**     | 設計・実装に課される制限条件                       |
| **acceptance criteria** | **受入条件** | 利用者視点での合格基準                             |

## 16. ドキュメント種別とプレフィックスの対応表

| 種別                 | English                                            | prefix | 例                                  |
| -------------------- | -------------------------------------------------- | ------ | ----------------------------------- |
| 概念データフロー図   | Conceptual Data Flow Diagram                       | cdfd-  | cdfd-overview                       |
| 概念クラス図         | Conceptual Class Diagram                           | ccd-   | ccd-customer                        |
| 業務データ辞書       | Business Data Dictionary                           | bdd-   | bdd-main                            |
| 概念データストア定義 | Conceptual Data Store Definition                   | cdsd-  | cdsd-main                           |
| 保管場所定義         | Storage Location Definition                        | sld-   | sld-main                            |
| ステータス定義       | Status Definition                                  | stsd-  | stsd-product                        |
| 分類定義             | Classification Definition                          | cld-   | cld-product                         |
| 概念状態遷移図       | Conceptual State Transition Diagram                | cstd-  | cstd-product                        |
| 業務プロセス仕様     | Business Process Specification                     | bps-   | bps-order-flow                      |
| ビジネスルール       | Business Rule                                      | br-    | br-discount                         |
| 画面仕様             | UI Specification                                   | uis-   | uis-order-edit                      |
| 帳票仕様             | Business Document Specification                    | bds-   | bds-order-summary                   |
| システム化機能       | System Function                                    | sf-    | sf-index, sf-product-register (注1) |
| 業務イベント仕様     | Business Event Specification                       | bes-   | bes-index, bes-order-approved       |
| 業務受入条件         | Business Acceptance Criteria                       | bac-   | bac-order-approved                  |
| 用語集               | Glossary                                           | gl-    | gl-sales                            |
| 用語集の用語         | Glossary Term                                      | tm-    | tm-reorder-point                    |
| 外部システムI/F      | External System Interface                          | ei-    | ei-index                            |
| 外部API仕様          | External API Specification                         | ei-    | ei-inventory-api                    |
| 外部ファイル連携仕様 | External File Exchange Specification               | ei-    | ei-order-file                       |
| 外部メッセージ仕様   | External Message Specification                     | ei-    | ei-stock-changed-message            |
| コンテキスト図       | Context Diagram                                    | cxd-   | cxd-customer                        |
| コンテナ図           | Container Diagram                                  | cnd-   | cnd-customer                        |
| コンポーネント図     | Component Diagram                                  | cpd-   | cpd-inventory                       |
| インフラ構成図       | Infrastructure Diagram                             | ifd-   | ifd-overview                        |
| 技術スタック定義     | Technology Stack Definition                        | tsd-   | tsd-overview                        |
| 非機能要件           | Non-Functional Requirements                        | nfr-   | nfr-performance                     |
| システム受入条件     | System Acceptance Criteria                         | sac-   | sac-performance                     |
| テスト戦略・方針     | Test Strategy and Policy                           | tsp-   | tsp-overview                        |
| テスト観点・条件     | Test Perspectives and Conditions                   | tpc-   | tpc-order-process                   |
| 単体テスト仕様       | Unit Test Specification (Detailed)                 | uts-   | uts-index, uts-product-service      |
| 単体テスト設計       | Unit Test Design (Detailed)                        | utd-   | utd-index, utd-product-service      |
| 内部結合テスト仕様   | Internal Integration Test Specification (Detailed) | its-   | its-index, its-order-api            |
| 内部結合テスト設計   | Internal Integration Test Design (Detailed)        | itd-   | itd-index, itd-order-api            |
| 外部結合テスト仕様   | External Integration Test Specification (Detailed) | ets-   | ets-index, ets-order-process        |
| 外部結合テスト設計   | External Integration Test Design (Detailed)        | etd-   | etd-index, etd-order-process        |
| 総合テスト仕様       | System Test Specification (Detailed)               | sts-   | sts-index, sts-order-flow           |
| 総合テスト設計       | System Test Design (Detailed)                      | std-   | std-index, std-order-flow           |
| 受入テスト仕様       | Acceptance Test Specification (Detailed)           | ats-   | ats-index, ats-order-payment        |
| 受入テスト設計       | Acceptance Test Design (Detailed)                  | atd-   | atd-index, atd-order-payment        |

（注１）sf- プレフィックスのIDは「システム化機能」という概念を表す識別子であり、業務仕様・システム設計の双方で共通に使用する。
各ドキュメントにおける記述粒度は、ドキュメント種別に従う。
