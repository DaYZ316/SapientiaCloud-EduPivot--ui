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

    // Color declaration
    colorDeclaration: {
        required: 'Required',
        elective: 'Elective'
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
        loading: 'Loading course information...',
        loadingTeacher: 'Loading teacher information...',
        loadingTasks: 'Loading course tasks...',
        loadingQuestions: 'Loading course questions...',
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
        viewDetails: 'View Details',
        courseProgress: 'Course Progress'
    },

    // Student management
    student: {
        title: 'Course Student Management',
        studentId: 'Student ID',
        studentName: 'Student Name',
        realName: 'Real Name',
        avatar: 'Avatar',
        grade: 'Grade',
        searchPlaceholder: 'Enter student real name',
        enrollmentDate: 'Enrollment Date',
        status: 'Enrollment Status',
        createTime: 'Create Time',
        updateGrade: 'Update Grade',
        batchUpdateGrade: 'Batch Update Grade',
        view: 'View',
        edit: 'Edit',
        remove: 'Remove',
        noStudents: 'No enrolled students',
        loadError: 'Failed to load student list',
        removeConfirm: 'Confirm Remove',
        removeConfirmContent: 'Are you sure you want to remove student "{studentName}"? This action cannot be undone.',
        removeSuccess: 'Student removed successfully',
        removeFail: 'Failed to remove student',
        viewNotImplemented: 'View student details feature not implemented yet',
        editNotImplemented: 'Edit student information feature not implemented yet',
        removeNotImplemented: 'Remove student feature not implemented yet',
        studentNotFound: 'Student information not found',
        userLoggedOut: 'This user has been logged out and cannot view detailed information',
        editDialog: {
            title: 'Edit Student Information',
            grade: 'Grade',
            status: 'Enrollment Status',
            gradePlaceholder: 'Please enter grade',
            gradeRequired: 'Please enter grade',
            gradeInvalid: 'Grade must be a number between 0-100',
            statusRequired: 'Please select enrollment status',
            cancel: 'Cancel',
            confirm: 'Confirm',
            editSuccess: 'Edit successful',
            editFail: 'Edit failed'
        }
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
        fetchStudentsError: 'Failed to fetch enrolled students',
        loadCourseFailed: 'Failed to load course information'
    },

    // Teacher information
    teacherInfo: 'Course Instructor',

    // Post type related
    postTypeLabel: 'Post Type',
    postTypePlaceholder: 'Please select post type',
    postTypeRequired: 'Please select post type',

    // Share course
    share: {
        title: 'Share Course',
        courseId: 'Course ID',
        copySuccess: 'Course ID copied to clipboard',
        copyFail: 'Copy failed, please copy manually',
        shareTips: 'Share knowledge with your classmates!',
        close: 'Close'
    },

    // Teacher education statistics
    teacherEducation: {
        title: 'Teacher Education Distribution',
        noDataDescription: 'No teacher education data available, please assign teachers to the course first'
    },

    // Student status distribution
    studentStatus: {
        title: 'Student Status Distribution',
        noDataDescription: 'No student status data available, please wait for students to enroll'
    },

    // Student enrollment statistics
    enrollment: {
        title: 'Student Enrollment Trend',
        tooltip: 'Enrollment Count',
        barSeriesName: 'Daily Enrollment',
        lineSeriesName: 'Total Students',
        enrollmentCount: 'Enrollment Count',
        totalStudents: 'Total Students',
        noDataDescription: 'No enrollment trend data available, please wait for students to enroll'
    },

    // Student grade distribution chart
    studentGrade: {
        title: 'Student Grade Distribution',
        studentCount: 'Student Count',
        ranges: {
            fail: 'Fail (0-59)',
            pass: 'Pass (60-69)',
            good: 'Good (70-79)',
            veryGood: 'Very Good (80-89)',
            excellent: 'Excellent (90-100)'
        },
        noDataDescription: 'No grade distribution data available, please enter student grades first'
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
    },

    // Teacher marquee
    teacherMarquee: {
        noAssistantTeachers: 'No assistant teachers available'
    },

    // Course function navigation
    navigation: {
        students: 'Students',
        forum: 'Forum',
        chapters: 'Chapters',
        classroom: 'Classroom',
        tasks: 'Tasks',
        questions: 'Question Bank'
    },

    // Counter
    counter: {
        students: 'Students',
        teachers: 'Teachers'
    },

    // Coming soon notice
    // Course Forum
    forum: {
        title: 'Course Forum',
        createForum: 'Create Forum',
        createPost: 'Create Post',
        createFirstForum: 'Create First Forum',
        noForums: 'No Forums Available',
        noDescription: 'No Description',
        posts: 'Posts',
        replies: 'Replies',
        anonymous: 'Anonymous',
        realName: 'Real Name',
        back: 'Back',

        // Forum Types
        forumType: {
            DISCUSSION: 'Discussion',
            Q_AND_A: 'Q&A',
            ASSIGNMENT: 'Assignment',
            ANNOUNCEMENT: 'Announcement'
        },

        // Forum Status
        forumStatus: {
            NORMAL: 'Normal',
            CLOSED: 'Closed',
            MAINTENANCE: 'Maintenance'
        },


        // Form Fields
        forumName: 'Forum Name',
        forumNamePlaceholder: 'Please enter forum name',
        forumNameRequired: 'Please enter forum name',
        description: 'Description',
        descriptionPlaceholder: 'Please enter description',
        forumTypeLabel: 'Forum Type',
        forumTypePlaceholder: 'Please select forum type',
        forumTypeRequired: 'Please select forum type',
        isPublic: 'Is Public',
        isPublicPlaceholder: 'Please select if public',
        isPublicRequired: 'Please select if public',
        private: 'Course Members Only',
        public: 'Public',
        allowAnonymous: 'Allow Anonymous',
        allowAnonymousRequired: 'Please select if allow anonymous',
        disallow: 'Disallow',
        allow: 'Allow',
        rules: 'Forum Rules',
        rulesPlaceholder: 'Please enter forum rules',

        // Post Form Fields
        postTitle: 'Post Title',
        postTitlePlaceholder: 'Please enter post title',
        postTitleRequired: 'Please enter post title',
        postContent: 'Post Content',
        postContentPlaceholder: 'Please enter post content',
        postContentRequired: 'Please enter post content',
        postTypeLabel: 'Post Type',
        postTypePlaceholder: 'Please select post type',
        postTypeRequired: 'Please select post type',
        isAnonymous: 'Is Anonymous',
        isAnonymousRequired: 'Please select if anonymous',
        tags: 'Tags',
        tagsPlaceholder: 'Please enter tags, press Enter to add',

        // Post Types
        postTypeDiscussion: 'Discussion',
        postTypeQuestion: 'Question',
        postTypeAnnouncement: 'Announcement',
        postTypeAssignment: 'Assignment',

        // Forum Type Labels
        forumTypeDiscussion: 'Discussion',
        forumTypeQa: 'Q&A',
        forumTypeAssignment: 'Assignment',
        forumTypeAnnouncement: 'Announcement',

        // Other Missing Translations
        selectForumToView: 'Please select a forum to view',
        totalPosts: 'Total Posts',
        loadForumFailed: 'Failed to load forum',
        loadPostsFailed: 'Failed to load posts',
        createPostFailed: 'Failed to create post',
        likePostFailed: 'Failed to like post',
        shareFeatureComingSoon: 'Share feature coming soon',
        postDetailComingSoon: 'Post details feature coming soon',
        noPosts: 'No posts yet',
        anonymousUser: 'Anonymous user profile not available',
        userNotFound: 'User information not found',

        // Share Related
        sharePost: 'Share Post',
        shareLink: 'Share Link',
        shareLinkCopied: 'Share link copied to clipboard',

        // Action Messages
        createForumSuccess: 'Forum created successfully',
        createPostSuccess: 'Post created successfully',
        deletePostConfirm: 'Are you sure to delete post "{postTitle}"?',
        deletePostSuccess: 'Post deleted successfully',
        editForumNotImplemented: 'Edit forum feature is under development...',
        editPostNotImplemented: 'Edit post feature is under development...',
        viewPostNotImplemented: 'Post details feature is under development...',

        // Edit and Delete Related
        editPost: 'Edit Post',
        deletePost: 'Delete Post',
        confirmDeletePost: 'Are you sure to delete this post? This action cannot be undone.',
        deletePostFailed: 'Failed to delete post',
        editPostSuccess: 'Post edited successfully',
        editPostFailed: 'Failed to edit post',

        // Top and Essence Operations
        setTopPost: 'Set as Top',
        cancelTopPost: 'Cancel Top',
        setTopPostSuccess: 'Post set as top successfully',
        setTopPostFailed: 'Failed to set post as top',
        cancelTopPostSuccess: 'Post top cancelled successfully',
        cancelTopPostFailed: 'Failed to cancel post top',
        setEssencePost: 'Set as Essence',
        cancelEssencePost: 'Cancel Essence',
        setEssencePostSuccess: 'Post set as essence successfully',
        setEssencePostFailed: 'Failed to set post as essence',
        cancelEssencePostSuccess: 'Post essence cancelled successfully',
        cancelEssencePostFailed: 'Failed to cancel post essence',
        editPostComingSoon: 'Edit post feature coming soon',
        deletePostComingSoon: 'Delete post feature coming soon',

        // Forum Management
        editForum: 'Edit Forum',
        deleteForum: 'Delete Forum',
        deleteForumConfirm: 'Are you sure to delete forum "{forumName}"? This action cannot be undone.',
        deleteForumSuccess: 'Forum deleted successfully',
        updateForumSuccess: 'Forum updated successfully',
        updateForumFail: 'Failed to update forum',

        // Like system
        likeSystemDeveloping: 'Like system is under development, stay tuned!',

        // Post detail page
        postNotFound: 'Post not found',
        loadPostFailed: 'Failed to load post',
        views: 'Views',
        likes: 'Likes',
        like: 'Like',
        unlike: 'Unlike',
        likeSuccess: 'Liked successfully',
        likeFailed: 'Failed to like',
        unlikeSuccess: 'Unliked successfully',
        replyIdNotFound: 'Reply ID not found',
        share: 'Share',
        shareSuccess: 'Shared successfully',
        shareFailed: 'Failed to share',
        collect: 'Collect',
        uncollect: 'Uncollect',
        collectSuccess: 'Collected successfully',
        uncollectSuccess: 'Uncollected successfully',
        attachments: 'Attachments',
        images: 'Images',
        topPost: 'Pinned',
        essencePost: 'Essence',
        lockedPost: 'Locked',

        // Combined labels
        topEssence: 'Pinned·Essence',
        announcementTop: 'Announcement·Pinned',
        announcementEssence: 'Announcement·Essence',
        announcementTopEssence: 'Announcement·Pinned·Essence',
        unlockPost: 'Unlock Post',
        lockPost: 'Lock Post',
        lockPostSuccess: 'Post locked successfully',
        unlockPostSuccess: 'Post unlocked successfully',
        toggleLockFailed: 'Failed to toggle lock status',
        noReplies: 'No replies yet',
        reply: 'Reply',
        replyContent: 'Reply Content',
        replyContentPlaceholder: 'Please enter reply content',
        replyContentRequired: 'Please enter reply content',
        replySuccess: 'Reply posted successfully',
        replyFailed: 'Failed to post reply',
        confirmDeleteReply: 'Are you sure to delete this reply? This action cannot be undone.',
        deleteReply: 'Delete Reply',
        deleteReplySuccess: 'Reply deleted successfully',
        deleteReplyFailed: 'Failed to delete reply',
        editReply: 'Edit Reply',
        editReplyComingSoon: 'Edit reply feature coming soon',
        replyingTo: 'Replying to',
        replyToUser: 'Reply to User',
        submitReply: 'Submit Reply',
        acceptedAnswer: 'Accepted Answer',
        loadRepliesFailed: 'Failed to load replies',

        // Lock/Unlock confirmation
        confirmLockPost: 'Are you sure you want to lock this post? Users will not be able to reply after locking.',
        confirmUnlockPost: 'Are you sure you want to unlock this post? Users will be able to reply normally after unlocking.',

        // Image loading
        imageLoadFailed: 'Image load failed',
        imageExpired: 'Image expired',

        // Reply related
        cannotReplyToAnonymous: 'Cannot reply to anonymous posts',
        editReplySuccess: 'Reply edited successfully',
        editReplyFailed: 'Failed to edit reply',
        accepted: 'Accepted',
        childReplies: 'Replies',
        expand: 'Expand',
        collapse: 'Collapse',
        replyTo: 'Reply to',
        acceptReply: 'Accept Reply',
        unacceptReply: 'Unaccept Reply',
        acceptReplySuccess: 'Reply accepted successfully',
        acceptReplyFailed: 'Failed to accept reply',
        unacceptReplySuccess: 'Reply unaccepted successfully',
        unacceptReplyFailed: 'Failed to unaccept reply',
        loadChildRepliesFailed: 'Failed to load child replies',
        noChildReplies: 'No child replies',
        anonymousCannotView: 'Anonymous users cannot be viewed',
        anonymousCannotReply: 'Anonymous users cannot reply',
        writeReply: 'Write Reply',
        restoringState: 'Restoring page state...',
        messageNotVisible: 'This message is not visible'
    },

    // Post types
    postType: {
        NORMAL: 'Normal Post',
        ANNOUNCEMENT: 'Announcement'
    },

    comingSoon: {
        title: 'Feature Coming Soon',
        studentsDescription: 'Student management feature is under development, stay tuned!',
        forumDescription: 'Forum Description',
        selectForumToView: 'Please select a forum to view',
        chaptersDescription: 'Course chapters feature is under development, stay tuned!',
        classroomDescription: 'Online classroom feature is under development, stay tuned!'
    },

    // Chapter management
    chapters: {
        title: 'Course Chapters',
        searchLabel: 'Chapter Name',
        searchPlaceholder: 'Please enter chapter name',
        addChapter: 'Add Chapter',
        chapterManagement: 'Chapter Management',
        draft: 'Draft',
        published: 'Published',
        draftChapters: 'No draft chapters available',
        publishedChapters: 'No published chapters available',
        noChapters: 'No chapters available',
        loadError: 'Failed to load chapters',
        loadCourseInfoFailed: 'Failed to load course information',
        loadDraftChaptersFailed: 'Failed to load draft chapters',
        loadPublishedChaptersFailed: 'Failed to load published chapters',
        deleteError: 'Failed to delete chapter',
        addChapterNotImplemented: 'Add chapter feature not implemented yet',
        viewChapterNotImplemented: 'View chapter details feature not implemented yet',
        editChapterNotImplemented: 'Edit chapter feature not implemented yet',
        likeSuccess: 'Liked successfully',
        likeError: 'Failed to like',
        unlikeSuccess: 'Unliked successfully',
        unlikeError: 'Failed to unlike',
        statusUpdateSuccess: 'Chapter status updated successfully',
        statusUpdateError: 'Failed to update chapter status',
        sortUpdateSuccess: 'Chapter sort updated successfully',
        sortUpdateError: 'Failed to update chapter sort',
        batchSortUpdateSuccess: 'Batch sort updated successfully',
        batchSortUpdateError: 'Failed to update batch sort',
        attachmentUploadSuccess: 'Attachment uploaded successfully',
        attachmentUploadError: 'Failed to upload attachment',
        attachmentRemoveSuccess: 'Attachment removed successfully',
        attachmentRemoveError: 'Failed to remove attachment',
        deleteAttachmentSuccess: 'Attachment deleted successfully',
        actions: {
            addChapter: 'Add Chapter',
            viewChapter: 'View Chapter',
            editChapter: 'Edit Chapter',
            deleteChapter: 'Delete Chapter',
            likeChapter: 'Like',
            unlikeChapter: 'Unlike'
        },
        form: {
            chapterName: 'Chapter Name',
            chapterNamePlaceholder: 'Please enter chapter name',
            parentChapterId: 'Parent Chapter',
            parentChapterIdPlaceholder: 'Please select parent chapter (optional)',
            sortOrder: 'Sort Weight',
            description: 'Description',
            descriptionPlaceholder: 'Please enter description (optional)',
            content: 'Chapter Content',
            contentPlaceholder: 'Please enter chapter content',
            sortOrderPlaceholder: 'Please enter sort order (0-9999)',
            attachments: 'Chapter Attachments',
            attachmentsPlaceholder: 'Please upload chapter attachments',
            attachmentsDescription: 'Support uploading documents, images, videos and other files, up to 10 files, single file size limit 50MB',
            attachmentsTitle: 'Chapter Attachments',
            noAttachments: 'No attachments',
            attachmentCount: 'files',
            attachmentExpired: 'Expired',
            attachmentValidityPeriod: 'Validity period',
            attachmentPreview: 'Preview',
            attachmentDownload: 'Download',
            attachmentDelete: 'Delete',
            attachmentUploadError: 'Attachment upload failed',
            attachmentRemoveError: 'Attachment removal failed',
            deleteAttachmentConfirm: 'Delete Attachment',
            deleteAttachmentConfirmContent: 'Are you sure you want to delete the attachment "{fileName}"? This action cannot be undone.',
            deleteAttachmentSuccess: 'Attachment deleted successfully'
        },
        validation: {
            chapterNameRequired: 'Please enter chapter name',
            chapterNameLength: 'Chapter name should be between 1-100 characters',
            descriptionLength: 'Description length cannot exceed 500 characters',
            sortOrderRange: 'Sort order should be between 0-9999'
        },
        selectChapterToView: 'Please select a chapter to view details',
        chapterOrder: 'Chapter {order}',
        description: 'Chapter Description',
        content: 'Chapter Content',
        editChapter: 'Edit Chapter',
        updateChapter: 'Update Chapter',
        deleteChapter: 'Delete Chapter',
        deleteChapterNotImplemented: 'Delete chapter feature not implemented yet',
        cancelEdit: 'Cancel Edit',
        deleteConfirm: 'Confirm Delete',
        deleteConfirmContent: 'Are you sure you want to delete chapter "{chapterName}"? This action cannot be undone.',
        confirmDelete: 'Confirm Delete',
        cannotGetChapterInfo: 'Cannot get chapter information',
        getFileInfoFailed: 'Failed to get file information',
        saveFailed: 'Save failed, please check form information',
        status: {
            published: 'Published',
            draft: 'Draft',
            archived: 'Archived',
            unknown: 'Unknown Status'
        },
        statusDraft: 'Draft',
        statusPublished: 'Published',
        addSuccess: 'Chapter added successfully',
        addFailed: 'Failed to add chapter',
        updateSuccess: 'Chapter updated successfully',
        updateFailed: 'Failed to update chapter',
        saveDraftSuccess: 'Draft saved successfully',
        saveDraftFailed: 'Failed to save draft',
        deleteSuccess: 'Chapter deleted successfully',
        deleteFailed: 'Failed to delete chapter',
        publish: 'Publish',
        saveDraft: 'Save Draft'
    },

    // Chapter status
    chapterStatus: {
        DRAFT: 'Draft',
        PUBLISHED: 'Published',
        OFFLINE: 'Offline'
    },

    // 文件预览
    previewFeatureDeveloping: 'Preview feature is under development, stay tuned...',

    // 状态恢复
    restoringState: 'Restoring page state...',

    // 任务管理
    tasks: {
        title: 'Course Tasks',
        addTask: 'Add Task',
        taskManagement: 'Task Management',
        noTasks: 'No tasks available',
        searchPlaceholder: 'Please enter task name',
        selectTaskToView: 'Please select a task to view details',
        deadline: 'Deadline',
        points: 'Points',
        description: 'Task Description',
        content: 'Task Content',
        requirements: 'Task Requirements',
        attachments: 'Task Attachments',
        statistics: 'Task Statistics',
        dueDate: 'Due Date',
        timeLimit: 'Time Limit',
        minutes: 'minutes',
        sortOrder: 'Sort Order',
        publish: 'Publish',
        close: 'Close',
        publishConfirmContent: 'Are you sure you want to publish task "{taskName}"?',
        closeConfirmContent: 'Are you sure you want to close task "{taskName}"?',
        publishSuccess: 'Task published successfully',
        closeSuccess: 'Task closed successfully',
        deleteConfirmContent: 'Are you sure you want to delete task "{taskName}"? This action cannot be undone.',
        deleteFailed: 'Failed to delete task',
        published: 'Published',
        draft: 'Draft',
        publishedTasks: 'Published Tasks',
        draftTasks: 'Draft Tasks',
        type: {
            HOMEWORK: 'Homework',
            QUIZ: 'Quiz',
            PROJECT: 'Project',
            EXPERIMENT: 'Experiment',
            homework: 'Homework',
            quiz: 'Quiz',
            project: 'Project',
            experiment: 'Experiment',
            unknown: 'Unknown Type'
        },
        difficulty: {
            EASY: 'Easy',
            MEDIUM: 'Medium',
            HARD: 'Hard',
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
            unknown: 'Unknown Difficulty'
        },
        status: {
            draft: 'Draft',
            published: 'Published',
            inProgress: 'In Progress',
            ended: 'Ended',
            unknown: 'Unknown Status'
        },
        // Task control page
        editTask: 'Edit Task',
        taskName: 'Task Name',
        taskNamePlaceholder: 'Please enter task name',
        taskNameRequired: 'Please enter task name',
        taskNameLength: 'Task name should be between 1-100 characters',
        taskType: 'Task Type',
        taskTypePlaceholder: 'Please select task type',
        taskTypeRequired: 'Please select task type',
        difficultyLabel: 'Difficulty',
        difficultyPlaceholder: 'Please select difficulty',
        difficultyRequired: 'Please select difficulty',
        pointsPlaceholder: 'Please enter points',
        pointsRequired: 'Please enter points',
        pointsRange: 'Points cannot be negative',
        pointsCannotBeNegative: 'Points cannot be negative',
        pointsCannotExceed150: 'Points cannot exceed 150',
        startTime: 'Start Time',
        startTimePlaceholder: 'Please select start time',
        startTimeRequired: 'Please select start time',
        endTime: 'End Time',
        endTimePlaceholder: 'Please select end time',
        endTimeRequired: 'Please select end time',
        dueDatePlaceholder: 'Please select due date',
        timeLimitPlaceholder: 'Please enter time limit (minutes)',
        timeLimitCannotBeNegative: 'Time limit cannot be negative',
        timeLimitCannotExceed9999: 'Time limit cannot exceed 9999',
        sortOrderPlaceholder: 'Please enter sort order',
        sortOrderRange: 'Sort order should be between 0-9999',
        descriptionPlaceholder: 'Please enter task description',
        contentPlaceholder: 'Please enter task content',
        requirementsPlaceholder: 'Please enter task requirements',
        saveDraft: 'Save Draft',
        saveDraftSuccess: 'Draft saved successfully',
        saveDraftFailed: 'Failed to save draft',
        publishFailed: 'Failed to publish task',
        loadFailed: 'Failed to load tasks',
        createTime: 'Create Time',
        updateTask: 'Update Task',
        cancelEdit: 'Cancel Edit',
        deleteTask: 'Delete Task',
        deleteConfirm: 'Confirm Delete Task',
        confirmDelete: 'Confirm Delete',
        deleteSuccess: 'Task deleted successfully',
        updateSuccess: 'Task updated successfully',
        updateFailed: 'Failed to update task',
        cannotGetTaskInfo: 'Cannot get task information',
        uploadFailed: 'File upload failed',
        loadFileInfoFailed: 'Failed to load file information',
        deleteAttachmentConfirm: 'Delete Attachment',
        deleteAttachmentConfirmContent: 'Are you sure you want to delete the attachment "{fileName}"? This action cannot be undone.',
        deleteAttachmentSuccess: 'Attachment deleted successfully',
        deleteAttachmentFailed: 'Failed to delete attachment'
    },

    // 题库管理
    questionBank: {
        title: 'Question Bank Management',
        description: 'Manage course question banks, create and manage questions',
        bankName: 'Bank Name',
        bankNamePlaceholder: 'Please enter bank name',
        bankNameRequired: 'Please enter bank name',
        bankDescription: 'Bank Description',
        descriptionPlaceholder: 'Please enter bank description',
        bankType: 'Bank Type',
        bankTypePlaceholder: 'Please select bank type',
        bankTypeRequired: 'Please select bank type',
        difficulty: 'Difficulty Level',
        difficultyPlaceholder: 'Please select difficulty level',
        difficultyRequired: 'Please select difficulty level',
        isPublic: 'Is Public',
        isPublicPlaceholder: 'Please select if public',
        isPublicRequired: 'Please select if public',
        private: 'Private',
        public: 'Public',
        practice: 'Practice Bank',
        exam: 'Exam Bank',
        homework: 'Homework Bank',
        questionCount: 'Question Count',
        noBanks: 'No Question Banks',
        noData: 'No Question Bank Data',
        createFirst: 'Create First Question Bank',
        noDescription: 'No Description',
        questions: 'Questions',
        tags: 'Tags',
        tagsPlaceholder: 'Please enter tags, press Enter to add',
        deleteConfirm: 'Delete Confirmation',
        deleteConfirmContent: 'Are you sure you want to delete question bank "{bankName}"? This action cannot be undone.',
        deleteSuccess: 'Question bank deleted successfully',
        deleteFailed: 'Failed to delete question bank',
        share: 'Share Question Bank',
        edit: 'Edit Question Bank',
        delete: 'Delete Question Bank',
        // 题库卡片
        card: {
            courseInfo: 'Course Info',
            createdBy: 'Created By',
            questionCount: 'Questions',
            difficulty: 'Difficulty',
            tags: 'Tags',
            createTime: 'Created',
            updateTime: 'Updated',
            public: 'Public',
            private: 'Private',
            practice: 'Practice',
            exam: 'Exam',
            homework: 'Homework',
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard'
        }
    },

    // Question management
    question: {
        title: 'Questions',
        description: 'Manage questions in the question bank',
        detail: 'Question Detail',
        detailDescription: 'View and edit question details',
        questionTitle: 'Question Title',
        questionTitlePlaceholder: 'Please enter question title',
        questionTitleRequired: 'Please enter question title',
        questionContent: 'Question Content',
        questionContentPlaceholder: 'Please enter question content',
        questionContentRequired: 'Please enter question content',
        questionType: 'Question Type',
        questionTypePlaceholder: 'Please select question type',
        questionTypeRequired: 'Please select question type',
        difficulty: 'Difficulty Level',
        difficultyPlaceholder: 'Please select difficulty level',
        difficultyRequired: 'Please select difficulty level',
        score: 'Question Score',
        scorePlaceholder: 'Please enter question score',
        scoreRequired: 'Please enter question score',
        estimatedTime: 'Estimated Time',
        estimatedTimePlaceholder: 'Please enter estimated time (minutes)',
        unlimited: 'Unlimited',
        status: 'Question Status',
        statusPlaceholder: 'Please select question status',
        statusRequired: 'Please select question status',
        tags: 'Tags',
        allowPartialCredit: 'Allow Partial Credit',
        singleChoice: 'Single Choice',
        multipleChoice: 'Multiple Choice',
        trueFalse: 'True/False',
        fillBlank: 'Fill in the Blank',
        shortAnswer: 'Short Answer',
        draft: 'Draft',
        published: 'Published',
        disabled: 'Disabled',
        myDraft: 'My Drafts',
        content: 'Question Content',
        options: 'Question Options',
        answers: 'Question Answers',
        basicInfo: 'Basic Information',
        addOption: 'Add Option',
        addAnswer: 'Add Answer',
        optionLabel: 'Option Label',
        optionLabelPlaceholder: 'Please enter option label (e.g., A, B, C, D)',
        optionLabelRequired: 'Please enter option label',
        optionContent: 'Option Content',
        optionContentPlaceholder: 'Please enter option content',
        optionContentRequired: 'Please enter option content',
        isCorrect: 'Is Correct',
        isCorrectPlaceholder: 'Please select if correct',
        isCorrectRequired: 'Please select if correct',
        optionScore: 'Option Score',
        optionScorePlaceholder: 'Please enter option score',
        answerContent: 'Answer Content',
        answerContentPlaceholder: 'Please enter answer content',
        answerContentRequired: 'Please enter answer content',
        answerText: 'Answer Text',
        answerTextPlaceholder: 'Please enter answer text',
        answerScore: 'Answer Score',
        answerScorePlaceholder: 'Please enter answer score',
        answerScoreRequired: 'Please enter answer score',
        incorrect: 'Incorrect',
        correct: 'Correct',
        showAnswers: 'Show Answers',
        hideAnswers: 'Hide Answers',
        partiallyCorrect: 'Partially Correct',
        noData: 'No question data',
        createFirst: 'Create first question',
        deleteConfirm: 'Confirm delete question',
        deleteConfirmContent: 'Are you sure you want to delete question "{questionTitle}"? This action cannot be undone.',
        deleteSuccess: 'Question deleted successfully',
        deleteFailed: 'Failed to delete question',
        viewCount: 'View count',
        createQuestion: 'Create Question',
        editQuestion: 'Edit Question',
        createSuccess: 'Question created successfully',
        createFailed: 'Failed to create question',
        editSuccess: 'Question edited successfully',
        editFailed: 'Failed to edit question',
        saveDraft: 'Save Draft',
        saveDraftSuccess: 'Draft saved successfully',
        saveDraftFailed: 'Failed to save draft',
        publish: 'Publish',
        publishConfirm: 'Confirm Publish',
        publishConfirmContent: 'Are you sure you want to publish question "{questionTitle}"?',
        publishSuccess: 'Question published successfully',
        publishFailed: 'Failed to publish question',
        optionExplanation: 'Option Explanation',
        optionExplanationPlaceholder: 'Please enter option explanation',
        noOptions: 'No options, please add options',
        noAnswers: 'No answers, please add answers',
        userNotLoggedIn: 'User not logged in',
        optionsMinRequired: 'Single choice, multiple choice, and true/false questions require at least {min} options',
        optionsMaxRequired: 'True/false questions can have at most {max} options',
        atLeastOneCorrectRequired: 'At least one option must be marked as correct',
        answersMinRequired: 'Fill-in-the-blank and short answer questions require at least {min} answers'
    },

    // Question status
    questions: {
        status: {
            DRAFT: 'Draft',
            PUBLISHED: 'Published',
            DISABLED: 'Disabled'
        },
        type: {
            SINGLE_CHOICE: 'Single Choice',
            MULTIPLE_CHOICE: 'Multiple Choice',
            TRUE_FALSE: 'True/False',
            FILL_BLANK: 'Fill in the Blank',
            SHORT_ANSWER: 'Short Answer'
        }
    }
}
