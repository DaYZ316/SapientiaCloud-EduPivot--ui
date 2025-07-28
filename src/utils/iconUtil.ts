import type {Component} from 'vue'
import {h} from 'vue'
import Icon from '@/components/common/Icon.vue'

/**
 * 创建图标渲染函数
 * @param icon 图标组件
 * @param props 额外属性
 * @returns 渲染函数
 */
export function renderIcon(icon: Component, props: Record<string, any> = {}) {
    return () => h(Icon, {component: icon, ...props})
}

/**
 * 使用图标组件封装的形式渲染图标
 * @param icon 图标组件
 * @param props 额外属性
 * @returns 图标组件VNode
 */
export function createIcon(icon: Component, props: Record<string, any> = {}) {
    return h(Icon, {component: icon, ...props})
} 