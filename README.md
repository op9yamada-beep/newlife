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