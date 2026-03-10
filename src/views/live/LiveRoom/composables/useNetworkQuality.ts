import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'

export interface NetworkQualityResult {
    // 状态
    connectionQuality: import('vue').Ref<'excellent' | 'good' | 'fair' | 'poor' | 'offline'>
    latency: import('vue').Ref<number>
    packetLoss: import('vue').Ref<number>
    bandwidth: import('vue').Ref<number>

    // 计算属性
    qualityLabel: import('vue').ComputedRef<string>
    qualityColor: import('vue').ComputedRef<string>
    isStable: import('vue').ComputedRef<boolean>

    // 方法
    updateQuality: (stats: NetworkStats) => void
    reset: () => void
}

interface NetworkStats {
    latency?: number
    packetLoss?: number
    bandwidth?: number
}

export const useNetworkQuality = (): NetworkQualityResult => {
    const {t} = useI18n()

    // 网络质量状态
    const connectionQuality = ref<'excellent' | 'good' | 'fair' | 'poor' | 'offline'>('good')
    const latency = ref(0)
    const packetLoss = ref(0)
    const bandwidth = ref(0)

    // 质量标签和颜色
    const qualityLabel = computed(() => {
        const labels = {
            excellent: t('live.network.excellent'),
            good: t('live.network.good'),
            fair: t('live.network.fair'),
            poor: t('live.network.poor'),
            offline: t('live.network.offline')
        }
        return labels[connectionQuality.value] || labels.good
    })

    const qualityColor = computed(() => {
        const colors = {
            excellent: 'green',
            good: 'blue',
            fair: 'orange',
            poor: 'red',
            offline: 'gray'
        }
        return colors[connectionQuality.value] || colors.good
    })

    const isStable = computed(() => {
        return connectionQuality.value === 'excellent' || connectionQuality.value === 'good'
    })

    // 更新网络质量
    const updateQuality = (stats: NetworkStats): void => {
        // 更新统计数据
        if (stats.latency !== undefined) {
            latency.value = stats.latency
        }
        if (stats.packetLoss !== undefined) {
            packetLoss.value = stats.packetLoss
        }
        if (stats.bandwidth !== undefined) {
            bandwidth.value = stats.bandwidth
        }

        // 根据统计数据计算质量
        let quality: typeof connectionQuality.value = 'good'

        if (latency.value > 500 || packetLoss.value > 10) {
            quality = 'poor'
        } else if (latency.value > 200 || packetLoss.value > 5) {
            quality = 'fair'
        } else if (latency.value < 50 && packetLoss.value < 1) {
            quality = 'excellent'
        }

        // 检查网络连接
        if (!navigator.onLine) {
            quality = 'offline'
        }

        connectionQuality.value = quality
    }

    // 重置状态
    const reset = (): void => {
        connectionQuality.value = 'good'
        latency.value = 0
        packetLoss.value = 0
        bandwidth.value = 0
    }

    return {
        // 状态
        connectionQuality,
        latency,
        packetLoss,
        bandwidth,

        // 计算属性
        qualityLabel,
        qualityColor,
        isStable,

        // 方法
        updateQuality,
        reset
    }
}
