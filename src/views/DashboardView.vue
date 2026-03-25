<template>
  <div class="dashboard p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Sprint Analysis Dashboard</h1>
        <p class="text-gray-600 mt-1">AI-powered sprint health and ticket quality analysis</p>
      </div>
      <button class="btn-primary flex items-center gap-2" :disabled="loading" @click="runAnalysis">
        <span
          v-if="loading"
          class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
        ></span>
        {{ loading ? 'Analyzing...' : 'Run Analysis' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Analyzing sprint and ticket quality...</p>
      <p class="text-sm text-gray-500 mt-2">This may take up to 2 minutes</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <span class="text-red-600 mr-2">Error:</span>
        <span class="text-red-800">{{ error }}</span>
      </div>
    </div>

    <!-- Results -->
    <div v-if="results && !loading" class="space-y-6">
      <!-- Sprint Health Section -->
      <SprintHealthCard
        :sprint-analysis="results.sprintAnalysis"
        :sprint-data="results.sprintData"
      />

      <!-- Stale Tickets Section -->
      <StaleTicketsCard
        v-if="results.sprintAnalysis.staleTickets?.length > 0"
        :stale-tickets="results.sprintAnalysis.staleTickets"
      />

      <!-- Workload Analysis Section -->
      <WorkloadAnalysisCard :workload-analysis="results.sprintAnalysis.workloadAnalysis" />

      <!-- Ticket Quality Section -->
      <TicketQualityCard :quality-results="results.qualityResults" />

      <!-- Action Items Section -->
      <ActionItemsCard v-if="results.actionItems?.length > 0" :action-items="results.actionItems" />
    </div>

    <!-- Empty State -->
    <div v-if="!results && !loading && !error" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900">No analysis results yet</h3>
      <p class="text-gray-600 mt-1">Click "Run Analysis" to analyze your current sprint</p>
    </div>
  </div>
</template>

<script setup>
import { useSprintAnalysis } from '@/composables/useSprintAnalysis';
import SprintHealthCard from '@/components/SprintHealthCard.vue';
import StaleTicketsCard from '@/components/StaleTicketsCard.vue';
import WorkloadAnalysisCard from '@/components/WorkloadAnalysisCard.vue';
import TicketQualityCard from '@/components/TicketQualityCard.vue';
import ActionItemsCard from '@/components/ActionItemsCard.vue';

const { loading, error, results, runAnalysis } = useSprintAnalysis();
</script>
