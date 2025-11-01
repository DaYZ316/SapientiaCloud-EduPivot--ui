# SapientiaCloud-EduPivot--classroom API


**简介**:SapientiaCloud-EduPivot--classroom API


**HOST**:http://172.16.0.10:31607


**联系人**:DaYZ


**Version**:1.0.0


**接口路径**:/api/classroom/v3/api-docs


[TOC]






# 课程记录管理


## getCourseRecordById


**接口地址**:`/api/classroom/course-record/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID查询课程记录详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|课程记录ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultCourseRecordVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||CourseRecordVO|CourseRecordVO|
|&emsp;&emsp;id|课程记录ID|string(uuid)||
|&emsp;&emsp;courseId|关联课程ID|string(uuid)||
|&emsp;&emsp;courseName|课程名称|string||
|&emsp;&emsp;teacherId|授课教师系统用户ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;studentIds|参与学生ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;questionIds|课堂互动题目ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;modelType|教室模型类型 (classroomSmall, classroomMiddle, classroomLarge)|string||
|&emsp;&emsp;totalDesks|桌椅总数 (1-200)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;spacing|桌椅间距系数 (0.7-1.5)|number(float)||
|&emsp;&emsp;layoutConfig|教室布局详细参数|LayoutConfig|LayoutConfig|
|&emsp;&emsp;&emsp;&emsp;leftLength|左侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;rightLength|右侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;bottomLength|底部长度|integer||
|&emsp;&emsp;&emsp;&emsp;uwidth||number||
|&emsp;&emsp;classroomLayout|【废弃】旧版布局字段，仅兼容早期版本|object||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消)|integer(int32)||
|&emsp;&emsp;expectedStudents|应到人数|integer(int32)||
|&emsp;&emsp;actualStudents|实到人数|integer(int32)||
|&emsp;&emsp;attendanceRate|出勤率 (%)|number(double)||
|&emsp;&emsp;durationMinutes|课程时长 (分钟)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"courseName": "",
		"teacherId": "",
		"teacherName": "",
		"teacherAvatar": "",
		"studentIds": [],
		"questionIds": [],
		"modelType": "",
		"totalDesks": 0,
		"layoutRows": 0,
		"layoutColumns": 0,
		"spacing": 0,
		"layoutConfig": {
			"leftLength": 0,
			"rightLength": 0,
			"bottomLength": 0,
			"uwidth": 0
		},
		"classroomLayout": {},
		"startTime": "",
		"overTime": "",
		"status": 0,
		"expectedStudents": 0,
		"actualStudents": 0,
		"attendanceRate": 0,
		"durationMinutes": 0,
		"createTime": "",
		"updateTime": ""
	}
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## removeCourseRecordById


**接口地址**:`/api/classroom/course-record/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID删除课程记录</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|课程记录ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## addCourseRecord


