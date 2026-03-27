<template>
  <div class="card">
    <div class="flex justify-between items-start mb-4">
      <h2 class="text-2xl font-bold">Sprint Health</h2>
      <span :class="['status-badge', statusClass]">
        {{ sprintAnalysis.sprintHealth?.toUpperCase() }}
      </span>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="text-center p-4 bg-gray-50 rounded-lg">
        <div class="text-sm text-gray-600">Sprint</div>
        <div class="text-lg font-semibold">{{ sprintData.sprint?.name }}</div>
      </div>
      <div class="text-center p-4 bg-gray-50 rounded-lg">
        <div class="text-sm text-gray-600">Days Remaining</div>
        <div class="text-lg font-semibold">{{ sprintData.sprint?.daysRemaining }}</div>
      </div>
      <div class="text-center p-4 bg-gray-50 rounded-lg">
        <div class="text-sm text-gray-600">Completion</div>
        <div class="text-lg font-semibold">
          {{ sprintData.metrics?.completionPct?.toFixed(1) }}%
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span
          >{{ sprintData.metrics?.completedPoints }} /
          {{ sprintData.metrics?.totalPoints }} points</span
        >
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="h-3 rounded-full transition-all duration-500"
          :class="progressBarClass"
          :style="{ width: `${sprintData.metrics?.completionPct || 0}%` }"
        ></div>
      </div>
    </div>

    <!-- Completion Prediction -->
    <div class="bg-gray-50 rounded-lg p-4 mb-4">
      <h3 class="font-semibold mb-2">Completion Prediction</h3>
      <p class="text-gray-700">{{ sprintAnalysis.completionPrediction?.reasoning }}</p>
      <div class="mt-2 flex gap-4 text-sm text-gray-600">
        <span
          >Likelihood: <strong>{{ sprintAnalysis.completionPrediction?.likelihood }}</strong></span
        >
        <span
          >Confidence: <strong>{{ sprintAnalysis.completionPrediction?.confidence }}</strong></span
        >
      </div>
    </div>

    <!-- Key Insights -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h3 class="font-semibold mb-2 text-blue-900">Key Insights</h3>
      <p class="text-blue-800">{{ sprintAnalysis.insights }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SprintAnalysis, SprintData } from '@/types';

interface Props {
  sprintAnalysis: SprintAnalysis;
  sprintData: SprintData;
}

const props = defineProps<Props>();

const statusClass = computed(() => {
  const health = props.sprintAnalysis.sprintHealth;
  if (health === 'healthy') {
    return 'status-healthy';
  }
  if (health === 'at-risk') {
    return 'status-at-risk';
  }
  return 'status-critical';
});

const progressBarClass = computed(() => {
  const pct = props.sprintData.metrics?.completionPct || 0;
  if (pct >= 70) {
    return 'bg-green-500';
  }
  if (pct >= 40) {
    return 'bg-yellow-500';
  }
  return 'bg-red-500';
});
</script>
