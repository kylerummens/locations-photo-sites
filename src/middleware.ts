// middleware.js
import { checkAccountId } from '@/lib/auth/middleware/check-account-id';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {

  const steps = [
    async () => checkAccountId(request),
  ];

  let response: NextResponse | undefined;

  for (const step of steps) {
    response = await step();
    if (response) return response;
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
