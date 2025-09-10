# SapientiaCloud-EduPivot--course API

**简介**:SapientiaCloud-EduPivot--course API

**HOST**:http://192.168.37.249:31606

**联系人**:DaYZ

**Version**:1.0.0

**接口路径**:/api/course/v3/api-docs

[TOC]

# 课程管理

## updateCourse

**接口地址**:`/api/course/`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>修改现有课程的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseName": "",
  "teacherId": "",
  "assistantTeacherIds": [],
  "description": "",
  "coverImageUrl": "",
  "semester": "",
  "location": "",
  "courseType": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                            | 参数说明              | 请求类型 | 是否必须  | 数据类型           | schema       |
|---------------------------------|-------------------|------|-------|----------------|--------------|
| courseDTO                       | 课程信息数据传输对象        | body | true  | CourseDTO      | CourseDTO    |
| &emsp;&emsp;id                  | 课程ID，更新时必须提供      |      | false | string(uuid)   |              |
| &emsp;&emsp;courseName          | 课程名称              |      | true  | string         |              |
| &emsp;&emsp;teacherId           | 授课教师ID            |      | true  | string(uuid)   |              |
| &emsp;&emsp;assistantTeacherIds | 辅助教学教师ID列表        |      | false | array          | string(uuid) |
| &emsp;&emsp;description         | 课程描述              |      | false | string         |              |
| &emsp;&emsp;coverImageUrl       | 课程封面图片URL         |      | false | string         |              |
| &emsp;&emsp;semester            | 开设学期              |      | false | string         |              |
| &emsp;&emsp;location            | 上课地点              |      | false | string         |              |
| &emsp;&emsp;courseType          | 课程类型 (0=必修, 1=选修) |      | false | integer(int32) |              |
| &emsp;&emsp;status              | 课程状态 (0=正常, 1=停课) |      | false | integer(int32) |              |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## removeCourseByIds

**接口地址**:`/api/course/`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>根据课程ID列表批量删除课程。</p>

**请求示例**:

```javascript
[]
```

**请求参数**:

| 参数名称    | 参数说明   | 请求类型 | 是否必须 | 数据类型  | schema |
|---------|--------|------|------|-------|--------|
| strings | string | body | true | array |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultInteger         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | integer(int32) | integer(int32) |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## enrollStudentToCourse

**接口地址**:`/api/course/{courseId}/enroll`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>学生根据课程ID加入课程。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|-----------|------|-------|------|--------------|--------|
| courseId  | 课程ID | path  | true | string(uuid) |        |
| studentId | 学生ID | query | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## assignTeacher

**接口地址**:`/api/course/{courseId}/teacher`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>为指定课程分配教师。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|-----------|------|-------|------|--------------|--------|
| courseId  | 课程ID | path  | true | string(uuid) |        |
| teacherId | 教师ID | query | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## assignCourseTeacherTeam

**接口地址**:`/api/course/{courseId}/teachers`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>为指定课程分配教师团队。</p>

**请求示例**:

```javascript
[]
```

**请求参数**:

| 参数名称     | 参数说明   | 请求类型 | 是否必须 | 数据类型         | schema |
|----------|--------|------|------|--------------|--------|
| courseId | 课程ID   | path | true | string(uuid) |        |
| strings  | string | body | true | array        |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## assignCourseTeachers

**接口地址**:`/api/course/{courseId}/teachers/assign`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>为指定课程批量分配教师团队，支持添加和移除教师。</p>

**请求示例**:

```javascript
[]
```

**请求参数**:

| 参数名称     | 参数说明   | 请求类型 | 是否必须 | 数据类型         | schema |
|----------|--------|------|------|--------------|--------|
| courseId | 课程ID   | path | true | string(uuid) |        |
| strings  | string | body | true | array        |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## getCourseById

