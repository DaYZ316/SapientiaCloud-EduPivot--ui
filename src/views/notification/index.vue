<template>
  <div class="notification-management-container">
    <PageHeader :title="t('notification.title')"/>

    <n-card size="small">
      <n-tabs v-model:value="activeBox" type="line" class="mb-4">
        <n-tab-pane :tab="t('notification.tab.received')" name="received" />
        <n-tab-pane :tab="t('notification.tab.sent')" name="sent" />
      </n-tabs>
      <!-- 搜索表单 -->
      <n-form :model="searchForm" class="search-form" inline>
        <n-form-item :label="t('notification.searchForm.title')" path="title">
          <n-input
              v-model:value="searchForm.title"
              :placeholder="t('notification.searchForm.titlePlaceholder')"
              clearable
          />
        </n-form-item>
        <n-form-item :label="t('notification.searchForm.type')" path="type">
          <n-select
              v-model:value="searchForm.type"
              :options="notificationTypeOptions"
              :placeholder="t('notification.searchForm.typePlaceholder')"
              clearable
              style="min-width: 140px;"
          />
        </n-form-item>
        <n-form-item :label="t('notification.searchForm.status')" path="status">
          <n-select
              v-model:value="searchForm.status"
              :options="notificationReadStatusOptions"
              :placeholder="t('notification.searchForm.statusPlaceholder')"
              clearable
              style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item :label="t('notification.searchForm.senderName')" path="senderName">
          <n-input
              v-model:value="searchForm.senderName"
              :placeholder="t('notification.searchForm.senderNamePlaceholder')"
              clearable
          />
        </n-form-item>
        <n-form-item :label="t('notification.searchForm.createTimeRange')" path="createTimeRange">
          <n-date-picker
              v-model:value="createTimeRange"
              :placeholder="t('notification.searchForm.createTimeRangePlaceholder')"
              clearable
              style="min-width: 300px;"
              type="datetimerange"
              @update:value="onDateRangeChange"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <Icon :component="SearchOutline"/>
            </template>
            {{ t('notification.searchForm.search') }}
          </n-button>
          <n-button class="ml-2" @click="resetSearch">
            <template #icon>
              <Icon :component="RefreshOutline"/>
            </template>
            {{ t('notification.searchForm.reset') }}
          </n-button>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <div class="table-actions">
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <Icon :component="AddOutline"/>
          </template>
          {{ t('notification.actions.add') }}
        </n-button>

        <!-- Received box: batch operations -->
        <template v-if="activeBox === 'received'">
          <n-button v-if="selectedRowKeys.length > 0" type="info" @click="handleBatchMarkAsRead">
            <template #icon>
              <Icon :component="CheckmarkCircleOutline"/>
            </template>
            {{ t('notification.actions.batchMarkAsRead') }}
          </n-button>
          <n-button v-if="selectedRowKeys.length > 0" type="error" @click="handleBatchDelete">
            <template #icon>
              <Icon :component="TrashOutline"/>
            </template>
            {{ t('notification.actions.batchDelete') }}
          </n-button>
          <n-button @click="handleMarkAllAsRead">
            <template #icon>
              <Icon :component="CheckmarkDoneOutline"/>
            </template>
            {{ t('notification.actions.markAllAsRead') }}
          </n-button>
        </template>

        <!-- Sent box: (for now) no batch mark-as-read; keep ability to refresh -->
        <template v-else>
          <n-button @click="pageTableRef.value?.refresh()">
            <template #icon>
              <Icon :component="RefreshOutline"/>
            </template>
            {{ t('common.refresh') }}
          </n-button>
        </template>
      </div>

      <!-- 通知表格 -->
      <page-table
          ref="pageTableRef"
          :api-fn="listNotification"
          :auto-search="false"
          :columns="columnsComputed"
          :query-params="searchForm"
          :row-key="(row: NotificationVO) => row.id"
          :checked-row-keys="selectedRowKeys"
          size="small"
          @update:checked-row-keys="onSelectionChange"
          @update:data="onDataUpdate"
      />
    </n-card>

    <!-- 发送通知对话-->
    <n-modal
        v-model:show="showSendModal"
        :title="t('notification.addNotification.title')"
        preset="card"
        style="width: 700px"
        @after-leave="resetSendForm"
    >
      <n-form
          ref="sendFormRef"
          :model="sendForm"
          :rules="sendFormRules"
          :style="{ maxWidth: '640px' }"
      >
        <n-form-item :label="t('notification.addNotification.title')" path="title">
          <n-input
              v-model:value="sendForm.title"
              :placeholder="t('notification.addNotification.titlePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('notification.addNotification.type')" path="type">
          <n-select
              v-model:value="sendForm.type"
              :options="notificationTypeOptions"
              :placeholder="t('notification.addNotification.typePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('notification.addNotification.recipientType')" path="recipientType">
          <n-radio-group v-model:value="sendForm.recipientType">
            <n-radio :value="0">{{ t('notification.recipientType.all') }}</n-radio>
            <n-radio :value="1">{{ t('notification.recipientType.role') }}</n-radio>
            <n-radio :value="2">{{ t('notification.recipientType.course') }}</n-radio>
            <n-radio :value="3">{{ t('notification.recipientType.users') }}</n-radio>
          </n-radio-group>
        </n-form-item>

        <n-form-item
            v-if="sendForm.recipientType === 1"
            :label="t('notification.addNotification.recipients')"
            path="roleKey"
        >
          <n-select
              v-model:value="sendForm.roleKey"
              :options="roleOptions"
              :placeholder="t('notification.addNotification.recipientsPlaceholder')"
          />
        </n-form-item>

        <n-form-item
            v-if="sendForm.recipientType === 2"
            :label="t('notification.addNotification.recipients')"
            path="courseId"
        >
          <n-select
              v-model:value="sendForm.courseId"
              :options="courseOptions"
              :placeholder="t('notification.addNotification.recipientsPlaceholder')"
          />
        </n-form-item>

        <n-form-item
            v-if="sendForm.recipientType === 3"
            :label="t('notification.addNotification.recipients')"
            path="userIds"
        >
          <n-select
              v-model:value="sendForm.userIds"
              :options="userOptions"
              :placeholder="t('notification.addNotification.recipientsPlaceholder')"
              multiple
              filterable
          />
        </n-form-item>

        <n-form-item :label="t('notification.addNotification.content')" path="content">
        <RichTextEditor
            v-model="sendForm.content!"
            :bucket-code="notificationBucketCode"
            :placeholder="t('notification.addNotification.contentPlaceholder')"
            upload-path="notification-assets"
        />
        </n-form-item>

                <n-form-item :label="t('notification.addNotification.attachments')" path="attachmentUrls">
          <FileUpload
              v-model="attachmentFiles"
              :bucket-code="notificationBucketCode"
              :max-file-count="10"
              :max-file-size="50 * 1024 * 1024"
              :multiple="true"
              :show-delete-button="true"
              :show-download-button="true"
              :show-file-list="true"
              :show-preview-button="true"
              :upload-text="t('notification.addNotification.attachmentsPlaceholder')"
              upload-dir="notification-assets"
              @upload-success="handleAttachmentUploadSuccess"
          />
        </n-form-item>
        <n-form-item v-if="sendForm.attachmentUrls.length > 0" :label="t('notification.detail.attachments')">
          <div class="upload-attachments-list">
            <div v-for="(item, index) in sendForm.attachmentUrls" :key="index" class="upload-attachment-item">
              <div class="upload-attachment-name">
                {{ item.name || t('notification.detail.unknownAttachment') + (index + 1) }}
              </div>
              <div class="upload-attachment-actions">
                <n-button text type="primary" @click="downloadAttachment(item.url)">
                  <template #icon>
                    <n-icon>
                      <DownloadOutline/>
                    </n-icon>
                  </template>
                  {{ t('notification.detail.download') }}
                </n-button>
                <n-button text type="error" @click="removeSendAttachment(index)">
                  <template #icon>
                    <n-icon>
                      <TrashOutline/>
                    </n-icon>
                  </template>
                  {{ t('common.delete') }}
                </n-button>
              </div>
            </div>
          </div>
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showSendModal = false">{{ t('notification.addNotification.cancel') }}</n-button>
          <n-button type="primary" :loading="sendLoading" @click="handleSendNotification">
            {{ t('notification.addNotification.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 通知详情对话-->
    <n-modal
        v-model:show="showDetailModal"
        :title="t('notification.detail.title')"
        preset="card"
        style="width: 700px"
    >
      <div v-if="currentNotification" class="notification-detail">
        <n-descriptions
            class="detail-descriptions"
            :column="2"
            bordered
            label-placement="left"
            size="small"
        >
          <n-descriptions-item :label="t('notification.table.title')">
            {{ currentNotification?.title || '-' }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('notification.table.type')">
            {{ getNotificationTypeLabel(currentNotification.type, isEnglish) || '-' }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('notification.table.senderName')">
            {{ currentNotification?.senderName || '-' }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('notification.table.createTime')">
            {{ currentNotification?.createTime || '-' }}
          </n-descriptions-item>
          <n-descriptions-item v-if="currentNotification?.status === 1" :label="t('notification.detail.readTime')">
            {{ currentNotification?.readTime || '-' }}
          </n-descriptions-item>
        </n-descriptions>

        <div class="detail-section" style="margin-top: 16px;">
          <n-text strong class="detail-title">{{ t('notification.table.content') }}</n-text>
          <div style="background-color: var(--background-tertiary-color); padding: 10px;" class="notification-content" v-html="currentNotification?.content"></div>
        </div>

        <div v-if="currentNotification?.attachmentUrls" class="detail-section">
          <n-text strong class="detail-title">{{ t('notification.detail.attachments') }}</n-text>
          <div class="attachments-list">
            <div v-for="(item, index) in currentAttachments" :key="index" class="attachment-item">
              <n-icon size="20" class="attachment-icon">
                <DocumentAttachOutline/>
              </n-icon>
              <div class="attachment-info">
                <div class="attachment-name">{{ item.name || t('notification.detail.unknownAttachment') + (index + 1) }}</div>
              </div>
              <div class="attachment-actions">
                <n-button text type="primary" @click="downloadAttachment(item.url)">
                  <template #icon>
                    <n-icon>
                      <DownloadOutline/>
                    </n-icon>
                  </template>
                  {{ t('notification.detail.download') }}
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, h, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useDialog } from 'naive-ui'
import {
  SearchOutline,
  RefreshOutline,
  AddOutline,
  CheckmarkCircleOutline,
  TrashOutline,
  CheckmarkDoneOutline,
  EyeOutline,
  DownloadOutline,
  DocumentAttachOutline
} from '@vicons/ionicons5'

import PageHeader from '@/components/common/PageHeader.vue'
import Icon from '@/components/common/Icon.vue'
import PageTable from '@/components/common/PageTable.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import FileUpload from '@/components/common/FileUpload.vue'
import { useUserStore } from '@/store'
import { renderIcon } from '@/utils/iconUtil'

import {
  listNotification,
  markNotificationAsRead,
  batchMarkAsRead,
  readAllNotifications,
  removeNotificationByIds,
  sendNotificationByScope,
  batchAddNotification,
  getDefaultNotificationQuery,
  getNotificationById
} from '@/api/system/notification'
import type { NotificationVO } from '@/types/system/notification'
import {
  getNotificationTypeOptions,
  getNotificationReadStatusOptions,
  getNotificationTypeLabel,
  getNotificationReadStatusLabel,
  NotificationReadStatus
} from '@/enum/system/notificationTypeEnum'

import { getAllRoles } from '@/api/system/role'
import { getAllUsers } from '@/api/system/user'
import { listAllCourse } from '@/api/course/course'
import { BusinessBucketCodeEnum } from '@/enum/minIO/businessBucketEnum'

// 国际�?
const { t, locale } = useI18n()
const dialog = useDialog()
const userStore = useUserStore()
const route = useRoute()

// 响应式数�?
const pageTableRef = ref()
const selectedRowKeys = ref<string[]>([])
const searchForm = reactive(getDefaultNotificationQuery())
const createTimeRange = ref<[number, number] | null>(null)
// 当前消息箱：'received' �?'sent'
const activeBox = ref<'received' | 'sent'>('received')

// 发送通知相关
const showSendModal = ref(false)
const sendFormRef = ref()
const sendLoading = ref(false)
const sendForm = reactive({
  title: null,
  content: null,
  type: null,
  recipientType: 0, // 0:全部用户 1:按角�?2:按课�?3:指定用户
  roleKey: null,
  courseId: null,
  userIds: null,
  attachmentUrls: [] as Array<{ name: string; url: string }>
})

const attachmentFiles = ref<any[]>([])

// 通知详情相关
const showDetailModal = ref(false)
const currentNotification = ref<NotificationVO | null>(null)

// 解析附件列表
const currentAttachments = computed(() => {
  if (!currentNotification.value?.attachmentUrls) return []
  const urls = currentNotification.value.attachmentUrls
  // 简单的判断是否为JSON格式
  if (urls.trim().startsWith('[')) {
    // 使用更安全的方式处理JSON.parse，避免异�?
    const parsed = JSON.parse(urls)
    return Array.isArray(parsed) ? parsed : []
  }
  return []
})

// 下载附件
const downloadAttachment = (url: string) => {
  window.open(url, '_blank')
}

// ���������ϴ��ɹ�
const handleAttachmentUploadSuccess = (_file: any, data: any) => {
  const url = data?.url || data?.objectName
  if (!url) return
  const rawName = data?.objectName || _file?.name || url.split('/').pop()
  const name = rawName ? rawName.split('/').pop() || rawName : rawName
  const list = sendForm.attachmentUrls as Array<{ name: string; url: string }>
  if (!list.find(item => item.url === url)) {
    list.push({ name, url })
  }
}

const removeSendAttachment = (index: number) => {
  const list = sendForm.attachmentUrls as Array<{ name: string; url: string }>
  list.splice(index, 1)
}


// 计算属�?
const isEnglish = computed(() => locale.value === 'en-US')
const notificationTypeOptions = computed(() => getNotificationTypeOptions(isEnglish.value))
const notificationReadStatusOptions = computed(() => getNotificationReadStatusOptions(isEnglish.value))

// 通知bucket code
const notificationBucketCode = BusinessBucketCodeEnum.SYSTEM_NOTIFICATION

// 是否为已发送箱
const isSentBox = computed(() => activeBox.value === 'sent')

// 选项数据（组件挂载时从API加载�?
const roleOptions = ref<any[]>([])
const courseOptions = ref<any[]>([])
const userOptions = ref<any[]>([])

// 加载角色选项
const loadRoleOptions = () => {
  getAllRoles().then(res => {
    roleOptions.value = res.data.map((r: any) => ({
      label: r.roleName,
      value: r.roleKey
    }))
  })
}

// 加载课程选项
const loadCourseOptions = () => {
  listAllCourse().then(res => {
    courseOptions.value = res.data.map((c: any) => ({
      label: c.courseName,
      value: c.id
    }))
  })
}

// 加载用户选项
const loadUserOptions = () => {
  getAllUsers().then(res => {
    userOptions.value = res.data.map((u: any) => ({
      label: u.nickName || u.username,
      value: u.id
    }))
  })
}

// 文件上传自定义请�?

// 表单验证规则
// 动态表单验证规�?
const sendFormRules = computed(() => ({
  title: [
    { required: true, message: t('notification.addNotification.titlePlaceholder'), trigger: 'blur' }
  ],
  // 通知类型可能�?0（系统通知），0 被视�?falsy，因此必须明确为数字类型校验
  type: [
    { required: true, type: 'number', message: t('notification.addNotification.typePlaceholder'), trigger: 'change' }
  ],
  content: [
    { required: true, message: t('notification.addNotification.contentPlaceholder'), trigger: 'blur' }
  ],
  // 根据接收者类型添加验证规�?
  ...(sendForm.recipientType === 1 && {
    roleKey: [
      { required: true, message: t('notification.addNotification.recipientsPlaceholder'), trigger: 'change' }
    ]
  }),
  ...(sendForm.recipientType === 2 && {
    courseId: [
      { required: true, message: t('notification.addNotification.recipientsPlaceholder'), trigger: 'change' }
    ]
  }),
  ...(sendForm.recipientType === 3 && {
    userIds: [
      { required: true, type: 'array', min: 1, message: t('notification.addNotification.recipientsPlaceholder'), trigger: 'change' }
    ]
  })
}))

// 表格列配�?
const columns: any[] = [
  {
    type: 'selection'
  },
  {
    title: t('notification.table.title'),
    key: 'title',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('notification.table.content'),
    key: 'content',
    width: 300,
    ellipsis: {
      tooltip: true
    },
    render: (row: any) => {
      // 移除HTML标签显示纯文�?
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = row.content
      return tempDiv.textContent || tempDiv.innerText || ''
    }
  },
  {
    title: t('notification.table.type'),
    key: 'type',
    width: 120,
    render: (row: any) => {
      return getNotificationTypeLabel(row.type, isEnglish.value)
    }
  },
  {
    title: t('notification.table.status'),
    key: 'status',
    width: 80,
    render: (row: any) => {
      const isUnread = row.status === NotificationReadStatus.UNREAD
      return h('n-tag', { type: isUnread ? 'info' : 'default' }, getNotificationReadStatusLabel(row.status, locale.value === 'en-US'))
    }
  },
  {
    title: t('notification.table.senderName'),
    key: 'senderName',
    width: 120
  },
  {
    title: t('notification.table.createTime'),
    key: 'createTime',
    width: 160
  },
  {
    title: t('notification.table.readTime'),
    key: 'readTime',
    width: 160,
    render: (row: any) => {
      return row.status === NotificationReadStatus.READ ? row.readTime : '-'
    }
  },
  {
    title: t('notification.table.actions'),
    key: 'actions',
    width: 200,
    render: (row: any) => {
      const actions = []

      if (row.status === NotificationReadStatus.UNREAD) {
        actions.push(
          h(
            'button',
            {
              class: 'n-button n-button--text action-btn',
              style: { marginRight: '8px' },
              onClick: () => handleMarkAsRead(row)
            },
            [
              renderIcon(CheckmarkCircleOutline)(),
              ' ' + t('notification.actions.markAsRead')
            ]
          )
        )
      }

      actions.push(
        h(
          'button',
          {
            class: 'n-button n-button--text action-btn',
            onClick: () => handleViewDetail(row)
          },
          [
            renderIcon(EyeOutline)(),
            ' ' + t('notification.actions.view')
          ]
        )
      )

      return h('n-space', null, actions)
    }
  }
]

// 已发送表格列（消息级�?
const sentColumns: any[] = [
  {
    type: 'selection'
  },
  {
    title: t('notification.table.title'),
    key: 'title',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('notification.table.content'),
    key: 'content',
    width: 300,
    ellipsis: {
      tooltip: true
    },
    render: (row: any) => {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = row.content
      return tempDiv.textContent || tempDiv.innerText || ''
    }
  },
  {
    title: t('notification.table.type'),
    key: 'type',
    width: 120,
    render: (row: any) => {
      return getNotificationTypeLabel(row.type, isEnglish.value)
    }
  },
  {
    title: t('notification.table.recipientCount'),
    key: 'recipientCount',
    width: 100
  },
  {
    title: t('notification.table.readCount'),
    key: 'readCount',
    width: 100
  },
  {
    title: t('notification.table.senderName'),
    key: 'senderName',
    width: 120
  },
  {
    title: t('notification.table.createTime'),
    key: 'createTime',
    width: 160
  },
  {
    title: t('notification.table.actions'),
    key: 'actions',
    width: 200,
    render: (row: any) => {
      const actions = []
      // 仅展示查看消息详情（消息级，不会标记为已读）
      actions.push(
        h(
          'button',
          {
            class: 'n-button n-button--text action-btn',
            onClick: () => handleViewSentDetail(row)
          },
          [
            renderIcon(EyeOutline)(),
            ' ' + t('notification.actions.view')
          ]
        )
      )
      return h('n-space', null, actions)
    }
  }
]

const columnsComputed = computed(() => {
  return isSentBox.value ? sentColumns : columns
})

// 方法
const handleSearch = () => {
  pageTableRef.value?.refresh()
}

const resetSearch = () => {
  Object.assign(searchForm, getDefaultNotificationQuery())
  createTimeRange.value = null
  handleSearch()
}

const onDateRangeChange = (value: [number, number] | null) => {
  if (value) {
    searchForm.startTime = new Date(value[0]).toISOString()
    searchForm.endTime = new Date(value[1]).toISOString()
  } else {
    searchForm.startTime = null
    searchForm.endTime = null
  }
}

const onSelectionChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const onDataUpdate = (_data: NotificationVO[]) => {
  // 数据更新回调，可以在这里处理数据
}

const handleAdd = () => {
  resetSendForm()
  showSendModal.value = true
}

const handleSendSuccess = async () => {
  showSendModal.value = false
  if (activeBox.value !== 'sent') {
    activeBox.value = 'sent'
  }
  await nextTick()
  setTimeout(() => {
    pageTableRef.value?.refresh()
  }, 200)
}


const handleSendNotification = () => {
  sendFormRef.value?.validate((errors: any) => {
    if (!errors) {
      sendLoading.value = true

      // 处理附件列表，提取URL和名�?
      const attachments = Array.isArray(sendForm.attachmentUrls) ? sendForm.attachmentUrls : []

      // 根据发送类型调用不同的API
      const sendData = {
        title: sendForm.title,
        content: sendForm.content,
        type: sendForm.type !== null ? Number(sendForm.type) : null,
        // 后端期望字段始终存在；当无附件时传空字符�?
        attachmentUrls: attachments.length > 0 ? JSON.stringify(attachments) : '',
        // �?userStore 中读�?senderId / senderName，若不存在则�?null
        senderId: userStore.userInfo?.id ?? null,
        senderName: userStore.userInfo?.nickName ?? null
      }

      if (sendForm.recipientType === 0) {
        // 发送给全部用户 - 使用批量创建
        batchAddNotification({
          ...sendData,
          // 文档�?userIds 为必传数组，使用空数组表�?所有用�?（后端按业务处理�?
          userIds: []
        }).then(() => {
          handleSendSuccess()
        }).finally(() => {
          sendLoading.value = false
        })
      } else if (sendForm.recipientType === 1) {
        // 按角色发�?
        sendNotificationByScope({
          ...sendData,
          scopeType: 0, // 按角�?
          roleKey: sendForm.roleKey,
          courseId: null
        }).then(() => {
          handleSendSuccess()
        }).finally(() => {
          sendLoading.value = false
        })
      } else if (sendForm.recipientType === 2) {
        // 按课程发�?
        sendNotificationByScope({
          ...sendData,
          scopeType: 1, // 按课程学�?
          courseId: sendForm.courseId,
          roleKey: null
        }).then(() => {
          handleSendSuccess()
        }).finally(() => {
          sendLoading.value = false
        })
      } else if (sendForm.recipientType === 3) {
        // 指定用户
        batchAddNotification({
          ...sendData,
          userIds: sendForm.userIds
        }).then(() => {
          handleSendSuccess()
        }).finally(() => {
          sendLoading.value = false
        })
      }
    }
  })
}

const resetSendForm = () => {
  // 重置表单数据
  Object.assign(sendForm, {
    title: null,
    content: null,
    type: null,
    recipientType: 0,
    roleKey: null,
    courseId: null,
    userIds: null,
    attachmentUrls: []
  })
  attachmentFiles.value = []
  // 清除表单验证状态
  sendFormRef.value?.restoreValidation()
}

const handleMarkAsRead = (row: NotificationVO) => {
  dialog.warning({
    title: t('common.confirm'),
    content: t('notification.messages.markAsReadConfirm'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      markNotificationAsRead(row.id).then(() => {
        pageTableRef.value?.refresh()
      })
    }
  })
}

const handleBatchMarkAsRead = () => {
  if (selectedRowKeys.value.length === 0) return

  dialog.warning({
    title: t('common.confirm'),
    content: t('notification.messages.markAsReadConfirm'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      batchMarkAsRead(selectedRowKeys.value).then(() => {
        selectedRowKeys.value = []
        pageTableRef.value?.refresh()
      })
    }
  })
}

const handleMarkAllAsRead = () => {
  dialog.warning({
    title: t('common.confirm'),
    content: t('notification.messages.markAllAsReadConfirm'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      readAllNotifications().then(() => {
        selectedRowKeys.value = []
        pageTableRef.value?.refresh()
      })
    }
  })
}

const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) return

  dialog.warning({
    title: t('common.confirm'),
    content: t('notification.messages.deleteConfirm'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      removeNotificationByIds(selectedRowKeys.value).then(() => {
        selectedRowKeys.value = []
        pageTableRef.value?.refresh()
      })
    }
  })
}

const handleViewDetail = (row: NotificationVO) => {
  currentNotification.value = row
  showDetailModal.value = true

  // 如果是未读通知，自动标记为已读
  if (row.status === NotificationReadStatus.UNREAD) {
    markNotificationAsRead(row.id).then(() => {
      pageTableRef.value?.refresh()
    })
  }
}

// 查看已发送消息详情（消息级别，不标记已读�?
const handleViewSentDetail = (row: NotificationVO) => {
  // row 为消息正文（msg id�?
  currentNotification.value = row
  showDetailModal.value = true
  // 已发送不需要标记为已读
}

// 处理路由参数中的通知ID
const handleRouteNotificationId = async (notificationId: string | undefined) => {
  if (!notificationId) return

  try {
    // 根据ID获取通知详情
    const result = await getNotificationById(notificationId)
    if (result.data) {
      // 延迟一点显示，确保页面加载完成
      setTimeout(() => {
        currentNotification.value = result.data
        showDetailModal.value = true

        // 如果是未读通知，自动标记为已读
        if (result.data.status === NotificationReadStatus.UNREAD) {
          markNotificationAsRead(notificationId).then(() => {
            pageTableRef.value?.refresh()
          })
        }
      }, 500)
    }
  } catch (error) {
    // 静默处理错误
  }
}

// 监听路由参数变化
watch(() => route.query.id, (newId) => {
  handleRouteNotificationId(newId as string)
}, { immediate: true })

// 组件挂载时初始化
onMounted(() => {
  // 加载角色、课程、用户选项数据
  loadRoleOptions()
  loadCourseOptions()
  loadUserOptions()

  // 处理初始路由参数
  handleRouteNotificationId(route.query.id as string)
})
 
// 监听 activeBox 切换，调整查询参数并刷新表格
watch(activeBox, (newVal) => {
  if (newVal === 'sent') {
    // boxType = 1 表示已发�?
    searchForm.boxType = 1
    // senderId 由后端从当前登录用户获取，不暴露给前�?
  } else {
    searchForm.boxType = 0
    // ensure userId is current user if not provided
    if (!searchForm.userId) {
      searchForm.userId = undefined
    }
  }
  // 刷新表格
  setTimeout(() => {
    pageTableRef.value?.refresh()
  }, 100)
})
</script>

<style lang="scss">
@use './index.scss';
</style>

