import { Routes, Route, Link } from 'react-router-dom';
import DeliveryManagement from './DeliveryManagement';
import { MasterEditor } from './MasterEditor'; // 別ファイルで作った想定
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';
import Login from './Login';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    return <Login />; // 未ログインならログイン画面を返す
  }

  return (
    <div>
      <nav className="p-4 bg-gray-200">
        <Link to="/" className="mr-4 text-blue-600">納品登録</Link>
        <Link to="/master" className="text-blue-600">マスタ管理</Link>
      </nav>

      <Routes>
        <Route path="/" element={<DeliveryManagement />} />
        <Route path="/master" element={<MasterEditor />} />
      </Routes>
    </div>
  );
}

export default App;