# 日期时间工具插件 (DateUtil)

## 简介

日期时间工具插件提供了一套完整的东八区（北京时间）日期时间格式化功能，特别适用于处理日期选择器和时间范围查询。

## 功能特性

- ✅ 东八区时间格式化
- ✅ 标准格式输出：`yyyy-MM-dd HH:mm:ss`
- ✅ 日期范围选择器集成
- ✅ TypeScript 完整类型支持
- ✅ 自动处理时区转换

## API 文档

### formatToBeijingTime(date: Date): string

将Date对象格式化为东八区时间字符串。

**参数：**

- `date: Date` - 要格式化的Date对象

**返回值：**

- `string` - 格式化后的时间字符串，格式为 `yyyy-MM-dd HH:mm:ss`

**示例：**

```typescript
import {formatToBeijingTime} from '@/utils/dateUtil'

const now = new Date()
const beijingTime = formatToBeijingTime(now)
console.log(beijingTime) // 输出：2024-01-15 14:30:25
```

### formatTimestampsToBeijingTime(timestamps: [number, number] | null): [string, string] | [null, null]

将时间戳数组格式化为东八区时间字符串数组。

**参数：**

- `timestamps: [number, number] | null` - 时间戳数组或null

**返回值：**

- `[string, string] | [null, null]` - 格式化后的时间字符串数组

**示例：**

```typescript
import {formatTimestampsToBeijingTime} from '@/utils/dateUtil'

const timestamps: [number, number] = [1705305000000, 1705391400000]
const [startTime, endTime] = formatTimestampsToBeijingTime(timestamps)
console.log(startTime, endTime) // 输出：2024-01-15 09:30:00 2024-01-16 09:30:00
```

### formatToBeijingDate(date: Date): string

将Date对象格式化为东八区日期字符串（仅日期部分）。

**参数：**

- `date: Date` - 要格式化的Date对象

**返回值：**

- `string` - 格式化后的日期字符串，格式为 `yyyy-MM-dd`

**示例：**

```typescript
import {formatToBeijingDate} from '@/utils/dateUtil'

const now = new Date()
const beijingDate = formatToBeijingDate(now)
console.log(beijingDate) // 输出：2024-01-15
```

### handleDateRangeChange(value, callback)

专门用于处理日期范围选择器值变化的工具函数。

**参数：**

- `value: [number, number] | null` - 日期范围选择器的值
- `callback: (startTime: string | null, endTime: string | null) => void` - 回调函数

**示例：**

```typescript
import {handleDateRangeChange} from '@/utils/dateUtil'

// 在Vue组件中使用
function onDateRangeChange(value: [number, number] | null) {
    handleDateRangeChange(value, (startTime, endTime) => {
        searchForm.startTime = startTime
        searchForm.endTime = endTime
    })
}
```

## 在组件中使用

### 基本用法

```vue

<template>
  <n-date-picker
      v-model:value="dateRange"
      type="datetimerange"
      @update:value="onDateRangeChange"
  />
</template>

<script setup lang="ts">
  import {ref} from 'vue'
  import {handleDateRangeChange} from '@/utils/dateUtil'

  const dateRange = ref<[number, number] | null>(null)
  const searchForm = reactive({
    startTime: null,
    endTime: null
  })

  function onDateRangeChange(value: [number, number] | null) {
    handleDateRangeChange(value, (startTime, endTime) => {
      searchForm.startTime = startTime
      searchForm.endTime = endTime
    })
  }
</script>
```

### 高级用法

```typescript
import {formatToBeijingTime, formatToBeijingDate} from '@/utils/dateUtil'

// 获取当前北京时间
const currentBeijingTime = formatToBeijingTime(new Date())

// 获取当前北京日期
const currentBeijingDate = formatToBeijingDate(new Date())

// 处理API返回的时间戳
const apiTimestamp = 1705305000000
const formattedTime = formatToBeijingTime(new Date(apiTimestamp))
```

## 时区说明

- 所有函数都会自动将输入时间转换为东八区（UTC+8）时间
- 无论当前系统时区如何，输出都保证是北京时间
- 格式化输出遵循标准格式：`yyyy-MM-dd HH:mm:ss`

## 注意事项

1. 所有函数都处理了null值情况，使用时无需额外判断
2. 时间格式化函数会自动处理时区转换，确保输出为东八区时间
3. 建议在处理日期选择器时使用 `handleDateRangeChange` 函数以保持代码一致性
4. 所有函数都有完整的TypeScript类型定义，支持代码提示和类型检查 