**接口地址**:`/api/classroom/course-record/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>教师开课，创建课程教学记录</p>



**请求示例**:


```javascript
{
  "id": "",
  "courseId": "",
  "teacherId": "",
  "studentIds": [],
  "questionIds": [],
  "modelType": "",
  "totalDesks": 0,
  "layoutRows": 0,
  "layoutColumns": 0,
  "spacing": 0,
  "layoutConfig": {
    "leftLength": 0,
    "rightLength": 0,
    "bottomLength": 0,
    "uwidth": 0
  },
  "classroomLayout": {},
  "startTime": "",
  "overTime": "",
  "status": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|courseRecordDTO|课程教学记录数据传输对象|body|true|CourseRecordDTO|CourseRecordDTO|
|&emsp;&emsp;id|课程记录ID，更新时必须提供||false|string(uuid)||
|&emsp;&emsp;courseId|关联课程ID||true|string(uuid)||
|&emsp;&emsp;teacherId|授课教师系统用户ID||true|string(uuid)||
|&emsp;&emsp;studentIds|参与学生ID列表 (JSON数组)||false|array|string(uuid)|
|&emsp;&emsp;questionIds|课堂互动题目ID列表 (JSON数组)||false|array|string(uuid)|
|&emsp;&emsp;modelType|教室模型类型 (classroomSmall, classroomMiddle, classroomLarge)||true|string||
|&emsp;&emsp;totalDesks|桌椅总数 (1-200)||true|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)||false|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)||false|integer(int32)||
|&emsp;&emsp;spacing|桌椅间距系数 (0.7-1.5)||false|number(float)||
|&emsp;&emsp;layoutConfig|教室布局详细参数||false|LayoutConfig|LayoutConfig|
|&emsp;&emsp;&emsp;&emsp;leftLength|左侧长度||false|integer||
|&emsp;&emsp;&emsp;&emsp;rightLength|右侧长度||false|integer||
|&emsp;&emsp;&emsp;&emsp;bottomLength|底部长度||false|integer||
|&emsp;&emsp;&emsp;&emsp;uwidth|||false|number||
|&emsp;&emsp;classroomLayout|【废弃】旧版布局字段，仅兼容早期版本||false|object||
|&emsp;&emsp;startTime|课程开始时间||false|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间||false|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消)||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultCourseRecordVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||CourseRecordVO|CourseRecordVO|
|&emsp;&emsp;id|课程记录ID|string(uuid)||
|&emsp;&emsp;courseId|关联课程ID|string(uuid)||
|&emsp;&emsp;courseName|课程名称|string||
|&emsp;&emsp;teacherId|授课教师系统用户ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;studentIds|参与学生ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;questionIds|课堂互动题目ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;modelType|教室模型类型 (classroomSmall, classroomMiddle, classroomLarge)|string||
|&emsp;&emsp;totalDesks|桌椅总数 (1-200)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;spacing|桌椅间距系数 (0.7-1.5)|number(float)||
|&emsp;&emsp;layoutConfig|教室布局详细参数|LayoutConfig|LayoutConfig|
|&emsp;&emsp;&emsp;&emsp;leftLength|左侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;rightLength|右侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;bottomLength|底部长度|integer||
|&emsp;&emsp;&emsp;&emsp;uwidth||number||
|&emsp;&emsp;classroomLayout|【废弃】旧版布局字段，仅兼容早期版本|object||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消)|integer(int32)||
|&emsp;&emsp;expectedStudents|应到人数|integer(int32)||
|&emsp;&emsp;actualStudents|实到人数|integer(int32)||
|&emsp;&emsp;attendanceRate|出勤率 (%)|number(double)||
|&emsp;&emsp;durationMinutes|课程时长 (分钟)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"courseName": "",
		"teacherId": "",
		"teacherName": "",
		"teacherAvatar": "",
		"studentIds": [],
		"questionIds": [],
		"modelType": "",
		"totalDesks": 0,
		"layoutRows": 0,
		"layoutColumns": 0,
		"spacing": 0,
		"layoutConfig": {
			"leftLength": 0,
			"rightLength": 0,
			"bottomLength": 0,
			"uwidth": 0
		},
		"classroomLayout": {},
		"startTime": "",
		"overTime": "",
		"status": 0,
		"expectedStudents": 0,
		"actualStudents": 0,
		"attendanceRate": 0,
		"durationMinutes": 0,
		"createTime": "",
		"updateTime": ""
	}
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## listAllCourseRecord


