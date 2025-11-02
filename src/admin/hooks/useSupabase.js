import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../config/supabase';

export function useQuotes(filters = {}) {
  return useQuery({
    queryKey: ['quotes', filters],
    queryFn: async () => {
      let query = supabase
        .from('quotes')
        .select(`
          *,
          client:clients(*),
          assigned_user:users!quotes_assigned_to_fkey(id, full_name, email, avatar_url),
          status:quote_statuses(*)
        `)
        .order('created_at', { ascending: false });

      if (filters.status_id) {
        query = query.eq('status_id', filters.status_id);
      }

      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }

      if (filters.insurance_type) {
        query = query.eq('insurance_type', filters.insurance_type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
}

export function useQuote(quoteId) {
  return useQuery({
    queryKey: ['quote', quoteId],
    enabled: !!quoteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          client:clients(*),
          assigned_user:users!quotes_assigned_to_fkey(id, full_name, email, avatar_url),
          status:quote_statuses(*)
        `)
        .eq('id', quoteId)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useClients(filters = {}) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: async () => {
      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
}

export function useQuoteStatuses() {
  return useQuery({
    queryKey: ['quote_statuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_statuses')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      return data || [];
    },
  });
}

export function useActivities(filters = {}) {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: async () => {
      let query = supabase
        .from('activities')
        .select(`
          *,
          user:users(full_name, avatar_url),
          quote:quotes(title),
          client:clients(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filters.quote_id) {
        query = query.eq('quote_id', filters.quote_id);
      }

      if (filters.client_id) {
        query = query.eq('client_id', filters.client_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quoteId, updates }) => {
      const { data, error } = await supabase
        .from('quotes')
        .update(updates)
        .eq('id', quoteId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['quote'] });
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          user_id: userData?.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const [quotesResult, statsResult] = await Promise.all([
        supabase
          .from('quotes')
          .select('*, status:quote_statuses(name, display_name)'),
        supabase.from('quote_pipeline_stats').select('*'),
      ]);

      const quotes = quotesResult.data || [];
      const pipelineStats = statsResult.data || [];

      const totalQuotes = quotes.length;
      const activeQuotes = quotes.filter(q => !['closed_won', 'closed_lost'].includes(q.status?.name)).length;
      const wonQuotes = quotes.filter(q => q.status?.name === 'closed_won').length;
      const lostQuotes = quotes.filter(q => q.status?.name === 'closed_lost').length;
      
      const totalRevenue = quotes
        .filter(q => q.status?.name === 'closed_won')
        .reduce((sum, q) => sum + (parseFloat(q.premium_amount) || 0), 0);

      const totalCoverage = quotes
        .filter(q => q.status?.name === 'closed_won')
        .reduce((sum, q) => sum + (parseFloat(q.coverage_amount) || 0), 0);

      const winRate = wonQuotes + lostQuotes > 0 
        ? Math.round((wonQuotes / (wonQuotes + lostQuotes)) * 100) 
        : 0;

      return {
        totalQuotes,
        activeQuotes,
        wonQuotes,
        lostQuotes,
        totalRevenue,
        totalCoverage,
        winRate,
        pipelineStats,
      };
    },
  });
}
