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
  <NDrawer v-model:show="drawerVisible" placement="right" :width="drawerWidth">
    <template #header>
      {{ t('classroom.editSeating') || '编辑座位' }}
    </template>
    <div class="drawer-body" style="padding:16px; position:relative; min-height:240px;">
      <div style="margin-bottom:12px;">
        <label class="form-label">{{ t('classroom.detail.rows') || '行' }}</label>
        <NInputNumber v-model:value="editRows" :min="1" style="width:100%;"/>
      </div>
      <div style="margin-bottom:12px;">
        <label class="form-label">{{ t('classroom.detail.columns') || '列' }}</label>
        <NInputNumber v-model:value="editCols" :min="1" style="width:100%;"/>
      </div>

      <!-- 座位预览（和 ClassroomDetail.vue 保持一致） -->
      <div v-if="editRows > 0 && editCols > 0" class="seating-preview drawer-preview" style="margin-top:12px;">
        <template v-if="classroomType === ClassroomTypeEnum.LARGE">
          <div class="large-components-row" :style="{ gap: DRAWER_GAP + 'px' }">
            <template v-for="r in editRows" :key="'row-' + r">
              <div class="large-component-row" style="display:flex;gap:8px;justify-content:center;">
                <template v-for="c in componentCount" :key="'comp-' + r + '-' + c">
                  <div
                    class="large-component"
                    :style="{ width: (largeCellSize * 4) + 'px', height: largeCellSize + 'px', display:'grid', gridTemplateColumns: 'repeat(4, ' + largeCellSize + 'px)', gridAutoRows: largeCellSize + 'px' }"
                  >
                    <div
                      v-for="local in 4"
                      :key="local"
                      class="large-seat"
                      :style="{ width: largeCellSize + 'px', height: largeCellSize + 'px', fontSize: Math.max(10, Math.floor(largeCellSize / 2)) + 'px' }"
                    >
                      <span v-if="getSeatLabelFromComp(r - 1, c - 1, local - 1)">
                        {{ getSeatLabelFromComp(r - 1, c - 1, local - 1) }}
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
          <p class="preview-info drawer-preview-info">
            {{ t('classroom.detail.totalSeats', {count: editRows * editCols * 4}) }}
          </p>
        </template>
        <template v-else>
          <div class="drawer-preview-grid">
            <div v-for="rowIndex in editRows" :key="`row-${rowIndex}`" class="drawer-preview-row">
              <div
                v-for="colIndex in editCols"
                :key="`seat-${rowIndex}-${colIndex}`"
                class="drawer-preview-seat"
                :title="`${t('classroom.detail.seat')}: ${String.fromCharCode(65 + (colIndex - 1))}${rowIndex}`"
                :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
              >
                {{ String.fromCharCode(65 + (colIndex - 1)) }}{{ rowIndex }}
              </div>
            </div>
          </div>
          <p class="preview-info drawer-preview-info">
            {{ t('classroom.detail.totalSeats', {count: editRows * editCols}) }}
          </p>
        </template>
      </div>

      <!-- 固定底部按钮，确保在内容较多时仍然可见 -->
      <div style="position:absolute; left:16px; right:16px; bottom:16px;">
        <NSpace justify="end" style="width:100%;">
          <NButton tertiary @click="drawerVisible = false">{{ t('common.cancel') || '取消' }}</NButton>
          <NButton type="primary" :loading="saving" @click="confirmEdit">{{ t('common.confirm') || '确认' }}</NButton>
        </NSpace>
      </div>
    </div>
    <template #footer>
      <!-- footer kept for compatibility; primary buttons are fixed inside drawer body -->
    </template>
  </NDrawer>
</template>

