GRANT SELECT ON public.chat_faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_faqs TO authenticated;
GRANT ALL ON public.chat_faqs TO service_role;
GRANT SELECT, DELETE ON public.chat_conversations TO authenticated;
GRANT ALL ON public.chat_conversations TO service_role;
GRANT SELECT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;