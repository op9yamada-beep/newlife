import mysql.connector

try:
    # docker-compose.yml の db サービス名をホスト名として使います
    connection = mysql.connector.connect(
        host='db',
        user='dev_user',
        password='dev_password', # docker-compose.yml で設定したパスワード
        database='my_database'   # 必要なら作成したDB名
    )
    if connection.is_connected():
        print("やった！MySQLに接続成功！")
        connection.close()
except Exception as e:
    print(f"エラー: {e}")