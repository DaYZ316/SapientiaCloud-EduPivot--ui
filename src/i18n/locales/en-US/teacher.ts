export default {
    title: 'Teacher Management',
    back: 'Back',

    // Search form
    searchForm: {
        title: 'Search Conditions',
        teacherCode: 'Teacher Code',
        teacherCodePlaceholder: 'Please enter teacher code',
        teacherName: 'Teacher Name',
        teacherNamePlaceholder: 'Please enter teacher name',
        department: 'Department',
        departmentPlaceholder: 'Please enter department',
        education: 'Education',
        educationPlaceholder: 'Please select education level',
        createTimeRange: 'Create Time',
        createTimeRangePlaceholder: 'Please select create time range'
    },

    // Education options
    education: {
        0: 'College',
        1: 'Bachelor',
        2: 'Master',
        3: 'Doctor',
        COLLEGE: 'College',
        BACHELOR: 'Bachelor',
        MASTER: 'Master',
        DOCTOR: 'Doctor'
    },

    // Table columns
    table: {
        teacherCode: 'Teacher Code',
        teacherName: 'Teacher Name',
        department: 'Department',
        education: 'Education',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        operation: 'Operation'
    },

    // Action buttons
    actions: {
        add: 'Add Teacher',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View'
    },

    // Add/Edit dialog
    dialog: {
        addTitle: 'Add Teacher',
        editTitle: 'Edit Teacher',
        teacherCode: 'Teacher Code',
        teacherCodePlaceholder: 'Please enter teacher code',
        teacherCodeRequired: 'Please enter teacher code',
        teacherName: 'Teacher Name',
        teacherNamePlaceholder: 'Please enter teacher name',
        teacherNameRequired: 'Please enter teacher name',
        department: 'Department',
        departmentPlaceholder: 'Please enter department',
        departmentRequired: 'Please enter department',
        education: 'Education',
        educationPlaceholder: 'Please select education level',
        educationRequired: 'Please select education level'
    },

    // Delete confirmation
    deleteConfirm: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete teacher "{0}"? This action cannot be undone.',
        confirmText: 'Confirm Delete',
        cancelText: 'Cancel'
    },

    // Messages
    messages: {
        addSuccess: 'Teacher added successfully',
        addFail: 'Failed to add teacher',
        updateSuccess: 'Teacher updated successfully',
        updateFail: 'Failed to update teacher',
        deleteSuccess: 'Teacher deleted successfully',
        deleteFail: 'Failed to delete teacher',
        loadFail: 'Failed to load teacher list',
        teacherCodeExists: 'Teacher code already exists',
        invalidTeacherCode: 'Invalid teacher code format'
    },

    // Validation rules
    validation: {
        teacherCodeRequired: 'Please enter teacher code',
        teacherCodeFormat: 'Invalid teacher code format',
        teacherNameRequired: 'Please enter teacher name',
        teacherNameLength: 'Teacher name cannot exceed 50 characters',
        departmentRequired: 'Please enter department',
        departmentLength: 'Department name cannot exceed 100 characters',
        educationRequired: 'Please select education level'
    }
}
