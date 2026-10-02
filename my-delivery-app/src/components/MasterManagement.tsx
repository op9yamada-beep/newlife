import { useState } from 'react';

// マスタタイプと区分の定義（将来的にDBから取得するように変える箇所）
const MASTER_TYPES = ['商品', '顧客'];
const CATEGORY_MAP = {
  商品: ['美容室', '病院', 'スポーツジム'],
  顧客: ['病院', '美容室', 'スポーツジム']
};

// プロトタイプ用：DBから抽出した前提のデータ
const initialDBData = [
  { name: 'タオル茶', category: '美容室' },
  { name: 'タオル白', category: '美容室' },
  { name: 'タオル紺', category: '美容室' },
];

/**
 * MasterManagement Component
 * - 商品・顧客マスタデータ編集・管理用インターフェース
 * * 主な機能
 * - 設定に基づく動的なフォーム生成（選択マスタに応じたカラム切り替え）
 * - 既存データの表示および新規行の動的追加
 * - TODO:マスタ種別変更時におけるフォーム状態の再初期化とスキーマ切り替え
 */
export default function MasterManagement() {
  const [masterType, setMasterType] = useState(MASTER_TYPES[0]);
  const [category, setCategory] = useState(CATEGORY_MAP['商品'][0]);
  const [dataList, setDataList] = useState(initialDBData); // 表示用のステート

  // 画面表示を返します
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">商品・顧客管理</h1>
      
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
            <label className="block text-sm font-medium">属性・区分</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded"
            >
              {CATEGORY_MAP[masterType as keyof typeof CATEGORY_MAP].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

          {/* データ表示エリア */}
          <div className="min-h-[128px] space-y-2">
            <div className="grid grid-cols-2 font-bold mb-2 pb-2 border-b text-sm text-gray-500">
            <div>{masterType}名</div>
            <div>注文{masterType}区分</div>
          </div>
            {dataList.map((item, index) => (
              <div key={index} className="grid grid-cols-2 py-2 border-b border-gray-100 items-center">
                
                {/* 既存データ（固定表示） vs 新規データ（入力可能）の切り替え */}
                {item.name === '新規追加' ? (
                  <input 
                    type="text" 
                    placeholder="名称を入力..." 
                    className="border-b p-1 mr-2 focus:border-blue-500 outline-none transition"
                    autoFocus
                  />
                ) : (
                  <span className="text-gray-800 font-medium">{item.name}</span>
                )}

                <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block w-fit">
                  {item.category}
                </span>
              </div>
            ))}
          </div>

        <button 
          type="button"
          onClick={() => setDataList([...dataList, { name: '新規追加', category: category }])}
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
}