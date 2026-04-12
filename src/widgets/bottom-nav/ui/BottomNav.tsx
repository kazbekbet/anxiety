import { NavLink } from 'react-router-dom';
import { navItems } from '../model/navItems';

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-nav backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-all duration-200 ${
                isActive ? 'text-accent-fg' : 'text-faint hover:text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
                {isActive && <div className="absolute bottom-0.5 h-0.5 w-8 rounded-full bg-accent-fg transition-all duration-300" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
