# SapientiaCloud-EduPivot--course API

**简介**:SapientiaCloud-EduPivot--course API

**HOST**:http://172.16.0.10:31606

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
| &emsp;&emsp;teacherAvatar       | 授课教师头像            | string            |                |
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
		"teacherAvatar": "",
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
| &emsp;&emsp;teacherAvatar       | 授课教师头像            | string            |                |
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
		"teacherAvatar": "",
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
| &emsp;&emsp;teacherAvatar       | 授课教师头像            | string            |                |
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
			"teacherAvatar": "",
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

# 课程教师管理

## assignTeacher

**接口地址**:`/api/course/course-teacher/{courseId}/teacher`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>为指定课程分配主讲教师。</p>

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

## assignCourseTeachers

**接口地址**:`/api/course/course-teacher/{courseId}/teachers/assign`

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

## listAllTeacherByCourseId

**接口地址**:`/api/course/course-teacher/course/{courseId}/all`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取课程下的所有教师。</p>

**请求参数**:

| 参数名称     | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|----------|------|------|------|--------------|--------|
| courseId | 课程ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultListTeacherVO   |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                        | 类型                | schema         |
|----------------------------|-----------------------------|-------------------|----------------| 
| success                    | 请求是否成功                      | boolean           |                |
| code                       | 业务状态码 (200表示成功)             | integer(int32)    | integer(int32) |
| message                    | 响应消息                        | string            |                |
| data                       | 响应数据体 (泛型)                  | array             | TeacherVO      |
| &emsp;&emsp;id             | 教师ID                        | string(uuid)      |                |
| &emsp;&emsp;teacherCode    | 教师工号                        | string            |                |
| &emsp;&emsp;realName       | 教师真实姓名                      | string            |                |
| &emsp;&emsp;birthDate      | 出生日期                        | string(date)      |                |
| &emsp;&emsp;department     | 所属部门/学院                     | string            |                |
| &emsp;&emsp;education      | 学历 (0=专科, 1=本科, 2=硕士, 3=博士) | integer(int32)    |                |
| &emsp;&emsp;specialization | 专业特长/研究方向                   | string            |                |
| &emsp;&emsp;description    | 自我描述                        | string            |                |
| &emsp;&emsp;sysUserId      | 系统用户ID                      | string(uuid)      |                |
| &emsp;&emsp;avatar         | 用户头像URL                     | string            |                |
| &emsp;&emsp;username       | 用户名                         | string            |                |
| &emsp;&emsp;nickName       | 用户昵称                        | string            |                |
| &emsp;&emsp;email          | 邮箱                          | string            |                |
| &emsp;&emsp;mobile         | 手机号                         | string            |                |
| &emsp;&emsp;gender         | 性别 (0=未知, 1=男, 2=女)         | integer(int32)    |                |
| &emsp;&emsp;status         | 状态 (0=正常, 1=停用)             | integer(int32)    |                |
| &emsp;&emsp;createTime     | 创建时间                        | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                        | string(date-time) |                |
| &emsp;&emsp;lastLoginTime  | 最后登录时间                      | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"teacherCode": "",
			"realName": "",
			"birthDate": "",
			"department": "",
			"education": 0,
			"specialization": "",
			"description": "",
			"sysUserId": "",
			"avatar": "",
			"username": "",
			"nickName": "",
			"email": "",
			"mobile": "",
			"gender": 0,
			"status": 0,
			"createTime": "",
			"updateTime": "",
			"lastLoginTime": ""
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

**接口地址**:`/api/course/course-teacher/teacher`

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

## listAllCourseByTeacherId

**接口地址**:`/api/course/course-teacher/teacher/{teacherId}/all`

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
| &emsp;&emsp;teacherAvatar       | 授课教师头像            | string            |                |
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
			"teacherAvatar": "",
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

# 课程论坛回复管理

## updateThreadReply

