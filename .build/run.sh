#/bin/bash

clasp login
clasp open

# "ここにスクリプトID" の部分を実際のIDに置き換えてください
clasp clone "ここにスクリプトID"

# "新しいプロジェクト名" の部分を好きな名前にしてください
# ./hatolink というディレクトリ内にコードが作成されるので整理に便利です
clasp create --title "hatolink" --rootDir ./hatolink

clasp push