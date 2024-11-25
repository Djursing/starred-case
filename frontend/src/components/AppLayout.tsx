// components/AppLayout.tsx
import React from 'react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex flex-2 p-10 mx-auto h-full">
      <div className="grow p-7">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </main>
  );
};


export default AppLayout;