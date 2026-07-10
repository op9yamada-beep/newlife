import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from './supabaseClient';
import { DELIVERY_RULES } from './validations/deliverySchema';

/**
 * ProductList Component
 * - 納品データ編集・管理用インターフェース
 * * 主な機能
 * - 既存データの表示および新規行の動的追加
 * - 当日分の新規顧客に対するカラムの動的追加
 */
const ProductList = ({ control, register, dIndex, productOptions, errors }: any) => {
  const { fields, append } = useFieldArray({ control, name: `deliveries.${dIndex}.products` });

  return (
    <div className="space-y-0.5">
      {/* 商品名と数量ラベル：余白を最小化 */}
      <div className="flex gap-2 text-xs font-semibold text-gray-500 px-1 mb-0.5">
        <div className="flex-1">商品名</div>
        <div className="w-20 pl-2 text-left">数量</div>
      </div>

      {fields.map((item: any, pIndex: number) => {
        const error = errors?.deliveries?.[dIndex]?.products?.[pIndex]?.quantity;

        return (
          <div key={item.id} className="flex flex-col">
            <div className="flex items-center gap-2">
              <select 
                {...register(`deliveries.${dIndex}.products.${pIndex}.productId`)} 
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">商品を選択</option>
                {productOptions.map((prod: any) => (
                  <option key={prod.product_id} value={prod.product_id}>
                    {prod.product_name}
                  </option>
                ))}
              </select>
              
              <input 
                {...register(`deliveries.${dIndex}.products.${pIndex}.quantity`, { 
                  required: "必須",
                  valueAsNumber: true,
                  min: { value: DELIVERY_RULES.quantity.min, message: "1以上" },
                  max: { value: DELIVERY_RULES.quantity.max, message: "3000以下" }
                })} 
                type="number" 
                placeholder="0"
                className={`w-20 p-2 border rounded-md text-sm text-left ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
              />
            </div>
            
            {/* エラーメッセージ */}
            {error && (
              <span className="text-red-500 text-[10px] ml-auto w-20 text-left">
                {error.message}
              </span>
            )}
          </div>
        );
      })}

      <button 
        type="button" 
        onClick={() => append({ productId: '', quantity: 0 })}
        className="text-xs text-blue-600 hover:underline mt-3"
      >
        + 商品を追加
      </button>
    </div>
  );
};

/**
 * FormWrapper Component
 * - フォーム描画の関心事を分離・カプセル化するレイアウトコンポーネント
 * * * 主な機能
 * - フォームの描画ロジックを抽象化し、再利用性を向上
 * - 宣言的なUI構造を提供し、親コンポーネントとの責務を明確化
 */
const FormWrapper = ({ initialValues, products }: { initialValues: any, products: any[] }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });
  {errors.deliveries && (
  <p className="text-red-500 text-sm">入力内容に不備があります。</p>
)}
  const { fields: deliveryFields, append: appendDelivery } = useFieldArray({
    control,
    name: "deliveries"
  });

// 送信ボタン押下時に下記1~4.の処理を実行
 const onSubmit = async (data: any) => {
  // 送信直前の強制チェック
  for (const delivery of data.deliveries) {
    for (const item of delivery.products) {
      if (Number(item.quantity) < 1 || Number(item.quantity) > 3000) {
          alert("数量は1から3000の間で入力してください");
          return;
      }
    }
  }
    // 1. マップ定義（IDから名前に変換）
    const customerMap: { [key: string]: string } = { 
      "1": "山田商会", 
      "2": "山田病院" 
    };
    
    // 2. 配送先ごとにループ
    for (const delivery of data.deliveries) {
      if (!delivery.customerData) continue;

      const customerId = delivery.customerData; // IDそのもの
      const customerName = customerMap[customerId] || "不明";

      // 3. 商品ごとにループ
      for (const item of delivery.products) {
        if (!item.productId) continue;

        const selectedProduct = products.find((p: any) => String(p.product_id) === String(item.productId));

        // 4. SupabaseへのINSERT
        try {
        const { error } = await supabase.from('deliveries').insert([{
          customer_id: parseInt(customerId, 10),
          customer_name: customerName,
          product_id: parseInt(item.productId, 10),
          product_name: selectedProduct?.product_name || "不明",
          quantity: Number(item.quantity)
        }]);
          if (error) {
            console.error("保存失敗:", error);
            alert("保存に失敗しました: " + error.message);
            return; // エラー時はここで止める
          }
        }catch (err: any) {
            // tryの中で問題が起きたら、即座にここに飛んでくる
            console.error("エラー詳細:", err.message);
            alert("通信エラーが発生しました: " + err.message);
          }
      }
    }

    alert("保存しました！");
  };

  const onInvalid = (errors: any) => {
    console.log("エラーあり:", errors);
    alert("入力内容を確認してください（数値:1~3000)");
  };

  // 納品登録画面を表示します
  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">納品登録</h2>
      {deliveryFields.map((delivery, dIndex) => (
        <div key={delivery.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">顧客名</label>
          <select {...register(`deliveries.${dIndex}.customerData`)} className="w-full p-2 mb-1.5 border border-gray-300 rounded-md">
            <option value="1">山田商会</option>
            <option value="2">山田病院</option>
          </select>
          {<ProductList control={control} register={register} dIndex={dIndex} productOptions={products} errors={errors}/> }
          <button type="button" onClick={() => appendDelivery({ customerData: '', products: [{ productId: '', quantity: 0 }] })} className="mt-4 text-sm text-blue-600 hover:underline">
            + 新しい配送先を追加
          </button>
        </div>
      ))}
      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition">送信する</button>
    </form>
  );
};

/**
 * DeliveryManagement Component
 * - データの準備と表示判定を行うメインコンポーネント
 * * * 主な機能
 * - 納品テーブルに紐づく該当マスタデータを取得し表示する
 */
const DeliveryManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [initialData, setInitialData] = useState<any>(null);

  // データベースより該当データを取得し表示する
  useEffect(() => {
    const initData = async () => {
      // 1. 商品マスターを取得
      const { data: pData } = await supabase.from('products').select('product_id, product_name');
      setProducts(pData || []);

      // 2. 納品テーブルからデータを取得（プロトタイプ用：最新1件を取る）
      const { data: dData } = await supabase
        .from('deliveries')
        .select('customer_id, customer_name, product_id, product_name, quantity')
        .limit(1)
        .single();

      // 3. データがあればそれを初期値にする。なければ空の雛形にする。
      if (dData) {
        setInitialData({
          deliveries: [{
            customerData: String(dData.customer_id),
            products: [{ productId: String(dData.product_id), quantity: dData.quantity }]
          }]
        });
      } else {
        // データが一件もない場合の初期値
        setInitialData({ 
          deliveries: [{ customerData: '', products: [{ productId: '', quantity: 0 }] }] 
        });
      }
    };
    initData();
  }, []);

  // データが取れるまでは何も表示しない
  if (!initialData) return <div>読み込み中...</div>;

  // データが揃ったらフォームを表示
  return <FormWrapper initialValues={initialData} products={products} />;
};

export default DeliveryManagement;