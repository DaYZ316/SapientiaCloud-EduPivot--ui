# SapientiaCloud-EduPivot--classroom API


**简介**:SapientiaCloud-EduPivot--classroom API


**HOST**:http://192.168.1.21:31607


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
|&emsp;&emsp;courseDescription|课程内容简介|string||
|&emsp;&emsp;teacherId|授课教师ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;classroomType|教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=已取消)|integer(int32)||
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
		"courseDescription": "",
		"teacherId": "",
		"teacherName": "",
		"teacherAvatar": "",
		"classroomType": 0,
		"layoutRows": 0,
		"layoutColumns": 0,
		"startTime": "",
		"overTime": "",
		"status": 0,
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
  "courseName": "",
  "courseDescription": "",
  "classroomType": 0,
  "layoutRows": 0,
  "layoutColumns": 0,
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
|&emsp;&emsp;teacherId|授课教师ID||true|string(uuid)||
|&emsp;&emsp;courseName|课程名称||false|string||
|&emsp;&emsp;courseDescription|课程内容简介||false|string||
|&emsp;&emsp;classroomType|教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室)||true|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)||false|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)||false|integer(int32)||
|&emsp;&emsp;startTime|课程开始时间||false|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间||false|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=已取消)||false|integer(int32)||


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
|&emsp;&emsp;courseDescription|课程内容简介|string||
|&emsp;&emsp;teacherId|授课教师ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;classroomType|教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=已取消)|integer(int32)||
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
		"courseDescription": "",
		"teacherId": "",
		"teacherName": "",
		"teacherAvatar": "",
		"classroomType": 0,
		"layoutRows": 0,
		"layoutColumns": 0,
		"startTime": "",
		"overTime": "",
		"status": 0,
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
|&emsp;&emsp;courseDescription|课程内容简介|string||
|&emsp;&emsp;teacherId|授课教师ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;classroomType|教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=已取消)|integer(int32)||
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
			"courseDescription": "",
			"teacherId": "",
			"teacherName": "",
			"teacherAvatar": "",
			"classroomType": 0,
			"layoutRows": 0,
			"layoutColumns": 0,
			"startTime": "",
			"overTime": "",
			"status": 0,
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
|&emsp;&emsp;courseDescription|课程内容简介|string||
|&emsp;&emsp;teacherId|授课教师ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;classroomType|教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=已取消)|integer(int32)||
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
			"courseDescription": "",
			"teacherId": "",
			"teacherName": "",
			"teacherAvatar": "",
			"classroomType": 0,
			"layoutRows": 0,
			"layoutColumns": 0,
			"startTime": "",
			"overTime": "",
			"status": 0,
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
|teacherId|授课教师ID|query|false|string||
|courseName|课程名称（模糊查询）|query|false|string||
|classroomType|教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室)|query|false|string||
|status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=已取消)|query|false|string||
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
|&emsp;&emsp;courseDescription|课程内容简介|string||
|&emsp;&emsp;teacherId|授课教师ID|string(uuid)||
|&emsp;&emsp;teacherName|授课教师姓名|string||
|&emsp;&emsp;teacherAvatar|授课教师头像|string||
|&emsp;&emsp;classroomType|教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室)|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)|integer(int32)||
|&emsp;&emsp;startTime|课程开始时间|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=已取消)|integer(int32)||
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
			"courseDescription": "",
			"teacherId": "",
			"teacherName": "",
			"teacherAvatar": "",
			"classroomType": 0,
			"layoutRows": 0,
			"layoutColumns": 0,
			"startTime": "",
			"overTime": "",
			"status": 0,
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
  "courseName": "",
  "courseDescription": "",
  "classroomType": 0,
  "layoutRows": 0,
  "layoutColumns": 0,
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
|&emsp;&emsp;teacherId|授课教师ID||true|string(uuid)||
|&emsp;&emsp;courseName|课程名称||false|string||
|&emsp;&emsp;courseDescription|课程内容简介||false|string||
|&emsp;&emsp;classroomType|教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室)||true|integer(int32)||
|&emsp;&emsp;layoutRows|行数 (仅传统布局或对齐布局使用)||false|integer(int32)||
|&emsp;&emsp;layoutColumns|列数 (仅传统布局或对齐布局使用)||false|integer(int32)||
|&emsp;&emsp;startTime|课程开始时间||false|string(date-time)||
|&emsp;&emsp;overTime|课程结束时间||false|string(date-time)||
|&emsp;&emsp;status|课程状态 (0=未开始, 1=进行中, 2=已结束, 3=已取消)||false|integer(int32)||


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


