export default {
    title: 'Student Management',
    back: 'Back',

    // Search form
    searchForm: {
        title: 'Search Conditions',
        studentCode: 'Student Code',
        studentCodePlaceholder: 'Please enter student code',
        studentName: 'Student Name',
        studentNamePlaceholder: 'Please enter student name',
        enrollmentYear: 'Enrollment Year',
        enrollmentYearPlaceholder: 'Please enter enrollment year',
        major: 'Major',
        majorPlaceholder: 'Please enter major',
        status: 'Status',
        statusPlaceholder: 'Please select student status',
        createTimeRange: 'Create Time',
        createTimeRangePlaceholder: 'Please select create time range'
    },

    // Student status options
    status: {
        0: 'Enrolled',
        1: 'Suspended',
        2: 'Dropped',
        3: 'Graduated',
        ACTIVE: 'Enrolled',
        GRADUATED: 'Graduated',
        SUSPENDED: 'Suspended',
        DROPPED: 'Dropped',
        ENROLLED: 'Enrolled'
    },

    // Table columns
    table: {
        studentCode: 'Student Code',
        studentName: 'Student Name',
        realName: 'Name',
        admissionYear: 'Admission Year',
        enrollmentYear: 'Enrollment Year',
        major: 'Major',
        academicStatus: 'Academic Status',
        status: 'Status',
        description: 'Description',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        actions: 'Actions',
        operation: 'Operation'
    },

    // Action buttons
    actions: {
        add: 'Add Student',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View'
    },

    // Add/Edit dialog
    addStudent: {
        title: 'Add Student',
        studentCode: 'Student Code',
        studentCodePlaceholder: 'Please enter student code',
        studentCodeRequired: 'Please enter student code',
        studentName: 'Student Name',
        studentNamePlaceholder: 'Please enter student name',
        studentNameRequired: 'Please enter student name',
        realName: 'Name',
        realNamePlaceholder: 'Please enter name',
        realNameRequired: 'Please enter name',
        birthDate: 'Birth Date',
        birthDatePlaceholder: 'Please select birth date',
        birthDateRequired: 'Please select birth date',
        enrollmentYear: 'Enrollment Year',
        enrollmentYearPlaceholder: 'Please enter enrollment year',
        enrollmentYearRequired: 'Please enter enrollment year',
        admissionYear: 'Admission Year',
        admissionYearPlaceholder: 'Please enter admission year',
        admissionYearRequired: 'Please enter admission year',
        major: 'Major',
        majorPlaceholder: 'Please enter major',
        majorRequired: 'Please enter major',
        status: 'Status',
        statusPlaceholder: 'Please select student status',
        statusRequired: 'Please select student status',
        academicStatus: 'Academic Status',
        academicStatusPlaceholder: 'Please select academic status',
        academicStatusRequired: 'Please select academic status',
        description: 'Description',
        descriptionPlaceholder: 'Please enter description',
        descriptionRequired: 'Please enter description',
        cancel: 'Cancel',
        submit: 'Submit'
    },
    editStudent: {
        title: 'Edit Student',
        studentCode: 'Student Code',
        studentCodePlaceholder: 'Please enter student code',
        studentCodeRequired: 'Please enter student code',
        studentName: 'Student Name',
        studentNamePlaceholder: 'Please enter student name',
        studentNameRequired: 'Please enter student name',
        realName: 'Name',
        realNamePlaceholder: 'Please enter name',
        realNameRequired: 'Please enter name',
        birthDate: 'Birth Date',
        birthDatePlaceholder: 'Please select birth date',
        birthDateRequired: 'Please select birth date',
        enrollmentYear: 'Enrollment Year',
        enrollmentYearPlaceholder: 'Please enter enrollment year',
        enrollmentYearRequired: 'Please enter enrollment year',
        admissionYear: 'Admission Year',
        admissionYearPlaceholder: 'Please enter admission year',
        admissionYearRequired: 'Please enter admission year',
        major: 'Major',
        majorPlaceholder: 'Please enter major',
        majorRequired: 'Please enter major',
        status: 'Status',
        statusPlaceholder: 'Please select student status',
        statusRequired: 'Please select student status',
        academicStatus: 'Academic Status',
        academicStatusPlaceholder: 'Please select academic status',
        academicStatusRequired: 'Please select academic status',
        description: 'Description',
        descriptionPlaceholder: 'Please enter description',
        descriptionRequired: 'Please enter description',
        cancel: 'Cancel',
        submit: 'Submit'
    },
    dialog: {
        addTitle: 'Add Student',
        editTitle: 'Edit Student'
    },

    // Delete confirmation
    deleteConfirm: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete student "{0}"? This action cannot be undone.',
        confirmText: 'Confirm Delete',
        cancelText: 'Cancel'
    },

    // Messages
    messages: {
        addSuccess: 'Student added successfully',
        addFail: 'Failed to add student',
        updateSuccess: 'Student updated successfully',
        updateFail: 'Failed to update student',
        editSuccess: 'Student edited successfully',
        editFail: 'Failed to edit student',
        deleteSuccess: 'Student deleted successfully',
        deleteFail: 'Failed to delete student',
        deleteConfirm: 'Are you sure you want to delete this student?',
        loadFail: 'Failed to load student list',
        getDetailFail: 'Failed to get student details',
        studentCodeExists: 'Student code already exists',
        invalidStudentCode: 'Invalid student code format',
        invalidEnrollmentYear: 'Invalid enrollment year format'
    },

    // Validation rules
    validation: {
        studentCodeRequired: 'Please enter student code',
        studentCodeFormat: 'Invalid student code format',
        studentNameRequired: 'Please enter student name',
        studentNameLength: 'Student name cannot exceed 50 characters',
        enrollmentYearRequired: 'Please enter enrollment year',
        enrollmentYearFormat: 'Invalid enrollment year format',
        majorRequired: 'Please enter major',
        majorLength: 'Major name cannot exceed 100 characters',
        statusRequired: 'Please select student status'
    }
}