**接口地址**:`/api/course/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过课程的唯一ID获取其详细信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 课程ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseVO        |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                            | 参数说明              | 类型                | schema         |
|---------------------------------|-------------------|-------------------|----------------| 
| success                         | 请求是否成功            | boolean           |                |
| code                            | 业务状态码 (200表示成功)   | integer(int32)    | integer(int32) |
| message                         | 响应消息              | string            |                |
| data                            |                   | CourseVO          | CourseVO       |
| &emsp;&emsp;id                  | 课程ID              | string(uuid)      |                |
| &emsp;&emsp;courseName          | 课程名称              | string            |                |
| &emsp;&emsp;description         | 课程描述              | string            |                |
| &emsp;&emsp;courseType          | 课程类型 (0=必修, 1=选修) | integer(int32)    |                |
| &emsp;&emsp;semester            | 开设学期              | string            |                |
| &emsp;&emsp;location            | 上课地点              | string            |                |
| &emsp;&emsp;teacherId           | 授课教师ID            | string(uuid)      |                |
| &emsp;&emsp;teacherName         | 授课教师姓名            | string            |                |
| &emsp;&emsp;assistantTeacherIds | 辅助教学教师ID列表        | array             | string(uuid)   |
| &emsp;&emsp;coverImageUrl       | 课程封面图片URL         | string            |                |
| &emsp;&emsp;status              | 课程状态 (0=正常, 1=停课) | integer(int32)    |                |
| &emsp;&emsp;createTime          | 创建时间              | string(date-time) |                |
| &emsp;&emsp;updateTime          | 更新时间              | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseName": "",
		"description": "",
		"courseType": 0,
		"semester": "",
		"location": "",
		"teacherId": "",
		"teacherName": "",
		"assistantTeacherIds": [],
		"coverImageUrl": "",
		"status": 0,
		"createTime": "",
		"updateTime": ""
	}
}
```

**响应状态码-400**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## removeCourseById

**接口地址**:`/api/course/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据课程ID从系统中移除课程。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 课程ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## addCourse

**接口地址**:`/api/course/add`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>管理员添加系统课程</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseName": "",
  "teacherId": "",
  "assistantTeacherIds": [],
  "description": "",
  "coverImageUrl": "",
  "semester": "",
  "location": "",
  "courseType": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                            | 参数说明              | 请求类型 | 是否必须  | 数据类型           | schema       |
|---------------------------------|-------------------|------|-------|----------------|--------------|
| courseDTO                       | 课程信息数据传输对象        | body | true  | CourseDTO      | CourseDTO    |
| &emsp;&emsp;id                  | 课程ID，更新时必须提供      |      | false | string(uuid)   |              |
| &emsp;&emsp;courseName          | 课程名称              |      | true  | string         |              |
| &emsp;&emsp;teacherId           | 授课教师ID            |      | true  | string(uuid)   |              |
| &emsp;&emsp;assistantTeacherIds | 辅助教学教师ID列表        |      | false | array          | string(uuid) |
| &emsp;&emsp;description         | 课程描述              |      | false | string         |              |
| &emsp;&emsp;coverImageUrl       | 课程封面图片URL         |      | false | string         |              |
| &emsp;&emsp;semester            | 开设学期              |      | false | string         |              |
| &emsp;&emsp;location            | 上课地点              |      | false | string         |              |
| &emsp;&emsp;courseType          | 课程类型 (0=必修, 1=选修) |      | false | integer(int32) |              |
| &emsp;&emsp;status              | 课程状态 (0=正常, 1=停课) |      | false | integer(int32) |              |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseVO        |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                            | 参数说明              | 类型                | schema         |
|---------------------------------|-------------------|-------------------|----------------| 
| success                         | 请求是否成功            | boolean           |                |
| code                            | 业务状态码 (200表示成功)   | integer(int32)    | integer(int32) |
| message                         | 响应消息              | string            |                |
| data                            |                   | CourseVO          | CourseVO       |
| &emsp;&emsp;id                  | 课程ID              | string(uuid)      |                |
| &emsp;&emsp;courseName          | 课程名称              | string            |                |
| &emsp;&emsp;description         | 课程描述              | string            |                |
| &emsp;&emsp;courseType          | 课程类型 (0=必修, 1=选修) | integer(int32)    |                |
| &emsp;&emsp;semester            | 开设学期              | string            |                |
| &emsp;&emsp;location            | 上课地点              | string            |                |
| &emsp;&emsp;teacherId           | 授课教师ID            | string(uuid)      |                |
| &emsp;&emsp;teacherName         | 授课教师姓名            | string            |                |
| &emsp;&emsp;assistantTeacherIds | 辅助教学教师ID列表        | array             | string(uuid)   |
| &emsp;&emsp;coverImageUrl       | 课程封面图片URL         | string            |                |
| &emsp;&emsp;status              | 课程状态 (0=正常, 1=停课) | integer(int32)    |                |
| &emsp;&emsp;createTime          | 创建时间              | string(date-time) |                |
| &emsp;&emsp;updateTime          | 更新时间              | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseName": "",
		"description": "",
		"courseType": 0,
		"semester": "",
		"location": "",
		"teacherId": "",
		"teacherName": "",
		"assistantTeacherIds": [],
		"coverImageUrl": "",
		"status": 0,
		"createTime": "",
		"updateTime": ""
	}
}
```

