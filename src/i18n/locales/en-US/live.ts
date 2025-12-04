export default {
    title: 'Live',
    singleRoom: {
        title: 'Live Room',
        roomName: 'Room Name',
        courseName: 'Course Name',
        teacher: 'Teacher',
        maxParticipants: 'Max Participants',
        startTime: 'Start Time',
        endTime: 'End Time',
        expectedEndTime: 'Expected End Time',
        enterRoom: 'Enter Room',
        courseSection: 'Class Information',
        empty: 'No live room is available for this class',
        courseEmpty: 'No course record found',
        contextMissing: 'Class context is missing, unable to create live room'
    },
    form: {
        roomName: 'Room Name',
        roomNamePlaceholder: 'Please enter the live room name',
        maxParticipants: 'Max Participants',
        maxParticipantsPlaceholder: 'Please enter max participants (optional)',
        recordingEnabled: 'Recording',
        recordingEnabledOn: 'Recording Enabled',
        recordingEnabledOff: 'Recording Disabled',
        courseRecordMissing: 'Course record missing',
        courseRecordMissingDesc: 'Please enter the class from course detail or classroom list before creating a live room'
    },
    validation: {
        roomNameRequired: 'Please enter the live room name',
        roomNameLength: 'Room name cannot exceed 128 characters'
    },
    actions: {
        create: 'Create / Update Live Room',
        issueToken: 'Issue Access Token'
    },
    token: {
        modalTitle: 'Issue Live Access Token',
        roleLabel: 'Access Role',
        issueButton: 'Generate Token',
        issuedToken: 'Issued Token',
        copyToken: 'Copy Token',
        shareLink: 'Share Link',
        copyLink: 'Copy Link'
    },
    room: {
        title: 'Live Room',
        statusUnknown: 'Unknown Status',
        onlineCount: 'Online',
        currentRole: 'Current Role: {role}',
        sharedToken: 'Joined with shared token',
        connectionState: 'Connection',
        join: 'Join',
        leave: 'Leave',
        localVideo: 'Local Video',
        chatTitle: 'Live Chat',
        chatDescription: 'Interact with teachers and classmates in real time',
        members: 'members',
        connecting: 'Connecting',
        connected: 'Connected',
        disconnected: 'Disconnected',
        reconnecting: 'Reconnecting',
        connectFailed: 'Connection Failed',
        system: 'System',
        welcomeMessage: 'Welcome to the live room. You can chat with teachers and classmates here.',
        unknown: 'Unknown'
    }
}
