// マスタ定義のサンプル
export const MASTER_CONFIG = {
  nextDelivery: {
    label: "次回納品対象",
    columns: ["customer_name", "delivery_days", "next_delivery_date"],
    dbTable: "next_delivery_master"
  },
  user: {
    label: "ユーザーマスタ",
    columns: ["user_id", "user_name", "role"],
    dbTable: "users"
  }
  // ここより下にマスターを追加
};