**响应状态码-400**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listAllCourse

**接口地址**:`/api/course/all`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取所有课程列表。</p>

**请求参数**:

暂无

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultListCourseVO    |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                            | 参数说明              | 类型                | schema         |
|---------------------------------|-------------------|-------------------|----------------| 
| success                         | 请求是否成功            | boolean           |                |
| code                            | 业务状态码 (200表示成功)   | integer(int32)    | integer(int32) |
| message                         | 响应消息              | string            |                |
| data                            | 响应数据体 (泛型)        | array             | CourseVO       |
| &emsp;&emsp;id                  | 课程ID              | string(uuid)      |                |
| &emsp;&emsp;courseName          | 课程名称              | string            |                |
| &emsp;&emsp;description         | 课程描述              | string            |                |
| &emsp;&emsp;courseType          | 课程类型 (0=必修, 1=选修) | integer(int32)    |                |
| &emsp;&emsp;semester            | 开设学期              | string            |                |
| &emsp;&emsp;location            | 上课地点              | string            |                |
| &emsp;&emsp;teacherId           | 授课教师ID            | string(uuid)      |                |
| &emsp;&emsp;teacherName         | 授课教师姓名            | string            |                |
| &emsp;&emsp;assistantTeacherIds | 辅助教学教师ID列表        | array             | string(uuid)   |
| &emsp;&emsp;coverImageUrl       | 课程封面图片URL         | string            |                |
| &emsp;&emsp;status              | 课程状态 (0=正常, 1=停课) | integer(int32)    |                |
| &emsp;&emsp;createTime          | 创建时间              | string(date-time) |                |
| &emsp;&emsp;updateTime          | 更新时间              | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"courseName": "",
			"description": "",
			"courseType": 0,
			"semester": "",
			"location": "",
			"teacherId": "",
			"teacherName": "",
			"assistantTeacherIds": [],
			"coverImageUrl": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```

**响应状态码-400**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listCourse

**接口地址**:`/api/course/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据传入的条件分页查询课程信息。支持根据课程名称、课程代码、课程类型、学期、学年、教师等字段进行模糊查询。</p>

**请求参数**:

| 参数名称          | 参数说明               | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|--------------------|-------|-------|--------|--------|
| courseName    | 课程名称（模糊查询）         | query | false | string |        |
| teacherId     | 授课教师ID             | query | false | string |        |
| semester      | 学期                 | query | false | string |        |
| courseType    | 课程类型               | query | false | string |        |
| location      | 上课地点               | query | false | string |        |
| status        | 课程状态 (0=正常, 1=停课)  | query | false | string |        |
| studentId     | 学生ID               | query | false | string |        |
| startTime     | 起始时间               | query | false | string |        |
| endTime       | 结束时间               | query | false | string |        |
| pageNum       | 当前记录起始索引           | query | false | string |        |
| pageSize      | 每页显示记录数            | query | false | string |        |
| orderByColumn | 排序列                | query | false | string |        |
| isAsc         | 排序的方向,可用值:asc,desc | query | false | string |        |
| reasonable    | 分页参数合理化            | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | TableDataResult       |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明  | 类型             | schema         |
|---------|-------|----------------|----------------| 
| total   | 总记录数  | integer(int64) | integer(int64) |
| data    | 列表数据  | array          |                |
| code    | 消息状态码 | integer(int32) | integer(int32) |
| message | 消息内容  | string         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listAllCourseByStudentId

**接口地址**:`/api/course/student/{studentId}/all`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取学生已选择的所有课程。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|-----------|------|------|------|--------------|--------|
| studentId | 学生ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultListCourseVO    |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                            | 参数说明              | 类型                | schema         |
|---------------------------------|-------------------|-------------------|----------------| 
| success                         | 请求是否成功            | boolean           |                |
| code                            | 业务状态码 (200表示成功)   | integer(int32)    | integer(int32) |
| message                         | 响应消息              | string            |                |
| data                            | 响应数据体 (泛型)        | array             | CourseVO       |
| &emsp;&emsp;id                  | 课程ID              | string(uuid)      |                |
| &emsp;&emsp;courseName          | 课程名称              | string            |                |
| &emsp;&emsp;description         | 课程描述              | string            |                |
| &emsp;&emsp;courseType          | 课程类型 (0=必修, 1=选修) | integer(int32)    |                |
| &emsp;&emsp;semester            | 开设学期              | string            |                |
| &emsp;&emsp;location            | 上课地点              | string            |                |
| &emsp;&emsp;teacherId           | 授课教师ID            | string(uuid)      |                |
| &emsp;&emsp;teacherName         | 授课教师姓名            | string            |                |
| &emsp;&emsp;assistantTeacherIds | 辅助教学教师ID列表        | array             | string(uuid)   |
| &emsp;&emsp;coverImageUrl       | 课程封面图片URL         | string            |                |
| &emsp;&emsp;status              | 课程状态 (0=正常, 1=停课) | integer(int32)    |                |
| &emsp;&emsp;createTime          | 创建时间              | string(date-time) |                |
| &emsp;&emsp;updateTime          | 更新时间              | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"courseName": "",
			"description": "",
			"courseType": 0,
			"semester": "",
			"location": "",
			"teacherId": "",
			"teacherName": "",
			"assistantTeacherIds": [],
			"coverImageUrl": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```

**响应状态码-400**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listCourseByStudentId

**接口地址**:`/api/course/student/page`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>分页获取学生已选择的所有课程。</p>

**请求参数**:

| 参数名称          | 参数说明               | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|--------------------|-------|-------|--------|--------|
| studentId     | 学生ID               | query | false | string |        |
| courseId      | 课程ID               | query | false | string |        |
| startTime     | 起始时间               | query | false | string |        |
| endTime       | 结束时间               | query | false | string |        |
| pageNum       | 当前记录起始索引           | query | false | string |        |
| pageSize      | 每页显示记录数            | query | false | string |        |
| orderByColumn | 排序列                | query | false | string |        |
| isAsc         | 排序的方向,可用值:asc,desc | query | false | string |        |
| reasonable    | 分页参数合理化            | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | TableDataResult       |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明  | 类型             | schema         |
|---------|-------|----------------|----------------| 
| total   | 总记录数  | integer(int64) | integer(int64) |
| data    | 列表数据  | array          |                |
| code    | 消息状态码 | integer(int32) | integer(int32) |
| message | 消息内容  | string         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listAllCourseByTeacherId

**接口地址**:`/api/course/teacher/{teacherId}/all`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取教师作为负责人或教学团队成员的所有课程。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|-----------|------|------|------|--------------|--------|
| teacherId | 教师ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultListCourseVO    |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                            | 参数说明              | 类型                | schema         |
|---------------------------------|-------------------|-------------------|----------------| 
| success                         | 请求是否成功            | boolean           |                |
| code                            | 业务状态码 (200表示成功)   | integer(int32)    | integer(int32) |
| message                         | 响应消息              | string            |                |
| data                            | 响应数据体 (泛型)        | array             | CourseVO       |
| &emsp;&emsp;id                  | 课程ID              | string(uuid)      |                |
| &emsp;&emsp;courseName          | 课程名称              | string            |                |
| &emsp;&emsp;description         | 课程描述              | string            |                |
| &emsp;&emsp;courseType          | 课程类型 (0=必修, 1=选修) | integer(int32)    |                |
| &emsp;&emsp;semester            | 开设学期              | string            |                |
| &emsp;&emsp;location            | 上课地点              | string            |                |
| &emsp;&emsp;teacherId           | 授课教师ID            | string(uuid)      |                |
| &emsp;&emsp;teacherName         | 授课教师姓名            | string            |                |
| &emsp;&emsp;assistantTeacherIds | 辅助教学教师ID列表        | array             | string(uuid)   |
| &emsp;&emsp;coverImageUrl       | 课程封面图片URL         | string            |                |
| &emsp;&emsp;status              | 课程状态 (0=正常, 1=停课) | integer(int32)    |                |
| &emsp;&emsp;createTime          | 创建时间              | string(date-time) |                |
| &emsp;&emsp;updateTime          | 更新时间              | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"courseName": "",
			"description": "",
			"courseType": 0,
			"semester": "",
			"location": "",
			"teacherId": "",
			"teacherName": "",
			"assistantTeacherIds": [],
			"coverImageUrl": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```