**接口地址**:`/api/course/course-thread/reply`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>修改现有论坛回复的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "threadId": "",
  "userId": "",
  "parentReplyId": "",
  "content": ""
}
```

**请求参数**:

| 参数名称                      | 参数说明               | 请求类型 | 是否必须  | 数据类型           | schema         |
|---------------------------|--------------------|------|-------|----------------|----------------|
| threadReplyDTO            | 课程论坛回复数据传输对象 (DTO) | body | true  | ThreadReplyDTO | ThreadReplyDTO |
| &emsp;&emsp;id            | 回复ID (更新时必填)       |      | false | string(uuid)   |                |
| &emsp;&emsp;threadId      | 所属主贴ID             |      | true  | string(uuid)   |                |
| &emsp;&emsp;userId        | 回复用户ID             |      | true  | string(uuid)   |                |
| &emsp;&emsp;parentReplyId | 父回复ID (用于支持楼中楼回复)  |      | false | string(uuid)   |                |
| &emsp;&emsp;content       | 回复内容               |      | true  | string         |                |

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

## removeThreadReplyByIds

**接口地址**:`/api/course/course-thread/reply`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>根据回复ID列表批量删除回复。</p>

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

## getThreadReplyById

**接口地址**:`/api/course/course-thread/reply/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过回复的唯一ID获取其详细信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 回复ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultThreadReplyVO   |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                      | 参数说明            | 类型                | schema         |
|---------------------------|-----------------|-------------------|----------------| 
| success                   | 请求是否成功          | boolean           |                |
| code                      | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                   | 响应消息            | string            |                |
| data                      |                 | ThreadReplyVO     | ThreadReplyVO  |
| &emsp;&emsp;id            | 回复ID            | string(uuid)      |                |
| &emsp;&emsp;threadId      | 所属主贴ID          | string(uuid)      |                |
| &emsp;&emsp;userId        | 回复用户ID          | string(uuid)      |                |
| &emsp;&emsp;userName      | 回复用户名称          | string            |                |
| &emsp;&emsp;userAvatar    | 回复用户头像          | string            |                |
| &emsp;&emsp;parentReplyId | 父回复ID           | string(uuid)      |                |
| &emsp;&emsp;content       | 回复内容            | string            |                |
| &emsp;&emsp;createTime    | 创建时间            | string(date-time) |                |
| &emsp;&emsp;updateTime    | 更新时间            | string(date-time) |                |
| &emsp;&emsp;children      | 子回复列表           | array             | ThreadReplyVO  |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"threadId": "",
		"userId": "",
		"userName": "",
		"userAvatar": "",
		"parentReplyId": "",
		"content": "",
		"createTime": "",
		"updateTime": "",
		"children": [
			{
				"id": "",
				"threadId": "",
				"userId": "",
				"userName": "",
				"userAvatar": "",
				"parentReplyId": "",
				"content": "",
				"createTime": "",
				"updateTime": "",
				"children": [
					{}
				]
			}
		]
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

## removeThreadReplyById