# 课堂练习管理


## updateClassroomPractice


**接口地址**:`/api/classroom/classroom-practice`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新课堂练习题目配置</p>



**请求示例**:


```javascript
{
  "id": "",
  "classroomId": "",
  "questionId": "",
  "publishOrder": 0,
  "score": 0,
  "isRequired": 0,
  "startTime": "",
  "endTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|classroomQuestionDTO|课堂练习发布与更新DTO|body|true|ClassroomQuestionDTO|ClassroomQuestionDTO|
|&emsp;&emsp;id|记录ID（更新时必填）||false|string(uuid)||
|&emsp;&emsp;classroomId|课堂记录ID||true|string(uuid)||
|&emsp;&emsp;questionId|题目ID||true|string(uuid)||
|&emsp;&emsp;publishOrder|发布顺序||false|integer(int32)||
|&emsp;&emsp;score|题目分值||false|number(float)||
|&emsp;&emsp;isRequired|是否必答 (0=选答,1=必答)||false|integer(int32)||
|&emsp;&emsp;startTime|题目可作答开始时间||false|string(date-time)||
|&emsp;&emsp;endTime|题目作答截止时间||false|string(date-time)||


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


## removeClassroomPractice


**接口地址**:`/api/classroom/classroom-practice/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除课堂已发布的练习题目</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|发布记录ID|path|true|string(uuid)||


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


## addClassroomPractice


