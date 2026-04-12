import { NavLink } from 'react-router-dom';
import { navItems } from '@/widgets/bottom-nav/model/navItems';

export function SideNav() {
  return (
    <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-16 flex-col items-center border-r border-border bg-nav backdrop-blur-sm py-4 gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
              isActive
                ? 'text-accent-fg bg-accent-soft'
                : 'text-faint hover:text-muted hover:bg-hover'
            }`
          }
          title={item.label}
        >
          {({ isActive }) => (
            <>
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </div>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full bg-accent-fg" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
