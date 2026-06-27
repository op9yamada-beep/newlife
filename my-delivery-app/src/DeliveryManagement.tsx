import React, { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import type { FormValues } from './types';
import { supabase } from './supabaseClient';

// 引数の props に register を追加します
const ProductList = ({ control, register, dIndex }: any) => {
  const { fields, append } = useFieldArray({ control, name: `deliveries.${dIndex}.products` });

  return (
    <div className="space-y-2">
      {fields.map((item, pIndex) => (
        <div key={item.id} className="flex gap-2">
          <input 
            {...register(`deliveries.${dIndex}.products.${pIndex}.productId`)} 
            placeholder="商品ID"
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
          />
          <input 
            {...register(`deliveries.${dIndex}.products.${pIndex}.quantity`)} 
            type="number" 
            placeholder="数量"
            className="w-20 p-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ productId: '', quantity: 0 })}
        className="text-xs text-gray-500 hover:text-gray-800"
      >
        + 商品を追加
      </button>
    </div>
  );
};

const DeliveryManagement = () => {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      deliveries: [{ customerId: '', products: [{ productId: '', quantity: 0 }] }]
    }
  });

  // 顧客ごとの塊を管理するFieldArray
  const { fields: deliveryFields, append: appendDelivery } = useFieldArray({
    control,
    name: "deliveries"
  });

  const [message, setMessage] = useState("");

const onSubmit = async (data: FormValues) => {
// deliveries 配列の中身を一つずつ順番に処理します
  for (const delivery of data.deliveries) {
    
    // この配送先（delivery）の中にある全商品（products）を処理
    for (const item of delivery.products) {

      if (!delivery.customerData) {
       console.warn("顧客が選択されていません");
       continue;
      }

      const customer = JSON.parse(delivery.customerData)

          for (const item of delivery.products) {
            // 2. productId や quantity が空ならスキップする
             if (!item.productId || item.quantity === 0) {
              console.warn("商品情報が不完全です");
               continue;
             }
          }

      const { error } = await supabase
        .from('deliveries')
        .insert([
          {
            customer_id: parseInt(customer.id, 10),
            customer_name: customer.name,
            product_id: parseInt(item.productId, 10),
            product_name: "商品名ダミー",
            quantity: Number(item.quantity)
          }
        ]);

      if (error) {
        console.error("保存失敗:", error);
        alert("保存中にエラーが発生しました");
        return;
      }
    }
  }

  alert("すべての登録が完了しました！");
};

  return (
    // フォーム全体を中央寄せでカード風に
<form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100">
  <h2 className="text-xl font-bold mb-4 text-gray-800">納品登録</h2>
  
  {deliveryFields.map((delivery, dIndex) => (
    <div key={delivery.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-1">顧客名</label>
      <select 
     // IDと名前をまとめて送るためにJSON文字列にする
     {...register(`deliveries.${dIndex}.customerData`)} 
       className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        >
       <option value={JSON.stringify({ id: "1", name: "山田商会" })}>山田商会</option>
        <option value={JSON.stringify({ id: "2", name: "山田病院" })}>山田病院</option>
      </select>

      <div className="space-y-2">
        <ProductList control={control} register={register} dIndex={dIndex} setMessage={setMessage} />
      </div>
      
      <button 
        type="button" 
        onClick={() => appendDelivery({ 
          customerId: '', 
          customerData: '',
          products: [{ productId: '', quantity: 0 }] 
        })}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        + 新しい配送先を追加
      </button>
      
    </div>
  ))}
  
  <button 
    type="submit" 
    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition"
  >
    送信する
  </button>
</form>
  );
};

export default DeliveryManagement;