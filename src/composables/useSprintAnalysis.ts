import { ref, type Ref } from 'vue';
import { sprintService } from '@/services/sprintService';
import type { AnalysisResponse } from '@/types';

interface UseSprintAnalysisReturn {
  readonly loading: Ref<boolean>;
  readonly error: Ref<string | null>;
  readonly results: Ref<AnalysisResponse | null>;
  readonly runAnalysis: () => Promise<void>;
}

export function useSprintAnalysis(): UseSprintAnalysisReturn {
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const results = ref<AnalysisResponse | null>(null);

  async function runAnalysis(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const data = await sprintService.analyzeCurrentSprint();
      results.value = data;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Analysis failed';
      error.value = errorMessage;
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