**接口地址**:`/api/course/course-thread/reply/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据回复ID从系统中移除回复。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 回复ID | path | true | string(uuid) |        |

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

## addThreadReply

**接口地址**:`/api/course/course-thread/reply/add`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>发布新的论坛回复。</p>

**请求示例**:

```javascript
{
  "id": "",
  "threadId": "",
  "userId": "",
  "parentReplyId": "",
  "content": ""
}
```

**请求参数**:

| 参数名称                      | 参数说明               | 请求类型 | 是否必须  | 数据类型           | schema         |
|---------------------------|--------------------|------|-------|----------------|----------------|
| threadReplyDTO            | 课程论坛回复数据传输对象 (DTO) | body | true  | ThreadReplyDTO | ThreadReplyDTO |
| &emsp;&emsp;id            | 回复ID (更新时必填)       |      | false | string(uuid)   |                |
| &emsp;&emsp;threadId      | 所属主贴ID             |      | true  | string(uuid)   |                |
| &emsp;&emsp;userId        | 回复用户ID             |      | true  | string(uuid)   |                |
| &emsp;&emsp;parentReplyId | 父回复ID (用于支持楼中楼回复)  |      | false | string(uuid)   |                |
| &emsp;&emsp;content       | 回复内容               |      | true  | string         |                |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultThreadReplyVO   |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                      | 参数说明            | 类型                | schema         |
|---------------------------|-----------------|-------------------|----------------| 
| success                   | 请求是否成功          | boolean           |                |
| code                      | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                   | 响应消息            | string            |                |
| data                      |                 | ThreadReplyVO     | ThreadReplyVO  |
| &emsp;&emsp;id            | 回复ID            | string(uuid)      |                |
| &emsp;&emsp;threadId      | 所属主贴ID          | string(uuid)      |                |
| &emsp;&emsp;userId        | 回复用户ID          | string(uuid)      |                |
| &emsp;&emsp;userName      | 回复用户名称          | string            |                |
| &emsp;&emsp;userAvatar    | 回复用户头像          | string            |                |
| &emsp;&emsp;parentReplyId | 父回复ID           | string(uuid)      |                |
| &emsp;&emsp;content       | 回复内容            | string            |                |
| &emsp;&emsp;createTime    | 创建时间            | string(date-time) |                |
| &emsp;&emsp;updateTime    | 更新时间            | string(date-time) |                |
| &emsp;&emsp;children      | 子回复列表           | array             | ThreadReplyVO  |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"threadId": "",
		"userId": "",
		"userName": "",
		"userAvatar": "",
		"parentReplyId": "",
		"content": "",
		"createTime": "",
		"updateTime": "",
		"children": [
			{
				"id": "",
				"threadId": "",
				"userId": "",
				"userName": "",
				"userAvatar": "",
				"parentReplyId": "",
				"content": "",
				"createTime": "",
				"updateTime": "",
				"children": [
					{}
				]
			}
		]
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

## listThreadReply

**接口地址**:`/api/course/course-thread/reply/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据传入的条件分页查询论坛回复信息。支持根据主贴ID、用户ID、父回复ID等字段进行查询。</p>

**请求参数**:

| 参数名称          | 参数说明               | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|--------------------|-------|-------|--------|--------|
| threadId      | 所属主贴ID             | query | false | string |        |
| userId        | 回复用户ID             | query | false | string |        |
| parentReplyId | 父回复ID              | query | false | string |        |
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

## listThreadReplyTreeByThreadId

**接口地址**:`/api/course/course-thread/reply/tree/Thread/{threadId}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取指定课程ID下所有回复列表,并以树状结构返回。</p>

**请求参数**:

| 参数名称     | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|----------|------|------|------|--------------|--------|
| threadId | 主贴ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                  |
|-----|-------------|-------------------------| 
| 200 | OK          | ResultListThreadReplyVO |
| 400 | Bad Request | ResultMapStringString   |
| 403 | Forbidden   | ResultString            |

**响应状态码-200**:

**响应参数**:

| 参数名称                      | 参数说明            | 类型                | schema         |
|---------------------------|-----------------|-------------------|----------------| 
| success                   | 请求是否成功          | boolean           |                |
| code                      | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                   | 响应消息            | string            |                |
| data                      | 响应数据体 (泛型)      | array             | ThreadReplyVO  |
| &emsp;&emsp;id            | 回复ID            | string(uuid)      |                |
| &emsp;&emsp;threadId      | 所属主贴ID          | string(uuid)      |                |
| &emsp;&emsp;userId        | 回复用户ID          | string(uuid)      |                |
| &emsp;&emsp;userName      | 回复用户名称          | string            |                |
| &emsp;&emsp;userAvatar    | 回复用户头像          | string            |                |
| &emsp;&emsp;parentReplyId | 父回复ID           | string(uuid)      |                |
| &emsp;&emsp;content       | 回复内容            | string            |                |
| &emsp;&emsp;createTime    | 创建时间            | string(date-time) |                |
| &emsp;&emsp;updateTime    | 更新时间            | string(date-time) |                |
| &emsp;&emsp;children      | 子回复列表           | array             | ThreadReplyVO  |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"threadId": "",
			"userId": "",
			"userName": "",
			"userAvatar": "",
			"parentReplyId": "",
			"content": "",
			"createTime": "",
			"updateTime": "",
			"children": [
				{
					"id": "",
					"threadId": "",
					"userId": "",
					"userName": "",
					"userAvatar": "",
					"parentReplyId": "",
					"content": "",
					"createTime": "",
					"updateTime": "",
					"children": [
						{}
					]
				}
			]
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

# 课程论坛主贴管理

## updateCourseThread

**接口地址**:`/api/course/course-thread`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>修改现有论坛主贴的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseId": "",
  "userId": "",
  "title": "",
  "content": "",
  "isPinned": 0,
  "isClosed": 0
}
```

