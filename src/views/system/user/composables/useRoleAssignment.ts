import {reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import * as userApi from '@api/system/user'
import {getAllRoles} from '@api/system/role'
import * as StudentApi from '@api/student'
import * as TeacherApi from '@api/teacher'
import type * as userType from '@types/system/user'
import type {SysRoleVO} from '@types/system/role'
import type {StudentAddDTO, StudentVO} from '@types/student'
import type {TeacherAddDTO, TeacherVO} from '@types/teacher'

// 通用信息类型
type InfoType = 'student' | 'teacher'
type InfoVO = StudentVO | TeacherVO

export function useRoleAssignment() {
    const {message} = getDiscreteApi()
    const {t} = useI18n()
    // 分配角色相关状态
    const showAssignModal = ref(false)
    const currentUser = ref<userType.SysUserVO | null>(null)
    const availableRoles = ref<SysRoleVO[]>([])
    const selectedRoleIds = ref<string[]>([])
    const userRoles = ref<SysRoleVO[]>([])
    const submittingRoles = ref(false)

    // 通用信息状态管理
    const infoModals = {
        student: {
            input: ref(false),
            display: ref(false),
            existing: ref<StudentVO | null>(null),
            submitting: ref(false),
            submittingUpdate: ref(false),
            form: reactive<StudentAddDTO>({
                studentCode: null,
                realName: null,
                birthDate: null,
                admissionYear: null,
                major: null,
                academicStatus: null,
                description: null,
                sysUserId: null
            })
        },
        teacher: {
            input: ref(false),
            display: ref(false),
            existing: ref<TeacherVO | null>(null),
            submitting: ref(false),
            submittingUpdate: ref(false),
            form: reactive<TeacherAddDTO>({
                teacherCode: null,
                realName: null,
                birthDate: null,
                department: null,
                education: null,
                specialization: null,
                description: null,
                sysUserId: null
            })
        }
    }

    // 向后兼容的别名
    const showStudentInfoModal = infoModals.student.input
    const showStudentInfoDisplayModal = infoModals.student.display
    const existingStudentInfo = infoModals.student.existing
    const submittingStudent = infoModals.student.submitting
    const submittingStudentUpdate = infoModals.student.submittingUpdate
    const studentInfoForm = infoModals.student.form

    const showTeacherInfoModal = infoModals.teacher.input
    const showTeacherInfoDisplayModal = infoModals.teacher.display
    const existingTeacherInfo = infoModals.teacher.existing
    const submittingTeacher = infoModals.teacher.submitting
    const submittingTeacherUpdate = infoModals.teacher.submittingUpdate
    const teacherInfoForm = infoModals.teacher.form

    // 处理分配角色
    async function handleAssignRole(row: userType.SysUserVO) {
        currentUser.value = row
        submittingRoles.value = true

        try {
            // 获取用户详情，包括已分配的角色
            const userDetail = await userApi.getUserById(row.id)
            userRoles.value = userDetail?.data?.roles || []

            // 获取所有角色列表
            const roleResult = await getAllRoles()
            availableRoles.value = roleResult?.data || []

            // 设置已选中的角色
            selectedRoleIds.value = userRoles.value.map((r: SysRoleVO) => r.id)

            // 显示分配角色对话框
            showAssignModal.value = true
        } catch (error) {
            message.error(t('settings.user.messages.getRoleFail'))
        } finally {
            submittingRoles.value = false
        }
    }

    // 关闭分配角色对话框
    function closeAssignModal() {
        showAssignModal.value = false
        currentUser.value = null
        selectedRoleIds.value = []
    }

    // 检查是否有新分配的角色
    function checkNewRoleAssignment(roleKey: string): boolean {
        const currentRoleKeys = userRoles.value.map((r: SysRoleVO) => r.roleKey)
        const selectedRoleKeys = selectedRoleIds.value
            .map(id => availableRoles.value.find(role => role.id === id)?.roleKey)
            .filter(Boolean)

        // 检查是否新选择了该角色（之前没有，现在有）
        return !currentRoleKeys.includes(roleKey) && selectedRoleKeys.includes(roleKey)
    }

    // 提交分配角色
    async function submitAssignRoles(roleIds?: string[]) {
        if (!currentUser.value) return

        // 如果传入了角色 IDs，更新选中的角色
        if (roleIds) {
            selectedRoleIds.value = roleIds
        }

        // 检查是否有新分配的教师或学生角色
        const hasNewTeacherRole = checkNewRoleAssignment('TEACHER')
        const hasNewStudentRole = checkNewRoleAssignment('STUDENT')

        // 如果有新分配的教师角色，检查是否已有教师信息
        if (hasNewTeacherRole) {
            await handleTeacherRoleAssignment()
            return
        }

        // 如果有新分配的学生角色，检查是否已有学生信息
        if (hasNewStudentRole) {
            await handleStudentRoleAssignment()
            return
        }

        // 没有新分配的特殊角色，直接提交
        await performRoleAssignment()
    }

    // 通用角色分配处理函数
    async function handleRoleAssignment(type: InfoType) {
        if (!currentUser.value) return

        const modal = infoModals[type]

        try {
            // 查询用户是否已有信息
            const getByUserId = type === 'student' ? StudentApi.getStudentByUserId : TeacherApi.getTeacherByUserId
            const existingData = await getByUserId(currentUser.value.id)

            if (existingData && existingData.data) {
                // 如果已有信息，展示信息并等待确认
                modal.existing.value = existingData.data
                fillForm(type, existingData.data)
                modal.display.value = true
            } else {
                // 如果没有信息，打开信息输入对话框
                modal.input.value = true
            }
        } catch (error) {
            // 如果查询失败，可能是用户没有信息，打开信息输入对话框
            modal.input.value = true
        }
    }

    // 通用表单填充函数
    function fillForm(type: InfoType, data: InfoVO) {
        const form = infoModals[type].form
        if (type === 'student') {
            const studentData = data as StudentVO
            Object.assign(form, {
                studentCode: studentData.studentCode,
                realName: studentData.realName,
                birthDate: studentData.birthDate,
                admissionYear: studentData.admissionYear,
                major: studentData.major,
                academicStatus: studentData.academicStatus,
                description: studentData.description,
                sysUserId: currentUser.value!.id
            })
        } else {
            const teacherData = data as TeacherVO
            Object.assign(form, {
                teacherCode: teacherData.teacherCode,
                realName: teacherData.realName,
                birthDate: teacherData.birthDate,
                department: teacherData.department,
                education: teacherData.education,
                specialization: teacherData.specialization,
                description: teacherData.description,
                sysUserId: currentUser.value!.id
            })
        }
    }

    // 处理教师角色分配
    async function handleTeacherRoleAssignment() {
        await handleRoleAssignment('teacher')
    }

    // 处理学生角色分配
    async function handleStudentRoleAssignment() {
        await handleRoleAssignment('student')
    }

    // 执行角色分配
    async function performRoleAssignment() {
        if (!currentUser.value) return

        submittingRoles.value = true
        try {
            await userApi.assignUserRoles(currentUser.value.id, selectedRoleIds.value)
            message.success(t('settings.user.messages.assignSuccess'))
            closeAssignModal()
        } catch (error) {
            message.error(t('settings.user.messages.assignFail'))
        } finally {
            submittingRoles.value = false
        }
    }

    // 通用表单重置函数
    function resetForm(type: InfoType) {
        const form = infoModals[type].form
        if (type === 'student') {
            Object.assign(form, {
                studentCode: null,
                realName: null,
                birthDate: null,
                admissionYear: null,
                major: null,
                academicStatus: null,
                description: null,
                sysUserId: null
            })
        } else {
            Object.assign(form, {
                teacherCode: null,
                realName: null,
                birthDate: null,
                department: null,
                education: null,
                specialization: null,
                description: null,
                sysUserId: null
            })
        }
    }

    // 关闭信息对话框
    function closeInfoModal(type: InfoType) {
        const modal = infoModals[type]
        modal.input.value = false
        modal.display.value = false
        resetForm(type)
    }

    // 提交信息
    async function submitInfo(type: InfoType) {
        if (!currentUser.value) return

        const modal = infoModals[type]
        const form = modal.form

        try {
            modal.submitting.value = true
            try {
                // 设置用户ID
                form.sysUserId = currentUser.value.id

                // 添加信息
                if (type === 'student') {
                    await StudentApi.addStudent(form as StudentAddDTO)
                } else {
                    await TeacherApi.addTeacher(form as TeacherAddDTO)
                }

                // 执行角色分配
                await performRoleAssignment()

                const successMessage = type === 'student'
                    ? 'settings.user.messages.studentInfoSuccess'
                    : 'settings.user.messages.teacherInfoSuccess'
                message.success(t(successMessage))
                closeInfoModal(type)
            } catch (error) {
                const errorMessage = type === 'student'
                    ? 'settings.user.messages.studentInfoFail'
                    : 'settings.user.messages.teacherInfoFail'
                message.error(t(errorMessage))
            } finally {
                modal.submitting.value = false
            }
        } catch (err) {
            message.error(t('settings.user.messages.formInvalid'))
        }
    }

    // 确认角色分配
    async function confirmRoleAssignment(type: InfoType) {
        if (!currentUser.value) return

        const modal = infoModals[type]
        const form = modal.form
        const existingInfo = modal.existing.value

        if (!existingInfo) return

        try {
            modal.submittingUpdate.value = true
            try {
                // 更新信息
                if (type === 'student') {
                    const studentForm = form as StudentAddDTO
                    const updateData = {
                        id: existingInfo.id,
                        studentCode: studentForm.studentCode,
                        realName: studentForm.realName,
                        birthDate: studentForm.birthDate,
                        admissionYear: studentForm.admissionYear,
                        major: studentForm.major,
                        academicStatus: studentForm.academicStatus,
                        description: studentForm.description,
                        sysUserId: currentUser.value.id
                    }
                    await StudentApi.updateStudent(updateData)
                } else {
                    const teacherForm = form as TeacherAddDTO
                    const updateData = {
                        id: existingInfo.id,
                        teacherCode: teacherForm.teacherCode,
                        realName: teacherForm.realName,
                        birthDate: teacherForm.birthDate,
                        department: teacherForm.department,
                        education: teacherForm.education,
                        specialization: teacherForm.specialization,
                        description: teacherForm.description,
                        sysUserId: currentUser.value.id
                    }
                    await TeacherApi.updateTeacher(updateData)
                }

                // 执行角色分配
                await performRoleAssignment()

                // 重置状态
                modal.display.value = false
                modal.existing.value = null
                resetForm(type)
            } catch (error) {
                const errorMessage = type === 'student'
                    ? 'settings.user.messages.studentRoleAssignFail'
                    : 'settings.user.messages.teacherRoleAssignFail'
                message.error(t(errorMessage))
            } finally {
                modal.submittingUpdate.value = false
            }
        } catch (err) {
            message.error(t('settings.user.messages.formInvalid'))
        }
    }

    return {
        // 分配角色相关
        showAssignModal,
        currentUser,
        availableRoles,
        selectedRoleIds,
        userRoles,
        submittingRoles,
        handleAssignRole,
        closeAssignModal,
        submitAssignRoles,
        performRoleAssignment,

        // 学生信息相关
        showStudentInfoModal,
        showStudentInfoDisplayModal,
        existingStudentInfo,
        submittingStudent,
        submittingStudentUpdate,
        studentInfoForm,
        closeInfoModal: (type: 'student' | 'teacher') => closeInfoModal(type),
        submitInfo: (type: 'student' | 'teacher') => submitInfo(type),
        confirmRoleAssignment: (type: 'student' | 'teacher') => confirmRoleAssignment(type),

        // 教师信息相关
        showTeacherInfoModal,
        showTeacherInfoDisplayModal,
        existingTeacherInfo,
        submittingTeacher,
        submittingTeacherUpdate,
        teacherInfoForm
    }
}
