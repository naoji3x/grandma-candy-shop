# ドキュメントのメタ情報の記述ルール

## 1. メタ情報概要

機械可読性を向上する目的で、各ドキュメントのヘッダー部に属性情報を記述します。

- 参照スキーマ: `docs/tools/schemas/spec-frontmatter.schema.yaml`
- Markdownの場合は、記述は YAML Front Matter を想定（各仕様ドキュメントの先頭）。
- YAML/JSON や他フォーマットの場合は、同等のメタ情報を持つこと。

## 2. メタ情報項目一覧

| 項目       | 説明                          | 必須 |
| ---------- | ----------------------------- | ---- |
| id         | ドキュメントID (xxx-xxx-xxxx) | ○    |
| type       | ドキュメントの種類            | ○    |
| title      | ドキュメント名                | ○    |
| status     | ドキュメントの状態            | ○    |
| version    | バージョン                    | 任意 |
| owners     | 担当者                        | 任意 |
| tags       | タグ・分類                    | 任意 |
| depends_on | 技術的・定義的な土台（前提）  | 任意 |
| implements | 満たすべきビジネスルール      | 任意 |
| tests      | この仕様を検証するテスト仕様  | 任意 |
| supersedes | 置き換え関係（古仕様→新仕様） | 任意 |

## 3. 各項目の詳細ルール

### 3.1. id(ドキュメントID)

- 必須項目
- 一意なID（正規表現に準拠）
- 文字列。`^[a-z0-9][a-z0-9-]*$` に完全一致。英小文字・数字・ハイフンのみ、先頭は英小文字または数字

### 3.2. type(ドキュメントの種類)

- 必須項目
- ドキュメントの種別

下表の定義済み列挙に限定

| 種類         | 説明                                               |
| ------------ | -------------------------------------------------- |
| screen       | 画面仕様                                           |
| api          | API仕様                                            |
| domain       | ドメイン仕様                                       |
| data         | データ仕様                                         |
| test         | テスト仕様                                         |
| flow         | 業務フロー仕様                                     |
| rule         | 業務ルール仕様                                     |
| architecture | 構造・構成（C4、配置、統合、ネットワーク境界など） |
| decision     | 設計判断（ADR的な意思決定記録）                    |

### 3.3. title(ドキュメント名)

- 必須項目
- ドキュメント名（1文字以上）
- ドキュメントの内容が一目で分かる名称

### 3.4. status(ドキュメントの状態)

- 必須項目
- ドキュメントの公開状態

下表の定義済み列挙に限定

| 種類       | 説明     |
| ---------- | -------- |
| draft      | 下書き中 |
| ready      | 公開済み |
| deprecated | 廃止済み |

### 3.5. version(バージョン)

- 任意項目
- 文字列（SemVer 2.0.0）。`X.Y.Z[-prerelease][+build]`
  - 例: `1.0.0`、`1.2.3-alpha.1`、`2.0.0+build.5`

### 3.6. owners(担当者)

- 任意項目
- メールアドレス文字列の配列（重複不可、形式は `email`）

### 3.7. tags(タグ・分類)

- 任意項目
- 1文字以上の文字列の配列（重複不可）

### 3.8. depends_on

- 任意項目
- 技術的・定義的な土台（前提）、上位概念となるドキュメント
- `id` の配列（重複不可、未指定時は空配列）

### 3.9. implements

- 任意項目
- 満たすべきビジネスルールを定義したドキュメント
- `id` の配列（重複不可、未指定時は空配列）

### 3.10. tests

- 任意項目
- この仕様を検証するテスト仕様ドキュメント
- `id` の配列（重複不可、未指定時は空配列）

### 3.11. supersedes

- 任意項目
- 置き換え関係（古仕様→新仕様）を示すドキュメント
- `id` の配列（重複不可、未指定時は空配列）

## 4. バリデーション指針

- スキーマに準拠しない場合は PR をブロック（lint/CI で検知）
- 未定義プロパティは不可（`additionalProperties: false`）。
- `id` 配列項目は重複禁止（`uniqueItems: true`）。
- `version` は SemVer のみ許可。枝番や枝記号はスキーマに従う。
- 省略可能項目（owners/tags/depends_on 等）は、未指定時に空配列 `[]` を許容。

## 5. 記述例

```yaml
---
id: api-get-order-v1
type: api
title: 注文API仕様
version: 1.2.0
status: ready
owners:
  - maintainer@example.com
tags:
  - order
  - backend
depends_on: []
implements: []
tests: [api-get-order-tests]
supersedes: [api-get-order-v0]
---
```

- NG例: `id: Order_API_v1`（大文字・アンダースコアNG）, `status: public`（列挙外）, `extra: foo`（未定義プロパティNG）
- OK例: `id: order-api-v1`, `status: ready`, `version: 1.2.3`, `owners: [owner@example.com]`
