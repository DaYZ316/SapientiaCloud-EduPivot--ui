<template>
  <div :class="`quality-${qualityColor}`" class="network-quality-indicator">
    <n-icon :component="qualityIcon" size="16"/>
    <span class="quality-text">{{ qualityLabel }}</span>
    <n-tooltip v-if="showDetails">
      <template #trigger>
        <n-icon :component="PinOutline" class="info-icon" size="14"/>
      </template>
      <div class="quality-details">
        <div>{{ t('live.network.latency') }}: {{ latency }}ms</div>
        <div>{{ t('live.network.packetLoss') }}: {{ packetLoss }}%</div>
        <div>{{ t('live.network.bandwidth') }}: {{ bandwidth }}kbps</div>
      </div>
    </n-tooltip>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {NIcon, NTooltip} from 'naive-ui'
import {PinOutline, WifiOutline} from '@vicons/ionicons5'
import {useNetworkQuality} from '../composables/useNetworkQuality'

interface Props {
  showDetails?: boolean
}

withDefaults(defineProps<Props>(), {
  showDetails: true
})

const {t} = useI18n()
const networkQuality = useNetworkQuality()

const qualityIcon = computed(() => {
  return networkQuality.isStable.value ? WifiOutline : WifiOutline
})

const qualityLabel = computed(() => networkQuality.qualityLabel.value)
const qualityColor = computed(() => networkQuality.qualityColor.value)
const latency = computed(() => networkQuality.latency.value)
const packetLoss = computed(() => networkQuality.packetLoss.value)
const bandwidth = computed(() => networkQuality.bandwidth.value)
</script>

<style scoped>
.network-quality-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.quality-green {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.quality-blue {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.quality-orange {
  background-color: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.quality-red {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.quality-gray {
  background-color: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}

.quality-text {
  font-size: 12px;
}

.info-icon {
  opacity: 0.6;
  cursor: help;
}

.quality-details {
  font-size: 12px;
  line-height: 1.4;
}

.quality-details > div {
  margin-bottom: 2px;
}

.quality-details > div:last-child {
  margin-bottom: 0;
}
</style>
