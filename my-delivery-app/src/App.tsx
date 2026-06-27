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
  const [loading, setLoading] = useState(true); // 初期化中のロード状態を追加

  useEffect(() => {
    // 1. セッションの初期取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. 状態変化のリスナー
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>読み込み中...</div>; // ロード中は表示を待機

  if (!session) {
    return <Login />;
  }

  return (
    <div>
      <nav className="p-4 bg-gray-200 border-b flex items-center gap-6">
        {/* 各リンクの mr-4 を削除し、gap-6 で一括管理します */}
        <Link to="/" className="text-blue-600 font-semibold hover:text-blue-800 transition">
          納品登録
        </Link>
        <Link to="/master" className="text-blue-600 font-semibold hover:text-blue-800 transition">
          商品・顧客管理
        </Link>
        <Link to="/system-master" className="text-blue-600 font-semibold hover:text-blue-800 transition">
          マスタ管理
        </Link>
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