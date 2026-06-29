import { Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import DeliveryManagement from './DeliveryManagement';
import MasterManagement from './MasterManagement';
import { MasterEditor } from './MasterEditor';
import Login from './Login';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  // 1. 初回起動時に現在のログイン状態を確認する
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. ログイン操作が行われたことを検知するリスナー
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>読み込み中...</div>;

  if (!session) {
    return <Login />;
  }

  // ログインしている時だけ、メニューと「Routes」を表示する
  return (
    <div>
      <nav className="p-4 bg-gray-200 border-b flex gap-6">
        <Link to="/" className="text-blue-600">納品登録</Link>
        <Link to="/master" className="text-blue-600">商品・顧客管理</Link>
        <Link to="/system-master" className="text-blue-600">マスタ管理</Link>
        <button 
          onClick={async () => {
          await supabase.auth.signOut();
          window.location.reload(); // 強制リロードしてログイン画面へ戻す
        }}
        className="ml-auto text-red-600 hover:underline text-sm"
      >
        ログアウト
      </button>
      </nav>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<DeliveryManagement />} />
          <Route path="/master" element={<MasterManagement />} />
          <Route path="/system-master" element={<MasterEditor />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;