<script lang="ts" setup>
import {computed, onMounted, onBeforeUnmount, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRoute} from 'vue-router';
import {useMessage} from 'naive-ui';
import {NButton, NTooltip, NDrawer, NInputNumber, NSpace} from 'naive-ui';
import {BriefcaseOutline, CloseOutline} from '@vicons/ionicons5';
import {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum';
import type {ClassroomToolboxItem} from '@/views/classroom/composables/toolbox';
import {getCourseRecordById, updateCourseRecord, getDefaultCourseRecordDTO} from '@/api/classroom/courseRecord';
import {listStudentsByRecordId} from '@/api/classroom/courseRecordStudent';
import eventBus from '@/utils/eventBus';

const props = withDefaults(defineProps<{ items: ClassroomToolboxItem[] | null }>(), {
  items: null
});

const {t} = useI18n();

const isOpen = ref<boolean | null>(null);
const route = useRoute();
const message = useMessage();

// 编辑座位抽屉状态
const drawerVisible = ref(false);
const editRows = ref<number>(4);
const editCols = ref<number>(3);
const saving = ref(false);
const classroomType = ref<number | null>(null);
// responsive sizing for drawer preview (drawer width = 35% of viewport, min 360)
const DRAWER_PADDING = 32; // left+right padding in drawer body
const DRAWER_GAP = 8;
const CELL_MIN = 28;
const CELL_MAX = 56;
const drawerWidth = ref(Math.max(360, Math.floor(window.innerWidth * 0.35)));
const updateDrawerWidth = () => {
  drawerWidth.value = Math.max(360, Math.floor(window.innerWidth * 0.35));
};
  window.addEventListener('resize', updateDrawerWidth);
  onMounted(() => {
    // ensure initial width is correct if mounted after resize
    updateDrawerWidth();
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateDrawerWidth);
  });
  const drawerInnerWidth = computed(() => Math.max(0, drawerWidth.value - DRAWER_PADDING));
const cellSize = computed(() => {
  const colsCount = editCols.value || 1;
  const available = Math.max(0, drawerInnerWidth.value - (colsCount - 1) * DRAWER_GAP);
  const size = Math.floor(available / colsCount);
  return Math.max(CELL_MIN, Math.min(CELL_MAX, size));
});
// For large preview we want 4 seats horizontally per component and each seat should be square.
// component count for LARGE classroom (number of components per row)
// componentCount represents number of components (models) per row shown in the editor.
const componentCount = computed(() => {
  return Math.max(1, editCols.value || 1);
});

const largeCellSize = computed(() => {
  const compsInRow = Math.max(1, componentCount.value || 1);
  const totalSeatCols = compsInRow * 4;
  const available = Math.max(0, drawerInnerWidth.value - (compsInRow - 1) * DRAWER_GAP);
  const size = Math.floor(available / totalSeatCols);
  return Math.max(CELL_MIN, Math.min(CELL_MAX, size));
});
onMounted(() => {
  isOpen.value = false;
});

const isOpenResolved = computed(() => Boolean(isOpen.value));

const normalizedItems = computed(() => {
  // 按行业规范，工具栏组件仅负责渲染传入的 items，不再自行注入路由相关项
  return props.items ? [...props.items] : [];
});

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

const loadCurrentLayout = async () => {
  const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
  if (!recordId) return;
  try {
    const resp = await getCourseRecordById(recordId);
    const data = resp?.data || null;
    if (data) {
      classroomType.value = data.classroomType ?? classroomType.value;
      editRows.value = data.layoutRows ?? editRows.value;
      // 后端返回的 layoutColumns 为实际座位列数，前端编辑器需要模型（组件）数量：componentCount = ceil(seatCols/4)
      if (classroomType.value === ClassroomTypeEnum.LARGE) {
        const seatCols = data.layoutColumns ?? null;
        editCols.value = seatCols !== null ? Math.max(1, Math.ceil(Number(seatCols) / 4)) : editCols.value;
      } else {
      editCols.value = data.layoutColumns ?? editCols.value;
      }
    }
  } catch (error) {
    // 静默处理
  }
};

const openEditDrawer = async () => {
  await loadCurrentLayout();
  drawerVisible.value = true;
};

