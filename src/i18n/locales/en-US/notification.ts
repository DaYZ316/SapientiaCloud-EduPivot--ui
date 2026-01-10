export default {
    title: 'Notification Management',
    tab: {
        received: 'Inbox',
        sent: 'Sent'
    },
    searchForm: {
        title: 'Title',
        titlePlaceholder: 'Please enter notification title keywords',
        type: 'Notification Type',
        typePlaceholder: 'Please select notification type',
        status: 'Read Status',
        statusPlaceholder: 'Please select read status',
        recipientCount: 'Recipients',
        readCount: 'Read Count',
        senderName: 'Sender',
        senderNamePlaceholder: 'Please enter sender name',
        createTimeRange: 'Create Time Range',
        createTimeRangePlaceholder: 'Please select create time range',
        search: 'Search',
        reset: 'Reset'
    },
    table: {
        title: 'Title',
        content: 'Content',
        type: 'Type',
        status: 'Status',
        senderName: 'Sender',
        createTime: 'Create Time',
        readTime: 'Read Time',
        actions: 'Actions'
    },
    actions: {
        add: 'Send Notification',
        edit: 'Edit Notification',
        delete: 'Delete Notification',
        markAsRead: 'Mark as Read',
        markAllAsRead: 'Mark All as Read',
        batchMarkAsRead: 'Batch Mark as Read',
        batchDelete: 'Batch Delete',
        view: 'View Details'
    },
    addNotification: {
        title: 'Send Notification',
        titlePlaceholder: 'Please enter notification title',
        content: 'Notification Content',
        contentPlaceholder: 'Please enter notification content (supports rich text)',
        type: 'Notification Type',
        typePlaceholder: 'Please select notification type',
        recipientType: 'Recipient Type',
        recipientTypePlaceholder: 'Please select recipient type',
        recipients: 'Recipients',
        recipientsPlaceholder: 'Please select recipients',
        attachments: 'Attachments',
        attachmentsPlaceholder: 'Please upload attachments (optional)',
        submit: 'Send',
        cancel: 'Cancel'
    },
    editNotification: {
        title: 'Edit Notification'
    },
    messages: {
        addSuccess: 'Notification sent successfully',
        updateSuccess: 'Notification updated successfully',
        deleteSuccess: 'Notification deleted successfully',
        batchDeleteSuccess: 'Batch delete successfully',
        markAsReadSuccess: 'Marked as read successfully',
        batchMarkAsReadSuccess: 'Batch mark as read successfully',
        markAllAsReadSuccess: 'All marked as read successfully',
        deleteConfirm: 'Are you sure you want to delete this notification?',
        markAsReadConfirm: 'Are you sure you want to mark this notification as read?',
        markAllAsReadConfirm: 'Are you sure you want to mark all notifications as read?'
    },
    status: {
        unread: 'Unread',
        read: 'Read'
    },
    type: {
        system: 'System Notification',
        course: 'Course Notification',
        homework: 'Homework Notification',
        live: 'Live Notification',
        other: 'Other'
    },
    recipientType: {
        all: 'All Users',
        role: 'By Role',
        course: 'By Course Students',
        users: 'Specified Users'
    },
    empty: {
        noData: 'No notifications yet',
        noUnread: 'No unread notifications'
    },
    detail: {
        title: 'Notification Details',
        attachments: 'Attachments',
        attachment: 'Attachment',
        download: 'Download',
        unknownAttachment: 'Unknown Attachment ',
        readTime: 'Read Time'
    }
}
