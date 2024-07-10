'use client';

import React from 'react';

function page() {
  return (
    <>
      {/* header */}
      <div className='border-b bg-card'>
        <div className='container flex flex-wrap items-centre justify-between gap-6 py-6'>
          <div>
            <h2 className='text-3xl font-bold'>Manage</h2>
            <p className='text-muted'>
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
