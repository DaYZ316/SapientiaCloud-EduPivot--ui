export default {
    title: 'Course Management',
    myCourses: 'My Courses',
    home: 'Home',

    // Search form
    searchForm: {
        courseName: 'Course Name',
        courseNamePlaceholder: 'Please enter course name',
        courseType: 'Course Type',
        courseTypePlaceholder: 'Please select course type',
        courseStatus: 'Course Status',
        courseStatusPlaceholder: 'Please select course status',
        semester: 'Semester',
        semesterPlaceholder: 'Please enter semester',
        location: 'Location',
        locationPlaceholder: 'Please enter location',
        createTimeRange: 'Create Time',
        createTimeRangePlaceholder: 'Please select create time range'
    },

    // Table columns
    table: {
        courseName: 'Course Name',
        courseType: 'Course Type',
        courseStatus: 'Course Status',
        teacherName: 'Main Instructor',
        semester: 'Semester',
        location: 'Location',
        description: 'Description',
        coverImage: 'Cover Image',
        createTime: 'Create Time',
        updateTime: 'Update Time',
        operation: 'Operation'
    },

    // Action buttons
    actions: {
        add: 'Add Course',
        edit: 'Edit',
        delete: 'Delete',
        deleteConfirm: 'Confirm Delete',
        deleteConfirmContent: 'Are you sure you want to delete course "{courseName}"? This action cannot be undone.',
        deleteSuccess: 'Course deleted successfully',
        addSuccess: 'Course added successfully',
        editSuccess: 'Course edited successfully',
        batchDelete: 'Batch Delete',
        assignTeacher: 'Assign Teacher',
        assignTeachers: 'Assign Teachers',
        batchAssignTeachers: 'Batch Assign Teachers',
        enroll: 'Enroll',
        drop: 'Drop',
        viewStudents: 'View Students',
        updateGrade: 'Update Grade',
        batchUpdateGrade: 'Batch Update Grade',
        checkEnrolled: 'Check Enrollment Status'
    },

    // Dialog
    dialog: {
        addTitle: 'Add Course',
        editTitle: 'Edit Course',
        courseName: 'Course Name',
        courseNamePlaceholder: 'Please enter course name',
        courseType: 'Course Type',
        courseTypePlaceholder: 'Please select course type',
        description: 'Course Description',
        descriptionPlaceholder: 'Please enter course description',
        teacherId: 'Main Instructor',
        teacherIdPlaceholder: 'Please select main instructor',
        assistantTeachers: 'Assistant Teachers',
        assistantTeachersPlaceholder: 'Please select assistant teachers',
        semester: 'Semester',
        semesterPlaceholder: 'Please enter semester',
        location: 'Location',
        locationPlaceholder: 'Please enter location',
        coverImage: 'Cover Image',
        coverImagePlaceholder: 'Please upload cover image',
        status: 'Course Status',
        statusPlaceholder: 'Please select course status'
    },

    // Course type
    courseType: {
        REQUIRED: 'Required',
        ELECTIVE: 'Elective'
    },

    // Course status
    courseStatus: {
        NORMAL: 'Normal',
        SUSPENDED: 'Suspended'
    },

    // Form validation
    validation: {
        courseNameRequired: 'Please enter course name',
        courseNameLength: 'Course name should be between 2-50 characters',
        courseTypeRequired: 'Please select course type',
        teacherIdRequired: 'Please select main instructor',
        semesterLength: 'Semester length cannot exceed 20 characters',
        locationLength: 'Location length cannot exceed 100 characters',
        descriptionLength: 'Description length cannot exceed 500 characters'
    },

    // Enrollment status
    enrollmentStatus: {
        ENROLLED: 'Enrolled',
        DROPPED: 'Dropped',
        COMPLETED: 'Completed'
    },

    // Delete confirmation
    deleteConfirm: {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete course "{0}"? This action cannot be undone.',
        batchContent: 'Are you sure you want to delete {0} selected courses? This action cannot be undone.',
        confirmText: 'Confirm Delete'
    },

    // Messages
    messages: {
        addSuccess: 'Course added successfully',
        addFail: 'Failed to add course',
        updateSuccess: 'Course updated successfully',
        updateFail: 'Failed to update course',
        deleteSuccess: 'Course deleted successfully',
        deleteFail: 'Failed to delete course',
        batchDeleteSuccess: 'Batch delete successful',
        batchDeleteFail: 'Batch delete failed',
        loadFail: 'Failed to load course information',
        enrollSuccess: 'Enrollment successful',
        enrollFail: 'Enrollment failed',
        dropSuccess: 'Drop successful',
        dropFail: 'Drop failed',
        assignTeacherSuccess: 'Teacher assignment successful',
        assignTeacherFail: 'Teacher assignment failed',
        batchAssignTeachersSuccess: 'Batch teacher assignment successful',
        batchAssignTeachersFail: 'Batch teacher assignment failed',
        updateGradeSuccess: 'Grade update successful',
        updateGradeFail: 'Grade update failed',
        batchUpdateGradeSuccess: 'Batch grade update successful',
        batchUpdateGradeFail: 'Batch grade update failed',
        checkEnrolledSuccess: 'Check enrollment status successful',
        checkEnrolledFail: 'Check enrollment status failed'
    },

    // View toggle
    view: {
        table: 'Table View',
        card: 'Card View'
    },

    // Empty state
    empty: {
        noData: 'No course data available',
        noStudents: 'No enrolled students',
        noCourses: 'No course records'
    },

    // Course card
    card: {
        instructor: 'Main Instructor',
        assistantTeachers: 'Assistant Teachers',
        startCourse: 'Enter Course',
        suspended: 'Suspended',
        enroll: 'Enroll',
        drop: 'Drop',
        viewDetails: 'View Details'
    },

    // Student management
    student: {
        title: 'Course Student Management',
        studentId: 'Student ID',
        studentName: 'Student Name',
        grade: 'Grade',
        enrollmentDate: 'Enrollment Date',
        status: 'Enrollment Status',
        updateGrade: 'Update Grade',
        batchUpdateGrade: 'Batch Update Grade'
    },

    // Teacher management
    teacher: {
        title: 'Course Teacher Management',
        assignTeacher: 'Assign Teacher',
        assignTeachers: 'Assign Teachers',
        mainTeacher: 'Main Instructor',
        assistantTeachers: 'Assistant Teachers'
    },

    // Teacher profile
    profile: {
        notFound: 'Teacher information not found',
        noName: 'Name not set',
        noCode: 'Teacher code not set',
        teacherCode: 'Teacher Code',
        description: 'Personal Introduction',
        specialization: 'Specialization',
        contactInfo: 'Contact Information'
    },

    // Enroll course functionality
    enroll: {
        addCourse: 'Add Course',
        addCourseTitle: 'Enroll in Course',
        courseId: 'Course ID',
        courseIdPlaceholder: 'Please enter course ID',
        courseIdRequired: 'Please enter course ID',
        addSuccess: 'Successfully enrolled in course',
        addFail: 'Failed to enroll in course',
        courseNotFound: 'Course not found',
        alreadyEnrolled: 'You have already enrolled in this course',
        confirmAdd: 'Confirm Enrollment',
        confirmAddContent: 'Are you sure you want to enroll in course with ID "{courseId}"?'
    },

    // Course detail page
    detail: {
        noDescription: 'No course description available',
        noChapters: 'No chapters available',
        noThreads: 'No forum threads available',
        noStudents: 'No enrolled students',
        unknownTeacher: 'Unknown Teacher',
        chapters: 'Course Chapters',
        forum: 'Course Forum',
        courseInfo: 'Course Information',
        basicInfo: 'Basic Information',
        quickActions: 'Quick Actions',
        addChapter: 'Add Chapter',
        createThread: 'Create Thread',
        view: 'View',
        pinned: 'Pinned',
        closed: 'Closed',
        views: 'Views',
        replies: 'Replies',
        teacher: 'Main Instructor',
        students: 'Enrolled Students',
        semester: 'Semester',
        location: 'Location',
        courseName: 'Course Name',
        courseType: 'Course Type',
        status: 'Status',
        createTime: 'Create Time',
        description: 'Course Description',
        enroll: 'Enroll',
        manageStudents: 'Manage Students',
        editCourse: 'Edit Course',
        viewProfile: 'View Profile',
        noTeacher: 'No teacher information',
        viewAllStudents: 'View All Students ({count})',
        threadTitle: 'Thread Title',
        threadTitlePlaceholder: 'Please enter thread title',
        threadContent: 'Thread Content',
        threadContentPlaceholder: 'Please enter thread content',
        threadTitleRequired: 'Please enter thread title',
        threadContentRequired: 'Please enter thread content',
        createThreadSuccess: 'Thread created successfully',
        createThreadError: 'Failed to create thread',
        enrollNotImplemented: 'Enrollment feature not implemented',
        viewAllStudentsNotImplemented: 'View all students feature not implemented',
        fetchCourseError: 'Failed to fetch course information',
        fetchChaptersError: 'Failed to fetch course chapters',
        fetchThreadsError: 'Failed to fetch course threads',
        fetchStudentsError: 'Failed to fetch enrolled students'
    },

    // Teacher information
    teacherInfo: 'Course Instructor',

    // Share course
    share: {
        title: 'Share Course',
        courseId: 'Course ID',
        copySuccess: 'Course ID copied to clipboard',
        copyFail: 'Copy failed, please copy manually',
        shareTips: 'Share knowledge with your classmates!',
        close: 'Close'
    },

    // Course detail actions
    detailActions: {
        edit: 'Edit Course',
        delete: 'Delete Course',
        deleteConfirm: 'Confirm Delete',
        deleteConfirmContent: 'Are you sure you want to delete course "{courseName}"? This action cannot be undone.',
        deleteSuccess: 'Course deleted successfully',
        deleteFail: 'Failed to delete course',
        editSuccess: 'Course edited successfully',
        editFail: 'Failed to edit course'
    }
}
