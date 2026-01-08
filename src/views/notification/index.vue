<template>
  <div class="notification-management-container">
    <PageHeader :title="t('notification.title')"/>

    <n-card size="small">
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
      </div>

      <!-- 通知表格 -->
      <page-table
          ref="pageTableRef"
          :api-fn="listNotification"
          :auto-search="false"
          :columns="columns"
          :query-params="searchForm"
          :row-key="(row: NotificationVO) => row.id"
          :checked-row-keys="selectedRowKeys"
          size="small"
          @update:checked-row-keys="onSelectionChange"
          @update:data="onDataUpdate"
      />
    </n-card>

    <!-- 发送通知对话框 -->
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
          <n-input
              v-model:value="sendForm.content"
              :placeholder="t('notification.addNotification.contentPlaceholder')"
              type="textarea"
              :rows="4"
          />
        </n-form-item>

        <n-form-item :label="t('notification.addNotification.attachments')" path="attachmentUrls">
          <n-upload
              v-model:file-list="sendForm.attachmentUrls"
              :placeholder="t('notification.addNotification.attachmentsPlaceholder')"
              multiple
              directory-dnd
              :custom-request="customRequest"
          >
            <template #trigger>
              <n-button>
                <template #icon>
                  <Icon :component="CloudUploadOutline"/>
                </template>
                {{ t('notification.addNotification.attachments') }}
              </n-button>
            </template>
          </n-upload>
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

    <!-- 通知详情对话框 -->
    <n-modal
        v-model:show="showDetailModal"
        :title="t('notification.detail.title')"
        preset="card"
        style="width: 700px"
    >
      <div v-if="currentNotification" class="notification-detail">
        <div class="detail-row">
          <n-text strong>{{ t('notification.table.title') }}:</n-text>
          <n-text>{{ currentNotification?.title }}</n-text>
        </div>
        <div class="detail-row">
          <n-text strong>{{ t('notification.table.type') }}:</n-text>
          <n-text>{{ currentNotification?.typeLabel }}</n-text>
        </div>
        <div class="detail-row">
          <n-text strong>{{ t('notification.table.senderName') }}:</n-text>
          <n-text>{{ currentNotification?.senderName }}</n-text>
        </div>
        <div class="detail-row">
          <n-text strong>{{ t('notification.table.createTime') }}:</n-text>
          <n-text>{{ currentNotification?.createTime }}</n-text>
        </div>
        <div class="detail-row" v-if="currentNotification?.status === 1">
          <n-text strong>{{ t('notification.detail.readTime') }}:</n-text>
          <n-text>{{ currentNotification?.readTime }}</n-text>
        </div>
        <div class="detail-row">
          <n-text strong>{{ t('notification.table.content') }}:</n-text>
        </div>
        <div class="notification-content" v-html="currentNotification?.content"></div>

        <div v-if="currentNotification?.attachmentUrls" class="detail-row">
          <n-text strong>{{ t('notification.detail.attachments') }}:</n-text>
        </div>
        <div v-if="currentNotification?.attachmentUrls" class="attachments-list">
          <div v-for="(item, index) in currentAttachments" :key="index" class="attachment-item">
            <n-icon size="20" class="attachment-icon">
              <DocumentAttachOutline/>
            </n-icon>
            <div class="attachment-info">
              <div class="attachment-name">{{ item.name || '附件' + (index + 1) }}</div>
            </div>
            <div class="attachment-actions">
              <n-button text type="primary" @click="downloadAttachment(item.url)">
                <template #icon>
                  <n-icon>
                    <DownloadOutline/>
                  </n-icon>
                </template>
                下载
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, useDialog, type UploadCustomRequestOptions, type UploadFileInfo } from 'naive-ui'
import {
  SearchOutline,
  RefreshOutline,
  AddOutline,
  CheckmarkCircleOutline,
  TrashOutline,
  CheckmarkDoneOutline,
  CloudUploadOutline,
  EyeOutline,
  DownloadOutline,
  DocumentAttachOutline
} from '@vicons/ionicons5'