**接口地址**:`/api/classroom/course-record/all`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有课程记录列表</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListCourseRecordVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|CourseRecordVO|
|&emsp;&emsp;id|课程记录ID|string(uuid)||
|&emsp;&emsp;courseId|关联课程ID|string(uuid)||
|&emsp;&emsp;courseName|课程名称|string||
|&emsp;&emsp;teacherId|授课教师系统用户ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;studentIds|参与学生ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;questionIds|课堂互动题目ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;modelType|教室模型类型 (classroomSmall, classroomMiddle, classroomLarge)|string||
|&emsp;&emsp;totalDesks|桌椅总数 (1-200)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;spacing|桌椅间距系数 (0.7-1.5)|number(float)||
|&emsp;&emsp;layoutConfig|教室布局详细参数|LayoutConfig|LayoutConfig|
|&emsp;&emsp;&emsp;&emsp;leftLength|左侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;rightLength|右侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;bottomLength|底部长度|integer||
|&emsp;&emsp;&emsp;&emsp;uwidth||number||
|&emsp;&emsp;classroomLayout|【废弃】旧版布局字段，仅兼容早期版本|object||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消)|integer(int32)||
|&emsp;&emsp;expectedStudents|应到人数|integer(int32)||
|&emsp;&emsp;actualStudents|实到人数|integer(int32)||
|&emsp;&emsp;attendanceRate|出勤率 (%)|number(double)||
|&emsp;&emsp;durationMinutes|课程时长 (分钟)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"courseId": "",
			"courseName": "",
			"teacherId": "",
			"teacherName": "",
			"teacherAvatar": "",
			"studentIds": [],
			"questionIds": [],
			"modelType": "",
			"totalDesks": 0,
			"layoutRows": 0,
			"layoutColumns": 0,
			"spacing": 0,
			"layoutConfig": {
				"leftLength": 0,
				"rightLength": 0,
				"bottomLength": 0,
				"uwidth": 0
			},
			"classroomLayout": {},
			"startTime": "",
			"overTime": "",
			"status": 0,
			"expectedStudents": 0,
			"actualStudents": 0,
			"attendanceRate": 0,
			"durationMinutes": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## removeCourseRecordByIds


**接口地址**:`/api/classroom/course-record/batch`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>根据ID列表批量删除课程记录</p>



**请求示例**:


```javascript
[]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|strings|string|body|true|array||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultInteger|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": 0
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## listCourseRecordByCourseId


**接口地址**:`/api/classroom/course-record/course/{courseId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据课程ID查询该课程的所有教学记录</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|courseId|课程ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListCourseRecordVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|CourseRecordVO|
|&emsp;&emsp;id|课程记录ID|string(uuid)||
|&emsp;&emsp;courseId|关联课程ID|string(uuid)||
|&emsp;&emsp;courseName|课程名称|string||
|&emsp;&emsp;teacherId|授课教师系统用户ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;studentIds|参与学生ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;questionIds|课堂互动题目ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;modelType|教室模型类型 (classroomSmall, classroomMiddle, classroomLarge)|string||
|&emsp;&emsp;totalDesks|桌椅总数 (1-200)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;spacing|桌椅间距系数 (0.7-1.5)|number(float)||
|&emsp;&emsp;layoutConfig|教室布局详细参数|LayoutConfig|LayoutConfig|
|&emsp;&emsp;&emsp;&emsp;leftLength|左侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;rightLength|右侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;bottomLength|底部长度|integer||
|&emsp;&emsp;&emsp;&emsp;uwidth||number||
|&emsp;&emsp;classroomLayout|【废弃】旧版布局字段，仅兼容早期版本|object||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消)|integer(int32)||
|&emsp;&emsp;expectedStudents|应到人数|integer(int32)||
|&emsp;&emsp;actualStudents|实到人数|integer(int32)||
|&emsp;&emsp;attendanceRate|出勤率 (%)|number(double)||
|&emsp;&emsp;durationMinutes|课程时长 (分钟)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"courseId": "",
			"courseName": "",
			"teacherId": "",
			"teacherName": "",
			"teacherAvatar": "",
			"studentIds": [],
			"questionIds": [],
			"modelType": "",
			"totalDesks": 0,
			"layoutRows": 0,
			"layoutColumns": 0,
			"spacing": 0,
			"layoutConfig": {
				"leftLength": 0,
				"rightLength": 0,
				"bottomLength": 0,
				"uwidth": 0
			},
			"classroomLayout": {},
			"startTime": "",
			"overTime": "",
			"status": 0,
			"expectedStudents": 0,
			"actualStudents": 0,
			"attendanceRate": 0,
			"durationMinutes": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## endCourseRecord