// 防止减少行/列导致已入座学生被裁剪：若用户尝试减少行或列，先检查后端已分配座位
const getOccupiedSeatIndices = async (): Promise<number[]> => {
  const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
  if (!recordId) return [];
  try {
    const resp = await listStudentsByRecordId(recordId);
    const list = resp?.data || resp || [];
    return (list as any[]).map((s: any) => Number(s.seatIndex)).filter((n: number) => !isNaN(n));
  } catch {
    return [];
  }
};

watch(editRows, async (newRows, oldRows) => {
  if (typeof oldRows !== 'number' || typeof newRows !== 'number') return;
  if (newRows >= oldRows) return; // only guard on reduction
  const occupied = await getOccupiedSeatIndices();
  // compute current seat columns (actual seat columns)
  const seatCols = classroomType.value === ClassroomTypeEnum.LARGE ? (editCols.value || 1) * 4 : (editCols.value || 1);
  const newTotal = Math.max(0, newRows) * seatCols;
  const hasConflict = occupied.some(idx => idx >= newTotal);
  if (hasConflict) {
    message.error(t('classroom.detail.cantDecreaseRowsBecauseOccupied') || '无法减少行数：存在已入座学生');
    editRows.value = oldRows;
  }
});

watch(editCols, async (newCols, oldCols) => {
  if (typeof oldCols !== 'number' || typeof newCols !== 'number') return;
  if (newCols >= oldCols) return; // only guard on reduction
  const occupied = await getOccupiedSeatIndices();
  // compute new seatCols based on classroom type (for LARGE, each component has 4 seats)
  const newSeatCols = classroomType.value === ClassroomTypeEnum.LARGE ? Math.max(1, newCols) * 4 : Math.max(1, newCols);
  const totalSeats = (editRows.value || 0) * newSeatCols;
  const hasConflict = occupied.some(idx => idx >= totalSeats);
  if (hasConflict) {
    message.error(t('classroom.detail.cantDecreaseColsBecauseOccupied') || '无法减少列数：存在已入座学生');
    editCols.value = oldCols;
  }
});

