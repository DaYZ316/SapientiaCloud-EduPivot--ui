<template>
  <div :class="statusClass" class="status-display">
    <span v-if="showDot" :class="dotClass"></span>
    {{ statusText }}
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {getStatusLabel, StatusEnum} from '@/enum/common';

const props = defineProps({
  // 状态值
  status: {
    type: Number,
    required: true
  },
  // 显示类型: 'text'=纯文本, 'dot'=带点, 'tag'=标签样式
  type: {
    type: String,
    default: 'text',
    validator: (value: string) => ['text', 'dot', 'tag'].includes(value)
  },
  // 自定义文本（不设置则使用i18n中的翻译）
  text: {
    type: String,
    default: ''
  }
});

const {locale} = useI18n();
const isEnglish = computed(() => locale.value === 'en-US');

// 状态文本
const statusText = computed(() => {
  if (props.text) return props.text;
  return getStatusLabel(props.status as StatusEnum, isEnglish.value);
});

// 是否显示状态小圆点
const showDot = computed(() => props.type === 'dot');

// 状态对应的CSS类
const statusClass = computed(() => {
  const isNormal = props.status === StatusEnum.NORMAL;

  switch (props.type) {
    case 'text':
      return isNormal ? 'text-status-normal' : 'text-status-disabled';
    case 'dot':
      return isNormal ? 'text-status-normal' : 'text-status-disabled';
    case 'tag':
      return isNormal ? 'status-tag-normal' : 'status-tag-disabled';
    default:
      return isNormal ? 'text-status-normal' : 'text-status-disabled';
  }
});

// 状态小圆点的CSS类
const dotClass = computed(() => {
  return props.status === StatusEnum.NORMAL ? 'status-dot-normal' : 'status-dot-disabled';
});
</script>

<style scoped>
.status-display {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 文本类型样式 */
.text-status-normal {
  color: var(--success-color);
}

.text-status-disabled {
  color: var(--error-color);
}

/* 标签类型样式 */
.status-tag-normal {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: var(--success-color);
  color: var(--card-background-color);
  border: 1px solid var(--success-color);
}

.status-tag-disabled {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: var(--error-color);
  color: var(--card-background-color);
  border: 1px solid var(--error-color);
}

/* 状态小圆点样式 */
.status-dot-normal {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--success-color);
  display: inline-block;
}

.status-dot-disabled {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--error-color);
  display: inline-block;
}

/* 暗黑模式适配 */
.dark .status-tag-normal {
  background-color: rgba(24, 160, 88, 0.1);
  border-color: var(--success-color);
}

.dark .status-tag-disabled {
  background-color: rgba(208, 48, 80, 0.1);
  border-color: var(--error-color);
}
</style> 