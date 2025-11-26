# 用語集(glossary)作成ルール

## サンプル

用語集-ja.yaml

```yaml
terms:
  - id: tm-reorder-point
    term: 発注点
    aliases: [発注基準点]
    definition: 在庫数量がこの値を下回ったときに、発注候補とみなす基準数量。
    notes: 商品ごとに設定。定番商品でのみ利用する。
    category: tm-inventory # 分類（例：会計、販売、在庫など）
    relatedTerms: [tm-safety-stock] # 関連用語（配列）
    source: https://example.com # 出典や参考文献
    status: official # 用語の状態（例：正式、非推奨、廃止予定など）
    example: '発注点を下回ったため、追加発注を行う。' # 例文や使用例

  - id: tm-standard-product
    term: 定番商品
    aliases: [レギュラー商品, 人気商品, 定番]
    definition: 常に棚に置いておきたい、よく売れる商品。
    notes: 発注点・最低在庫数などを設定する対象。

  - id: tm-accounts-receivable
    term: つけ
    definition: 顧客が代金を後払いにする販売形態。「ツケ」とも言う。
    notes: 顧客単位で残高と限度額を管理する。

  - id: tm-grandma
    term: おばあちゃん
    definition: 駄菓子屋の店主。システムの主な利用者。
    notes: IT に詳しくない前提で画面を設計する。
```
