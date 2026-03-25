import { ref } from 'vue';
import { sprintService } from '@/services/sprintService';

export function useSprintAnalysis() {
  const loading = ref(false);
  const error = ref(null);
  const results = ref(null);

  async function runAnalysis() {
    loading.value = true;
    error.value = null;

    try {
      const data = await sprintService.analyzeCurrentSprint();
      results.value = data;
    } catch (e) {
      error.value = e.message || 'Analysis failed';
      console.error('Sprint analysis error:', e);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    results,
    runAnalysis,
  };
}