**请求参数**:

| 参数名称                 | 参数说明               | 请求类型 | 是否必须  | 数据类型            | schema          |
|----------------------|--------------------|------|-------|-----------------|-----------------|
| courseThreadDTO      | 课程论坛主贴数据传输对象 (DTO) | body | true  | CourseThreadDTO | CourseThreadDTO |
| &emsp;&emsp;id       | 主贴ID (更新时必填)       |      | false | string(uuid)    |                 |
| &emsp;&emsp;courseId | 所属课程ID             |      | true  | string(uuid)    |                 |
| &emsp;&emsp;userId   | 发帖用户ID             |      | true  | string(uuid)    |                 |
| &emsp;&emsp;title    | 帖子标题               |      | true  | string          |                 |
| &emsp;&emsp;content  | 帖子内容               |      | true  | string          |                 |
| &emsp;&emsp;isPinned | 是否置顶 (1=是, 0=否)    |      | false | integer(int32)  |                 |
| &emsp;&emsp;isClosed | 是否关闭/锁定 (1=是, 0=否) |      | false | integer(int32)  |                 |

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

## removeCourseThreadByIds

**接口地址**:`/api/course/course-thread`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>根据主贴ID列表批量删除主贴。</p>

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

## getCourseThreadById

**接口地址**:`/api/course/course-thread/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过主贴的唯一ID获取其详细信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 主贴ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseThreadVO  |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                      | 参数说明            | 类型                | schema         |
|---------------------------|-----------------|-------------------|----------------| 
| success                   | 请求是否成功          | boolean           |                |
| code                      | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                   | 响应消息            | string            |                |
| data                      |                 | CourseThreadVO    | CourseThreadVO |
| &emsp;&emsp;id            | 主贴ID            | string(uuid)      |                |
| &emsp;&emsp;courseId      | 所属课程ID          | string(uuid)      |                |
| &emsp;&emsp;userId        | 发帖用户ID          | string(uuid)      |                |
| &emsp;&emsp;userName      | 发帖用户名称          | string            |                |
| &emsp;&emsp;userAvatar    | 发帖用户头像          | string            |                |
| &emsp;&emsp;title         | 帖子标题            | string            |                |
| &emsp;&emsp;content       | 帖子内容            | string            |                |
| &emsp;&emsp;pinned        | 是否置顶            | integer(int32)    |                |
| &emsp;&emsp;closed        | 是否关闭/锁定         | integer(int32)    |                |
| &emsp;&emsp;viewCount     | 浏览次数            | integer(int32)    |                |
| &emsp;&emsp;replyCount    | 回复总数            | integer(int32)    |                |
| &emsp;&emsp;lastReplyTime | 最后回复时间          | string(date-time) |                |
| &emsp;&emsp;createTime    | 创建时间            | string(date-time) |                |
| &emsp;&emsp;updateTime    | 更新时间            | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"userId": "",
		"userName": "",
		"userAvatar": "",
		"title": "",
		"content": "",
		"pinned": 0,
		"closed": 0,
		"viewCount": 0,
		"replyCount": 0,
		"lastReplyTime": "",
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

## removeCourseThreadById

**接口地址**:`/api/course/course-thread/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据主贴ID从系统中移除主贴。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 主贴ID | path | true | string(uuid) |        |

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

## addCourseThread

