# GraphQL(Apollo) × React.js 入門

GraphQL の入門、及び React × GraphQL クライアントの Apollo を利用した\
チュートリアルの学習メモ。

---

- [GraphQL(Apollo) × React.js 入門](#graphqlapollo--reactjs-入門)
  - [GraphQL 概要](#graphql-概要)
    - [REST と比較した GraphQL の利点](#rest-と比較した-graphql-の利点)
  - [GraphQL の基本的な言語構成](#graphql-の基本的な言語構成)
    - [Query を用いたデータ取得](#query-を用いたデータ取得)
    - [Mutation によるデータ書き込み](#mutation-によるデータ書き込み)
    - [Subscription  でデータのリアルタイム更新](#subscription-でデータのリアルタイム更新)
    - [スキーマの定義](#スキーマの定義)
  - [GraphQL を用いたアーキテクチャ](#graphql-を用いたアーキテクチャ)
    - [1. DB に接続された GraphQL サーバ(一般的)](#1-db-に接続された-graphql-サーバ一般的)
    - [2. 既存のシステムを統合する GraphQL レイヤー](#2-既存のシステムを統合する-graphql-レイヤー)
    - [3. データベース接続と既存システムの統合によるハイブリッドアプローチ](#3-データベース接続と既存システムの統合によるハイブリッドアプローチ)

---

## GraphQL 概要

### REST と比較した GraphQL の利点

- リクエスト 1 回で**必要な情報**を**必要な分だけ**取得できる(リクエストをリソースごとに複数回送る必要がない。)
- 取得したいデータが増えたり減ったりする場合においても、\
  クライアントが必要とするデータを正確に指定できるため、バックエンド側での調整が不要。
- API で公開されるすべての型は、\
  GraphQL Schema Definition Language (SDL)を使ってスキーマに書き込まれる。\
  → スキーマが定義されると、フロントエンドチームとバックエンドチームが互いに独立して作業できる。

フロントとバックエンドで組織が分かれている開発の場合、開発効率が上がりそう？

---

## GraphQL の基本的な言語構成

SDL の文法

```gql
# !は、このフィールドが必須であることを表す
type Person {
  name: String!
  age: Int!
}

# PostとPersonの間に一対一の関係
type Post {
  title: String!
  author: Person!
}

# PersonとPostの間に一対多の関係
type Person {
  name: String!
  age: Int!
  posts: [Post!]!
}
```

### Query を用いたデータ取得

GraphQL は REST API と違い API のエンドポイントは一つ\
→ 取得するデータの構造をサーバに送る必要がある。

```gql
# request to server
# 引数の指定もできる。
{
  allPersons(last: 2) {
    name
    # 取得したい情報が増えた場合は、新しいフィールドをクエリに追加する。
    # age
    # posts {
    #   title
    # }
  }
}

# response example
{
  "allPersons": [
    { "name": "Johnny" },
    { "name": "Sarah" },
    { "name": "Alice" }
  ]
}

```

### Mutation によるデータ書き込み

データに変更を加える場合(Create,Update,Delete)は、Mutation をつける必要がある。

```gql
# 登録の例
mutation {
  createPerson(name: "Bob", age: 36) {
    name
    age
  }
}

# response example
"createPerson": {
  "name": "Bob",
  "age": 36,
}
```

### Subscription  でデータのリアルタイム更新

```gql
# クライアントがこのサブスクリプションをサーバーに送信すると、両者の間に接続が開かれます。
# そして、新しいPersonを作るための新しい変異が実行されるたびに、
# サーバーはこのPersonに関する情報をクライアントに送ります

subscription {
  newPerson {
    name
    age
  }
}

{
  "newPerson": {
    "name": "Jane",
    "age": 23
  }
}
```

### スキーマの定義

スキーマは、API の機能を指定し、クライアントがどのようにデータをリクエストするかを定義する。\
API 用のスキーマを書く場合、いくつかの特別なルートタイプがある。

```gql
type Query { ... }
type Mutation { ... }
type Subscription { ... }

# root fieldを定義
type Query {
  allPersons(last: Int): [Person!]!
}

type Mutation {
  createPerson(name: String!, age: Int!): Person!
}

type Subscription {
  newPerson: Person!
}
```

---

## GraphQL を用いたアーキテクチャ

GraphQL はあくまで仕様であり、実装ではない\
= GraphQL を利用して、様々なアーキテクチャを構築できる。

### 1. DB に接続された GraphQL サーバ(一般的)

GraphQL の仕様を実装した単一の（Web）サーバーとクライアントのやりとり

- 受け取ったクエリをもとにデータを取得し、レスポンスをクライアント側に返却する。
- GraphQL はトランスポート層に依存しない。
  - どのようなネットワークプロトコルでも利用できる.
- GraphQL は、データを保存するためのデータベースやフォーマットを気にしない。\
  - RDB や、NoSQL DB も使用できる。

### 2. 既存のシステムを統合する GraphQL レイヤー

- 複数の既存システムを 1 つの一貫した GraphQL API に統合することができる。
- GraphQL サーバーは、既存のシステムからデータを取得し、\
  GraphQL のレスポンス形式でパッケージ化する役割を担うことも可能。 \
  → クライアント側からの視点として、GraphQL API を介して既存のシステムを背後に隠すことができる。

### 3. データベース接続と既存システムの統合によるハイブリッドアプローチ

- 2 つのアプローチを組み合わせて、データベースに接続しつつ、\
  レガシーシステムやサードパーティシステムと連携する GraphQL サーバーを構築することも可能

---
