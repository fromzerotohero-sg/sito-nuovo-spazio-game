import { createContext, useContext, type ReactNode } from 'react';

type EditModeValue = {
  enabled: boolean;
};

const EditModeContext = createContext<EditModeValue>({ enabled: false });

export function EditModeProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  return <EditModeContext.Provider value={{ enabled }}>{children}</EditModeContext.Provider>;
}

export function useEditMode() {
  return useContext(EditModeContext);
}

export function useIsEditing() {
  return useContext(EditModeContext).enabled;
}

export function useAppPath() {
  const { enabled } = useEditMode();
  return (path: string) => {
    if (!enabled) return path;
    if (!path || path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:') || path.startsWith('#')) {
      return path;
    }
    if (path === '/') return '/admin';
    if (path.startsWith('/admin')) return path;
    return `/admin${path}`;
  };
}
