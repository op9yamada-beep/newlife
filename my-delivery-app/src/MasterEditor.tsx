import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from './supabaseClient';

// マスタごとの設定データ（ここを編集して拡張していく）
const MASTER_CONFIG = {
  nextDelivery: {
    label: "次回納品対象",
    columns: ["customer_name", "delivery_days", "next_delivery_date"],
    dbTable: "next_delivery_master"
  },
  // ここに他のマスタ定義を追加
};

export const MasterEditor = () => {
  const [selectedKey, setSelectedKey] = useState<keyof typeof MASTER_CONFIG>('nextDelivery');
  const config = MASTER_CONFIG[selectedKey];

  const { register, control, reset } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: "rows"
  });

  // マスタ切り替え時にデータを取得
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from(config.dbTable).select('*');
      reset({ rows: data });
    };
    fetchData();
  }, [selectedKey]);

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">マスタ管理画面</h2>
      
      {/* マスタ選択 */}
      <select 
        value={selectedKey} 
        onChange={(e) => setSelectedKey(e.target.value as any)}
        className="mb-4 p-2 border rounded"
      >
        {Object.entries(MASTER_CONFIG).map(([key, conf]) => (
          <option key={key} value={key}>{conf.label}</option>
        ))}
      </select>

      {/* テーブル表示 */}
      <div className="bg-white p-4 shadow rounded">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            {config.columns.map((col) => (
              <input 
                key={col}
                {...register(`rows.${index}.${col}`)}
                placeholder={col}
                className="border p-1 rounded text-sm"
              />
            ))}
          </div>
        ))}
        <button onClick={() => append({})} className="mt-2 text-blue-600">+ データ行追加</button>
      </div>

      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">保存</button>
    </div>
  );
};