**接口地址**:`/api/course/course-thread/add`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>发布新的论坛主贴。</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseId": "",
  "userId": "",
  "title": "",
  "content": "",
  "isPinned": 0,
  "isClosed": 0
}
```

**请求参数**:

| 参数名称                 | 参数说明               | 请求类型 | 是否必须  | 数据类型            | schema          |
|----------------------|--------------------|------|-------|-----------------|-----------------|
| courseThreadDTO      | 课程论坛主贴数据传输对象 (DTO) | body | true  | CourseThreadDTO | CourseThreadDTO |
| &emsp;&emsp;id       | 主贴ID (更新时必填)       |      | false | string(uuid)    |                 |
| &emsp;&emsp;courseId | 所属课程ID             |      | true  | string(uuid)    |                 |
| &emsp;&emsp;userId   | 发帖用户ID             |      | true  | string(uuid)    |                 |
| &emsp;&emsp;title    | 帖子标题               |      | true  | string          |                 |
| &emsp;&emsp;content  | 帖子内容               |      | true  | string          |                 |
| &emsp;&emsp;isPinned | 是否置顶 (1=是, 0=否)    |      | false | integer(int32)  |                 |
| &emsp;&emsp;isClosed | 是否关闭/锁定 (1=是, 0=否) |      | false | integer(int32)  |                 |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseThreadVO  |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                      | 参数说明            | 类型                | schema         |
|---------------------------|-----------------|-------------------|----------------| 
| success                   | 请求是否成功          | boolean           |                |
| code                      | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                   | 响应消息            | string            |                |
| data                      |                 | CourseThreadVO    | CourseThreadVO |
| &emsp;&emsp;id            | 主贴ID            | string(uuid)      |                |
| &emsp;&emsp;courseId      | 所属课程ID          | string(uuid)      |                |
| &emsp;&emsp;userId        | 发帖用户ID          | string(uuid)      |                |
| &emsp;&emsp;userName      | 发帖用户名称          | string            |                |
| &emsp;&emsp;userAvatar    | 发帖用户头像          | string            |                |
| &emsp;&emsp;title         | 帖子标题            | string            |                |
| &emsp;&emsp;content       | 帖子内容            | string            |                |
| &emsp;&emsp;pinned        | 是否置顶            | integer(int32)    |                |
| &emsp;&emsp;closed        | 是否关闭/锁定         | integer(int32)    |                |
| &emsp;&emsp;viewCount     | 浏览次数            | integer(int32)    |                |
| &emsp;&emsp;replyCount    | 回复总数            | integer(int32)    |                |
| &emsp;&emsp;lastReplyTime | 最后回复时间          | string(date-time) |                |
| &emsp;&emsp;createTime    | 创建时间            | string(date-time) |                |
| &emsp;&emsp;updateTime    | 更新时间            | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"userId": "",
		"userName": "",
		"userAvatar": "",
		"title": "",
		"content": "",
		"pinned": 0,
		"closed": 0,
		"viewCount": 0,
		"replyCount": 0,
		"lastReplyTime": "",
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

## listAllCourseThread

**接口地址**:`/api/course/course-thread/all`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取所有论坛主贴列表。</p>

**请求参数**:

暂无

**响应状态**:

| 状态码 | 说明          | schema                   |
|-----|-------------|--------------------------| 
| 200 | OK          | ResultListCourseThreadVO |
| 400 | Bad Request | ResultMapStringString    |
| 403 | Forbidden   | ResultString             |

**响应状态码-200**:

**响应参数**:

| 参数名称                      | 参数说明            | 类型                | schema         |
|---------------------------|-----------------|-------------------|----------------| 
| success                   | 请求是否成功          | boolean           |                |
| code                      | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                   | 响应消息            | string            |                |
| data                      | 响应数据体 (泛型)      | array             | CourseThreadVO |
| &emsp;&emsp;id            | 主贴ID            | string(uuid)      |                |
| &emsp;&emsp;courseId      | 所属课程ID          | string(uuid)      |                |
| &emsp;&emsp;userId        | 发帖用户ID          | string(uuid)      |                |
| &emsp;&emsp;userName      | 发帖用户名称          | string            |                |
| &emsp;&emsp;userAvatar    | 发帖用户头像          | string            |                |
| &emsp;&emsp;title         | 帖子标题            | string            |                |
| &emsp;&emsp;content       | 帖子内容            | string            |                |
| &emsp;&emsp;pinned        | 是否置顶            | integer(int32)    |                |
| &emsp;&emsp;closed        | 是否关闭/锁定         | integer(int32)    |                |
| &emsp;&emsp;viewCount     | 浏览次数            | integer(int32)    |                |
| &emsp;&emsp;replyCount    | 回复总数            | integer(int32)    |                |
| &emsp;&emsp;lastReplyTime | 最后回复时间          | string(date-time) |                |
| &emsp;&emsp;createTime    | 创建时间            | string(date-time) |                |
| &emsp;&emsp;updateTime    | 更新时间            | string(date-time) |                |

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
			"userId": "",
			"userName": "",
			"userAvatar": "",
			"title": "",
			"content": "",
			"pinned": 0,
			"closed": 0,
			"viewCount": 0,
			"replyCount": 0,
			"lastReplyTime": "",
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

## closeThread

**接口地址**:`/api/course/course-thread/close/{id}`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>关闭或开启主贴。</p>

**请求参数**:

| 参数名称     | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|----------|------|-------|------|--------------|--------|
| id       | 主贴ID | path  | true | string(uuid) |        |
| isClosed | 是否关闭 | query | true | boolean      |        |

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

## listCourseThread

**接口地址**:`/api/course/course-thread/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据传入的条件分页查询论坛主贴信息。支持根据课程ID、用户ID、标题等字段进行查询。</p>

