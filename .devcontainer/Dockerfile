FROM python:3.12-slim

# 作業ディレクトリの設定
WORKDIR /workspaces

# パッケージリストの更新と必要なツールのインストール
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# ここに requirements.txt があればインストールする設定などを追加していく