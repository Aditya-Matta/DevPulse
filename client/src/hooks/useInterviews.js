import { useEffect } from 'react';
import useInterviewStore from '../store/interviewStore';

const useInterviews = (autoFetch = true) => {
  const store = useInterviewStore();

  useEffect(() => {
    if (autoFetch) store.fetchInterviews();
  }, []);

  return store;
};

export default useInterviews;