**请求参数**:

| 参数名称          | 参数说明               | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|--------------------|-------|-------|--------|--------|
| courseId      | 所属课程ID             | query | false | string |        |
| userId        | 发帖用户ID             | query | false | string |        |
| title         | 帖子标题 (支持模糊查询)      | query | false | string |        |
| isPinned      | 是否置顶 (1=是, 0=否)    | query | false | string |        |
| isClosed      | 是否关闭/锁定 (1=是, 0=否) | query | false | string |        |
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

## pinThread

**接口地址**:`/api/course/course-thread/pin/{id}`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>置顶或取消置顶主贴。</p>

**请求参数**:

| 参数名称     | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|----------|------|-------|------|--------------|--------|
| id       | 主贴ID | path  | true | string(uuid) |        |
| isPinned | 是否置顶 | query | true | boolean      |        |

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

## viewThread

**接口地址**:`/api/course/course-thread/view/{id}`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>浏览主贴，增加浏览次数。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 主贴ID | path | true | string(uuid) |        |

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

# 课程学生管理

## updateCourseStudent

**接口地址**:`/api/course/course-student`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>修改选课信息。</p>

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

## removeCourseStudentByStudentIds

**接口地址**:`/api/course/course-student`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>批量删除选课记录。</p>

**请求示例**:

```javascript
[]
```

**请求参数**:

| 参数名称     | 参数说明   | 请求类型  | 是否必须 | 数据类型         | schema |
|----------|--------|-------|------|--------------|--------|
| courseId | 课程ID   | query | true | string(uuid) |        |
| strings  | string | body  | true | array        |        |

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

## getStudentCourseById

**接口地址**:`/api/course/course-student/{studentId}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取学生在指定课程中的选课信息。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|-----------|------|-------|------|--------------|--------|
| studentId | 学生ID | path  | true | string(uuid) |        |
| courseId  | 课程ID | query | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseStudentVO |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                      | 类型                | schema          |
|----------------------------|---------------------------|-------------------|-----------------| 
| success                    | 请求是否成功                    | boolean           |                 |
| code                       | 业务状态码 (200表示成功)           | integer(int32)    | integer(int32)  |
| message                    | 响应消息                      | string            |                 |
| data                       |                           | CourseStudentVO   | CourseStudentVO |
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
	"data": {
		"studentId": "",
		"courseId": "",
		"grade": 0,
		"enrollmentDate": "",
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

## removeCourseStudentByStudentId

**接口地址**:`/api/course/course-student/{studentId}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>学生退出已选的课程。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型  | 是否必须 | 数据类型         | schema |
|-----------|------|-------|------|--------------|--------|
| courseId  | 课程ID | query | true | string(uuid) |        |
| studentId | 学生ID | path  | true | string(uuid) |        |

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

## addCourseStudent

**接口地址**:`/api/course/course-student/add`

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

## listCourseStudent

**接口地址**:`/api/course/course-student/course/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>分页查询选课记录。</p>

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

## listAllCourseStudentByStudentId

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

# 课程章节管理

## updateCourseChapter

**接口地址**:`/api/course/course-chapter`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>修改现有课程章节的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseId": "",
  "parentId": "",
  "chapterName": "",
  "chapterContent": "",
  "sort": 0
}
```

**请求参数**:

