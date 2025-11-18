# TODOリストアプリ

React + TypeScript + Supabase で構築した認証機能付きTODOリストアプリケーション

## デモアカウント
- ID: Ponkotsu@demo.com 
- password: Ponkotsu7890

## 技術スタック

### フロントエンド

#### **React 19.1.1**
- UIライブラリ
- 関数コンポーネントとHooksを使用（useState, useEffect）
- 状態管理、イベント処理、条件付きレンダリング

#### **TypeScript**
- 型安全性を提供
- Todo型、イベント型（FormEvent, ChangeEvent）などで型定義
- コンパイル時のエラー検出

#### **Vite 7.1.5**
- 高速な開発サーバー（localhost:5173）
- ホットモジュールリロード（HMR）
- TypeScript + Reactのビルドツール

### スタイリング

#### **Tailwind CSS 3.4.18**
- ユーティリティファーストのCSSフレームワーク
- `className="bg-blue-500 text-white px-4 py-2"`のような記述
- PostCSS経由で処理

### バックエンド・データベース

#### **Supabase**
- **PostgreSQL データベース**: `todos`テーブルでデータ永続化
- **Supabase Auth**: メール/パスワード認証、セッション管理
- **@supabase/supabase-js v2.81.1**: JavaScriptクライアント

## 主要機能

### 認証機能
- サインアップ/サインイン/サインアウト
- セッション永続化（ページリロード後も自動ログイン）
- モーダルUIでの認証フォーム

### CRUD操作
- **Create**: TODO追加
- **Read**: TODO一覧取得・表示
- **Update**: 完了/未完了切り替え、編集
- **Delete**: TODO削除

## プロジェクト構成

```
src/
├── App.tsx              # メインコンポーネント
├── main.tsx             # エントリーポイント
├── lib/
│   ├── supabaseClient.ts  # Supabase初期化
│   └── auth.ts            # 認証ヘルパー関数
└── styles.css           # Tailwindインポート
```

## 開発ツール

- **ESLint**: コード品質チェック
- **Git/GitHub**: バージョン管理
- **npm**: パッケージ管理

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定（`.env.local`ファイルを作成）
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. 開発サーバーの起動
```bash
npm run dev
```

## 特徴

このスタックにより、型安全で保守性の高いモダンなWebアプリケーションを構築しています。

