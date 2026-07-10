// バリデーションルールを一元管理
export const DELIVERY_RULES = {
  quantity: {
    min: 1,
    max: 3000,
    message: "数量は1〜3000の間で入力してください"
  },
  customerRequired: "顧客を選択してください"
};