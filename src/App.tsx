import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { CalendarSection } from './components/CalendarSection';
import { IdealScheduleSection } from './components/IdealScheduleSection';
import { TipsSection } from './components/TipsSection';
import { TeacherPortalSection } from './components/TeacherPortalSection';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';
import { api, type ActivityInput } from './lib/api';
import type { TeacherActivity } from './data/schedule';

export default function App() {
  const [teacher, setTeacher] = useState<string | null>(null);
  const [activities, setActivities] = useState<TeacherActivity[]>([]);
  const [booting, setBooting] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [me, acts] = await Promise.all([api.me(), api.activities()]);
        if (!active) return;
        setTeacher(me?.name ?? null);
        setActivities(acts);
      } catch {
        if (active) setActivities([]);
      } finally {
        if (active) setBooting(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async (name: string) => {
    setTeacher(name);
    setLoginOpen(false);
    const acts = await api.activities().catch(() => null);
    if (acts) setActivities(acts);
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    setTeacher(null);
    const acts = await api.activities().catch(() => null);
    if (acts) setActivities(acts);
  };

  const handleAdd = async (input: ActivityInput) => {
    const created = await api.createActivity(input);
    setActivities((prev) => [created, ...prev]);
  };

  const handleRemove = async (id: string) => {
    await api.deleteActivity(id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-bone">
        <p className="font-display text-lg font-bold text-ink-soft">Cargando EduPaz…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-ink">
      <Navbar teacher={teacher} onLogin={() => setLoginOpen(true)} />
      <main>
        <CalendarSection activities={activities} />
        <IdealScheduleSection />
        <TipsSection />
        <TeacherPortalSection
          activities={activities}
          teacher={teacher}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onLogout={handleLogout}
          onLogin={() => setLoginOpen(true)}
        />
      </main>
      <Footer />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={handleLogin} />
    </div>
  );
}
