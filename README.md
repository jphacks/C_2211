# LINE Bot「しらべるん」

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2022/08/JPHACKS2022_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要
### 背景(製品開発のきっかけ、課題等）

IT格差の多くはIT技術の使い方が分からないため発生します。

分からないのならば調べれば良い。

しかしITに不慣れな高齢者は、Google検索を上手く活用できません(検索ワードの選定など)。

このような高齢者も、多くの人はLINEを使用しています。

そこで、わからないこと・知りたいことをチャット(口語)で送信すると、適切なキーワードでGoogle検索した結果を返すLINE Botを作成しました。

### 製品説明（具体的な製品の説明）
### 特長
#### 1. 特長1

**最も利用されているSNSであるLINEを利用**

LINEの普及率は2022年の調査でも **約7割** ほど。

60歳以上も **57.9%** の人がLINEを使っています。

また、60歳以上でも **59%** の人が、LINE公式アカウントを友達追加しているというデータもあります。

そのため、ITに不慣れな人でも使いやすい製品になっています。

参考: [【消費者のLINE公式アカウント利用実態調査】
コロナ禍で約2人に1人が新たに登録、主な目的は「情報収集」「自宅時間を楽しむ」。 60代以上の3人に1人が「行政・自治体」アカウントを追加。 約7割がチャットで質問や相談をしたい・したことがあると回答。
](https://mobilus.co.jp/press-release/24414)

#### 2. 特長2

**口語から検索ワードを生成するアルゴリズム** 

口語から適切な検索ワードを作成するにあたり、以下の技術を用いました。

- 固有名詞抽出(gooラボ 固有表現抽出API)
- 形態素解析(gooラボ 形態素解析API)
- Lemmatisationによる置き換え(Python spacyライブラリ)
- その他、それぞれの形態素に合わせた活用系の選定

#### 3. 特長3

TODO: **誰もが親しみやすいアイコン** ???

### 解決出来ること

すでにGoogle検索はDX化されていると思う人もいるかもしれませんが、Google検索に必要な検索ワードは依然として人間が考えています。

そこで、私たちは検索ワードを考えるという作業をDX化しようと考えました。

これにより、ITが不慣れな人でも気軽にGoogle検索を行えるようになります。

これは、IT格差が広がっていくことを止めることができるでしょう。

### 今後の展望
TODO

### 注力したこと（こだわり等）
* 口語から適切な検索ワードを作成するところ
  口語をそのままGoogle検索に入れた結果
  TODO
  本製品に口語を送信した結果
  TODO

### 競合他サービスなどとの比較
* Googleアシスタント
  TODO
* Siri
  TODO

## 開発技術
### 活用した技術

#### 言語
* Google Apps Script(GAS)
* Python

#### API・データ
* gooラボAPI
  * 固有表現抽出API
  * 形態素解析API
* 自作API
  * 動詞を終止形に変換するAPI

#### フレームワーク・ライブラリ・モジュール
* spacy(Python)
* FastAPI(Python)

<!-- #### デバイス
* 
*  -->

### 独自技術
#### ハッカソンで開発した独自機能・技術
* 口語から検索ワードを生成するアルゴリズム([/improve-search-query.gs](https://github.com/jphacks/C_2211/blob/develop/improve-search-query.gs))
  
  - 固有名詞の抽出
  - 形態素分析
  - 動詞を終止形に変換
  - 不要なワードの削除
  - 形容詞を終止形に変換

  などを組み合わせることで、口語から適切な検索ワードを作成しました。
  
<!-- * 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください。 -->

<!-- #### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
* 
*  -->
