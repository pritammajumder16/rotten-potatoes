import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const getCookie = (name: string) => {
    console.log(document.cookie);
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(';').shift();
    return null;
  };

  const accessToken = getCookie('accessToken');
  console.log(accessToken);
  if (accessToken) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