**接口地址**:`/api/classroom/course-record/end/{id}`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>教师下课，结束课程记录</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|课程记录ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## listCourseRecord


**接口地址**:`/api/classroom/course-record/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据条件分页查询课程记录列表，支持按课程、教师、状态等条件筛选</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|courseId|关联课程ID|query|false|string||
|teacherId|授课教师系统用户ID|query|false|string||
|modelType|教室模型类型 (classroomSmall, classroomMiddle, classroomLarge)|query|false|string||
|status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消)|query|false|string||
|startTimeBegin|开始时间范围 - 起始|query|false|string||
|startTimeEnd|开始时间范围 - 结束|query|false|string||
|startTime|起始时间|query|false|string||
|endTime|结束时间|query|false|string||
|pageNum|当前记录起始索引|query|false|string||
|pageSize|每页显示记录数|query|false|string||
|orderByColumn|排序列|query|false|string||
|isAsc|排序的方向,可用值:asc,desc|query|false|string||
|reasonable|分页参数合理化|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|TableDataResult|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|total|总记录数|integer(int64)|integer(int64)|
|data|列表数据|array||
|code|消息状态码|integer(int32)|integer(int32)|
|message|消息内容|string||


**响应示例**:
```javascript
{
	"total": 0,
	"data": [],
	"code": 0,
	"message": ""
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## listCourseRecordByTeacherId


**接口地址**:`/api/classroom/course-record/teacher/{teacherId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据教师ID查询该教师的所有教学记录</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|teacherId|教师ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListCourseRecordVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|CourseRecordVO|
|&emsp;&emsp;id|课程记录ID|string(uuid)||
|&emsp;&emsp;courseId|关联课程ID|string(uuid)||
|&emsp;&emsp;courseName|课程名称|string||
|&emsp;&emsp;teacherId|授课教师系统用户ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;studentIds|参与学生ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;questionIds|课堂互动题目ID列表 (JSON数组)|array|string(uuid)|
|&emsp;&emsp;modelType|教室模型类型 (classroomSmall, classroomMiddle, classroomLarge)|string||
|&emsp;&emsp;totalDesks|桌椅总数 (1-200)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;spacing|桌椅间距系数 (0.7-1.5)|number(float)||
|&emsp;&emsp;layoutConfig|教室布局详细参数|LayoutConfig|LayoutConfig|
|&emsp;&emsp;&emsp;&emsp;leftLength|左侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;rightLength|右侧长度|integer||
|&emsp;&emsp;&emsp;&emsp;bottomLength|底部长度|integer||
|&emsp;&emsp;&emsp;&emsp;uwidth||number||
|&emsp;&emsp;classroomLayout|【废弃】旧版布局字段，仅兼容早期版本|object||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消)|integer(int32)||
|&emsp;&emsp;expectedStudents|应到人数|integer(int32)||
|&emsp;&emsp;actualStudents|实到人数|integer(int32)||
|&emsp;&emsp;attendanceRate|出勤率 (%)|number(double)||
|&emsp;&emsp;durationMinutes|课程时长 (分钟)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"courseId": "",
			"courseName": "",
			"teacherId": "",
			"teacherName": "",
			"teacherAvatar": "",
			"studentIds": [],
			"questionIds": [],
			"modelType": "",
			"totalDesks": 0,
			"layoutRows": 0,
			"layoutColumns": 0,
			"spacing": 0,
			"layoutConfig": {
				"leftLength": 0,
				"rightLength": 0,
				"bottomLength": 0,
				"uwidth": 0
			},
			"classroomLayout": {},
			"startTime": "",
			"overTime": "",
			"status": 0,
			"expectedStudents": 0,
			"actualStudents": 0,
			"attendanceRate": 0,
			"durationMinutes": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## updateCourseRecord


**接口地址**:`/api/classroom/course-record/update`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改课程记录信息</p>



**请求示例**:


```javascript
{
  "id": "",
  "courseId": "",
  "teacherId": "",
  "studentIds": [],
  "questionIds": [],
  "modelType": "",
  "totalDesks": 0,
  "layoutRows": 0,
  "layoutColumns": 0,
  "spacing": 0,
  "layoutConfig": {
    "leftLength": 0,
    "rightLength": 0,
    "bottomLength": 0,
    "uwidth": 0
  },
  "classroomLayout": {},
  "startTime": "",
  "overTime": "",
  "status": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|courseRecordDTO|课程教学记录数据传输对象|body|true|CourseRecordDTO|CourseRecordDTO|
|&emsp;&emsp;id|课程记录ID，更新时必须提供||false|string(uuid)||
|&emsp;&emsp;courseId|关联课程ID||true|string(uuid)||
|&emsp;&emsp;teacherId|授课教师系统用户ID||true|string(uuid)||
|&emsp;&emsp;studentIds|参与学生ID列表 (JSON数组)||false|array|string(uuid)|
|&emsp;&emsp;questionIds|课堂互动题目ID列表 (JSON数组)||false|array|string(uuid)|
|&emsp;&emsp;modelType|教室模型类型 (classroomSmall, classroomMiddle, classroomLarge)||true|string||
|&emsp;&emsp;totalDesks|桌椅总数 (1-200)||true|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)||false|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)||false|integer(int32)||
|&emsp;&emsp;spacing|桌椅间距系数 (0.7-1.5)||false|number(float)||
|&emsp;&emsp;layoutConfig|教室布局详细参数||false|LayoutConfig|LayoutConfig|
|&emsp;&emsp;&emsp;&emsp;leftLength|左侧长度||false|integer||
|&emsp;&emsp;&emsp;&emsp;rightLength|右侧长度||false|integer||
|&emsp;&emsp;&emsp;&emsp;bottomLength|底部长度||false|integer||
|&emsp;&emsp;&emsp;&emsp;uwidth|||false|number||
|&emsp;&emsp;classroomLayout|【废弃】旧版布局字段，仅兼容早期版本||false|object||
|&emsp;&emsp;startTime|课程开始时间||false|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间||false|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消)||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


