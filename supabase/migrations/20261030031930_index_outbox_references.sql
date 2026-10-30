-- Cover outbox references used by refunds, delivery lookup, and foreign-key checks.
create index soltasite_outbox_order on public.soltasite_commerce_outbox(order_id);
create index soltasite_outbox_submission on public.soltasite_commerce_outbox(submission_id);
