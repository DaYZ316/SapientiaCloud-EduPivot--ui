$files = @(
    'composables/useSeatLayout.ts',
    'composables/spriteManager.ts',
    'components/ClassroomDetail.vue',
    'components/LivePanel.vue',
    'components/ClassroomDetail.scss',
    'components/Classroom3D.vue',
    'composables/useModelRouter.ts',
    'composables/useClassroomInteraction.ts',
    'composables/useCameraGroup.ts',
    'composables/toolbox.ts',
    'composables/ModelInstanceManager.ts',
    'components/StudentInfoPopup.vue',
    'components/QuestionPanel.vue',
    'components/PracticePanel.vue',
    'components/ClassroomToolbox.vue',
    'components/ClassroomHistory.vue',
    'components/ClassroomHistory.scss',
    'components/ChapterPanel.vue',
    'ClassroomSelect.vue',
    'Classroom3DDetail.vue'
)

foreach ($file in $files) {
    $f1 = "e:\SapientiaCloud-EduPivot--ui-master--副本2\src\views\classroom\$file"
    $f2 = "e:\SapientiaCloud-EduPivot--ui-master\src\views\classroom\$file"
    if (Test-Path $f1 -and Test-Path $f2) {
        $c1 = Get-Content $f1 -Raw
        $c2 = Get-Content $f2 -Raw
        if ($c1 -ne $c2) {
            Write-Host "DIFFERENT: $file"
        } else {
            Write-Host "SAME: $file"
        }
    } else {
        Write-Host "MISSING: $file"
    }
}
