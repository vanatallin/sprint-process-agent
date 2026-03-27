<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-4">Ticket Quality Issues</h2>

    <div v-if="lowQualityTickets.length === 0" class="text-center py-6 text-gray-500">
      <p>All tickets meet quality standards</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="ticket in lowQualityTickets"
        :key="ticket.ticketKey"
        class="border border-gray-200 rounded-lg p-4"
      >
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-semibold text-lg">{{ ticket.ticketKey }}</h3>
          <span :class="['status-badge', qualityBadgeClass(ticket.quality)]">
            {{ ticket.quality?.toUpperCase() }} ({{ ticket.qualityScore }}/100)
          </span>
        </div>

        <!-- Issues -->
        <div v-if="ticket.issues?.length > 0" class="mb-3">
          <h4 class="font-medium text-sm text-gray-700 mb-2">Issues:</h4>
          <ul class="space-y-1">
            <li
              v-for="(issue, idx) in ticket.issues"
              :key="idx"
              class="text-sm text-gray-600 flex items-start gap-2"
            >
              <span :class="severityDot(issue.severity)"></span>
              <span>{{ issue.description }}</span>
            </li>
          </ul>
        </div>

        <!-- Scope Creep -->
        <div v-if="ticket.scopeCreep?.length > 0" class="mb-3 bg-yellow-50 rounded p-3">
          <h4 class="font-medium text-sm text-yellow-800 mb-2">Scope Creep:</h4>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(item, idx) in ticket.scopeCreep" :key="idx" class="text-sm text-yellow-900">
              {{ item.item }}
            </li>
          </ul>
        </div>

        <!-- Missing Requirements -->
        <div v-if="ticket.missingRequirements?.length > 0" class="bg-red-50 rounded p-3">
          <h4 class="font-medium text-sm text-red-800 mb-2">Missing Requirements:</h4>
          <ul class="list-disc list-inside space-y-1">
            <li
              v-for="(item, idx) in ticket.missingRequirements"
              :key="idx"
              class="text-sm text-red-900"
            >
              {{ item.item }} <span class="text-red-600">(from {{ item.sourceDoc }})</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QualityResult, QualityLevel } from '@/types';

interface Props {
  qualityResults: QualityResult[];
}

const props = defineProps<Props>();

const lowQualityTickets = computed(() => {
  return props.qualityResults.filter(
    (t) => t.quality === 'low' || t.quality === 'medium' || t.issues?.length > 0,
  );
});

function qualityBadgeClass(quality: QualityLevel): string {
  if (quality === 'high') {
    return 'status-healthy';
  }
  if (quality === 'medium') {
    return 'status-at-risk';
  }
  return 'status-critical';
}

function severityDot(severity: 'high' | 'medium' | 'low'): string {
  const base = 'w-2 h-2 rounded-full mt-1.5 flex-shrink-0';
  if (severity === 'high') {
    return `${base} bg-red-500`;
  }
  if (severity === 'medium') {
    return `${base} bg-yellow-500`;
  }
  return `${base} bg-gray-400`;
}
</script>
