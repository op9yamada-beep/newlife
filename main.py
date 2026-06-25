import sys
import io
import os

from supabase import create_client, Client
# 必要に応じて load_dotenv を使って .env を読み込む
from dotenv import load_dotenv

# エンコーディングを明示的に指定
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# .envファイルを読み込む（ローカル開発時用）
load_dotenv()

# 環境変数から取得
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_ANON_KEY")

# 接続情報が空なら即座に止める
if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_ANON_KEY is not set.")
    sys.exit(1)

# クライアント作成
supabase: Client = create_client(url, key)

def test_connection():
    try:
        # 接続確認のみ行う（データは取得しない）
        # select('*')だと日本語データが混ざって死ぬ可能性があるため、countのみ取得
        response = supabase.table("customers").select("*", count='exact').execute()
        print("Connected.")
        print(f"Row count: {response.count}")
    except Exception as e:
        # エラーが出た場合も「日本語」を一切排除して英語だけで表示する
        print("Connection failed.")
        print(f"Details: {str(e).encode('ascii', 'ignore').decode('ascii')}")

if __name__ == "__main__":
    test_connection()