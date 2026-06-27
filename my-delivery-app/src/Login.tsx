import { Routes, Route, Link } from 'react-router-dom';
import DeliveryManagement from './DeliveryManagement';
import MasterManagement from './MasterManagement';
import { MasterEditor } from './MasterEditor';
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Login from './Login';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初回読み込み時のセッション確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // ログイン等の認証状態変化をリアルタイムで監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>読み込み中...</div>;

  // セッションがない場合はログイン画面を返す
  if (!session) {
    return <Login />;
  }

  // ログイン後はメイン画面を表示
  return (
    <div>
      <nav className="p-4 bg-gray-200 border-b">
        <Link to="/" className="mr-4 text-blue-600">納品登録</Link>
        <Link to="/master" className="mr-4 text-blue-600">商品・顧客管理</Link>
        <Link to="/system-master" className="text-blue-600">設定・マスタ</Link>
      </nav>
      <main className="p-4">
      <Routes>
        {/* 1. 納品管理（デフォルト画面） */}
        <Route path="/" element={<DeliveryManagement />} />
        
        {/* 2. 商品・顧客管理　*/}
        <Route path="/master" element={<MasterManagement />} />
        
        {/* 3. その他マスタ管理 */}
        <Route path="/system-master" element={<MasterEditor />} />
      </Routes>
      </main>
    </div>
  );
}

export default App;