**接口地址**:`/api/classroom/classroom-practice/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>发布课堂练习题目</p>



**请求示例**:


```javascript
{
  "id": "",
  "classroomId": "",
  "questionId": "",
  "publishOrder": 0,
  "score": 0,
  "isRequired": 0,
  "startTime": "",
  "endTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|classroomQuestionDTO|课堂练习发布与更新DTO|body|true|ClassroomQuestionDTO|ClassroomQuestionDTO|
|&emsp;&emsp;id|记录ID（更新时必填）||false|string(uuid)||
|&emsp;&emsp;classroomId|课堂记录ID||true|string(uuid)||
|&emsp;&emsp;questionId|题目ID||true|string(uuid)||
|&emsp;&emsp;publishOrder|发布顺序||false|integer(int32)||
|&emsp;&emsp;score|题目分值||false|number(float)||
|&emsp;&emsp;isRequired|是否必答 (0=选答,1=必答)||false|integer(int32)||
|&emsp;&emsp;startTime|题目可作答开始时间||false|string(date-time)||
|&emsp;&emsp;endTime|题目作答截止时间||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultClassroomQuestionVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||ClassroomQuestionVO|ClassroomQuestionVO|
|&emsp;&emsp;id|记录ID|string(uuid)||
|&emsp;&emsp;classroomId|课堂记录ID|string(uuid)||
|&emsp;&emsp;questionId|题目ID|string(uuid)||
|&emsp;&emsp;publishOrder|发布顺序|integer(int32)||
|&emsp;&emsp;score|题目分值|number(float)||
|&emsp;&emsp;isRequired|是否必答 (0=选答,1=必答)|integer(int32)||
|&emsp;&emsp;startTime|题目可作答开始时间|string(date-time)||
|&emsp;&emsp;endTime|题目作答截止时间|string(date-time)||
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
		"classroomId": "",
		"questionId": "",
		"publishOrder": 0,
		"score": 0,
		"isRequired": 0,
		"startTime": "",
		"endTime": "",
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


## listByClassroomId


**接口地址**:`/api/classroom/classroom-practice/classroom/{classroomId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据课堂ID查询所有已发布练习</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|classroomId|课堂记录ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListClassroomQuestionVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|ClassroomQuestionVO|
|&emsp;&emsp;id|记录ID|string(uuid)||
|&emsp;&emsp;classroomId|课堂记录ID|string(uuid)||
|&emsp;&emsp;questionId|题目ID|string(uuid)||
|&emsp;&emsp;publishOrder|发布顺序|integer(int32)||
|&emsp;&emsp;score|题目分值|number(float)||
|&emsp;&emsp;isRequired|是否必答 (0=选答,1=必答)|integer(int32)||
|&emsp;&emsp;startTime|题目可作答开始时间|string(date-time)||
|&emsp;&emsp;endTime|题目作答截止时间|string(date-time)||
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
			"classroomId": "",
			"questionId": "",
			"publishOrder": 0,
			"score": 0,
			"isRequired": 0,
			"startTime": "",
			"endTime": "",
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


## listClassroomPractice


**接口地址**:`/api/classroom/classroom-practice/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据条件分页查询课堂内练习发布记录</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|classroomId|课堂记录ID|query|false|string||
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


## listStudentSubmissions


**接口地址**:`/api/classroom/classroom-practice/submissions/{classroomId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取课堂内所有学生练习作答记录（教师统计）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|classroomId|课堂记录ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListObject|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": []
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
  "seatStatus": 0
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
|&emsp;&emsp;locationX|学生座位的x坐标||true|integer(int32)||
|&emsp;&emsp;locationY|学生座位的y坐标||true|integer(int32)||
|&emsp;&emsp;seatStatus|座位状态 (0=正常, 2=已预留, 3=已占用)||false|integer(int32)||


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
|&emsp;&emsp;seatIndex|座位编号 (从0开始)|integer(int32)||
|&emsp;&emsp;locationX|学生座位的x坐标|integer(int32)||
|&emsp;&emsp;locationY|学生座位的y坐标|integer(int32)||
|&emsp;&emsp;seatStatus|座位状态 (0=正常, 2=已预留, 3=已占用)|integer(int32)||
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
		"seatIndex": 0,
		"locationX": 0,
		"locationY": 0,
		"seatStatus": 0,
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
|&emsp;&emsp;seatIndex|座位编号 (从0开始)|integer(int32)||
|&emsp;&emsp;locationX|学生座位的x坐标|integer(int32)||
|&emsp;&emsp;locationY|学生座位的y坐标|integer(int32)||
|&emsp;&emsp;seatStatus|座位状态 (0=正常, 2=已预留, 3=已占用)|integer(int32)||
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
			"seatIndex": 0,
			"locationX": 0,
			"locationY": 0,
			"seatStatus": 0,
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
|seatStatus|座位状态 (0=正常, 2=已预留, 3=已占用)|query|false|string||
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
|&emsp;&emsp;seatIndex|座位编号 (从0开始)|integer(int32)||
|&emsp;&emsp;locationX|学生座位的x坐标|integer(int32)||
|&emsp;&emsp;locationY|学生座位的y坐标|integer(int32)||
|&emsp;&emsp;seatStatus|座位状态 (0=正常, 2=已预留, 3=已占用)|integer(int32)||
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
			"seatIndex": 0,
			"locationX": 0,
			"locationY": 0,
			"seatStatus": 0,
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
|&emsp;&emsp;seatIndex|座位编号 (从0开始)|integer(int32)||
|&emsp;&emsp;locationX|学生座位的x坐标|integer(int32)||
|&emsp;&emsp;locationY|学生座位的y坐标|integer(int32)||
|&emsp;&emsp;seatStatus|座位状态 (0=正常, 2=已预留, 3=已占用)|integer(int32)||
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
		"seatIndex": 0,
		"locationX": 0,
		"locationY": 0,
		"seatStatus": 0,
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
  "seatStatus": 0
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
|&emsp;&emsp;locationX|学生座位的x坐标||true|integer(int32)||
|&emsp;&emsp;locationY|学生座位的y坐标||true|integer(int32)||
|&emsp;&emsp;seatStatus|座位状态 (0=正常, 2=已预留, 3=已占用)||false|integer(int32)||


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