# 学生座位管理


## removeStudentSeat


**接口地址**:`/api/classroom/course-record-student/{recordId}/{studentId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>移除学生座位（学生离开教室）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|recordId|课程记录ID|path|true|string(uuid)||
|studentId|学生ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## addStudentSeat


**接口地址**:`/api/classroom/course-record-student/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>学生选择座位并入座</p>



**请求示例**:


```javascript
{
  "recordId": "",
  "studentId": "",
  "courseId": "",
  "seatIndex": 0,
  "locationX": 0,
  "locationY": 0,
  "locationZ": 0,
  "rotationY": 0,
  "seatStatus": "",
  "attendanceStatus": 0,
  "participationScore": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|courseRecordStudentDTO|课程教学学生参与数据传输对象|body|true|CourseRecordStudentDTO|CourseRecordStudentDTO|
|&emsp;&emsp;recordId|课程记录ID||true|string(uuid)||
|&emsp;&emsp;studentId|学生ID||true|string(uuid)||
|&emsp;&emsp;courseId|课程ID||true|string(uuid)||
|&emsp;&emsp;seatIndex|座位编号 (从0开始)||true|integer(int32)||
|&emsp;&emsp;locationX|3D坐标X (横向)||true|number(float)||
|&emsp;&emsp;locationY|3D坐标Y (高度)||true|number(float)||
|&emsp;&emsp;locationZ|3D坐标Z (纵深)||true|number(float)||
|&emsp;&emsp;rotationY|朝向角度 (弧度制)||false|number(float)||
|&emsp;&emsp;seatStatus|座位状态 (normal, marked, reserved, occupied)||false|string||
|&emsp;&emsp;attendanceStatus|出勤状态 (0=未签到, 1=已签到, 2=缺席)||false|integer(int32)||
|&emsp;&emsp;participationScore|课堂互动得分 (可选)||false|number(float)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultCourseRecordStudentVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||CourseRecordStudentVO|CourseRecordStudentVO|
|&emsp;&emsp;recordId|课程记录ID|string(uuid)||
|&emsp;&emsp;studentId|学生ID|string(uuid)||
|&emsp;&emsp;studentName|学生姓名|string||
|&emsp;&emsp;studentCode|学号|string||
|&emsp;&emsp;studentAvatar|学生头像|string||
|&emsp;&emsp;courseId|课程ID|string(uuid)||
|&emsp;&emsp;courseName|课程名称|string||
|&emsp;&emsp;seatIndex|座位编号 (从0开始)|integer(int32)||
|&emsp;&emsp;locationX|3D坐标X (横向)|number(float)||
|&emsp;&emsp;locationY|3D坐标Y (高度)|number(float)||
|&emsp;&emsp;locationZ|3D坐标Z (纵深)|number(float)||
|&emsp;&emsp;rotationY|朝向角度 (弧度制)|number(float)||
|&emsp;&emsp;seatStatus|座位状态 (normal, marked, reserved, occupied)|string||
|&emsp;&emsp;attendanceStatus|出勤状态 (0=未签到, 1=已签到, 2=缺席)|integer(int32)||
|&emsp;&emsp;participationScore|课堂互动得分 (可选)|number(float)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"recordId": "",
		"studentId": "",
		"studentName": "",
		"studentCode": "",
		"studentAvatar": "",
		"courseId": "",
		"courseName": "",
		"seatIndex": 0,
		"locationX": 0,
		"locationY": 0,
		"locationZ": 0,
		"rotationY": 0,
		"seatStatus": "",
		"attendanceStatus": 0,
		"participationScore": 0,
		"createTime": "",
		"updateTime": ""
	}
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## listAllCourseRecordStudent


**接口地址**:`/api/classroom/course-record-student/all`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有学生座位记录列表</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListCourseRecordStudentVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|CourseRecordStudentVO|
|&emsp;&emsp;recordId|课程记录ID|string(uuid)||
|&emsp;&emsp;studentId|学生ID|string(uuid)||
|&emsp;&emsp;studentName|学生姓名|string||
|&emsp;&emsp;studentCode|学号|string||
|&emsp;&emsp;studentAvatar|学生头像|string||
|&emsp;&emsp;courseId|课程ID|string(uuid)||
|&emsp;&emsp;courseName|课程名称|string||
|&emsp;&emsp;seatIndex|座位编号 (从0开始)|integer(int32)||
|&emsp;&emsp;locationX|3D坐标X (横向)|number(float)||
|&emsp;&emsp;locationY|3D坐标Y (高度)|number(float)||
|&emsp;&emsp;locationZ|3D坐标Z (纵深)|number(float)||
|&emsp;&emsp;rotationY|朝向角度 (弧度制)|number(float)||
|&emsp;&emsp;seatStatus|座位状态 (normal, marked, reserved, occupied)|string||
|&emsp;&emsp;attendanceStatus|出勤状态 (0=未签到, 1=已签到, 2=缺席)|integer(int32)||
|&emsp;&emsp;participationScore|课堂互动得分 (可选)|number(float)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"recordId": "",
			"studentId": "",
			"studentName": "",
			"studentCode": "",
			"studentAvatar": "",
			"courseId": "",
			"courseName": "",
			"seatIndex": 0,
			"locationX": 0,
			"locationY": 0,
			"locationZ": 0,
			"rotationY": 0,
			"seatStatus": "",
			"attendanceStatus": 0,
			"participationScore": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## removeStudentSeatBatch


**接口地址**:`/api/classroom/course-record-student/batch`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>批量移除学生座位</p>



**请求示例**:


```javascript
[
  {
    "recordId": "",
    "studentId": ""
  }
]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|studentSeatDeleteDTOs|学生座位删除数据传输对象|body|true|array|StudentSeatDeleteDTO|
|&emsp;&emsp;recordId|课程记录ID||true|string(uuid)||
|&emsp;&emsp;studentId|学生ID||true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultInteger|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": 0
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## checkSeatOccupied


