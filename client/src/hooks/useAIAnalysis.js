import { useState } from 'react';
import api from '../lib/axios';
import useUIStore from '../store/uiStore';

const useAIAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [callsRemaining, setCallsRemaining] = useState(null);
  const { addNotification } = useUIStore();

  const triggerAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/ai/analyse');
      const { weaknesses, generatedAt, callsRemaining: remaining } = res.data.data;
      setAnalysis({ weaknesses, generatedAt });
      setCallsRemaining(remaining);
      addNotification({ type: 'success', message: 'AI analysis complete!' });
    } catch (err) {
      const msg = err.response?.data?.message || 'AI analysis failed';
      setError(msg);
      addNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const fetchLastAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/ai/last-analysis');
      const { analysis: a } = res.data.data;
      if (a?.generatedAt) setAnalysis(a);
    } catch {}
    finally { setLoading(false); }
  };

  return { analysis, loading, error, callsRemaining, triggerAnalysis, fetchLastAnalysis };
};

export default useAIAnalysis;
