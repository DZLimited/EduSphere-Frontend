import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
// Light, minimal sidebar — thin border instead of a solid color block.
// Indigo is reserved for the active nav item only, keeping the rest of
// the UI quiet so content is what draws the eye, not the chrome.
const Sidebar = ({ roleLabel, items, extra }) => {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col min-h-screen">
    <div className="px-4 pt-5 pb-4 flex items-center justify-between">
        <Logo size={22} wordmarkClassName="text-sm" />
        {extra}
      </div>

      {roleLabel && (
        <p className="px-4 pb-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">{roleLabel}</p>
      )}

      <nav className="flex-1 px-2.5 flex flex-col gap-0.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;