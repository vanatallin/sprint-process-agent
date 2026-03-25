<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-4">
      Stale Tickets
      <span class="text-lg font-normal text-gray-500">({{ staleTickets.length }})</span>
    </h2>

    <div class="space-y-4">
      <div
        v-for="ticket in staleTickets"
        :key="ticket.ticketKey"
        class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-lg text-blue-600">{{ ticket.ticketKey }}</h3>
          <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {{ ticket.daysSinceUpdate }} days since update
          </span>
        </div>

        <p class="text-sm text-gray-600 mb-2">
          <span class="font-medium">Assignee:</span> {{ ticket.assignee }}
        </p>

        <div class="mb-2">
          <span class="font-medium text-gray-700">Reason:</span>
          <p class="text-gray-600 mt-1">{{ ticket.reason }}</p>
        </div>

        <div class="bg-blue-50 rounded p-3">
          <span class="font-medium text-blue-800">Recommendation:</span>
          <p class="text-blue-700 mt-1">{{ ticket.recommendation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  staleTickets: {
    type: Array,
    required: true,
  },
});
</script>