**接口地址**:`/api/classroom/course-record-student/check-seat/{recordId}/{seatIndex}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>检查指定座位是否已被其他学生占用</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|recordId|课程记录ID|path|true|string(uuid)||
|seatIndex|座位编号|path|true|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## countStudentsByRecordId


**接口地址**:`/api/classroom/course-record-student/count/{recordId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>统计某课程记录的实际到课人数</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|recordId|课程记录ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultInteger|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": 0
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## listCourseRecordStudent


**接口地址**:`/api/classroom/course-record-student/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据条件分页查询学生座位记录列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|recordId|课程记录ID|query|false|string||
|studentId|学生ID|query|false|string||
|courseId|课程ID|query|false|string||
|seatStatus|座位状态 (normal, marked, reserved, occupied)|query|false|string||
|attendanceStatus|出勤状态 (0=未签到, 1=已签到, 2=缺席)|query|false|string||
|startTime|起始时间|query|false|string||
|endTime|结束时间|query|false|string||
|pageNum|当前记录起始索引|query|false|string||
|pageSize|每页显示记录数|query|false|string||
|orderByColumn|排序列|query|false|string||
|isAsc|排序的方向,可用值:asc,desc|query|false|string||
|reasonable|分页参数合理化|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|TableDataResult|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|total|总记录数|integer(int64)|integer(int64)|
|data|列表数据|array||
|code|消息状态码|integer(int32)|integer(int32)|
|message|消息内容|string||


**响应示例**:
```javascript
{
	"total": 0,
	"data": [],
	"code": 0,
	"message": ""
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## listStudentsByRecordId


**接口地址**:`/api/classroom/course-record-student/record/{recordId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据课程记录ID查询该课程的所有学生座位信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|recordId|课程记录ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListCourseRecordStudentVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|CourseRecordStudentVO|
|&emsp;&emsp;recordId|课程记录ID|string(uuid)||
|&emsp;&emsp;studentId|学生ID|string(uuid)||
|&emsp;&emsp;studentName|学生姓名|string||
|&emsp;&emsp;studentCode|学号|string||
|&emsp;&emsp;studentAvatar|学生头像|string||
|&emsp;&emsp;courseId|课程ID|string(uuid)||
|&emsp;&emsp;courseName|课程名称|string||
|&emsp;&emsp;seatIndex|座位编号 (从0开始)|integer(int32)||
|&emsp;&emsp;locationX|3D坐标X (横向)|number(float)||
|&emsp;&emsp;locationY|3D坐标Y (高度)|number(float)||
|&emsp;&emsp;locationZ|3D坐标Z (纵深)|number(float)||
|&emsp;&emsp;rotationY|朝向角度 (弧度制)|number(float)||
|&emsp;&emsp;seatStatus|座位状态 (normal, marked, reserved, occupied)|string||
|&emsp;&emsp;attendanceStatus|出勤状态 (0=未签到, 1=已签到, 2=缺席)|integer(int32)||
|&emsp;&emsp;participationScore|课堂互动得分 (可选)|number(float)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"recordId": "",
			"studentId": "",
			"studentName": "",
			"studentCode": "",
			"studentAvatar": "",
			"courseId": "",
			"courseName": "",
			"seatIndex": 0,
			"locationX": 0,
			"locationY": 0,
			"locationZ": 0,
			"rotationY": 0,
			"seatStatus": "",
			"attendanceStatus": 0,
			"participationScore": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## getStudentSeat


**接口地址**:`/api/classroom/course-record-student/student-seat/{recordId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>查询具体学生在某课程记录中的座位信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|recordId|课程记录ID|path|true|string(uuid)||
|studentId|学生ID|query|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultCourseRecordStudentVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||CourseRecordStudentVO|CourseRecordStudentVO|
|&emsp;&emsp;recordId|课程记录ID|string(uuid)||
|&emsp;&emsp;studentId|学生ID|string(uuid)||
|&emsp;&emsp;studentName|学生姓名|string||
|&emsp;&emsp;studentCode|学号|string||
|&emsp;&emsp;studentAvatar|学生头像|string||
|&emsp;&emsp;courseId|课程ID|string(uuid)||
|&emsp;&emsp;courseName|课程名称|string||
|&emsp;&emsp;seatIndex|座位编号 (从0开始)|integer(int32)||
|&emsp;&emsp;locationX|3D坐标X (横向)|number(float)||
|&emsp;&emsp;locationY|3D坐标Y (高度)|number(float)||
|&emsp;&emsp;locationZ|3D坐标Z (纵深)|number(float)||
|&emsp;&emsp;rotationY|朝向角度 (弧度制)|number(float)||
|&emsp;&emsp;seatStatus|座位状态 (normal, marked, reserved, occupied)|string||
|&emsp;&emsp;attendanceStatus|出勤状态 (0=未签到, 1=已签到, 2=缺席)|integer(int32)||
|&emsp;&emsp;participationScore|课堂互动得分 (可选)|number(float)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"recordId": "",
		"studentId": "",
		"studentName": "",
		"studentCode": "",
		"studentAvatar": "",
		"courseId": "",
		"courseName": "",
		"seatIndex": 0,
		"locationX": 0,
		"locationY": 0,
		"locationZ": 0,
		"rotationY": 0,
		"seatStatus": "",
		"attendanceStatus": 0,
		"participationScore": 0,
		"createTime": "",
		"updateTime": ""
	}
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```


## updateStudentSeat


**接口地址**:`/api/classroom/course-record-student/update`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新学生座位信息（换座、更新状态等）</p>



**请求示例**:


```javascript
{
  "recordId": "",
  "studentId": "",
  "courseId": "",
  "seatIndex": 0,
  "locationX": 0,
  "locationY": 0,
  "locationZ": 0,
  "rotationY": 0,
  "seatStatus": "",
  "attendanceStatus": 0,
  "participationScore": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|courseRecordStudentDTO|课程教学学生参与数据传输对象|body|true|CourseRecordStudentDTO|CourseRecordStudentDTO|
|&emsp;&emsp;recordId|课程记录ID||true|string(uuid)||
|&emsp;&emsp;studentId|学生ID||true|string(uuid)||
|&emsp;&emsp;courseId|课程ID||true|string(uuid)||
|&emsp;&emsp;seatIndex|座位编号 (从0开始)||true|integer(int32)||
|&emsp;&emsp;locationX|3D坐标X (横向)||true|number(float)||
|&emsp;&emsp;locationY|3D坐标Y (高度)||true|number(float)||
|&emsp;&emsp;locationZ|3D坐标Z (纵深)||true|number(float)||
|&emsp;&emsp;rotationY|朝向角度 (弧度制)||false|number(float)||
|&emsp;&emsp;seatStatus|座位状态 (normal, marked, reserved, occupied)||false|string||
|&emsp;&emsp;attendanceStatus|出勤状态 (0=未签到, 1=已签到, 2=缺席)||false|integer(int32)||
|&emsp;&emsp;participationScore|课堂互动得分 (可选)||false|number(float)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {}
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```