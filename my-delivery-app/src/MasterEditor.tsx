import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

// 1. 各マスタの定義と擬似データを追加
const MASTER_CONFIG = {
  product: {
    label: "商品マスタ",
    columns: ["name", "category"],
    dbTable: "product_master",
    dummyData: [
      { name: 'タオル茶', category: '美容室' },
      { name: 'タオル白', category: '美容室' },
      { name: 'タオル紺', category: '美容院' },
    ]
  },
  customer: {
    label: "顧客マスタ",
    columns: ["name", "address"],
    dbTable: "customer_master",
    dummyData: [
      { name: '山田商会', address: '東京都千代田区' },
      { name: '山田病院', address: '大阪府大阪市' },
    ]
  },
  nextDelivery: {
    label: "次回納品マスタ",
    columns: ["customer_name", "delivery_date"],
    dbTable: "next_delivery_master",
    dummyData: [
      { customer_name: '山田商会', delivery_date: '2026/07/05' },
      { customer_name: '山田病院', delivery_date: '2026/07/06' },
      { customer_name: '佐藤ジム', delivery_date: '2026/07/07' },
    ]
  },
};

export const MasterEditor = () => {
  // 初期値を 'product' に設定
  const [selectedKey, setSelectedKey] = useState<keyof typeof MASTER_CONFIG>('product');
  const config = MASTER_CONFIG[selectedKey];

  const { register, control, reset } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: "rows"
  });

  // マスタ切り替え時に擬似データをロード
  useEffect(() => {
    // 本来は supabase から取得するが、デモ用にダミーデータをセット
    reset({ rows: config.dummyData });
  }, [selectedKey, reset]);

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">マスタ管理</h2>
      
      <select 
        value={selectedKey} 
        onChange={(e) => setSelectedKey(e.target.value as any)}
        className="mb-4 p-2 border rounded w-full max-w-xs"
      >
        {Object.entries(MASTER_CONFIG).map(([key, conf]) => (
          <option key={key} value={key}>{conf.label}</option>
        ))}
      </select>

      <div className="bg-white p-4 shadow rounded">
        <div className="grid grid-cols-2 gap-2 mb-2 font-bold text-gray-600 px-1">
           {config.columns.map(col => <div key={col}>{col}</div>)}
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            {config.columns.map((col) => (
              <input 
                key={col}
                {...register(`rows.${index}.${col}`)}
                className="border p-1 rounded text-sm w-full"
              />
            ))}
          </div>
        ))}
        
        <button 
          type="button"
          onClick={() => append({})}
          className="mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-medium transition-colors"
        >
          + データ行追加
        </button>
      </div>

      <button 
        type="button"
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all"
        onClick={() => alert("保存しました！（UIデモ）")}
      >
        保存
      </button>
    </div>
  );
};