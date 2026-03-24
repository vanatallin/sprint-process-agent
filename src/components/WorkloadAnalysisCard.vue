<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-4">Workload Analysis</h2>

    <!-- Overloaded -->
    <div v-if="workloadAnalysis.overloaded?.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
        <span class="w-3 h-3 bg-red-500 rounded-full"></span>
        Overloaded Team Members
      </h3>
      <div class="space-y-3">
        <div
          v-for="person in workloadAnalysis.overloaded"
          :key="person.person"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold">{{ person.person }}</span>
            <span class="text-red-700 font-bold">{{ person.currentPoints }} points</span>
          </div>
          <p class="text-sm text-red-700">{{ person.reasoning }}</p>
        </div>
      </div>
    </div>

    <!-- Underutilized -->
    <div v-if="workloadAnalysis.underutilized?.length > 0">
      <h3 class="text-lg font-semibold text-blue-600 mb-3 flex items-center gap-2">
        <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
        Underutilized Team Members
      </h3>
      <div class="space-y-3">
        <div
          v-for="person in workloadAnalysis.underutilized"
          :key="person.person"
          class="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold">{{ person.person }}</span>
            <span class="text-blue-700 font-bold">{{ person.currentPoints }} points</span>
          </div>
          <p class="text-sm text-blue-700">{{ person.reasoning }}</p>
        </div>
      </div>
    </div>

    <!-- Balanced State -->
    <div
      v-if="!workloadAnalysis.overloaded?.length && !workloadAnalysis.underutilized?.length"
      class="text-center py-6 text-gray-500"
    >
      <p>Workload is evenly distributed across the team</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  workloadAnalysis: {
    type: Object,
    required: true
  }
})
</script>
