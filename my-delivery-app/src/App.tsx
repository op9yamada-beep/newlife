import { Routes, Route, Link } from 'react-router-dom';
import DeliveryManagement from './DeliveryManagement';
import { MasterEditor } from './MasterEditor'; // 別ファイルで作った想定

function App() {
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