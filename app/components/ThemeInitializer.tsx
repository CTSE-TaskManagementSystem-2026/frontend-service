'use client';

import { useEffect } from 'react';
import { applyTheme, getInitialTheme } from '@/app/components/theme';

export default function ThemeInitializer() {
  useEffect(() => {
    applyTheme(getInitialTheme());
  }, []);

  return null;
}
