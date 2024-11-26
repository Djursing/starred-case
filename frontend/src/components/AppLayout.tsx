// components/AppLayout.tsx
import React from 'react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex flex-2 p-10 mx-auto h-full min-h-screen overflow-auto">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
};


export default AppLayout;