import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import HomeLayout from './features/home/components/HomeLayout';
import Home from './features/home/components/Home';
import { CrmLayout } from './features/leads/components/CrmLayout';
import LeadsPage from './features/list-view/components/LeadsPage';
import LeadDetailPage from './features/leads/components/LeadDetailPage';
import BoardPage from './features/board-view/components/BoardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  {
    element: <CrmLayout />,
    children: [
      { path: '/leads',       element: <Navigate to="/leads/list" replace /> },
      { path: '/leads/list',  element: <LeadsPage /> },
      { path: '/leads/board', element: <BoardPage /> },
      { path: '/leads/:id',   element: <LeadDetailPage /> },
    ],
  },
  { path: '/login',            element: <Navigate to="/leads/list" replace /> },
  { path: '/signup',           element: <Navigate to="/leads/list" replace /> },
  { path: '/organization',     element: <Navigate to="/leads/list" replace /> },
  { path: '/organization/:id', element: <Navigate to="/leads/list" replace /> },
  { path: '/plan/:boardId',    element: <Navigate to="/leads/list" replace /> },
  { path: '*',                 element: <Navigate to="/leads/list" replace /> },
]);

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
