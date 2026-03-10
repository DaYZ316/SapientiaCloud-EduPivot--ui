<template>
  <n-popover
      ref="popoverRef"
      :offset="8"
      :width="700"
      placement="bottom-start"
      trigger="click"
  >
    <template #trigger>
      <div class="fast-enter-trigger">
        <n-button
            circle
            quaternary
            size="medium"
        >
          <template #icon>
            <Icon :component="GridOutline"/>
          </template>
        </n-button>
      </div>
    </template>

    <div class="fast-enter">
      <div class="apps-section">
        <div class="apps-grid">
          <div
              v-for="application in enabledApplications"
              :key="application.nameKey"
              class="app-item"
              @click="handleApplicationClick(application)"
          >
            <div class="app-icon">
              <Icon :component="application.icon"/>
            </div>
            <div class="app-info">
              <h3>{{ t(application.nameKey) }}</h3>
              <p>{{ t(application.descriptionKey) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-links">
        <h3>{{ t('header.quickLinks') }}</h3>
        <ul>
          <li
              v-for="quickLink in enabledQuickLinks"
              :key="quickLink.nameKey"
              @click="handleQuickLinkClick(quickLink)"
          >
            <span>{{ t(quickLink.nameKey) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </n-popover>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import {GridOutline} from '@vicons/ionicons5'
import {NButton, NPopover} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'
import fastEnterConfig, {type FastEnterApplication, type FastEnterQuickLink} from '@/config/fastEnter'

const router = useRouter()
const {t} = useI18n()
const popoverRef = ref<InstanceType<typeof NPopover> | null>(null)

const enabledApplications = computed<FastEnterApplication[]>(() => {
  return fastEnterConfig.applications
      .filter((app) => app.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
})

const enabledQuickLinks = computed<FastEnterQuickLink[]>(() => {
  return fastEnterConfig.quickLinks
      .filter((link) => link.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
})

const handleNavigate = (routeName: string): void => {
  if (!routeName) {
    return
  }

  router.push({name: routeName})
  popoverRef.value?.setShow(false)
}

const handleApplicationClick = (application: FastEnterApplication): void => {
  handleNavigate(application.routeName)
}

const handleQuickLinkClick = (quickLink: FastEnterQuickLink): void => {
  handleNavigate(quickLink.routeName)
}
</script>

<style lang="scss" scoped>
.fast-enter-trigger {
  display: flex;
  align-items: center;
}

.fast-enter {
  display: grid;
  grid-template-columns: 2fr 0.8fr;
  padding: 8px;

  .apps-section {
    .apps-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .app-item {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 12px;
      margin-right: 12px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;

      .app-icon {
        transition: background-color 0.2s, transform 0.2s;
      }

      &:hover {
        background-color: var(--n-color-hover);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

        .app-icon {
          background-color: var(--n-primary-color);
        }

        .app-info {
          h3 {
            color: var(--n-primary-color);
          }

          p {
            color: var(--n-text-color);
          }
        }
      }

      .app-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 46px;
        background-color: var(--n-color-hover);
        border-radius: 8px;
        flex-shrink: 0;
      }

      .app-info {
        flex: 1;
        min-width: 0;

        h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: var(--n-text-color);
        }

        p {
          margin: 4px 0 0;
          font-size: 12px;
          color: var(--n-text-color-secondary);
        }
      }
    }
  }

  .quick-links {
    padding: 8px 0 0 24px;
    border-left: 1px solid var(--n-divider-color);

    h3 {
      margin: 0 0 10px;
      font-size: 16px;
      font-weight: 500;
      color: var(--n-text-color);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        padding: 8px 0 8px 8px;
        cursor: pointer;
        transition: color 0.2s, background-color 0.2s, padding-left 0.15s;
        border-radius: 6px;

        &:hover {
          background-color: var(--n-color-hover);
          padding-left: 12px;

          span {
            color: var(--n-primary-color);
            font-weight: 500;
          }
        }

        span {
          color: var(--n-text-color-secondary);
          font-size: 14px;
        }
      }
    }
  }
}
</style>
