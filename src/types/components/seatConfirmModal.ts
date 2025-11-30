/**
 * 入座确认弹窗类型
 */

import type { Texture } from 'three'

/**
 * 弹窗 props
 */
export interface SeatConfirmModalProps {
  /** 是否展示弹窗 */
  show: boolean
  /** 座位描述 */
  seatLabel: string | null
  /** 当前用户名称 */
  studentName: string | null
}

/**
 * 弹窗事件
 */
export interface SeatConfirmModalEmits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

/**
 * 待入座上下文
 */
export interface SeatAssignmentContext {
  /** 目标座位索引 */
  seatIndex: number | null
  /** 座位描述 */
  seatLabel: string | null
  /** 头像地址 */
  avatarUrl: string | null
  /** 显示名称 */
  displayName: string | null
}

/**
 * 入座纹理上下文
 */
export interface SeatAssignmentTextureContext extends SeatAssignmentContext {
  /** 备用纹理 */
  fallbackTexture: Texture | null
}

