import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import TaskManager from './components/TaskManager';
import TrashedTaskManager from './components/TrashedTaskManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* 認証が必要なルート */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/taskmanager"
          element={
            <ProtectedRoute>
              <TaskManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trashedTaskmanager"
          element={
            <ProtectedRoute>
              <TrashedTaskManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
