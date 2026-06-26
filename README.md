## 開発環境構築ログ (Troubleshooting)

### 環境構築時のトラブルと解決策
本プロジェクトの開発環境構築において、以下の事象が発生したため解決策を記録します。

#### 1. コンテナの起動失敗 (Exit code 1)
* **事象:** `Reopen in Container` 実行時にコンテナが起動しない。
* **原因:** 
    * プロジェクトフォルダがOneDrive同期対象配下にあり、ファイル同期処理とDockerのファイル監視が競合していた。
    * また、VS Codeの古い拡張機能キャッシュが影響していた。
* **解決策:**
    1. プロジェクトフォルダを同期対象外のローカルパス（例: `C:\projects\...`）へ移動。
    2. Docker Desktopにて「WSL 2 integration」が対象ディストリビューションで有効化されていることを確認。
    3. `Dev Containers: Rebuild Container Without Cache` を実行。

#### 2. プロジェクトファイルが認識されない問題
* **事象:** コンテナ起動後、`/workspaces` 内に `.devcontainer` フォルダ内の設定ファイルしか存在せず、ソースコードや `README.md` が表示されない。
* **原因:** 
    * `docker-compose.yml` のマウント設定 (`volumes`) が、`.devcontainer` フォルダのみを対象としていたため。
    * リモートコンテナ環境において、設定変更後に VS Code 上での「Rebuild Container」の案内を無視していたため、最新の `docker-compose.yml` がコンテナに反映されていなかった。
* **解決策:**
    1. `docker-compose.yml` の `volumes` を、プロジェクトルートを指すように修正。
```yaml
       volumes:
         - ..:/workspaces:cached
       ```
    2. VS Code 右下に表示される「Rebuild required」の案内から、確実に `Rebuild Container` を実行。

    # 納品管理システム (Delivery Management System)

本プロジェクトは、納品予定や商品情報を効率的に管理するためのWEBアプリケーションです。

## 技術スタック
* **Frontend:** React, TypeScript, Tailwind CSS
* **Form Management:** React Hook Form
* **Backend/Database:** Supabase (PostgreSQL)

## 開発のこだわり・意思決定プロセス

### 1. データベースの選定: MySQL から Supabase へ
当初はMySQLの使用を検討していましたが、開発の途中で **Supabase** へ移行しました。
* **選定理由:**
    * **開発スピードの向上:** 認証機能やAPI生成が自動化されており、インフラ構築の手間を削減し、フロントエンドの実装に集中できるため。
    * **セキュリティの確保:** 行レベルセキュリティ (RLS) を活用することで、データベース層でのアクセス制御を簡潔かつ強固に実装できるため。

### 2. 環境変数の管理 (`.env`)
セキュリティ向上のため、データベースの接続情報などの機密情報は環境変数として管理しています。
* **取り組み:**
    * Gitへの機密情報の混入を防ぐため、`.env` ファイルを `.gitignore` に指定。
    * Supabase移行に伴い、ローカル環境と本番環境で接続先を適切に切り替えられる構成を構築しました。これにより、本番環境のデータ整合性とセキュリティを担保しています。

## 今後の展望 (拡張性への考察)
* **複数テナント対応:** ユーザーIDに基づくデータ分離の強化。
* **カレンダー連携:** 納品予定日をGoogleカレンダー等と同期するAPIの実装。
* **権限管理:** 管理者と一般ユーザーで閲覧・編集権限を分けるアクセス制御の追加。