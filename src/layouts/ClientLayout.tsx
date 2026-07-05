import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import MobileTabNavigation from '../components/MobileTabNavigation';
import ScrollToTop from '../components/ScrollToTop';

export default function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-white">
      <ScrollToTop />
      <Header />
      <main className="flex-grow pt-16 lg:pt-20 pb-16 md:pb-0">
        <Outlet />
      </main>
      <MobileTabNavigation />
    </div>
  );
}