import PageHeader from '@/components/common/PageHeader.vue'
import Icon from '@/components/common/Icon.vue'
import PageTable from '@/components/common/PageTable.vue'
import { useUserStore } from '@/store'

import {
  listNotification,
  markNotificationAsRead,
  batchMarkAsRead,
  readAllNotifications,
  removeNotificationByIds,
  sendNotificationByScope,
  batchAddNotification,
  getDefaultNotificationQuery
} from '@/api/system/notification'
import type { NotificationVO } from '@/types/system/notification'
import {
  getNotificationTypeOptions,
  getNotificationReadStatusOptions,
  NotificationReadStatus
} from '@/enum/system/notificationTypeEnum'
import { getAllRoles } from '@/api/system/role'
import { getAllUsers } from '@/api/system/user'
import { listAllCourse } from '@/api/course/course'
import { uploadFile } from '@/api/minIO'

// 国际化
const { t } = useI18n()
const message = useMessage()
const dialog = useDialog()
const userStore = useUserStore()

// 响应式数据
const pageTableRef = ref()
const selectedRowKeys = ref<string[]>([])
const searchForm = reactive(getDefaultNotificationQuery())
const createTimeRange = ref<[number, number] | null>(null)

// 发送通知相关
const showSendModal = ref(false)
const sendFormRef = ref()
const sendLoading = ref(false)
const sendForm = reactive({
  title: null,
  content: null,
  type: null,
  recipientType: 0, // 0:全部用户 1:按角色 2:按课程 3:指定用户
  roleKey: null,
  courseId: null,
  userIds: null,
  attachmentUrls: []
})

// 通知详情相关
const showDetailModal = ref(false)
const currentNotification = ref<NotificationVO | null>(null)

// 解析附件列表
const currentAttachments = computed(() => {
  if (!currentNotification.value?.attachmentUrls) return []
  try {
    const urls = currentNotification.value.attachmentUrls
    // 简单的判断是否为JSON格式
    if (urls.trim().startsWith('[')) {
      return JSON.parse(urls)
    }
    return []
  } catch (e) {
    return []
  }
})

// 下载附件
const downloadAttachment = (url: string) => {
  window.open(url, '_blank')
}

// 计算属性
const notificationTypeOptions = computed(() => getNotificationTypeOptions(false))
const notificationReadStatusOptions = computed(() => getNotificationReadStatusOptions(false))

// 模拟数据（实际项目中需要从API获取）
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

// 文件上传自定义请求
const customRequest = ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
  uploadFile(file.file as File).then(res => {
    file.url = res.data.url
    file.name = res.data.objectName || file.name // 使用后端返回的文件名或者原始文件名
    onFinish()
  }).catch(() => {
    onError()
  })
}

// 表单验证规则
const sendFormRules = {
  title: [
    { required: true, message: t('notification.addNotification.titlePlaceholder'), trigger: 'blur' }
  ],
  // 通知类型可能为 0（系统通知），0 被视为 falsy，因此必须明确为数字类型校验
  type: [
    { required: true, type: 'number', message: t('notification.addNotification.typePlaceholder'), trigger: 'change' }
  ],
  content: [
    { required: true, message: t('notification.addNotification.contentPlaceholder'), trigger: 'blur' }
  ]
}

// 表格列配置
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
      // 移除HTML标签显示纯文本
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = row.content
      return tempDiv.textContent || tempDiv.innerText || ''
    }
  },
  {
    title: t('notification.table.type'),
    key: 'typeLabel',
    width: 120
  },
  {
    title: t('notification.table.status'),
    key: 'status',
    width: 80,
    render: (row: any) => {
      const isUnread = row.status === NotificationReadStatus.UNREAD
      return h('n-tag', { type: isUnread ? 'info' : 'default' }, row.statusLabel)
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
          h('n-button', {
            text: true,
            type: 'info',
            size: 'small',
            onClick: () => handleMarkAsRead(row)
          }, {
            icon: () => h(Icon, { component: CheckmarkCircleOutline }),
            default: () => t('notification.actions.markAsRead')
          })
        )
      }

      actions.push(
        h('n-button', {
          text: true,
          type: 'primary',
          size: 'small',
          onClick: () => handleViewDetail(row)
        }, {
          icon: () => h(Icon, { component: EyeOutline }),
          default: () => t('notification.actions.view')
        })
      )

      return h('n-space', null, actions)
    }
  }
]

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
  showSendModal.value = true
}