const confirmEdit = async () => {
  const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
  if (!recordId) return;
  saving.value = true;
  try {
    // 获取完整现有记录并基于完整 DTO 更新，避免后端对必需字段校验导致 400
    const currentResp = await getCourseRecordById(recordId);
    const currentData = currentResp?.data || null;

    const payload = getDefaultCourseRecordDTO();
    payload.id = recordId;
    payload.courseId = currentData?.courseId ?? null;
    payload.teacherId = currentData?.teacherId ?? null;
    payload.courseName = currentData?.courseName ?? null;
    payload.courseDescription = currentData?.courseDescription ?? null;
    payload.classroomType = currentData?.classroomType ?? null;
    payload.startTime = currentData?.startTime ?? null;
    payload.overTime = currentData?.overTime ?? null;
    payload.layoutRows = typeof editRows.value === 'number' ? editRows.value : null;
    payload.layoutColumns = typeof editCols.value === 'number' ? editCols.value : null;

    // 保留完整 DTO（避免省略必需字段），并确保字段类型/格式符合后端期望
    // 将时间格式化为 ISO（后端通常期望 ISO 格式）
    if (currentData?.startTime) {
      try {
        payload.startTime = new Date(String(currentData.startTime).replace(' ', 'T')).toISOString();
      } catch {
        payload.startTime = currentData.startTime;
      }
    } else {
      payload.startTime = null;
    }
    if (currentData?.overTime) {
      try {
        payload.overTime = new Date(String(currentData.overTime).replace(' ', 'T')).toISOString();
      } catch {
        payload.overTime = currentData.overTime;
      }
    } else {
      payload.overTime = null;
    }
    // 包含 status 字段（可能为 null 或数字），避免后端因为缺少字段抛异常
    payload.status = currentData?.status ?? null;
    // 确保行列为数字类型或 null
    payload.layoutRows = typeof payload.layoutRows !== 'undefined' ? Number(payload.layoutRows) : null;
    // 对于 LARGE 教室，后端期望收到的是实际座位列数（每个组件包含 4 个并排座位）
    let columnsToSend: number | null = null;
    if (classroomType.value === ClassroomTypeEnum.LARGE) {
      columnsToSend = typeof editCols.value === 'number' ? Number(editCols.value) * 4 : null;
    } else {
      columnsToSend = typeof editCols.value === 'number' ? Number(editCols.value) : null;
    }
    payload.layoutColumns = columnsToSend !== undefined ? columnsToSend : null;

    const resp = await updateCourseRecord(payload as any, { meta: { hideHttpError: true, hideBusinessError: true } });
    const success = typeof resp === 'boolean' ? resp : Boolean(resp && (resp.success === true || resp.code === 200));
    if (!success) {
      const msg = resp && resp.message ? resp.message : '保存失败';
      message.error(msg);
      drawerVisible.value = false;
      return;
    }

    message.success('教室座位信息已保存');
    drawerVisible.value = false;
    // 通知外部刷新（Classroom3D 将监听并处理）
    // 尝试拉取最新 DTO 并同步到前端，避免直接刷新页面导致不必要的重加载
    try {
      const latestResp = await getCourseRecordById(recordId);
      const latest = latestResp?.data || null;
      if (latest) {
      // 同步编辑器值（editCols 存储为组件（模型）列数）
        classroomType.value = latest.classroomType ?? classroomType.value;
        editRows.value = latest.layoutRows ?? editRows.value;
      if (classroomType.value === ClassroomTypeEnum.LARGE) {
        // latest.layoutColumns 是后端的实际座位列数，前端需要组件数量（每个组件包含4座）
        editCols.value = latest.layoutColumns ? Math.max(1, Math.ceil(Number(latest.layoutColumns) / 4)) : editCols.value;
      } else {
        editCols.value = latest.layoutColumns ?? editCols.value;
      }
        (eventBus as any).emit('classroomLayoutUpdated', recordId);
      } else {
        (eventBus as any).emit('classroomLayoutUpdated', recordId);
      }
    } catch {
    (eventBus as any).emit('classroomLayoutUpdated', recordId);
    }
  } catch (error: any) {
    // 如果后端返回了详细错误信息，尝试读取并显示
    const serverMsg = error && (error.message || (error.response && error.response.data && (error.response.data.message || error.response.data.msg)));
    message.error(serverMsg || '保存失败，请重试');
  } finally {
    saving.value = false;
  }
};

const handleClick = (item: ClassroomToolboxItem, event: MouseEvent) => {
  if (item.key === 'edit-seating') {
    openEditDrawer();
  } else {
  if (item.handler) {
    item.handler(event);
    }
  }
  isOpen.value = false;
};


// For large classroom: compute seat label from component row/col and local seat index (0..3)
// For LARGE classroom: map component row/col + local seat index(0..3) to global seat label.
const getSeatLabelFromComp = (compRow: number, compCol: number, localIndex: number): string | null => {
  // componentCount * 4 == total seat columns
  const globalRow = compRow; // each component row corresponds to one seat row in 1x4 layout
  const globalCol = compCol * 4 + localIndex; // 4 seats per component, arranged horizontally
  const totalRows = editRows.value;
  const totalCols = (editCols.value || 1) * 4;
  if (globalRow < 0 || globalRow >= totalRows || globalCol < 0 || globalCol >= totalCols) return null;
  return `${String.fromCharCode(65 + globalCol)}${globalRow + 1}`;
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

/* Drawer preview centering */
.drawer-preview {
  display: flex;
  flex-direction: column;
}
.drawer-preview-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}
.drawer-preview-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.drawer-preview-seat {
  background: rgba(255,255,255,0.03);
  padding: 8px 10px;
  border-radius: 4px;
  min-width: 44px;
  text-align: center;
  color: var(--text-color);
}
.drawer-preview-info {
  margin-top: 8px;
  color: var(--text-color-muted);
  text-align: center;
}

/* large component styles */
.large-components-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.large-component {
  width: 140px;
  height: 80px;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
  display: flex;
  overflow: hidden;
}
.large-seat {
  flex: 1;
  border-left: 1px solid rgba(255,255,255,0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-color);
}
.large-seat:first-child {
  border-left: none;
}
</style>

