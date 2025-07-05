# ベースイメージとして、Node.jsの公式LTS(長期サポート)版を使用
FROM node:lts-slim

# タイムゾーンを日本時間に設定
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 必要なパッケージ（git）をインストール
# sudoはコンテナ内で一時的に権限が必要になった場合に便利
RUN apt-get update && apt-get install -y \
    git \
    sudo \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Google Apps ScriptのCLIツール(clasp)をグローバルにインストール
RUN npm install -g @google/clasp

# デフォルトで存在する'node'ユーザーがパスワードなしでsudoコマンドを実行できるように設定
# これにより、VSCodeのDev Container利用時に権限の問題が起きにくくなります
RUN echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node-nopasswd

# 作業ディレクトリを作成し、所有者を'node'ユーザーに変更
# /workspaces/ 配下はDev Containersが利用する標準的なパス
RUN mkdir -p /app && chown -R node:node /app

# デフォルトのユーザーを'node'ユーザーに切り替え
USER node

# 作業ディレクトリを設定
WORKDIR /app