| 参数名称                       | 参数说明                            | 请求类型 | 是否必须  | 数据类型             | schema           |
|----------------------------|---------------------------------|------|-------|------------------|------------------|
| courseChapterDTO           | 课程章节数据传输对象 (DTO)                | body | true  | CourseChapterDTO | CourseChapterDTO |
| &emsp;&emsp;id             | 章节ID (更新时必填)                    |      | false | string(uuid)     |                  |
| &emsp;&emsp;courseId       | 所属课程ID                          |      | true  | string(uuid)     |                  |
| &emsp;&emsp;parentId       | 父章节ID (用于支持多级章节结构, NULL表示为一级章节) |      | false | string(uuid)     |                  |
| &emsp;&emsp;chapterName    | 章节名称                            |      | true  | string           |                  |
| &emsp;&emsp;chapterContent | 章节内容 (例如: 详细的文本、富文本标记等)         |      | false | string           |                  |
| &emsp;&emsp;sort           | 章节排序 (值越小越靠前)                   |      | false | integer(int32)   |                  |

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

## removeCourseChapterByIds

**接口地址**:`/api/course/course-chapter`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>根据章节ID列表批量删除章节。</p>

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

## getCourseChapterById

**接口地址**:`/api/course/course-chapter/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过章节的唯一ID获取其详细信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 章节ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseChapterVO |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明            | 类型                | schema          |
|----------------------------|-----------------|-------------------|-----------------| 
| success                    | 请求是否成功          | boolean           |                 |
| code                       | 业务状态码 (200表示成功) | integer(int32)    | integer(int32)  |
| message                    | 响应消息            | string            |                 |
| data                       |                 | CourseChapterVO   | CourseChapterVO |
| &emsp;&emsp;id             | 章节ID            | string(uuid)      |                 |
| &emsp;&emsp;courseId       | 所属课程ID          | string(uuid)      |                 |
| &emsp;&emsp;parentId       | 父章节ID           | string(uuid)      |                 |
| &emsp;&emsp;chapterName    | 章节名称            | string            |                 |
| &emsp;&emsp;chapterContent | 章节内容            | string            |                 |
| &emsp;&emsp;sort           | 章节排序            | integer(int32)    |                 |
| &emsp;&emsp;createTime     | 创建时间            | string(date-time) |                 |
| &emsp;&emsp;updateTime     | 更新时间            | string(date-time) |                 |
| &emsp;&emsp;children       | 子章节列表           | array             | CourseChapterVO |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"parentId": "",
		"chapterName": "",
		"chapterContent": "",
		"sort": 0,
		"createTime": "",
		"updateTime": "",
		"children": [
			{
				"id": "",
				"courseId": "",
				"parentId": "",
				"chapterName": "",
				"chapterContent": "",
				"sort": 0,
				"createTime": "",
				"updateTime": "",
				"children": [
					{}
				]
			}
		]
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

## removeCourseChapterById

**接口地址**:`/api/course/course-chapter/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据章节ID从系统中移除章节。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 章节ID | path | true | string(uuid) |        |

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

## addCourseChapter

