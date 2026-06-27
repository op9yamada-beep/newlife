import { useState } from 'react';

// マスタタイプと区分の定義（将来的にDBから取得するように変える箇所）
const MASTER_TYPES = ['商品', '顧客'];
const CATEGORY_MAP = {
  商品: ['病院', '美容室', 'スポーツジム'],
  顧客: ['病院', '美容室', 'スポーツジム']
};

export default function MasterManagement() {
  const [masterType, setMasterType] = useState(MASTER_TYPES[0]);
  const [category, setCategory] = useState(CATEGORY_MAP['商品'][0]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">商品・顧客管理画面</h1>
      
      <div className="bg-white p-6 rounded shadow-md">
        {/* プルダウンエリア */}
        <div className="flex gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium">マスタ名</label>
            <select 
              value={masterType} 
              onChange={(e) => {
                setMasterType(e.target.value);
                setCategory(CATEGORY_MAP[e.target.value as keyof typeof CATEGORY_MAP][0]);
              }}
              className="border p-2 rounded"
            >
              {MASTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">属性属・区分</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded"
            >
              {CATEGORY_MAP[masterType as keyof typeof CATEGORY_MAP].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* ステージ（データ表示エリア） */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 font-bold mb-2">
            <div>{masterType}名</div>
            <div>注文{masterType}区分</div>
          </div>
          {/* ここにSupabaseから取得した行が並びます */}
          <div className="h-32 flex items-center justify-center text-gray-400 italic">
            データがここに表示されます
          </div>
        </div>

        <button className="mt-4 bg-purple-200 p-2 rounded flex items-center">
          + データ行追加
        </button>
      </div>

      <button className="mt-6 bg-purple-500 text-white px-6 py-2 rounded">
        保存
      </button>
    </div>
  );
}