**响应状态码-400**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listCourseByTeacherId

**接口地址**:`/api/course/teacher/page`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>分页获取教师作为负责人或教学团队成员的所有课程。</p>

**请求参数**:

| 参数名称          | 参数说明               | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|--------------------|-------|-------|--------|--------|
| teacherId     | 教师ID               | query | true  | string |        |
| startTime     | 起始时间               | query | false | string |        |
| endTime       | 结束时间               | query | false | string |        |
| pageNum       | 当前记录起始索引           | query | false | string |        |
| pageSize      | 每页显示记录数            | query | false | string |        |
| orderByColumn | 排序列                | query | false | string |        |
| isAsc         | 排序的方向,可用值:asc,desc | query | false | string |        |
| reasonable    | 分页参数合理化            | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | TableDataResult       |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明  | 类型             | schema         |
|---------|-------|----------------|----------------| 
| total   | 总记录数  | integer(int64) | integer(int64) |
| data    | 列表数据  | array          |                |
| code    | 消息状态码 | integer(int32) | integer(int32) |
| message | 消息内容  | string         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

# 课程学生管理

## isEnrolled

**接口地址**:`/api/course/course-student/check-enrolled`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>检查学生是否已经选择了指定的课程。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|-----------|------|-------|------|--------------|--------|
| studentId | 学生ID | query | true | string(uuid) |        |
| courseId  | 课程ID | query | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listAllCourseStudentByCourseId

**接口地址**:`/api/course/course-student/course/{courseId}/all`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据课程ID获取所有选课学生。</p>

**请求参数**:

| 参数名称     | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|----------|------|------|------|--------------|--------|
| courseId | 课程ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                    |
|-----|-------------|---------------------------| 
| 200 | OK          | ResultListCourseStudentVO |
| 400 | Bad Request | ResultMapStringString     |
| 403 | Forbidden   | ResultString              |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                      | 类型                | schema          |
|----------------------------|---------------------------|-------------------|-----------------| 
| success                    | 请求是否成功                    | boolean           |                 |
| code                       | 业务状态码 (200表示成功)           | integer(int32)    | integer(int32)  |
| message                    | 响应消息                      | string            |                 |
| data                       | 响应数据体 (泛型)                | array             | CourseStudentVO |
| &emsp;&emsp;studentId      | 学生ID                      | string(uuid)      |                 |
| &emsp;&emsp;courseId       | 课程ID                      | string(uuid)      |                 |
| &emsp;&emsp;grade          | 成绩                        | number            |                 |
| &emsp;&emsp;enrollmentDate | 选课日期                      | string(date)      |                 |
| &emsp;&emsp;status         | 选课状态 (0=在读, 1=已退课, 2=已完成) | integer(int32)    |                 |
| &emsp;&emsp;createTime     | 创建时间                      | string(date-time) |                 |
| &emsp;&emsp;updateTime     | 更新时间                      | string(date-time) |                 |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"studentId": "",
			"courseId": "",
			"grade": 0,
			"enrollmentDate": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```

**响应状态码-400**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listCourseStudentByCourseId

**接口地址**:`/api/course/course-student/course/page`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据课程ID分页查询选课学生。</p>

**请求参数**:

| 参数名称          | 参数说明               | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|--------------------|-------|-------|--------|--------|
| studentId     | 学生ID               | query | false | string |        |
| courseId      | 课程ID               | query | false | string |        |
| startTime     | 起始时间               | query | false | string |        |
| endTime       | 结束时间               | query | false | string |        |
| pageNum       | 当前记录起始索引           | query | false | string |        |
| pageSize      | 每页显示记录数            | query | false | string |        |
| orderByColumn | 排序列                | query | false | string |        |
| isAsc         | 排序的方向,可用值:asc,desc | query | false | string |        |
| reasonable    | 分页参数合理化            | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | TableDataResult       |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明  | 类型             | schema         |
|---------|-------|----------------|----------------| 
| total   | 总记录数  | integer(int64) | integer(int64) |
| data    | 列表数据  | array          |                |
| code    | 消息状态码 | integer(int32) | integer(int32) |
| message | 消息内容  | string         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## dropCourse

**接口地址**:`/api/course/course-student/drop`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>学生退出已选的课程。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|-----------|------|-------|------|--------------|--------|
| studentId | 学生ID | query | true | string(uuid) |        |
| courseId  | 课程ID | query | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## enrollCourse

**接口地址**:`/api/course/course-student/enroll`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>学生选择某门课程。</p>

**请求示例**:

```javascript
{
  "studentId": "",
  "courseId": "",
  "grade": 0,
  "enrollmentDate": "",
  "status": 0
}
```

**请求参数**:

| 参数名称                       | 参数说明                      | 请求类型 | 是否必须  | 数据类型             | schema           |
|----------------------------|---------------------------|------|-------|------------------|------------------|
| courseStudentDTO           | 课程学生数据传输对象                | body | true  | CourseStudentDTO | CourseStudentDTO |
| &emsp;&emsp;studentId      | 学生ID                      |      | true  | string(uuid)     |                  |
| &emsp;&emsp;courseId       | 课程ID                      |      | true  | string(uuid)     |                  |
| &emsp;&emsp;grade          | 成绩                        |      | false | number           |                  |
| &emsp;&emsp;enrollmentDate | 选课日期                      |      | false | string(date)     |                  |
| &emsp;&emsp;status         | 选课状态 (0=在读, 1=已退课, 2=已完成) |      | false | integer(int32)   |                  |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## getStudentGrade

**接口地址**:`/api/course/course-student/grade`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取学生在指定课程中的成绩。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|-----------|------|-------|------|--------------|--------|
| studentId | 学生ID | query | true | string(uuid) |        |
| courseId  | 课程ID | query | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBigDecimal      |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | number         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## updateGrade

**接口地址**:`/api/course/course-student/grade`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>更新学生在某门课程的成绩。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|-----------|------|-------|------|--------------|--------|
| studentId | 学生ID | query | true | string(uuid) |        |
| courseId  | 课程ID | query | true | string(uuid) |        |
| grade     | 成绩   | query | true | number       |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultBoolean         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | boolean        |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## batchUpdateGrade

**接口地址**:`/api/course/course-student/grade/batch`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>批量更新多个学生的课程成绩。</p>

**请求示例**:

```javascript
[
  {
    "studentId": "",
    "courseId": "",
    "grade": 0,
    "enrollmentDate": "",
    "status": 0
  }
]
```

**请求参数**:

| 参数名称                       | 参数说明                      | 请求类型 | 是否必须  | 数据类型           | schema           |
|----------------------------|---------------------------|------|-------|----------------|------------------|
| courseStudentDTOs          | 课程学生数据传输对象                | body | true  | array          | CourseStudentDTO |
| &emsp;&emsp;studentId      | 学生ID                      |      | true  | string(uuid)   |                  |
| &emsp;&emsp;courseId       | 课程ID                      |      | true  | string(uuid)   |                  |
| &emsp;&emsp;grade          | 成绩                        |      | false | number         |                  |
| &emsp;&emsp;enrollmentDate | 选课日期                      |      | false | string(date)   |                  |
| &emsp;&emsp;status         | 选课状态 (0=在读, 1=已退课, 2=已完成) |      | false | integer(int32) |                  |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultInteger         |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | integer(int32) | integer(int32) |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listCourseStudentByStudentId

**接口地址**:`/api/course/course-student/student/{studentId}/all`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据学生ID获取所有选课记录。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|-----------|------|------|------|--------------|--------|
| studentId | 学生ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                    |
|-----|-------------|---------------------------| 
| 200 | OK          | ResultListCourseStudentVO |
| 400 | Bad Request | ResultMapStringString     |
| 403 | Forbidden   | ResultString              |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                      | 类型                | schema          |
|----------------------------|---------------------------|-------------------|-----------------| 
| success                    | 请求是否成功                    | boolean           |                 |
| code                       | 业务状态码 (200表示成功)           | integer(int32)    | integer(int32)  |
| message                    | 响应消息                      | string            |                 |
| data                       | 响应数据体 (泛型)                | array             | CourseStudentVO |
| &emsp;&emsp;studentId      | 学生ID                      | string(uuid)      |                 |
| &emsp;&emsp;courseId       | 课程ID                      | string(uuid)      |                 |
| &emsp;&emsp;grade          | 成绩                        | number            |                 |
| &emsp;&emsp;enrollmentDate | 选课日期                      | string(date)      |                 |
| &emsp;&emsp;status         | 选课状态 (0=在读, 1=已退课, 2=已完成) | integer(int32)    |                 |
| &emsp;&emsp;createTime     | 创建时间                      | string(date-time) |                 |
| &emsp;&emsp;updateTime     | 更新时间                      | string(date-time) |                 |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"studentId": "",
			"courseId": "",
			"grade": 0,
			"enrollmentDate": "",
			"status": 0,
			"createTime": "",
			"updateTime": ""
		}
	]
}
```

**响应状态码-400**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```

## listCourseStudentByStudentId

**接口地址**:`/api/course/course-student/student/page`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据学生ID分页查询选课记录。</p>

**请求参数**:

| 参数名称          | 参数说明               | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|--------------------|-------|-------|--------|--------|
| studentId     | 学生ID               | query | false | string |        |
| courseId      | 课程ID               | query | false | string |        |
| startTime     | 起始时间               | query | false | string |        |
| endTime       | 结束时间               | query | false | string |        |
| pageNum       | 当前记录起始索引           | query | false | string |        |
| pageSize      | 每页显示记录数            | query | false | string |        |
| orderByColumn | 排序列                | query | false | string |        |
| isAsc         | 排序的方向,可用值:asc,desc | query | false | string |        |
| reasonable    | 分页参数合理化            | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | TableDataResult       |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明  | 类型             | schema         |
|---------|-------|----------------|----------------| 
| total   | 总记录数  | integer(int64) | integer(int64) |
| data    | 列表数据  | array          |                |
| code    | 消息状态码 | integer(int32) | integer(int32) |
| message | 消息内容  | string         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | object         |                |

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

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | string         |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": ""
}
```