**接口地址**:`/api/course/course-chapter/add`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>添加新的课程章节。</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseId": "",
  "parentId": "",
  "chapterName": "",
  "chapterContent": "",
  "sort": 0
}
```

**请求参数**:

| 参数名称                       | 参数说明                            | 请求类型 | 是否必须  | 数据类型             | schema           |
|----------------------------|---------------------------------|------|-------|------------------|------------------|
| courseChapterDTO           | 课程章节数据传输对象 (DTO)                | body | true  | CourseChapterDTO | CourseChapterDTO |
| &emsp;&emsp;id             | 章节ID (更新时必填)                    |      | false | string(uuid)     |                  |
| &emsp;&emsp;courseId       | 所属课程ID                          |      | true  | string(uuid)     |                  |
| &emsp;&emsp;parentId       | 父章节ID (用于支持多级章节结构, NULL表示为一级章节) |      | false | string(uuid)     |                  |
| &emsp;&emsp;chapterName    | 章节名称                            |      | true  | string           |                  |
| &emsp;&emsp;chapterContent | 章节内容 (例如: 详细的文本、富文本标记等)         |      | false | string           |                  |
| &emsp;&emsp;sort           | 章节排序 (值越小越靠前)                   |      | false | integer(int32)   |                  |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseChapterVO |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明            | 类型                | schema          |
|----------------------------|-----------------|-------------------|-----------------| 
| success                    | 请求是否成功          | boolean           |                 |
| code                       | 业务状态码 (200表示成功) | integer(int32)    | integer(int32)  |
| message                    | 响应消息            | string            |                 |
| data                       |                 | CourseChapterVO   | CourseChapterVO |
| &emsp;&emsp;id             | 章节ID            | string(uuid)      |                 |
| &emsp;&emsp;courseId       | 所属课程ID          | string(uuid)      |                 |
| &emsp;&emsp;parentId       | 父章节ID           | string(uuid)      |                 |
| &emsp;&emsp;chapterName    | 章节名称            | string            |                 |
| &emsp;&emsp;chapterContent | 章节内容            | string            |                 |
| &emsp;&emsp;sort           | 章节排序            | integer(int32)    |                 |
| &emsp;&emsp;createTime     | 创建时间            | string(date-time) |                 |
| &emsp;&emsp;updateTime     | 更新时间            | string(date-time) |                 |
| &emsp;&emsp;children       | 子章节列表           | array             | CourseChapterVO |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"parentId": "",
		"chapterName": "",
		"chapterContent": "",
		"sort": 0,
		"createTime": "",
		"updateTime": "",
		"children": [
			{
				"id": "",
				"courseId": "",
				"parentId": "",
				"chapterName": "",
				"chapterContent": "",
				"sort": 0,
				"createTime": "",
				"updateTime": "",
				"children": [
					{}
				]
			}
		]
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

## listCourseChapter

**接口地址**:`/api/course/course-chapter/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据父章节ID获取子章节列表。</p>

**请求参数**:

| 参数名称          | 参数说明               | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|--------------------|-------|-------|--------|--------|
| courseId      | 所属课程ID             | query | false | string |        |
| parentId      | 父章节ID              | query | false | string |        |
| chapterName   | 章节名称 (支持模糊查询)      | query | false | string |        |
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

## listAllCourseChapterTree

**接口地址**:`/api/course/course-chapter/tree/course/{courseId}`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>查询课程中的所有章节，并以树状结构返回</p>

**请求参数**:

| 参数名称     | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|----------|------|------|------|--------------|--------|
| courseId | 课程ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                    |
|-----|-------------|---------------------------| 
| 200 | OK          | ResultListCourseChapterVO |
| 400 | Bad Request | ResultMapStringString     |
| 403 | Forbidden   | ResultString              |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明            | 类型                | schema          |
|----------------------------|-----------------|-------------------|-----------------| 
| success                    | 请求是否成功          | boolean           |                 |
| code                       | 业务状态码 (200表示成功) | integer(int32)    | integer(int32)  |
| message                    | 响应消息            | string            |                 |
| data                       | 响应数据体 (泛型)      | array             | CourseChapterVO |
| &emsp;&emsp;id             | 章节ID            | string(uuid)      |                 |
| &emsp;&emsp;courseId       | 所属课程ID          | string(uuid)      |                 |
| &emsp;&emsp;parentId       | 父章节ID           | string(uuid)      |                 |
| &emsp;&emsp;chapterName    | 章节名称            | string            |                 |
| &emsp;&emsp;chapterContent | 章节内容            | string            |                 |
| &emsp;&emsp;sort           | 章节排序            | integer(int32)    |                 |
| &emsp;&emsp;createTime     | 创建时间            | string(date-time) |                 |
| &emsp;&emsp;updateTime     | 更新时间            | string(date-time) |                 |
| &emsp;&emsp;children       | 子章节列表           | array             | CourseChapterVO |

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
			"parentId": "",
			"chapterName": "",
			"chapterContent": "",
			"sort": 0,
			"createTime": "",
			"updateTime": "",
			"children": [
				{
					"id": "",
					"courseId": "",
					"parentId": "",
					"chapterName": "",
					"chapterContent": "",
					"sort": 0,
					"createTime": "",
					"updateTime": "",
					"children": [
						{}
					]
				}
			]
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