const handleSendNotification = () => {
  sendFormRef.value?.validate((errors: any) => {
    if (!errors) {
      sendLoading.value = true

      // 处理附件列表，提取URL和名称
      const attachments = (sendForm.attachmentUrls as UploadFileInfo[]).map(file => ({
        name: file.name,
        url: file.url
      })).filter(item => item.url)

      // 根据发送类型调用不同的API
      const sendData = {
        title: sendForm.title,
        content: sendForm.content,
        type: sendForm.type !== null ? Number(sendForm.type) : null,
        // 后端期望字段始终存在；当无附件时传空字符串
        attachmentUrls: attachments.length > 0 ? JSON.stringify(attachments) : "",
        // 从 userStore 中读取 senderId / senderName，若不存在则传 null
        senderId: userStore.userInfo?.id ?? null,
        senderName: userStore.userInfo?.nickName ?? null
      }

      if (sendForm.recipientType === 0) {
        // 发送给全部用户 - 使用批量创建
        batchAddNotification({
          ...sendData,
          // 文档中 userIds 为必传数组，使用空数组表示“所有用户”（后端按业务处理）
          userIds: []
        }).then(() => {
          message.success(t('notification.messages.addSuccess'))
          showSendModal.value = false
          pageTableRef.value?.refresh()
        }).catch(() => {
          // 错误处理已在API层处理
        }).finally(() => {
          sendLoading.value = false
        })
      } else if (sendForm.recipientType === 1) {
        // 按角色发送
        sendNotificationByScope({
          ...sendData,
          scopeType: 0, // 按角色
          roleKey: sendForm.roleKey,
          courseId: null
        }).then(() => {
          message.success(t('notification.messages.addSuccess'))
          showSendModal.value = false
          pageTableRef.value?.refresh()
        }).catch(() => {
          // 错误处理已在API层处理
        }).finally(() => {
          sendLoading.value = false
        })
      } else if (sendForm.recipientType === 2) {
        // 按课程发送
        sendNotificationByScope({
          ...sendData,
          scopeType: 1, // 按课程学生
          courseId: sendForm.courseId,
          roleKey: null
        }).then(() => {
          message.success(t('notification.messages.addSuccess'))
          showSendModal.value = false
          pageTableRef.value?.refresh()
        }).catch(() => {
          // 错误处理已在API层处理
        }).finally(() => {
          sendLoading.value = false
        })
      } else if (sendForm.recipientType === 3) {
        // 指定用户
        batchAddNotification({
          ...sendData,
          userIds: sendForm.userIds
        }).then(() => {
          message.success(t('notification.messages.addSuccess'))
          showSendModal.value = false
          pageTableRef.value?.refresh()
        }).catch(() => {
          // 错误处理已在API层处理
        }).finally(() => {
          sendLoading.value = false
        })
      }
    }
  })
}

const resetSendForm = () => {
  sendFormRef.value?.resetValidation()
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
}

const handleMarkAsRead = (row: NotificationVO) => {
  dialog.warning({
    title: t('common.confirm'),
    content: t('notification.messages.markAsReadConfirm'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      markNotificationAsRead(row.id).then(() => {
        message.success(t('notification.messages.markAsReadSuccess'))
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
        message.success(t('notification.messages.batchMarkAsReadSuccess'))
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
        message.success(t('notification.messages.markAllAsReadSuccess'))
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
        message.success(t('notification.messages.batchDeleteSuccess'))
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

// 组件挂载时初始化
onMounted(() => {
  // 加载角色、课程、用户选项数据
  loadRoleOptions()
  loadCourseOptions()
  loadUserOptions()
})
</script>

<style lang="scss">
@use './index.scss';
</style>
