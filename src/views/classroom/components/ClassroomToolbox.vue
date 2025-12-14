<template>
  <div class="classroom-toolbox">
    <div :class="{'is-open': isOpenResolved}" class="radial-container">
      <div class="toolbox-items">
        <transition-group name="toolbox-item">
          <div
              v-for="(item, index) in radialItems"
              :key="item.key"
              :style="getItemTransformStyle(item, index)"
              class="toolbox-item-wrapper"
          >
            <NTooltip placement="left">
              <template #trigger>
                <NButton
                    circle
                    class="toolbox-item"
                    size="large"
                    tertiary
                    @click="handleClick(item, $event)"
                >
                  <component :is="item.icon"/>
                </NButton>
              </template>
              <span>{{ item.labelKey ? t(item.labelKey) : item.label }}</span>
            </NTooltip>
          </div>
        </transition-group>
      </div>
      <NButton
          circle
          class="toolbox-trigger glow-effect"
          size="large"
          type="primary"
          @click="toggleOpen"
      >
        <component :is="isOpenResolved ? CloseOutline : BriefcaseOutline"/>
      </NButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {NButton, NTooltip} from 'naive-ui';
import {BriefcaseOutline, CloseOutline} from '@vicons/ionicons5';
import type {ClassroomToolboxItem} from '@/views/classroom/composables/toolbox';

const props = withDefaults(defineProps<{ items: ClassroomToolboxItem[] | null }>(), {
  items: null
});

const {t} = useI18n();

const isOpen = ref<boolean | null>(null);

onMounted(() => {
  isOpen.value = false;
});

const isOpenResolved = computed(() => Boolean(isOpen.value));

const normalizedItems = computed(() => props.items || []);

const radialItems = computed(() => {
  const list = normalizedItems.value;
  if (!list.length) {
    return [];
  }

  const itemsPerLayer = 4;
  const baseAngle = 180; // 开始角度（左侧水平向左）
  const angleSpan = 90;  // 展开角度范围
  const radiusFirst = 110;
  const radiusSecond = 170;

  return list.map((item, index) => {
    const layerIndex = Math.floor(index / itemsPerLayer); // 0: 第一层，1: 第二层
    const indexInLayer = index % itemsPerLayer;
    const layerCount = Math.min(itemsPerLayer, list.length - layerIndex * itemsPerLayer);
    const angleStep = layerCount > 1 ? angleSpan / (layerCount - 1) : 0;
    const angleDeg = baseAngle + angleStep * indexInLayer;
    const rad = (angleDeg * Math.PI) / 180;
    const radius = layerIndex === 0 ? radiusFirst : radiusSecond;
    const translateX = Math.cos(rad) * radius;
    const translateY = Math.sin(rad) * radius * -1;
    return {...item, translateX, translateY};
  });
});

const toggleOpen = () => {
  const nextState = !(isOpen.value ?? false);
  isOpen.value = nextState;
};

const getItemTransformStyle = (item: ClassroomToolboxItem & {
  translateX: number;
  translateY: number
}, index: number) => {
  const delay = `${index * 40}ms`;
  return {
    '--tx': `${item.translateX}px`,
    '--ty': `${item.translateY}px`,
    transitionDelay: delay,
    WebkitTransitionDelay: delay
  };
};

const handleClick = (item: ClassroomToolboxItem, event: MouseEvent) => {
  if (item.handler) {
    item.handler(event);
  }
  isOpen.value = false;
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/index.scss" as *;

.classroom-toolbox {
  position: absolute;
  right: 32px;
  top: 32px;
  pointer-events: none;
  z-index: 12;
}

.radial-container {
  position: relative;
  width: 72px;
  height: 72px;
}

.toolbox-trigger {
  width: 72px;
  height: 72px;
  pointer-events: all;
  box-shadow: 0 16px 36px color-mix(in srgb, var(--shadow-color) 80%, transparent),
  inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 50%, transparent);
  background: radial-gradient(circle at 25% 25%, color-mix(in srgb, var(--color-primary-light) 80%, transparent), color-mix(in srgb, var(--color-primary-dark) 90%, transparent)),
  linear-gradient(135deg, color-mix(in srgb, var(--background-secondary-color) 70%, transparent), color-mix(in srgb, var(--background-tertiary-color) 90%, transparent));
  border: 1px solid color-mix(in srgb, var(--color-primary) 70%, transparent);
  color: #ffffff;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  :deep(svg) {
    width: 30px;
    height: 30px;
    color: #ffffff;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px color-mix(in srgb, var(--shadow-color) 90%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--color-primary-light) 60%, transparent);
  }
}

.toolbox-items {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.toolbox-item-wrapper {
  position: absolute;
  right: 8px;
  bottom: 8px;
  pointer-events: none;
  transform: translate(0, 0) scale(0.8);
  opacity: 0;
  transition: transform 0.32s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.22s ease;
}

.toolbox-item {
  width: 56px;
  height: 56px;
  pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--border-color) 70%, transparent);
  background: linear-gradient(135deg, color-mix(in srgb, var(--background-secondary-color) 60%, transparent), color-mix(in srgb, var(--background-tertiary-color) 90%, transparent));
  color: var(--text-color);
  box-shadow: 0 12px 26px color-mix(in srgb, var(--shadow-secondary-color) 90%, transparent);
  transition: box-shadow 0.28s ease;

  :deep(svg) {
    width: 24px;
    height: 24px;
  }

  &:hover {
    box-shadow: 0 16px 30px color-mix(in srgb, var(--shadow-color) 80%, transparent);
    border-color: color-mix(in srgb, var(--color-primary) 60%, transparent);
    color: var(--color-primary);
  }
}

.toolbox-item-enter-from,
.toolbox-item-leave-to {
  opacity: 0;
}

.is-open {
  .toolbox-item-wrapper {
    pointer-events: all;
    opacity: 1;
    transform: translate(var(--tx), var(--ty)) scale(1);
  }

  .toolbox-item {
    pointer-events: all;
  }
}
</style>

