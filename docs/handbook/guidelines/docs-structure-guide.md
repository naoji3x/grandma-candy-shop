# ドキュメント構成ガイド

## ドキュメントの分類

### 📦 プロダクトドキュメント

プロダクトの最新状況を説明するドキュメントです。プロダクトを新規に構築する際に作成されて、プロダクトを改修する毎に更新されます。
プロダクトの、

- 要件〜設計に関する定義
- 品質保証に関する定義
- 移行に関する定義

について記載します。プロダクトのライフサイクルにわたって管理されます。

プロダクトドキュメントは、

- 常に「現在の正」を表します。
- プロジェクト固有の判断や経緯は含めず、必要な場合はプロジェクトドキュメントから反映されます。
- ドキュメントの改定履歴はバージョン管理システムで管理します。

### 🎯 プロジェクトドキュメント

プロダクトの構築時や改修時に、プロジェクト毎に作成されるドキュメントです。個別プロジェクト毎の、

- 業務要求: 目的・狙い、スコープ、課題と対策
- プロジェクトマネジメント

について記載します。プロジェクト完了後はアーカイブされます。

## 前提となる工程のフロー

| フェーズ | 用語                   | このガイドでの意味                        |
| -------- | ---------------------- | ----------------------------------------- |
| 1        | 要求（Needs）          | ユーザー・業務の**目的・欲求・困りごと**  |
| 2        | 要件（Requirements）   | システムとして**満たすべき条件**          |
| 3        | 仕様（Specifications） | 振る舞い・I/F・ルールを**曖昧さなく定義** |
| 4        | 設計（Design）         | 構造・方式・構成として**どう実現するか**  |
| 5        | 実装（Implementation） | コード・設定としての実現                  |

## ドキュメントオーナー

ドキュメントのオーナーは、以下の通りです。

| オーナー         | 記号 | 略称 | 役割                       |
| ---------------- | ---- | ---- | -------------------------- |
| ビジネスオーナー | 🧭   | BO   | 最終的な価値判断の主体     |
| エンジニア       | ⚙️   | EN   | 技術的実現と品質判断の主体 |

## ドキュメントの構成

### 凡例

```mermaid
flowchart TB
  プロダクトドキュメント["📦プロダクト<br>ドキュメント<br>オーナー"]
  プロジェクトドキュメント["🎯プロジェクト<br>ドキュメント<br>オーナー"]
  成果物((成果物))
  classDef projectWise fill:#fff3bf,stroke:#f08c00,color:#000;
  classDef productSpec fill:#d0ebff,stroke:#1c7ed6,color:#000;

  class プロジェクトドキュメント projectWise;
  class プロダクトドキュメント,成果物 productSpec;
```

### ドキュメント構成図

```mermaid
flowchart TB
  subgraph Project[プロジェクト]
  direction TB
    subgraph Needs[要求]
      direction TB
      OBJ["目的・狙い<br>🧭"]
      SCP["スコープ<br>🧭"]
      CS["課題と対策<br>🧭"]
    end
    PM["プロジェクトマネジメント<br>🧭 / ⚙️"]
  end

  subgraph D2M[開発〜移行]
    direction TB
    subgraph D2T[開発〜テスト]
      direction TB
      subgraph Product[プロダクト]
      direction LR
        BM((ビジネス<br>モデル))
        Data((データ))
        Srv((サービス))
        BM<-->Data<-->Srv
        BM<-->Srv
      end

      subgraph Development[プロダクトの要件〜設計]
      direction TB
        subgraph BusinessSpec[業務仕様群（要件含む）]
          BS["業務仕様<br>🧭"]
          EI["外部I/F仕様<br>🧭 / ⚙️"]
        end
        SD["システム設計<br>⚙️"]
        ACH["アーキテクチャ設計<br>⚙️"]
        BS-->SD
        EI-->SD
        ACH-->SD
      end

      subgraph Quality[プロダクトの品質保証]
      direction TB
          NFR["非機能要件<br>🧭 / ⚙️"]
          BAC["業務受入条件（仕様）<br>🧭"]
          SAC["システム受入条件（仕様）<br>⚙️"]
          TST["テスト仕様・設計・実装<br>🧭 / ⚙️"]
          NFR-->SAC-->TST
          BAC-->TST
      end

      Development-->|実装|Product
      Quality-->|品質保証|Product
    end
    subgraph Migration[移行]
      MYG["移行設計<br>🧭 / ⚙️"]
    end
    D2T<-->Migration
  end

  subgraph Operation[運用]
    OPS["運用設計<br>🧭 / ⚙️"]
  end

  Project <-->|目的・狙い／マネジメント| D2M <-->Operation

  classDef projectWise fill:#fff3bf,stroke:#f08c00,color:#000;
  classDef productSpec fill:#d0ebff,stroke:#1c7ed6,color:#000;

  class OBJ,SCP,CS,PM,MYG projectWise;
  class BS,EI,ACH,SD,NFR,BAC,SAC,TST,BM,Data,Srv,OPS productSpec;
```

※補足事項

- 図中のアーキテクチャ設計は、個別仕様に先立つ全体構造の設計を表します。
- 「要件含む」とは、業務仕様の冒頭に業務要件相当（対象範囲・成功条件・制約等）を含めることを指します。
