import { NextResponse } from 'next/server';
import { commerceConfig } from '@/lib/server/config';
import { createOrderAccessCookie, loadPaidOrder } from '@/lib/server/orders';
import { ApiError } from '@/lib/server/errors';
import { errorResponse, PRIVATE_HEADERS } from '@/lib/server/http';

export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const config = commerceConfig();
    const id = new URL(request.url).searchParams.get('session_id') ?? '';
    let order;
    try { order = await loadPaidOrder(id); }
    catch (error) {
      if (!(error instanceof ApiError) || error.code !== 'payment_pending') throw error;
    }
    if (!order) {
      const pending = new URL('/thanks', config.origin);
      pending.searchParams.set('payment', 'pending'); pending.searchParams.set('session_id', id);
      return NextResponse.redirect(pending, { status: 303, headers: PRIVATE_HEADERS });
    }
    const response = NextResponse.redirect(new URL('/thanks', config.origin), { status: 303, headers: PRIVATE_HEADERS });
    response.cookies.set(createOrderAccessCookie(order.id));
    return response;
  } catch (error) { return errorResponse(error); }
}
