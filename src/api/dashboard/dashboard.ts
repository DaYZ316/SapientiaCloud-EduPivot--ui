import http from '@/utils/http'
import type {StatisticsVO} from '@/types/dashboard/statistics'
import type {Result} from '@/types/common'

// 获取统计数据
export function getStatistics(): Promise<Result<StatisticsVO>> {
    return http.get<StatisticsVO>('/system/dashboard/statistics')
}
