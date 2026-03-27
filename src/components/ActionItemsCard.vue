<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-4">Action Items for Next Sprint</h2>

    <div class="space-y-4">
      <div
        v-for="(item, idx) in actionItems"
        :key="idx"
        class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-2">
            <span :class="['status-badge', priorityClass(item.priority)]">
              {{ item.priority?.toUpperCase() }}
            </span>
            <span class="text-sm text-gray-500 capitalize">{{ item.type }}</span>
          </div>
          <div class="flex gap-2">
            <button class="text-sm text-green-600 hover:text-green-800" @click="markDone(idx)">
              Mark Done
            </button>
            <button class="text-sm text-gray-500 hover:text-gray-700" @click="dismiss(idx)">
              Dismiss
            </button>
          </div>
        </div>

        <p class="font-medium text-gray-900 mb-2">{{ item.action }}</p>

        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Expected Impact:</span>
            <p class="text-gray-700">{{ item.expectedImpact }}</p>
          </div>
          <div>
            <span class="text-gray-500">Responsible:</span>
            <p class="text-gray-700">{{ item.responsible }}</p>
          </div>
          <div>
            <span class="text-gray-500">Timeline:</span>
            <p class="text-gray-700">{{ item.timeline }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Button -->
    <div class="mt-6 flex justify-end">
      <button class="btn-secondary" @click="exportActions">Export to Markdown</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActionItem } from '@/types';

interface Props {
  actionItems?: readonly ActionItem[];
}

const props = withDefaults(defineProps<Props>(), {
  actionItems: () => [],
});

const emit = defineEmits<{
  'update:actionItems': [items: ActionItem[]];
}>();

function priorityClass(priority: 'high' | 'medium' | 'low'): string {
  if (priority === 'high') {
    return 'status-critical';
  }
  if (priority === 'medium') {
    return 'status-at-risk';
  }
  return 'status-healthy';
}

function markDone(idx: number): void {
  const updated = props.actionItems.filter((_, i) => i !== idx);
  emit('update:actionItems', updated);
}

function dismiss(idx: number): void {
  const updated = props.actionItems.filter((_, i) => i !== idx);
  emit('update:actionItems', updated);
}

function exportActions(): void {
  const markdown = props.actionItems
    .map((item) => {
      return `## ${item.action}

- **Priority:** ${item.priority}
- **Type:** ${item.type}
- **Expected Impact:** ${item.expectedImpact}
- **Responsible:** ${item.responsible}
- **Timeline:** ${item.timeline}
`;
    })
    .join('\n---\n\n');

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sprint-action-items.md';
  a.click();
  URL.revokeObjectURL(url);
}
</script>
