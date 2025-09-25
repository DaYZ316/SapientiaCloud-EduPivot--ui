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

# 课程论坛管理

## addCourseForum

**接口地址**:`/api/course/forum`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>向课程中添加一个新的论坛。</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseId": "",
  "forumName": "",
  "description": "",
  "forumType": 0,
  "isPublic": 0,
  "allowAnonymous": 0,
  "moderatorIds": [],
  "sortOrder": 0,
  "status": 0,
  "rules": "",
  "tags": []
}
```

**请求参数**:

| 参数名称                       | 参数说明                              | 请求类型 | 是否必须  | 数据类型           | schema         |
|----------------------------|-----------------------------------|------|-------|----------------|----------------|
| courseForumDTO             | 课程论坛数据传输对象                        | body | true  | CourseForumDTO | CourseForumDTO |
| &emsp;&emsp;id             | 论坛ID，更新时必须提供                      |      | false | string(uuid)   |                |
| &emsp;&emsp;courseId       | 所属课程ID                            |      | true  | string(uuid)   |                |
| &emsp;&emsp;forumName      | 论坛名称                              |      | true  | string         |                |
| &emsp;&emsp;description    | 论坛描述                              |      | false | string         |                |
| &emsp;&emsp;forumType      | 论坛类型 (0=讨论区, 1=问答区, 2=作业区, 3=公告区) |      | false | integer(int32) |                |
| &emsp;&emsp;isPublic       | 是否公开 (0=仅课程成员, 1=公开)              |      | false | integer(int32) |                |
| &emsp;&emsp;allowAnonymous | 是否允许匿名发帖 (0=不允许, 1=允许)            |      | false | integer(int32) |                |
| &emsp;&emsp;moderatorIds   | 版主ID列表                            |      | false | array          | string(uuid)   |
| &emsp;&emsp;sortOrder      | 排序权重                              |      | false | integer(int32) |                |
| &emsp;&emsp;status         | 论坛状态 (0=正常, 1=关闭, 2=维护)           |      | false | integer(int32) |                |
| &emsp;&emsp;rules          | 论坛规则                              |      | false | string         |                |
| &emsp;&emsp;tags           | 标签列表                              |      | false | array          | string         |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseForumVO   |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                              | 类型                | schema         |
|----------------------------|-----------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                            | boolean           |                |
| code                       | 业务状态码 (200表示成功)                   | integer(int32)    | integer(int32) |
| message                    | 响应消息                              | string            |                |
| data                       |                                   | CourseForumVO     | CourseForumVO  |
| &emsp;&emsp;id             | 论坛ID                              | string(uuid)      |                |
| &emsp;&emsp;courseId       | 所属课程ID                            | string(uuid)      |                |
| &emsp;&emsp;forumName      | 论坛名称                              | string            |                |
| &emsp;&emsp;description    | 论坛描述                              | string            |                |
| &emsp;&emsp;forumType      | 论坛类型 (0=讨论区, 1=问答区, 2=作业区, 3=公告区) | integer(int32)    |                |
| &emsp;&emsp;isPublic       | 是否公开 (0=仅课程成员, 1=公开)              | integer(int32)    |                |
| &emsp;&emsp;allowAnonymous | 是否允许匿名发帖 (0=不允许, 1=允许)            | integer(int32)    |                |
| &emsp;&emsp;moderatorIds   | 版主ID列表                            | array             | string(uuid)   |
| &emsp;&emsp;postCount      | 帖子总数                              | integer(int64)    |                |
| &emsp;&emsp;replyCount     | 回复总数                              | integer(int64)    |                |
| &emsp;&emsp;lastPostId     | 最新帖子ID                            | string(uuid)      |                |
| &emsp;&emsp;lastPostTime   | 最新发帖时间                            | string(date-time) |                |
| &emsp;&emsp;sortOrder      | 排序权重                              | integer(int32)    |                |
| &emsp;&emsp;status         | 论坛状态 (0=正常, 1=关闭, 2=维护)           | integer(int32)    |                |
| &emsp;&emsp;rules          | 论坛规则                              | string            |                |
| &emsp;&emsp;tags           | 标签列表                              | array             | string         |
| &emsp;&emsp;createTime     | 创建时间                              | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                              | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"forumName": "",
		"description": "",
		"forumType": 0,
		"isPublic": 0,
		"allowAnonymous": 0,
		"moderatorIds": [],
		"postCount": 0,
		"replyCount": 0,
		"lastPostId": "",
		"lastPostTime": "",
		"sortOrder": 0,
		"status": 0,
		"rules": "",
		"tags": [],
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

## updateCourseForum

**接口地址**:`/api/course/forum`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>更新现有论坛的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseId": "",
  "forumName": "",
  "description": "",
  "forumType": 0,
  "isPublic": 0,
  "allowAnonymous": 0,
  "moderatorIds": [],
  "sortOrder": 0,
  "status": 0,
  "rules": "",
  "tags": []
}
```

**请求参数**:

| 参数名称                       | 参数说明                              | 请求类型 | 是否必须  | 数据类型           | schema         |
|----------------------------|-----------------------------------|------|-------|----------------|----------------|
| courseForumDTO             | 课程论坛数据传输对象                        | body | true  | CourseForumDTO | CourseForumDTO |
| &emsp;&emsp;id             | 论坛ID，更新时必须提供                      |      | false | string(uuid)   |                |
| &emsp;&emsp;courseId       | 所属课程ID                            |      | true  | string(uuid)   |                |
| &emsp;&emsp;forumName      | 论坛名称                              |      | true  | string         |                |
| &emsp;&emsp;description    | 论坛描述                              |      | false | string         |                |
| &emsp;&emsp;forumType      | 论坛类型 (0=讨论区, 1=问答区, 2=作业区, 3=公告区) |      | false | integer(int32) |                |
| &emsp;&emsp;isPublic       | 是否公开 (0=仅课程成员, 1=公开)              |      | false | integer(int32) |                |
| &emsp;&emsp;allowAnonymous | 是否允许匿名发帖 (0=不允许, 1=允许)            |      | false | integer(int32) |                |
| &emsp;&emsp;moderatorIds   | 版主ID列表                            |      | false | array          | string(uuid)   |
| &emsp;&emsp;sortOrder      | 排序权重                              |      | false | integer(int32) |                |
| &emsp;&emsp;status         | 论坛状态 (0=正常, 1=关闭, 2=维护)           |      | false | integer(int32) |                |
| &emsp;&emsp;rules          | 论坛规则                              |      | false | string         |                |
| &emsp;&emsp;tags           | 标签列表                              |      | false | array          | string         |

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

## removeCourseForumByIds

**接口地址**:`/api/course/forum`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>根据论坛ID列表批量删除论坛。</p>

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

## getCourseForumById

**接口地址**:`/api/course/forum/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过论坛的唯一ID获取其详细信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 论坛ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseForumVO   |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                              | 类型                | schema         |
|----------------------------|-----------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                            | boolean           |                |
| code                       | 业务状态码 (200表示成功)                   | integer(int32)    | integer(int32) |
| message                    | 响应消息                              | string            |                |
| data                       |                                   | CourseForumVO     | CourseForumVO  |
| &emsp;&emsp;id             | 论坛ID                              | string(uuid)      |                |
| &emsp;&emsp;courseId       | 所属课程ID                            | string(uuid)      |                |
| &emsp;&emsp;forumName      | 论坛名称                              | string            |                |
| &emsp;&emsp;description    | 论坛描述                              | string            |                |
| &emsp;&emsp;forumType      | 论坛类型 (0=讨论区, 1=问答区, 2=作业区, 3=公告区) | integer(int32)    |                |
| &emsp;&emsp;isPublic       | 是否公开 (0=仅课程成员, 1=公开)              | integer(int32)    |                |
| &emsp;&emsp;allowAnonymous | 是否允许匿名发帖 (0=不允许, 1=允许)            | integer(int32)    |                |
| &emsp;&emsp;moderatorIds   | 版主ID列表                            | array             | string(uuid)   |
| &emsp;&emsp;postCount      | 帖子总数                              | integer(int64)    |                |
| &emsp;&emsp;replyCount     | 回复总数                              | integer(int64)    |                |
| &emsp;&emsp;lastPostId     | 最新帖子ID                            | string(uuid)      |                |
| &emsp;&emsp;lastPostTime   | 最新发帖时间                            | string(date-time) |                |
| &emsp;&emsp;sortOrder      | 排序权重                              | integer(int32)    |                |
| &emsp;&emsp;status         | 论坛状态 (0=正常, 1=关闭, 2=维护)           | integer(int32)    |                |
| &emsp;&emsp;rules          | 论坛规则                              | string            |                |
| &emsp;&emsp;tags           | 标签列表                              | array             | string         |
| &emsp;&emsp;createTime     | 创建时间                              | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                              | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"forumName": "",
		"description": "",
		"forumType": 0,
		"isPublic": 0,
		"allowAnonymous": 0,
		"moderatorIds": [],
		"postCount": 0,
		"replyCount": 0,
		"lastPostId": "",
		"lastPostTime": "",
		"sortOrder": 0,
		"status": 0,
		"rules": "",
		"tags": [],
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

## removeCourseForumById

**接口地址**:`/api/course/forum/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过论坛的唯一ID删除论坛。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 论坛ID | path | true | string(uuid) |        |

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

## setForumModerators

**接口地址**:`/api/course/forum/{id}/moderators`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>设置论坛版主。</p>

**请求示例**:

```javascript
[]
```

**请求参数**:

| 参数名称    | 参数说明   | 请求类型 | 是否必须 | 数据类型         | schema |
|---------|--------|------|------|--------------|--------|
| id      | 论坛ID   | path | true | string(uuid) |        |
| strings | string | body | true | array        |        |

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

## getForumStatistics

**接口地址**:`/api/course/forum/{id}/statistics`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取论坛统计信息（帖子数、回复数等）。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 论坛ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseForumVO   |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                              | 类型                | schema         |
|----------------------------|-----------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                            | boolean           |                |
| code                       | 业务状态码 (200表示成功)                   | integer(int32)    | integer(int32) |
| message                    | 响应消息                              | string            |                |
| data                       |                                   | CourseForumVO     | CourseForumVO  |
| &emsp;&emsp;id             | 论坛ID                              | string(uuid)      |                |
| &emsp;&emsp;courseId       | 所属课程ID                            | string(uuid)      |                |
| &emsp;&emsp;forumName      | 论坛名称                              | string            |                |
| &emsp;&emsp;description    | 论坛描述                              | string            |                |
| &emsp;&emsp;forumType      | 论坛类型 (0=讨论区, 1=问答区, 2=作业区, 3=公告区) | integer(int32)    |                |
| &emsp;&emsp;isPublic       | 是否公开 (0=仅课程成员, 1=公开)              | integer(int32)    |                |
| &emsp;&emsp;allowAnonymous | 是否允许匿名发帖 (0=不允许, 1=允许)            | integer(int32)    |                |
| &emsp;&emsp;moderatorIds   | 版主ID列表                            | array             | string(uuid)   |
| &emsp;&emsp;postCount      | 帖子总数                              | integer(int64)    |                |
| &emsp;&emsp;replyCount     | 回复总数                              | integer(int64)    |                |
| &emsp;&emsp;lastPostId     | 最新帖子ID                            | string(uuid)      |                |
| &emsp;&emsp;lastPostTime   | 最新发帖时间                            | string(date-time) |                |
| &emsp;&emsp;sortOrder      | 排序权重                              | integer(int32)    |                |
| &emsp;&emsp;status         | 论坛状态 (0=正常, 1=关闭, 2=维护)           | integer(int32)    |                |
| &emsp;&emsp;rules          | 论坛规则                              | string            |                |
| &emsp;&emsp;tags           | 标签列表                              | array             | string         |
| &emsp;&emsp;createTime     | 创建时间                              | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                              | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"forumName": "",
		"description": "",
		"forumType": 0,
		"isPublic": 0,
		"allowAnonymous": 0,
		"moderatorIds": [],
		"postCount": 0,
		"replyCount": 0,
		"lastPostId": "",
		"lastPostTime": "",
		"sortOrder": 0,
		"status": 0,
		"rules": "",
		"tags": [],
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

## updateForumStatus

**接口地址**:`/api/course/forum/{id}/status`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>更新论坛状态（正常/关闭/维护）。</p>

**请求参数**:

| 参数名称   | 参数说明                    | 请求类型  | 是否必须 | 数据类型           | schema |
|--------|-------------------------|-------|------|----------------|--------|
| id     | 论坛ID                    | path  | true | string(uuid)   |        |
| status | 论坛状态 (0=正常, 1=关闭, 2=维护) | query | true | integer(int32) |        |

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

## listCourseForumByCourseId

**接口地址**:`/api/course/forum/course/{courseId}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据课程ID获取该课程下的所有论坛列表。</p>

**请求参数**:

| 参数名称     | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|----------|------|------|------|--------------|--------|
| courseId | 课程ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                  |
|-----|-------------|-------------------------| 
| 200 | OK          | ResultListCourseForumVO |
| 400 | Bad Request | ResultMapStringString   |
| 403 | Forbidden   | ResultString            |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                              | 类型                | schema         |
|----------------------------|-----------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                            | boolean           |                |
| code                       | 业务状态码 (200表示成功)                   | integer(int32)    | integer(int32) |
| message                    | 响应消息                              | string            |                |
| data                       | 响应数据体 (泛型)                        | array             | CourseForumVO  |
| &emsp;&emsp;id             | 论坛ID                              | string(uuid)      |                |
| &emsp;&emsp;courseId       | 所属课程ID                            | string(uuid)      |                |
| &emsp;&emsp;forumName      | 论坛名称                              | string            |                |
| &emsp;&emsp;description    | 论坛描述                              | string            |                |
| &emsp;&emsp;forumType      | 论坛类型 (0=讨论区, 1=问答区, 2=作业区, 3=公告区) | integer(int32)    |                |
| &emsp;&emsp;isPublic       | 是否公开 (0=仅课程成员, 1=公开)              | integer(int32)    |                |
| &emsp;&emsp;allowAnonymous | 是否允许匿名发帖 (0=不允许, 1=允许)            | integer(int32)    |                |
| &emsp;&emsp;moderatorIds   | 版主ID列表                            | array             | string(uuid)   |
| &emsp;&emsp;postCount      | 帖子总数                              | integer(int64)    |                |
| &emsp;&emsp;replyCount     | 回复总数                              | integer(int64)    |                |
| &emsp;&emsp;lastPostId     | 最新帖子ID                            | string(uuid)      |                |
| &emsp;&emsp;lastPostTime   | 最新发帖时间                            | string(date-time) |                |
| &emsp;&emsp;sortOrder      | 排序权重                              | integer(int32)    |                |
| &emsp;&emsp;status         | 论坛状态 (0=正常, 1=关闭, 2=维护)           | integer(int32)    |                |
| &emsp;&emsp;rules          | 论坛规则                              | string            |                |
| &emsp;&emsp;tags           | 标签列表                              | array             | string         |
| &emsp;&emsp;createTime     | 创建时间                              | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                              | string(date-time) |                |

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
			"forumName": "",
			"description": "",
			"forumType": 0,
			"isPublic": 0,
			"allowAnonymous": 0,
			"moderatorIds": [],
			"postCount": 0,
			"replyCount": 0,
			"lastPostId": "",
			"lastPostTime": "",
			"sortOrder": 0,
			"status": 0,
			"rules": "",
			"tags": [],
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

## listCourseForum

**接口地址**:`/api/course/forum/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据传入的条件分页查询课程论坛信息。支持根据论坛名称、论坛类型、课程ID等字段进行查询。</p>

**请求参数**:

| 参数名称           | 参数说明                              | 请求类型  | 是否必须  | 数据类型   | schema |
|----------------|-----------------------------------|-------|-------|--------|--------|
| courseId       | 所属课程ID                            | query | false | string |        |
| forumName      | 论坛名称（模糊查询）                        | query | false | string |        |
| forumType      | 论坛类型 (0=讨论区, 1=问答区, 2=作业区, 3=公告区) | query | false | string |        |
| isPublic       | 是否公开 (0=仅课程成员, 1=公开)              | query | false | string |        |
| allowAnonymous | 是否允许匿名发帖 (0=不允许, 1=允许)            | query | false | string |        |
| status         | 论坛状态 (0=正常, 1=关闭, 2=维护)           | query | false | string |        |
| moderatorId    | 版主ID                              | query | false | string |        |
| startTime      | 起始时间                              | query | false | string |        |
| endTime        | 结束时间                              | query | false | string |        |
| pageNum        | 当前记录起始索引                          | query | false | string |        |
| pageSize       | 每页显示记录数                           | query | false | string |        |
| orderByColumn  | 排序列                               | query | false | string |        |
| isAsc          | 排序的方向,可用值:asc,desc                | query | false | string |        |
| reasonable     | 分页参数合理化                           | query | false | string |        |

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
  "status": 0
}
```

**请求参数**:

| 参数名称                  | 参数说明                      | 请求类型 | 是否必须  | 数据类型             | schema           |
|-----------------------|---------------------------|------|-------|------------------|------------------|
| courseStudentDTO      | 课程学生数据传输对象                | body | true  | CourseStudentDTO | CourseStudentDTO |
| &emsp;&emsp;studentId | 学生ID                      |      | true  | string(uuid)     |                  |
| &emsp;&emsp;courseId  | 课程ID                      |      | true  | string(uuid)     |                  |
| &emsp;&emsp;grade     | 成绩                        |      | false | number           |                  |
| &emsp;&emsp;status    | 选课状态 (0=在读, 1=已退课, 2=已完成) |      | false | integer(int32)   |                  |

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

| 参数名称                   | 参数说明                      | 类型                | schema          |
|------------------------|---------------------------|-------------------|-----------------| 
| success                | 请求是否成功                    | boolean           |                 |
| code                   | 业务状态码 (200表示成功)           | integer(int32)    | integer(int32)  |
| message                | 响应消息                      | string            |                 |
| data                   |                           | CourseStudentVO   | CourseStudentVO |
| &emsp;&emsp;studentId  | 学生ID                      | string(uuid)      |                 |
| &emsp;&emsp;courseId   | 课程ID                      | string(uuid)      |                 |
| &emsp;&emsp;grade      | 成绩                        | number            |                 |
| &emsp;&emsp;status     | 选课状态 (0=在读, 1=已退课, 2=已完成) | integer(int32)    |                 |
| &emsp;&emsp;createTime | 创建时间                      | string(date-time) |                 |
| &emsp;&emsp;updateTime | 更新时间                      | string(date-time) |                 |

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
  "status": 0
}
```

**请求参数**:

| 参数名称                  | 参数说明                      | 请求类型 | 是否必须  | 数据类型             | schema           |
|-----------------------|---------------------------|------|-------|------------------|------------------|
| courseStudentDTO      | 课程学生数据传输对象                | body | true  | CourseStudentDTO | CourseStudentDTO |
| &emsp;&emsp;studentId | 学生ID                      |      | true  | string(uuid)     |                  |
| &emsp;&emsp;courseId  | 课程ID                      |      | true  | string(uuid)     |                  |
| &emsp;&emsp;grade     | 成绩                        |      | false | number           |                  |
| &emsp;&emsp;status    | 选课状态 (0=在读, 1=已退课, 2=已完成) |      | false | integer(int32)   |                  |

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

| 参数名称                   | 参数说明                      | 类型                | schema          |
|------------------------|---------------------------|-------------------|-----------------| 
| success                | 请求是否成功                    | boolean           |                 |
| code                   | 业务状态码 (200表示成功)           | integer(int32)    | integer(int32)  |
| message                | 响应消息                      | string            |                 |
| data                   | 响应数据体 (泛型)                | array             | CourseStudentVO |
| &emsp;&emsp;studentId  | 学生ID                      | string(uuid)      |                 |
| &emsp;&emsp;courseId   | 课程ID                      | string(uuid)      |                 |
| &emsp;&emsp;grade      | 成绩                        | number            |                 |
| &emsp;&emsp;status     | 选课状态 (0=在读, 1=已退课, 2=已完成) | integer(int32)    |                 |
| &emsp;&emsp;createTime | 创建时间                      | string(date-time) |                 |
| &emsp;&emsp;updateTime | 更新时间                      | string(date-time) |                 |

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

| 参数名称                   | 参数说明                      | 类型                | schema          |
|------------------------|---------------------------|-------------------|-----------------| 
| success                | 请求是否成功                    | boolean           |                 |
| code                   | 业务状态码 (200表示成功)           | integer(int32)    | integer(int32)  |
| message                | 响应消息                      | string            |                 |
| data                   | 响应数据体 (泛型)                | array             | CourseStudentVO |
| &emsp;&emsp;studentId  | 学生ID                      | string(uuid)      |                 |
| &emsp;&emsp;courseId   | 课程ID                      | string(uuid)      |                 |
| &emsp;&emsp;grade      | 成绩                        | number            |                 |
| &emsp;&emsp;status     | 选课状态 (0=在读, 1=已退课, 2=已完成) | integer(int32)    |                 |
| &emsp;&emsp;createTime | 创建时间                      | string(date-time) |                 |
| &emsp;&emsp;updateTime | 更新时间                      | string(date-time) |                 |

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

## addCourseChapter

**接口地址**:`/api/course/chapter`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>向课程中添加一个新的章节。</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseId": "",
  "chapterName": "",
  "chapterNumber": 0,
  "parentChapterId": "",
  "description": "",
  "content": "",
  "videoUrl": "",
  "videoDuration": 0,
  "attachmentUrls": [],
  "sortOrder": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                        | 参数说明                    | 请求类型 | 是否必须  | 数据类型             | schema           |
|-----------------------------|-------------------------|------|-------|------------------|------------------|
| courseChapterDTO            | 课程章节数据传输对象              | body | true  | CourseChapterDTO | CourseChapterDTO |
| &emsp;&emsp;id              | 章节ID，更新时必须提供            |      | false | string(uuid)     |                  |
| &emsp;&emsp;courseId        | 所属课程ID                  |      | true  | string(uuid)     |                  |
| &emsp;&emsp;chapterName     | 章节名称                    |      | true  | string           |                  |
| &emsp;&emsp;chapterNumber   | 章节序号                    |      | false | integer(int32)   |                  |
| &emsp;&emsp;parentChapterId | 父章节ID                   |      | false | string(uuid)     |                  |
| &emsp;&emsp;description     | 章节描述                    |      | false | string           |                  |
| &emsp;&emsp;content         | 章节内容                    |      | false | string           |                  |
| &emsp;&emsp;videoUrl        | 视频资源URL                 |      | false | string           |                  |
| &emsp;&emsp;videoDuration   | 视频时长(秒)                 |      | false | integer(int32)   |                  |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                 |      | false | array            | string           |
| &emsp;&emsp;sortOrder       | 排序权重                    |      | false | integer(int32)   |                  |
| &emsp;&emsp;status          | 章节状态 (0=草稿, 1=发布, 2=下架) |      | false | integer(int32)   |                  |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultCourseChapterVO |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                        | 参数说明                    | 类型                | schema          |
|-----------------------------|-------------------------|-------------------|-----------------| 
| success                     | 请求是否成功                  | boolean           |                 |
| code                        | 业务状态码 (200表示成功)         | integer(int32)    | integer(int32)  |
| message                     | 响应消息                    | string            |                 |
| data                        |                         | CourseChapterVO   | CourseChapterVO |
| &emsp;&emsp;id              | 章节ID                    | string(uuid)      |                 |
| &emsp;&emsp;courseId        | 所属课程ID                  | string(uuid)      |                 |
| &emsp;&emsp;chapterName     | 章节名称                    | string            |                 |
| &emsp;&emsp;chapterNumber   | 章节序号                    | integer(int32)    |                 |
| &emsp;&emsp;parentChapterId | 父章节ID                   | string(uuid)      |                 |
| &emsp;&emsp;description     | 章节描述                    | string            |                 |
| &emsp;&emsp;content         | 章节内容                    | string            |                 |
| &emsp;&emsp;videoUrl        | 视频资源URL                 | string            |                 |
| &emsp;&emsp;videoDuration   | 视频时长(秒)                 | integer(int32)    |                 |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                 | array             | string          |
| &emsp;&emsp;sortOrder       | 排序权重                    | integer(int32)    |                 |
| &emsp;&emsp;status          | 章节状态 (0=草稿, 1=发布, 2=下架) | integer(int32)    |                 |
| &emsp;&emsp;viewCount       | 浏览次数                    | integer(int64)    |                 |
| &emsp;&emsp;likeCount       | 点赞次数                    | integer(int64)    |                 |
| &emsp;&emsp;commentCount    | 评论次数                    | integer(int64)    |                 |
| &emsp;&emsp;createTime      | 创建时间                    | string(date-time) |                 |
| &emsp;&emsp;updateTime      | 更新时间                    | string(date-time) |                 |
| &emsp;&emsp;children        | 子章节列表（用于树形结构）           | array             | CourseChapterVO |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"chapterName": "",
		"chapterNumber": 0,
		"parentChapterId": "",
		"description": "",
		"content": "",
		"videoUrl": "",
		"videoDuration": 0,
		"attachmentUrls": [],
		"sortOrder": 0,
		"status": 0,
		"viewCount": 0,
		"likeCount": 0,
		"commentCount": 0,
		"createTime": "",
		"updateTime": "",
		"children": [
			{
				"id": "",
				"courseId": "",
				"chapterName": "",
				"chapterNumber": 0,
				"parentChapterId": "",
				"description": "",
				"content": "",
				"videoUrl": "",
				"videoDuration": 0,
				"attachmentUrls": [],
				"sortOrder": 0,
				"status": 0,
				"viewCount": 0,
				"likeCount": 0,
				"commentCount": 0,
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

## updateCourseChapter

**接口地址**:`/api/course/chapter`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>更新现有章节的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "courseId": "",
  "chapterName": "",
  "chapterNumber": 0,
  "parentChapterId": "",
  "description": "",
  "content": "",
  "videoUrl": "",
  "videoDuration": 0,
  "attachmentUrls": [],
  "sortOrder": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                        | 参数说明                    | 请求类型 | 是否必须  | 数据类型             | schema           |
|-----------------------------|-------------------------|------|-------|------------------|------------------|
| courseChapterDTO            | 课程章节数据传输对象              | body | true  | CourseChapterDTO | CourseChapterDTO |
| &emsp;&emsp;id              | 章节ID，更新时必须提供            |      | false | string(uuid)     |                  |
| &emsp;&emsp;courseId        | 所属课程ID                  |      | true  | string(uuid)     |                  |
| &emsp;&emsp;chapterName     | 章节名称                    |      | true  | string           |                  |
| &emsp;&emsp;chapterNumber   | 章节序号                    |      | false | integer(int32)   |                  |
| &emsp;&emsp;parentChapterId | 父章节ID                   |      | false | string(uuid)     |                  |
| &emsp;&emsp;description     | 章节描述                    |      | false | string           |                  |
| &emsp;&emsp;content         | 章节内容                    |      | false | string           |                  |
| &emsp;&emsp;videoUrl        | 视频资源URL                 |      | false | string           |                  |
| &emsp;&emsp;videoDuration   | 视频时长(秒)                 |      | false | integer(int32)   |                  |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                 |      | false | array            | string           |
| &emsp;&emsp;sortOrder       | 排序权重                    |      | false | integer(int32)   |                  |
| &emsp;&emsp;status          | 章节状态 (0=草稿, 1=发布, 2=下架) |      | false | integer(int32)   |                  |

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

**接口地址**:`/api/course/chapter`

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

**接口地址**:`/api/course/chapter/{id}`

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

| 参数名称                        | 参数说明                    | 类型                | schema          |
|-----------------------------|-------------------------|-------------------|-----------------| 
| success                     | 请求是否成功                  | boolean           |                 |
| code                        | 业务状态码 (200表示成功)         | integer(int32)    | integer(int32)  |
| message                     | 响应消息                    | string            |                 |
| data                        |                         | CourseChapterVO   | CourseChapterVO |
| &emsp;&emsp;id              | 章节ID                    | string(uuid)      |                 |
| &emsp;&emsp;courseId        | 所属课程ID                  | string(uuid)      |                 |
| &emsp;&emsp;chapterName     | 章节名称                    | string            |                 |
| &emsp;&emsp;chapterNumber   | 章节序号                    | integer(int32)    |                 |
| &emsp;&emsp;parentChapterId | 父章节ID                   | string(uuid)      |                 |
| &emsp;&emsp;description     | 章节描述                    | string            |                 |
| &emsp;&emsp;content         | 章节内容                    | string            |                 |
| &emsp;&emsp;videoUrl        | 视频资源URL                 | string            |                 |
| &emsp;&emsp;videoDuration   | 视频时长(秒)                 | integer(int32)    |                 |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                 | array             | string          |
| &emsp;&emsp;sortOrder       | 排序权重                    | integer(int32)    |                 |
| &emsp;&emsp;status          | 章节状态 (0=草稿, 1=发布, 2=下架) | integer(int32)    |                 |
| &emsp;&emsp;viewCount       | 浏览次数                    | integer(int64)    |                 |
| &emsp;&emsp;likeCount       | 点赞次数                    | integer(int64)    |                 |
| &emsp;&emsp;commentCount    | 评论次数                    | integer(int64)    |                 |
| &emsp;&emsp;createTime      | 创建时间                    | string(date-time) |                 |
| &emsp;&emsp;updateTime      | 更新时间                    | string(date-time) |                 |
| &emsp;&emsp;children        | 子章节列表（用于树形结构）           | array             | CourseChapterVO |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"chapterName": "",
		"chapterNumber": 0,
		"parentChapterId": "",
		"description": "",
		"content": "",
		"videoUrl": "",
		"videoDuration": 0,
		"attachmentUrls": [],
		"sortOrder": 0,
		"status": 0,
		"viewCount": 0,
		"likeCount": 0,
		"commentCount": 0,
		"createTime": "",
		"updateTime": "",
		"children": [
			{
				"id": "",
				"courseId": "",
				"chapterName": "",
				"chapterNumber": 0,
				"parentChapterId": "",
				"description": "",
				"content": "",
				"videoUrl": "",
				"videoDuration": 0,
				"attachmentUrls": [],
				"sortOrder": 0,
				"status": 0,
				"viewCount": 0,
				"likeCount": 0,
				"commentCount": 0,
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

**接口地址**:`/api/course/chapter/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过章节的唯一ID删除章节。</p>

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

## likeChapter

**接口地址**:`/api/course/chapter/{id}/like`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>点赞章节。</p>

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

## unlikeChapter

**接口地址**:`/api/course/chapter/{id}/like`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>取消点赞章节。</p>

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

## updateChapterSortOrder

**接口地址**:`/api/course/chapter/{id}/sort`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>更新章节排序权重。</p>

**请求参数**:

| 参数名称      | 参数说明 | 请求类型  | 是否必须 | 数据类型           | schema |
|-----------|------|-------|------|----------------|--------|
| id        | 章节ID | path  | true | string(uuid)   |        |
| sortOrder | 排序权重 | query | true | integer(int32) |        |

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

## getChapterStatistics

**接口地址**:`/api/course/chapter/{id}/statistics`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取章节统计信息（浏览次数、点赞次数、评论次数等）。</p>

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

| 参数名称                        | 参数说明                    | 类型                | schema          |
|-----------------------------|-------------------------|-------------------|-----------------| 
| success                     | 请求是否成功                  | boolean           |                 |
| code                        | 业务状态码 (200表示成功)         | integer(int32)    | integer(int32)  |
| message                     | 响应消息                    | string            |                 |
| data                        |                         | CourseChapterVO   | CourseChapterVO |
| &emsp;&emsp;id              | 章节ID                    | string(uuid)      |                 |
| &emsp;&emsp;courseId        | 所属课程ID                  | string(uuid)      |                 |
| &emsp;&emsp;chapterName     | 章节名称                    | string            |                 |
| &emsp;&emsp;chapterNumber   | 章节序号                    | integer(int32)    |                 |
| &emsp;&emsp;parentChapterId | 父章节ID                   | string(uuid)      |                 |
| &emsp;&emsp;description     | 章节描述                    | string            |                 |
| &emsp;&emsp;content         | 章节内容                    | string            |                 |
| &emsp;&emsp;videoUrl        | 视频资源URL                 | string            |                 |
| &emsp;&emsp;videoDuration   | 视频时长(秒)                 | integer(int32)    |                 |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                 | array             | string          |
| &emsp;&emsp;sortOrder       | 排序权重                    | integer(int32)    |                 |
| &emsp;&emsp;status          | 章节状态 (0=草稿, 1=发布, 2=下架) | integer(int32)    |                 |
| &emsp;&emsp;viewCount       | 浏览次数                    | integer(int64)    |                 |
| &emsp;&emsp;likeCount       | 点赞次数                    | integer(int64)    |                 |
| &emsp;&emsp;commentCount    | 评论次数                    | integer(int64)    |                 |
| &emsp;&emsp;createTime      | 创建时间                    | string(date-time) |                 |
| &emsp;&emsp;updateTime      | 更新时间                    | string(date-time) |                 |
| &emsp;&emsp;children        | 子章节列表（用于树形结构）           | array             | CourseChapterVO |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"courseId": "",
		"chapterName": "",
		"chapterNumber": 0,
		"parentChapterId": "",
		"description": "",
		"content": "",
		"videoUrl": "",
		"videoDuration": 0,
		"attachmentUrls": [],
		"sortOrder": 0,
		"status": 0,
		"viewCount": 0,
		"likeCount": 0,
		"commentCount": 0,
		"createTime": "",
		"updateTime": "",
		"children": [
			{
				"id": "",
				"courseId": "",
				"chapterName": "",
				"chapterNumber": 0,
				"parentChapterId": "",
				"description": "",
				"content": "",
				"videoUrl": "",
				"videoDuration": 0,
				"attachmentUrls": [],
				"sortOrder": 0,
				"status": 0,
				"viewCount": 0,
				"likeCount": 0,
				"commentCount": 0,
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

## updateChapterStatus

**接口地址**:`/api/course/chapter/{id}/status`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>更新章节状态（草稿/发布/下架）。</p>

**请求参数**:

| 参数名称   | 参数说明                    | 请求类型  | 是否必须 | 数据类型           | schema |
|--------|-------------------------|-------|------|----------------|--------|
| id     | 章节ID                    | path  | true | string(uuid)   |        |
| status | 章节状态 (0=草稿, 1=发布, 2=下架) | query | true | integer(int32) |        |

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

## viewChapter

**接口地址**:`/api/course/chapter/{id}/view`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>浏览章节（增加浏览次数）。</p>

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

## batchUpdateChapterSortOrder

**接口地址**:`/api/course/chapter/batch/sort`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>批量更新章节排序权重。</p>

**请求示例**:

```javascript
[
  {
    "id": "",
    "courseId": "",
    "chapterName": "",
    "chapterNumber": 0,
    "parentChapterId": "",
    "description": "",
    "content": "",
    "videoUrl": "",
    "videoDuration": 0,
    "attachmentUrls": [],
    "sortOrder": 0,
    "status": 0
  }
]
```

**请求参数**:

| 参数名称                        | 参数说明                    | 请求类型 | 是否必须  | 数据类型           | schema           |
|-----------------------------|-------------------------|------|-------|----------------|------------------|
| courseChapterDTOs           | 课程章节数据传输对象              | body | true  | array          | CourseChapterDTO |
| &emsp;&emsp;id              | 章节ID，更新时必须提供            |      | false | string(uuid)   |                  |
| &emsp;&emsp;courseId        | 所属课程ID                  |      | true  | string(uuid)   |                  |
| &emsp;&emsp;chapterName     | 章节名称                    |      | true  | string         |                  |
| &emsp;&emsp;chapterNumber   | 章节序号                    |      | false | integer(int32) |                  |
| &emsp;&emsp;parentChapterId | 父章节ID                   |      | false | string(uuid)   |                  |
| &emsp;&emsp;description     | 章节描述                    |      | false | string         |                  |
| &emsp;&emsp;content         | 章节内容                    |      | false | string         |                  |
| &emsp;&emsp;videoUrl        | 视频资源URL                 |      | false | string         |                  |
| &emsp;&emsp;videoDuration   | 视频时长(秒)                 |      | false | integer(int32) |                  |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                 |      | false | array          | string           |
| &emsp;&emsp;sortOrder       | 排序权重                    |      | false | integer(int32) |                  |
| &emsp;&emsp;status          | 章节状态 (0=草稿, 1=发布, 2=下架) |      | false | integer(int32) |                  |

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

## listCourseChapterByCourseId

**接口地址**:`/api/course/chapter/course/{courseId}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据课程ID获取该课程下的所有章节列表。</p>

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

| 参数名称                        | 参数说明                    | 类型                | schema          |
|-----------------------------|-------------------------|-------------------|-----------------| 
| success                     | 请求是否成功                  | boolean           |                 |
| code                        | 业务状态码 (200表示成功)         | integer(int32)    | integer(int32)  |
| message                     | 响应消息                    | string            |                 |
| data                        | 响应数据体 (泛型)              | array             | CourseChapterVO |
| &emsp;&emsp;id              | 章节ID                    | string(uuid)      |                 |
| &emsp;&emsp;courseId        | 所属课程ID                  | string(uuid)      |                 |
| &emsp;&emsp;chapterName     | 章节名称                    | string            |                 |
| &emsp;&emsp;chapterNumber   | 章节序号                    | integer(int32)    |                 |
| &emsp;&emsp;parentChapterId | 父章节ID                   | string(uuid)      |                 |
| &emsp;&emsp;description     | 章节描述                    | string            |                 |
| &emsp;&emsp;content         | 章节内容                    | string            |                 |
| &emsp;&emsp;videoUrl        | 视频资源URL                 | string            |                 |
| &emsp;&emsp;videoDuration   | 视频时长(秒)                 | integer(int32)    |                 |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                 | array             | string          |
| &emsp;&emsp;sortOrder       | 排序权重                    | integer(int32)    |                 |
| &emsp;&emsp;status          | 章节状态 (0=草稿, 1=发布, 2=下架) | integer(int32)    |                 |
| &emsp;&emsp;viewCount       | 浏览次数                    | integer(int64)    |                 |
| &emsp;&emsp;likeCount       | 点赞次数                    | integer(int64)    |                 |
| &emsp;&emsp;commentCount    | 评论次数                    | integer(int64)    |                 |
| &emsp;&emsp;createTime      | 创建时间                    | string(date-time) |                 |
| &emsp;&emsp;updateTime      | 更新时间                    | string(date-time) |                 |
| &emsp;&emsp;children        | 子章节列表（用于树形结构）           | array             | CourseChapterVO |

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
			"chapterName": "",
			"chapterNumber": 0,
			"parentChapterId": "",
			"description": "",
			"content": "",
			"videoUrl": "",
			"videoDuration": 0,
			"attachmentUrls": [],
			"sortOrder": 0,
			"status": 0,
			"viewCount": 0,
			"likeCount": 0,
			"commentCount": 0,
			"createTime": "",
			"updateTime": "",
			"children": [
				{
					"id": "",
					"courseId": "",
					"chapterName": "",
					"chapterNumber": 0,
					"parentChapterId": "",
					"description": "",
					"content": "",
					"videoUrl": "",
					"videoDuration": 0,
					"attachmentUrls": [],
					"sortOrder": 0,
					"status": 0,
					"viewCount": 0,
					"likeCount": 0,
					"commentCount": 0,
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

## getCourseChapterTree

**接口地址**:`/api/course/chapter/course/{courseId}/tree`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取课程章节的树形结构。</p>

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

| 参数名称                        | 参数说明                    | 类型                | schema          |
|-----------------------------|-------------------------|-------------------|-----------------| 
| success                     | 请求是否成功                  | boolean           |                 |
| code                        | 业务状态码 (200表示成功)         | integer(int32)    | integer(int32)  |
| message                     | 响应消息                    | string            |                 |
| data                        | 响应数据体 (泛型)              | array             | CourseChapterVO |
| &emsp;&emsp;id              | 章节ID                    | string(uuid)      |                 |
| &emsp;&emsp;courseId        | 所属课程ID                  | string(uuid)      |                 |
| &emsp;&emsp;chapterName     | 章节名称                    | string            |                 |
| &emsp;&emsp;chapterNumber   | 章节序号                    | integer(int32)    |                 |
| &emsp;&emsp;parentChapterId | 父章节ID                   | string(uuid)      |                 |
| &emsp;&emsp;description     | 章节描述                    | string            |                 |
| &emsp;&emsp;content         | 章节内容                    | string            |                 |
| &emsp;&emsp;videoUrl        | 视频资源URL                 | string            |                 |
| &emsp;&emsp;videoDuration   | 视频时长(秒)                 | integer(int32)    |                 |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                 | array             | string          |
| &emsp;&emsp;sortOrder       | 排序权重                    | integer(int32)    |                 |
| &emsp;&emsp;status          | 章节状态 (0=草稿, 1=发布, 2=下架) | integer(int32)    |                 |
| &emsp;&emsp;viewCount       | 浏览次数                    | integer(int64)    |                 |
| &emsp;&emsp;likeCount       | 点赞次数                    | integer(int64)    |                 |
| &emsp;&emsp;commentCount    | 评论次数                    | integer(int64)    |                 |
| &emsp;&emsp;createTime      | 创建时间                    | string(date-time) |                 |
| &emsp;&emsp;updateTime      | 更新时间                    | string(date-time) |                 |
| &emsp;&emsp;children        | 子章节列表（用于树形结构）           | array             | CourseChapterVO |

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
			"chapterName": "",
			"chapterNumber": 0,
			"parentChapterId": "",
			"description": "",
			"content": "",
			"videoUrl": "",
			"videoDuration": 0,
			"attachmentUrls": [],
			"sortOrder": 0,
			"status": 0,
			"viewCount": 0,
			"likeCount": 0,
			"commentCount": 0,
			"createTime": "",
			"updateTime": "",
			"children": [
				{
					"id": "",
					"courseId": "",
					"chapterName": "",
					"chapterNumber": 0,
					"parentChapterId": "",
					"description": "",
					"content": "",
					"videoUrl": "",
					"videoDuration": 0,
					"attachmentUrls": [],
					"sortOrder": 0,
					"status": 0,
					"viewCount": 0,
					"likeCount": 0,
					"commentCount": 0,
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

## listCourseChapter

**接口地址**:`/api/course/chapter/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据传入的条件分页查询课程章节信息。支持根据章节名称、课程ID、章节序号等字段进行查询。</p>

**请求参数**:

| 参数名称            | 参数说明                    | 请求类型  | 是否必须  | 数据类型   | schema |
|-----------------|-------------------------|-------|-------|--------|--------|
| courseId        | 所属课程ID                  | query | false | string |        |
| chapterName     | 章节名称（模糊查询）              | query | false | string |        |
| parentChapterId | 父章节ID                   | query | false | string |        |
| status          | 章节状态 (0=草稿, 1=发布, 2=下架) | query | false | string |        |
| minViewCount    | 最小浏览次数                  | query | false | string |        |
| maxViewCount    | 最大浏览次数                  | query | false | string |        |
| startTime       | 起始时间                    | query | false | string |        |
| endTime         | 结束时间                    | query | false | string |        |
| pageNum         | 当前记录起始索引                | query | false | string |        |
| pageSize        | 每页显示记录数                 | query | false | string |        |
| orderByColumn   | 排序列                     | query | false | string |        |
| isAsc           | 排序的方向,可用值:asc,desc      | query | false | string |        |
| reasonable      | 分页参数合理化                 | query | false | string |        |

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

# 论坛回复管理

## addForumReply

**接口地址**:`/api/course/reply`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>在帖子中添加一个新回复。</p>

**请求示例**:

```javascript
{
  "id": "",
  "postId": "",
  "forumId": "",
  "courseId": "",
  "sysUserId": "",
  "content": "",
  "parentReplyId": "",
  "replyToUserId": "",
  "isAnonymous": 0,
  "attachmentUrls": [],
  "imageUrls": [],
  "isAccepted": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                       | 参数说明                             | 请求类型 | 是否必须  | 数据类型           | schema        |
|----------------------------|----------------------------------|------|-------|----------------|---------------|
| forumReplyDTO              | 论坛回复数据传输对象                       | body | true  | ForumReplyDTO  | ForumReplyDTO |
| &emsp;&emsp;id             | 回复ID，更新时必须提供                     |      | false | string(uuid)   |               |
| &emsp;&emsp;postId         | 所属帖子ID                           |      | true  | string(uuid)   |               |
| &emsp;&emsp;forumId        | 所属论坛ID                           |      | true  | string(uuid)   |               |
| &emsp;&emsp;courseId       | 所属课程ID                           |      | true  | string(uuid)   |               |
| &emsp;&emsp;sysUserId      | 回复人ID                            |      | true  | string(uuid)   |               |
| &emsp;&emsp;content        | 回复内容                             |      | true  | string         |               |
| &emsp;&emsp;parentReplyId  | 父回复ID                            |      | false | string(uuid)   |               |
| &emsp;&emsp;replyToUserId  | 回复目标用户ID                         |      | false | string(uuid)   |               |
| &emsp;&emsp;isAnonymous    | 是否匿名回复 (0=实名, 1=匿名)              |      | false | integer(int32) |               |
| &emsp;&emsp;attachmentUrls | 附件URL列表                          |      | false | array          | string        |
| &emsp;&emsp;imageUrls      | 图片URL列表                          |      | false | array          | string        |
| &emsp;&emsp;isAccepted     | 是否被采纳 (0=否, 1=是)                 |      | false | integer(int32) |               |
| &emsp;&emsp;status         | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) |      | false | integer(int32) |               |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultForumReplyVO    |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                             | 类型                | schema         |
|----------------------------|----------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                           | boolean           |                |
| code                       | 业务状态码 (200表示成功)                  | integer(int32)    | integer(int32) |
| message                    | 响应消息                             | string            |                |
| data                       |                                  | ForumReplyVO      | ForumReplyVO   |
| &emsp;&emsp;id             | 回复ID                             | string(uuid)      |                |
| &emsp;&emsp;postId         | 所属帖子ID                           | string(uuid)      |                |
| &emsp;&emsp;forumId        | 所属论坛ID                           | string(uuid)      |                |
| &emsp;&emsp;courseId       | 所属课程ID                           | string(uuid)      |                |
| &emsp;&emsp;sysUserId      | 回复人ID                            | string(uuid)      |                |
| &emsp;&emsp;content        | 回复内容                             | string            |                |
| &emsp;&emsp;parentReplyId  | 父回复ID                            | string(uuid)      |                |
| &emsp;&emsp;replyToUserId  | 回复目标用户ID                         | string(uuid)      |                |
| &emsp;&emsp;isAnonymous    | 是否匿名回复 (0=实名, 1=匿名)              | integer(int32)    |                |
| &emsp;&emsp;attachmentUrls | 附件URL列表                          | array             | string         |
| &emsp;&emsp;imageUrls      | 图片URL列表                          | array             | string         |
| &emsp;&emsp;likeCount      | 点赞次数                             | integer(int64)    |                |
| &emsp;&emsp;replyCount     | 子回复次数                            | integer(int64)    |                |
| &emsp;&emsp;isAccepted     | 是否被采纳 (0=否, 1=是)                 | integer(int32)    |                |
| &emsp;&emsp;floorNumber    | 楼层号                              | integer(int32)    |                |
| &emsp;&emsp;status         | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | integer(int32)    |                |
| &emsp;&emsp;ipAddress      | 发帖IP地址                           | string            |                |
| &emsp;&emsp;userAgent      | 用户代理信息                           | string            |                |
| &emsp;&emsp;children       | 子回复列表                            | array             | ForumReplyVO   |
| &emsp;&emsp;createTime     | 创建时间                             | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                             | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"postId": "",
		"forumId": "",
		"courseId": "",
		"sysUserId": "",
		"content": "",
		"parentReplyId": "",
		"replyToUserId": "",
		"isAnonymous": 0,
		"attachmentUrls": [],
		"imageUrls": [],
		"likeCount": 0,
		"replyCount": 0,
		"isAccepted": 0,
		"floorNumber": 0,
		"status": 0,
		"ipAddress": "",
		"userAgent": "",
		"children": [
			{
				"id": "",
				"postId": "",
				"forumId": "",
				"courseId": "",
				"sysUserId": "",
				"content": "",
				"parentReplyId": "",
				"replyToUserId": "",
				"isAnonymous": 0,
				"attachmentUrls": [],
				"imageUrls": [],
				"likeCount": 0,
				"replyCount": 0,
				"isAccepted": 0,
				"floorNumber": 0,
				"status": 0,
				"ipAddress": "",
				"userAgent": "",
				"children": [
					{}
				],
				"createTime": "",
				"updateTime": ""
			}
		],
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

## updateForumReply

**接口地址**:`/api/course/reply`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>更新现有回复的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "postId": "",
  "forumId": "",
  "courseId": "",
  "sysUserId": "",
  "content": "",
  "parentReplyId": "",
  "replyToUserId": "",
  "isAnonymous": 0,
  "attachmentUrls": [],
  "imageUrls": [],
  "isAccepted": 0,
  "status": 0
}
```

**请求参数**:

| 参数名称                       | 参数说明                             | 请求类型 | 是否必须  | 数据类型           | schema        |
|----------------------------|----------------------------------|------|-------|----------------|---------------|
| forumReplyDTO              | 论坛回复数据传输对象                       | body | true  | ForumReplyDTO  | ForumReplyDTO |
| &emsp;&emsp;id             | 回复ID，更新时必须提供                     |      | false | string(uuid)   |               |
| &emsp;&emsp;postId         | 所属帖子ID                           |      | true  | string(uuid)   |               |
| &emsp;&emsp;forumId        | 所属论坛ID                           |      | true  | string(uuid)   |               |
| &emsp;&emsp;courseId       | 所属课程ID                           |      | true  | string(uuid)   |               |
| &emsp;&emsp;sysUserId      | 回复人ID                            |      | true  | string(uuid)   |               |
| &emsp;&emsp;content        | 回复内容                             |      | true  | string         |               |
| &emsp;&emsp;parentReplyId  | 父回复ID                            |      | false | string(uuid)   |               |
| &emsp;&emsp;replyToUserId  | 回复目标用户ID                         |      | false | string(uuid)   |               |
| &emsp;&emsp;isAnonymous    | 是否匿名回复 (0=实名, 1=匿名)              |      | false | integer(int32) |               |
| &emsp;&emsp;attachmentUrls | 附件URL列表                          |      | false | array          | string        |
| &emsp;&emsp;imageUrls      | 图片URL列表                          |      | false | array          | string        |
| &emsp;&emsp;isAccepted     | 是否被采纳 (0=否, 1=是)                 |      | false | integer(int32) |               |
| &emsp;&emsp;status         | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) |      | false | integer(int32) |               |

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

## removeForumReplyByIds

**接口地址**:`/api/course/reply`

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

## getForumReplyById

**接口地址**:`/api/course/reply/{id}`

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
| 200 | OK          | ResultForumReplyVO    |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                             | 类型                | schema         |
|----------------------------|----------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                           | boolean           |                |
| code                       | 业务状态码 (200表示成功)                  | integer(int32)    | integer(int32) |
| message                    | 响应消息                             | string            |                |
| data                       |                                  | ForumReplyVO      | ForumReplyVO   |
| &emsp;&emsp;id             | 回复ID                             | string(uuid)      |                |
| &emsp;&emsp;postId         | 所属帖子ID                           | string(uuid)      |                |
| &emsp;&emsp;forumId        | 所属论坛ID                           | string(uuid)      |                |
| &emsp;&emsp;courseId       | 所属课程ID                           | string(uuid)      |                |
| &emsp;&emsp;sysUserId      | 回复人ID                            | string(uuid)      |                |
| &emsp;&emsp;content        | 回复内容                             | string            |                |
| &emsp;&emsp;parentReplyId  | 父回复ID                            | string(uuid)      |                |
| &emsp;&emsp;replyToUserId  | 回复目标用户ID                         | string(uuid)      |                |
| &emsp;&emsp;isAnonymous    | 是否匿名回复 (0=实名, 1=匿名)              | integer(int32)    |                |
| &emsp;&emsp;attachmentUrls | 附件URL列表                          | array             | string         |
| &emsp;&emsp;imageUrls      | 图片URL列表                          | array             | string         |
| &emsp;&emsp;likeCount      | 点赞次数                             | integer(int64)    |                |
| &emsp;&emsp;replyCount     | 子回复次数                            | integer(int64)    |                |
| &emsp;&emsp;isAccepted     | 是否被采纳 (0=否, 1=是)                 | integer(int32)    |                |
| &emsp;&emsp;floorNumber    | 楼层号                              | integer(int32)    |                |
| &emsp;&emsp;status         | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | integer(int32)    |                |
| &emsp;&emsp;ipAddress      | 发帖IP地址                           | string            |                |
| &emsp;&emsp;userAgent      | 用户代理信息                           | string            |                |
| &emsp;&emsp;children       | 子回复列表                            | array             | ForumReplyVO   |
| &emsp;&emsp;createTime     | 创建时间                             | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                             | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"postId": "",
		"forumId": "",
		"courseId": "",
		"sysUserId": "",
		"content": "",
		"parentReplyId": "",
		"replyToUserId": "",
		"isAnonymous": 0,
		"attachmentUrls": [],
		"imageUrls": [],
		"likeCount": 0,
		"replyCount": 0,
		"isAccepted": 0,
		"floorNumber": 0,
		"status": 0,
		"ipAddress": "",
		"userAgent": "",
		"children": [
			{
				"id": "",
				"postId": "",
				"forumId": "",
				"courseId": "",
				"sysUserId": "",
				"content": "",
				"parentReplyId": "",
				"replyToUserId": "",
				"isAnonymous": 0,
				"attachmentUrls": [],
				"imageUrls": [],
				"likeCount": 0,
				"replyCount": 0,
				"isAccepted": 0,
				"floorNumber": 0,
				"status": 0,
				"ipAddress": "",
				"userAgent": "",
				"children": [
					{}
				],
				"createTime": "",
				"updateTime": ""
			}
		],
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

## removeForumReplyById

**接口地址**:`/api/course/reply/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过回复的唯一ID删除回复。</p>

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

## acceptReply

**接口地址**:`/api/course/reply/{id}/accept`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>采纳回复（仅问答区有效）。</p>

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

## likeReply

**接口地址**:`/api/course/reply/{id}/like`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>点赞回复。</p>

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

## unlikeReply

**接口地址**:`/api/course/reply/{id}/like`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>取消点赞回复。</p>

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

## getReplyStatistics

**接口地址**:`/api/course/reply/{id}/statistics`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取回复统计信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 回复ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultForumReplyVO    |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                             | 类型                | schema         |
|----------------------------|----------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                           | boolean           |                |
| code                       | 业务状态码 (200表示成功)                  | integer(int32)    | integer(int32) |
| message                    | 响应消息                             | string            |                |
| data                       |                                  | ForumReplyVO      | ForumReplyVO   |
| &emsp;&emsp;id             | 回复ID                             | string(uuid)      |                |
| &emsp;&emsp;postId         | 所属帖子ID                           | string(uuid)      |                |
| &emsp;&emsp;forumId        | 所属论坛ID                           | string(uuid)      |                |
| &emsp;&emsp;courseId       | 所属课程ID                           | string(uuid)      |                |
| &emsp;&emsp;sysUserId      | 回复人ID                            | string(uuid)      |                |
| &emsp;&emsp;content        | 回复内容                             | string            |                |
| &emsp;&emsp;parentReplyId  | 父回复ID                            | string(uuid)      |                |
| &emsp;&emsp;replyToUserId  | 回复目标用户ID                         | string(uuid)      |                |
| &emsp;&emsp;isAnonymous    | 是否匿名回复 (0=实名, 1=匿名)              | integer(int32)    |                |
| &emsp;&emsp;attachmentUrls | 附件URL列表                          | array             | string         |
| &emsp;&emsp;imageUrls      | 图片URL列表                          | array             | string         |
| &emsp;&emsp;likeCount      | 点赞次数                             | integer(int64)    |                |
| &emsp;&emsp;replyCount     | 子回复次数                            | integer(int64)    |                |
| &emsp;&emsp;isAccepted     | 是否被采纳 (0=否, 1=是)                 | integer(int32)    |                |
| &emsp;&emsp;floorNumber    | 楼层号                              | integer(int32)    |                |
| &emsp;&emsp;status         | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | integer(int32)    |                |
| &emsp;&emsp;ipAddress      | 发帖IP地址                           | string            |                |
| &emsp;&emsp;userAgent      | 用户代理信息                           | string            |                |
| &emsp;&emsp;children       | 子回复列表                            | array             | ForumReplyVO   |
| &emsp;&emsp;createTime     | 创建时间                             | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                             | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"postId": "",
		"forumId": "",
		"courseId": "",
		"sysUserId": "",
		"content": "",
		"parentReplyId": "",
		"replyToUserId": "",
		"isAnonymous": 0,
		"attachmentUrls": [],
		"imageUrls": [],
		"likeCount": 0,
		"replyCount": 0,
		"isAccepted": 0,
		"floorNumber": 0,
		"status": 0,
		"ipAddress": "",
		"userAgent": "",
		"children": [
			{
				"id": "",
				"postId": "",
				"forumId": "",
				"courseId": "",
				"sysUserId": "",
				"content": "",
				"parentReplyId": "",
				"replyToUserId": "",
				"isAnonymous": 0,
				"attachmentUrls": [],
				"imageUrls": [],
				"likeCount": 0,
				"replyCount": 0,
				"isAccepted": 0,
				"floorNumber": 0,
				"status": 0,
				"ipAddress": "",
				"userAgent": "",
				"children": [
					{}
				],
				"createTime": "",
				"updateTime": ""
			}
		],
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

## updateReplyStatus

**接口地址**:`/api/course/reply/{id}/status`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>更新回复状态（正常/删除/审核中/审核失败）。</p>

**请求参数**:

| 参数名称   | 参数说明                             | 请求类型  | 是否必须 | 数据类型           | schema |
|--------|----------------------------------|-------|------|----------------|--------|
| id     | 回复ID                             | path  | true | string(uuid)   |        |
| status | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | query | true | integer(int32) |        |

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

## getReplyTree

**接口地址**:`/api/course/reply/{id}/tree`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取回复的树形结构（包含子回复）。</p>

**请求参数**:

| 参数名称 | 参数说明  | 请求类型 | 是否必须 | 数据类型         | schema |
|------|-------|------|------|--------------|--------|
| id   | 父回复ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                 |
|-----|-------------|------------------------| 
| 200 | OK          | ResultListForumReplyVO |
| 400 | Bad Request | ResultMapStringString  |
| 403 | Forbidden   | ResultString           |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                             | 类型                | schema         |
|----------------------------|----------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                           | boolean           |                |
| code                       | 业务状态码 (200表示成功)                  | integer(int32)    | integer(int32) |
| message                    | 响应消息                             | string            |                |
| data                       | 响应数据体 (泛型)                       | array             | ForumReplyVO   |
| &emsp;&emsp;id             | 回复ID                             | string(uuid)      |                |
| &emsp;&emsp;postId         | 所属帖子ID                           | string(uuid)      |                |
| &emsp;&emsp;forumId        | 所属论坛ID                           | string(uuid)      |                |
| &emsp;&emsp;courseId       | 所属课程ID                           | string(uuid)      |                |
| &emsp;&emsp;sysUserId      | 回复人ID                            | string(uuid)      |                |
| &emsp;&emsp;content        | 回复内容                             | string            |                |
| &emsp;&emsp;parentReplyId  | 父回复ID                            | string(uuid)      |                |
| &emsp;&emsp;replyToUserId  | 回复目标用户ID                         | string(uuid)      |                |
| &emsp;&emsp;isAnonymous    | 是否匿名回复 (0=实名, 1=匿名)              | integer(int32)    |                |
| &emsp;&emsp;attachmentUrls | 附件URL列表                          | array             | string         |
| &emsp;&emsp;imageUrls      | 图片URL列表                          | array             | string         |
| &emsp;&emsp;likeCount      | 点赞次数                             | integer(int64)    |                |
| &emsp;&emsp;replyCount     | 子回复次数                            | integer(int64)    |                |
| &emsp;&emsp;isAccepted     | 是否被采纳 (0=否, 1=是)                 | integer(int32)    |                |
| &emsp;&emsp;floorNumber    | 楼层号                              | integer(int32)    |                |
| &emsp;&emsp;status         | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | integer(int32)    |                |
| &emsp;&emsp;ipAddress      | 发帖IP地址                           | string            |                |
| &emsp;&emsp;userAgent      | 用户代理信息                           | string            |                |
| &emsp;&emsp;children       | 子回复列表                            | array             | ForumReplyVO   |
| &emsp;&emsp;createTime     | 创建时间                             | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                             | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"postId": "",
			"forumId": "",
			"courseId": "",
			"sysUserId": "",
			"content": "",
			"parentReplyId": "",
			"replyToUserId": "",
			"isAnonymous": 0,
			"attachmentUrls": [],
			"imageUrls": [],
			"likeCount": 0,
			"replyCount": 0,
			"isAccepted": 0,
			"floorNumber": 0,
			"status": 0,
			"ipAddress": "",
			"userAgent": "",
			"children": [
				{
					"id": "",
					"postId": "",
					"forumId": "",
					"courseId": "",
					"sysUserId": "",
					"content": "",
					"parentReplyId": "",
					"replyToUserId": "",
					"isAnonymous": 0,
					"attachmentUrls": [],
					"imageUrls": [],
					"likeCount": 0,
					"replyCount": 0,
					"isAccepted": 0,
					"floorNumber": 0,
					"status": 0,
					"ipAddress": "",
					"userAgent": "",
					"children": [
						{}
					],
					"createTime": "",
					"updateTime": ""
				}
			],
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

## unacceptReply

**接口地址**:`/api/course/reply/{id}/unaccept`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>取消采纳回复（仅问答区有效）。</p>

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

## listForumReplyByCourseId

**接口地址**:`/api/course/reply/course/{courseId}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据课程ID获取该课程下的所有回复列表。</p>

**请求参数**:

| 参数名称          | 参数说明                             | 请求类型  | 是否必须  | 数据类型         | schema |
|---------------|----------------------------------|-------|-------|--------------|--------|
| courseId      | 课程ID                             | path  | true  | string(uuid) |        |
| postId        | 所属帖子ID                           | query | false | string       |        |
| forumId       | 所属论坛ID                           | query | false | string       |        |
| sysUserId     | 回复人ID                            | query | false | string       |        |
| parentReplyId | 父回复ID                            | query | false | string       |        |
| replyToUserId | 回复目标用户ID                         | query | false | string       |        |
| isAnonymous   | 是否匿名回复 (0=实名, 1=匿名)              | query | false | string       |        |
| isAccepted    | 是否被采纳 (0=否, 1=是)                 | query | false | string       |        |
| status        | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | query | false | string       |        |
| startTime     | 起始时间                             | query | false | string       |        |
| endTime       | 结束时间                             | query | false | string       |        |
| pageNum       | 当前记录起始索引                         | query | false | string       |        |
| pageSize      | 每页显示记录数                          | query | false | string       |        |
| orderByColumn | 排序列                              | query | false | string       |        |
| isAsc         | 排序的方向,可用值:asc,desc               | query | false | string       |        |
| reasonable    | 分页参数合理化                          | query | false | string       |        |

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

## listForumReplyByForumId

**接口地址**:`/api/course/reply/forum/{forumId}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据论坛ID获取该论坛下的所有回复列表。</p>

**请求参数**:

| 参数名称          | 参数说明                             | 请求类型  | 是否必须  | 数据类型         | schema |
|---------------|----------------------------------|-------|-------|--------------|--------|
| forumId       | 论坛ID                             | path  | true  | string(uuid) |        |
| postId        | 所属帖子ID                           | query | false | string       |        |
| courseId      | 所属课程ID                           | query | false | string       |        |
| sysUserId     | 回复人ID                            | query | false | string       |        |
| parentReplyId | 父回复ID                            | query | false | string       |        |
| replyToUserId | 回复目标用户ID                         | query | false | string       |        |
| isAnonymous   | 是否匿名回复 (0=实名, 1=匿名)              | query | false | string       |        |
| isAccepted    | 是否被采纳 (0=否, 1=是)                 | query | false | string       |        |
| status        | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | query | false | string       |        |
| startTime     | 起始时间                             | query | false | string       |        |
| endTime       | 结束时间                             | query | false | string       |        |
| pageNum       | 当前记录起始索引                         | query | false | string       |        |
| pageSize      | 每页显示记录数                          | query | false | string       |        |
| orderByColumn | 排序列                              | query | false | string       |        |
| isAsc         | 排序的方向,可用值:asc,desc               | query | false | string       |        |
| reasonable    | 分页参数合理化                          | query | false | string       |        |

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

## listForumReply

**接口地址**:`/api/course/reply/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据传入的条件分页查询论坛回复信息。支持根据回复内容、作者、帖子ID等字段进行查询。</p>

**请求参数**:

| 参数名称          | 参数说明                             | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|----------------------------------|-------|-------|--------|--------|
| postId        | 所属帖子ID                           | query | false | string |        |
| forumId       | 所属论坛ID                           | query | false | string |        |
| courseId      | 所属课程ID                           | query | false | string |        |
| sysUserId     | 回复人ID                            | query | false | string |        |
| parentReplyId | 父回复ID                            | query | false | string |        |
| replyToUserId | 回复目标用户ID                         | query | false | string |        |
| isAnonymous   | 是否匿名回复 (0=实名, 1=匿名)              | query | false | string |        |
| isAccepted    | 是否被采纳 (0=否, 1=是)                 | query | false | string |        |
| status        | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | query | false | string |        |
| startTime     | 起始时间                             | query | false | string |        |
| endTime       | 结束时间                             | query | false | string |        |
| pageNum       | 当前记录起始索引                         | query | false | string |        |
| pageSize      | 每页显示记录数                          | query | false | string |        |
| orderByColumn | 排序列                              | query | false | string |        |
| isAsc         | 排序的方向,可用值:asc,desc               | query | false | string |        |
| reasonable    | 分页参数合理化                          | query | false | string |        |

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

## listForumReplyByPostId

**接口地址**:`/api/course/reply/post/{postId}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据帖子ID获取该帖子下的所有回复列表。</p>

**请求参数**:

| 参数名称          | 参数说明                             | 请求类型  | 是否必须  | 数据类型         | schema |
|---------------|----------------------------------|-------|-------|--------------|--------|
| postId        | 帖子ID                             | path  | true  | string(uuid) |        |
| forumId       | 所属论坛ID                           | query | false | string       |        |
| courseId      | 所属课程ID                           | query | false | string       |        |
| sysUserId     | 回复人ID                            | query | false | string       |        |
| parentReplyId | 父回复ID                            | query | false | string       |        |
| replyToUserId | 回复目标用户ID                         | query | false | string       |        |
| isAnonymous   | 是否匿名回复 (0=实名, 1=匿名)              | query | false | string       |        |
| isAccepted    | 是否被采纳 (0=否, 1=是)                 | query | false | string       |        |
| status        | 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | query | false | string       |        |
| startTime     | 起始时间                             | query | false | string       |        |
| endTime       | 结束时间                             | query | false | string       |        |
| pageNum       | 当前记录起始索引                         | query | false | string       |        |
| pageSize      | 每页显示记录数                          | query | false | string       |        |
| orderByColumn | 排序列                              | query | false | string       |        |
| isAsc         | 排序的方向,可用值:asc,desc               | query | false | string       |        |
| reasonable    | 分页参数合理化                          | query | false | string       |        |

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

# 论坛帖子管理

## addForumPost

**接口地址**:`/api/course/post`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>在论坛中发布一个新帖子。</p>

**请求示例**:

```javascript
{
  "id": "",
  "forumId": "",
  "courseId": "",
  "sysUserId": "",
  "title": "",
  "content": "",
  "postType": 0,
  "isAnonymous": 0,
  "attachmentUrls": [],
  "imageUrls": [],
  "tags": [],
  "isTop": 0,
  "isEssence": 0,
  "isLocked": 0,
  "status": 0,
  "chapterId": ""
}
```

**请求参数**:

| 参数名称                       | 参数说明                                | 请求类型 | 是否必须  | 数据类型           | schema       |
|----------------------------|-------------------------------------|------|-------|----------------|--------------|
| forumPostDTO               | 论坛帖子数据传输对象                          | body | true  | ForumPostDTO   | ForumPostDTO |
| &emsp;&emsp;id             | 帖子ID，更新时必须提供                        |      | false | string(uuid)   |              |
| &emsp;&emsp;forumId        | 所属论坛ID                              |      | true  | string(uuid)   |              |
| &emsp;&emsp;courseId       | 所属课程ID                              |      | true  | string(uuid)   |              |
| &emsp;&emsp;sysUserId      | 发帖人ID                               |      | true  | string(uuid)   |              |
| &emsp;&emsp;title          | 帖子标题                                |      | true  | string         |              |
| &emsp;&emsp;content        | 帖子内容                                |      | true  | string         |              |
| &emsp;&emsp;postType       | 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) |      | false | integer(int32) |              |
| &emsp;&emsp;isAnonymous    | 是否匿名发帖 (0=实名, 1=匿名)                 |      | false | integer(int32) |              |
| &emsp;&emsp;attachmentUrls | 附件URL列表                             |      | false | array          | string       |
| &emsp;&emsp;imageUrls      | 图片URL列表                             |      | false | array          | string       |
| &emsp;&emsp;tags           | 标签列表                                |      | false | array          | string       |
| &emsp;&emsp;isTop          | 是否置顶 (0=否, 1=是)                     |      | false | integer(int32) |              |
| &emsp;&emsp;isEssence      | 是否精华 (0=否, 1=是)                     |      | false | integer(int32) |              |
| &emsp;&emsp;isLocked       | 是否锁定 (0=否, 1=是)                     |      | false | integer(int32) |              |
| &emsp;&emsp;status         | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败)    |      | false | integer(int32) |              |
| &emsp;&emsp;chapterId      | 关联章节ID                              |      | false | string(uuid)   |              |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultForumPostVO     |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                        | 参数说明                                | 类型                | schema         |
|-----------------------------|-------------------------------------|-------------------|----------------| 
| success                     | 请求是否成功                              | boolean           |                |
| code                        | 业务状态码 (200表示成功)                     | integer(int32)    | integer(int32) |
| message                     | 响应消息                                | string            |                |
| data                        |                                     | ForumPostVO       | ForumPostVO    |
| &emsp;&emsp;id              | 帖子ID                                | string(uuid)      |                |
| &emsp;&emsp;forumId         | 所属论坛ID                              | string(uuid)      |                |
| &emsp;&emsp;courseId        | 所属课程ID                              | string(uuid)      |                |
| &emsp;&emsp;sysUserId       | 发帖人ID                               | string(uuid)      |                |
| &emsp;&emsp;title           | 帖子标题                                | string            |                |
| &emsp;&emsp;content         | 帖子内容                                | string            |                |
| &emsp;&emsp;postType        | 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) | integer(int32)    |                |
| &emsp;&emsp;isAnonymous     | 是否匿名发帖 (0=实名, 1=匿名)                 | integer(int32)    |                |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                             | array             | string         |
| &emsp;&emsp;imageUrls       | 图片URL列表                             | array             | string         |
| &emsp;&emsp;tags            | 标签列表                                | array             | string         |
| &emsp;&emsp;viewCount       | 浏览次数                                | integer(int64)    |                |
| &emsp;&emsp;likeCount       | 点赞次数                                | integer(int64)    |                |
| &emsp;&emsp;replyCount      | 回复次数                                | integer(int64)    |                |
| &emsp;&emsp;shareCount      | 分享次数                                | integer(int64)    |                |
| &emsp;&emsp;isTop           | 是否置顶 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;isEssence       | 是否精华 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;isLocked        | 是否锁定 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;lastReplyId     | 最新回复ID                              | string(uuid)      |                |
| &emsp;&emsp;lastReplyTime   | 最新回复时间                              | string(date-time) |                |
| &emsp;&emsp;lastReplyUserId | 最新回复用户ID                            | string(uuid)      |                |
| &emsp;&emsp;status          | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败)    | integer(int32)    |                |
| &emsp;&emsp;chapterId       | 关联章节ID                              | string(uuid)      |                |
| &emsp;&emsp;createTime      | 创建时间                                | string(date-time) |                |
| &emsp;&emsp;updateTime      | 更新时间                                | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"forumId": "",
		"courseId": "",
		"sysUserId": "",
		"title": "",
		"content": "",
		"postType": 0,
		"isAnonymous": 0,
		"attachmentUrls": [],
		"imageUrls": [],
		"tags": [],
		"viewCount": 0,
		"likeCount": 0,
		"replyCount": 0,
		"shareCount": 0,
		"isTop": 0,
		"isEssence": 0,
		"isLocked": 0,
		"lastReplyId": "",
		"lastReplyTime": "",
		"lastReplyUserId": "",
		"status": 0,
		"chapterId": "",
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

## updateForumPost

**接口地址**:`/api/course/post`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>更新现有帖子的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "forumId": "",
  "courseId": "",
  "sysUserId": "",
  "title": "",
  "content": "",
  "postType": 0,
  "isAnonymous": 0,
  "attachmentUrls": [],
  "imageUrls": [],
  "tags": [],
  "isTop": 0,
  "isEssence": 0,
  "isLocked": 0,
  "status": 0,
  "chapterId": ""
}
```

**请求参数**:

| 参数名称                       | 参数说明                                | 请求类型 | 是否必须  | 数据类型           | schema       |
|----------------------------|-------------------------------------|------|-------|----------------|--------------|
| forumPostDTO               | 论坛帖子数据传输对象                          | body | true  | ForumPostDTO   | ForumPostDTO |
| &emsp;&emsp;id             | 帖子ID，更新时必须提供                        |      | false | string(uuid)   |              |
| &emsp;&emsp;forumId        | 所属论坛ID                              |      | true  | string(uuid)   |              |
| &emsp;&emsp;courseId       | 所属课程ID                              |      | true  | string(uuid)   |              |
| &emsp;&emsp;sysUserId      | 发帖人ID                               |      | true  | string(uuid)   |              |
| &emsp;&emsp;title          | 帖子标题                                |      | true  | string         |              |
| &emsp;&emsp;content        | 帖子内容                                |      | true  | string         |              |
| &emsp;&emsp;postType       | 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) |      | false | integer(int32) |              |
| &emsp;&emsp;isAnonymous    | 是否匿名发帖 (0=实名, 1=匿名)                 |      | false | integer(int32) |              |
| &emsp;&emsp;attachmentUrls | 附件URL列表                             |      | false | array          | string       |
| &emsp;&emsp;imageUrls      | 图片URL列表                             |      | false | array          | string       |
| &emsp;&emsp;tags           | 标签列表                                |      | false | array          | string       |
| &emsp;&emsp;isTop          | 是否置顶 (0=否, 1=是)                     |      | false | integer(int32) |              |
| &emsp;&emsp;isEssence      | 是否精华 (0=否, 1=是)                     |      | false | integer(int32) |              |
| &emsp;&emsp;isLocked       | 是否锁定 (0=否, 1=是)                     |      | false | integer(int32) |              |
| &emsp;&emsp;status         | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败)    |      | false | integer(int32) |              |
| &emsp;&emsp;chapterId      | 关联章节ID                              |      | false | string(uuid)   |              |

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

## removeForumPostByIds

**接口地址**:`/api/course/post`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>根据帖子ID列表批量删除帖子。</p>

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

## getForumPostById

**接口地址**:`/api/course/post/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过帖子的唯一ID获取其详细信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 帖子ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultForumPostVO     |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                        | 参数说明                                | 类型                | schema         |
|-----------------------------|-------------------------------------|-------------------|----------------| 
| success                     | 请求是否成功                              | boolean           |                |
| code                        | 业务状态码 (200表示成功)                     | integer(int32)    | integer(int32) |
| message                     | 响应消息                                | string            |                |
| data                        |                                     | ForumPostVO       | ForumPostVO    |
| &emsp;&emsp;id              | 帖子ID                                | string(uuid)      |                |
| &emsp;&emsp;forumId         | 所属论坛ID                              | string(uuid)      |                |
| &emsp;&emsp;courseId        | 所属课程ID                              | string(uuid)      |                |
| &emsp;&emsp;sysUserId       | 发帖人ID                               | string(uuid)      |                |
| &emsp;&emsp;title           | 帖子标题                                | string            |                |
| &emsp;&emsp;content         | 帖子内容                                | string            |                |
| &emsp;&emsp;postType        | 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) | integer(int32)    |                |
| &emsp;&emsp;isAnonymous     | 是否匿名发帖 (0=实名, 1=匿名)                 | integer(int32)    |                |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                             | array             | string         |
| &emsp;&emsp;imageUrls       | 图片URL列表                             | array             | string         |
| &emsp;&emsp;tags            | 标签列表                                | array             | string         |
| &emsp;&emsp;viewCount       | 浏览次数                                | integer(int64)    |                |
| &emsp;&emsp;likeCount       | 点赞次数                                | integer(int64)    |                |
| &emsp;&emsp;replyCount      | 回复次数                                | integer(int64)    |                |
| &emsp;&emsp;shareCount      | 分享次数                                | integer(int64)    |                |
| &emsp;&emsp;isTop           | 是否置顶 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;isEssence       | 是否精华 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;isLocked        | 是否锁定 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;lastReplyId     | 最新回复ID                              | string(uuid)      |                |
| &emsp;&emsp;lastReplyTime   | 最新回复时间                              | string(date-time) |                |
| &emsp;&emsp;lastReplyUserId | 最新回复用户ID                            | string(uuid)      |                |
| &emsp;&emsp;status          | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败)    | integer(int32)    |                |
| &emsp;&emsp;chapterId       | 关联章节ID                              | string(uuid)      |                |
| &emsp;&emsp;createTime      | 创建时间                                | string(date-time) |                |
| &emsp;&emsp;updateTime      | 更新时间                                | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"forumId": "",
		"courseId": "",
		"sysUserId": "",
		"title": "",
		"content": "",
		"postType": 0,
		"isAnonymous": 0,
		"attachmentUrls": [],
		"imageUrls": [],
		"tags": [],
		"viewCount": 0,
		"likeCount": 0,
		"replyCount": 0,
		"shareCount": 0,
		"isTop": 0,
		"isEssence": 0,
		"isLocked": 0,
		"lastReplyId": "",
		"lastReplyTime": "",
		"lastReplyUserId": "",
		"status": 0,
		"chapterId": "",
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

## removeForumPostById

**接口地址**:`/api/course/post/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过帖子的唯一ID删除帖子。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 帖子ID | path | true | string(uuid) |        |

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

## setPostEssence

**接口地址**:`/api/course/post/{id}/essence`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>设置帖子精华状态。</p>

**请求参数**:

| 参数名称      | 参数说明            | 请求类型  | 是否必须 | 数据类型           | schema |
|-----------|-----------------|-------|------|----------------|--------|
| id        | 帖子ID            | path  | true | string(uuid)   |        |
| isEssence | 是否精华 (0=否, 1=是) | query | true | integer(int32) |        |

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

## likePost

**接口地址**:`/api/course/post/{id}/like`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>点赞帖子。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 帖子ID | path | true | string(uuid) |        |

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

## unlikePost

**接口地址**:`/api/course/post/{id}/like`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>取消点赞帖子。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 帖子ID | path | true | string(uuid) |        |

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

## setPostLock

**接口地址**:`/api/course/post/{id}/lock`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>设置帖子锁定状态。</p>

**请求参数**:

| 参数名称     | 参数说明            | 请求类型  | 是否必须 | 数据类型           | schema |
|----------|-----------------|-------|------|----------------|--------|
| id       | 帖子ID            | path  | true | string(uuid)   |        |
| isLocked | 是否锁定 (0=否, 1=是) | query | true | integer(int32) |        |

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

## sharePost

**接口地址**:`/api/course/post/{id}/share`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>分享帖子。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 帖子ID | path | true | string(uuid) |        |

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

## updatePostStatus

**接口地址**:`/api/course/post/{id}/status`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>更新帖子状态（正常/删除/审核中/审核失败）。</p>

**请求参数**:

| 参数名称   | 参数说明                             | 请求类型  | 是否必须 | 数据类型           | schema |
|--------|----------------------------------|-------|------|----------------|--------|
| id     | 帖子ID                             | path  | true | string(uuid)   |        |
| status | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) | query | true | integer(int32) |        |

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

## setPostTop

**接口地址**:`/api/course/post/{id}/top`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>设置帖子置顶状态。</p>

**请求参数**:

| 参数名称  | 参数说明            | 请求类型  | 是否必须 | 数据类型           | schema |
|-------|-----------------|-------|------|----------------|--------|
| id    | 帖子ID            | path  | true | string(uuid)   |        |
| isTop | 是否置顶 (0=否, 1=是) | query | true | integer(int32) |        |

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

## viewPost

**接口地址**:`/api/course/post/{id}/view`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>浏览帖子（增加浏览次数）。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 帖子ID | path | true | string(uuid) |        |

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

## listForumPostByCourseId

**接口地址**:`/api/course/post/course/{courseId}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据课程ID获取该课程下的所有帖子列表。</p>

**请求参数**:

| 参数名称          | 参数说明                                | 请求类型  | 是否必须  | 数据类型         | schema |
|---------------|-------------------------------------|-------|-------|--------------|--------|
| courseId      | 课程ID                                | path  | true  | string(uuid) |        |
| forumId       | 所属论坛ID                              | query | false | string       |        |
| sysUserId     | 发帖人ID                               | query | false | string       |        |
| title         | 帖子标题（模糊查询）                          | query | false | string       |        |
| postType      | 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) | query | false | string       |        |
| isAnonymous   | 是否匿名发帖 (0=实名, 1=匿名)                 | query | false | string       |        |
| isTop         | 是否置顶 (0=否, 1=是)                     | query | false | string       |        |
| isEssence     | 是否精华 (0=否, 1=是)                     | query | false | string       |        |
| isLocked      | 是否锁定 (0=否, 1=是)                     | query | false | string       |        |
| status        | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败)    | query | false | string       |        |
| chapterId     | 关联章节ID                              | query | false | string       |        |
| tag           | 标签（模糊查询）                            | query | false | string       |        |
| startTime     | 起始时间                                | query | false | string       |        |
| endTime       | 结束时间                                | query | false | string       |        |
| pageNum       | 当前记录起始索引                            | query | false | string       |        |
| pageSize      | 每页显示记录数                             | query | false | string       |        |
| orderByColumn | 排序列                                 | query | false | string       |        |
| isAsc         | 排序的方向,可用值:asc,desc                  | query | false | string       |        |
| reasonable    | 分页参数合理化                             | query | false | string       |        |

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

## listForumPostByForumId

**接口地址**:`/api/course/post/forum/{forumId}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据论坛ID获取该论坛下的所有帖子列表。</p>

**请求参数**:

| 参数名称          | 参数说明                                | 请求类型  | 是否必须  | 数据类型         | schema |
|---------------|-------------------------------------|-------|-------|--------------|--------|
| forumId       | 论坛ID                                | path  | true  | string(uuid) |        |
| courseId      | 所属课程ID                              | query | false | string       |        |
| sysUserId     | 发帖人ID                               | query | false | string       |        |
| title         | 帖子标题（模糊查询）                          | query | false | string       |        |
| postType      | 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) | query | false | string       |        |
| isAnonymous   | 是否匿名发帖 (0=实名, 1=匿名)                 | query | false | string       |        |
| isTop         | 是否置顶 (0=否, 1=是)                     | query | false | string       |        |
| isEssence     | 是否精华 (0=否, 1=是)                     | query | false | string       |        |
| isLocked      | 是否锁定 (0=否, 1=是)                     | query | false | string       |        |
| status        | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败)    | query | false | string       |        |
| chapterId     | 关联章节ID                              | query | false | string       |        |
| tag           | 标签（模糊查询）                            | query | false | string       |        |
| startTime     | 起始时间                                | query | false | string       |        |
| endTime       | 结束时间                                | query | false | string       |        |
| pageNum       | 当前记录起始索引                            | query | false | string       |        |
| pageSize      | 每页显示记录数                             | query | false | string       |        |
| orderByColumn | 排序列                                 | query | false | string       |        |
| isAsc         | 排序的方向,可用值:asc,desc                  | query | false | string       |        |
| reasonable    | 分页参数合理化                             | query | false | string       |        |

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

## getHotPosts

**接口地址**:`/api/course/post/hot`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取热门帖子列表。</p>

**请求参数**:

| 参数名称  | 参数说明   | 请求类型  | 是否必须  | 数据类型           | schema |
|-------|--------|-------|-------|----------------|--------|
| limit | 返回数量限制 | query | false | integer(int32) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultListForumPostVO |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                        | 参数说明                                | 类型                | schema         |
|-----------------------------|-------------------------------------|-------------------|----------------| 
| success                     | 请求是否成功                              | boolean           |                |
| code                        | 业务状态码 (200表示成功)                     | integer(int32)    | integer(int32) |
| message                     | 响应消息                                | string            |                |
| data                        | 响应数据体 (泛型)                          | array             | ForumPostVO    |
| &emsp;&emsp;id              | 帖子ID                                | string(uuid)      |                |
| &emsp;&emsp;forumId         | 所属论坛ID                              | string(uuid)      |                |
| &emsp;&emsp;courseId        | 所属课程ID                              | string(uuid)      |                |
| &emsp;&emsp;sysUserId       | 发帖人ID                               | string(uuid)      |                |
| &emsp;&emsp;title           | 帖子标题                                | string            |                |
| &emsp;&emsp;content         | 帖子内容                                | string            |                |
| &emsp;&emsp;postType        | 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) | integer(int32)    |                |
| &emsp;&emsp;isAnonymous     | 是否匿名发帖 (0=实名, 1=匿名)                 | integer(int32)    |                |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                             | array             | string         |
| &emsp;&emsp;imageUrls       | 图片URL列表                             | array             | string         |
| &emsp;&emsp;tags            | 标签列表                                | array             | string         |
| &emsp;&emsp;viewCount       | 浏览次数                                | integer(int64)    |                |
| &emsp;&emsp;likeCount       | 点赞次数                                | integer(int64)    |                |
| &emsp;&emsp;replyCount      | 回复次数                                | integer(int64)    |                |
| &emsp;&emsp;shareCount      | 分享次数                                | integer(int64)    |                |
| &emsp;&emsp;isTop           | 是否置顶 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;isEssence       | 是否精华 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;isLocked        | 是否锁定 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;lastReplyId     | 最新回复ID                              | string(uuid)      |                |
| &emsp;&emsp;lastReplyTime   | 最新回复时间                              | string(date-time) |                |
| &emsp;&emsp;lastReplyUserId | 最新回复用户ID                            | string(uuid)      |                |
| &emsp;&emsp;status          | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败)    | integer(int32)    |                |
| &emsp;&emsp;chapterId       | 关联章节ID                              | string(uuid)      |                |
| &emsp;&emsp;createTime      | 创建时间                                | string(date-time) |                |
| &emsp;&emsp;updateTime      | 更新时间                                | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"forumId": "",
			"courseId": "",
			"sysUserId": "",
			"title": "",
			"content": "",
			"postType": 0,
			"isAnonymous": 0,
			"attachmentUrls": [],
			"imageUrls": [],
			"tags": [],
			"viewCount": 0,
			"likeCount": 0,
			"replyCount": 0,
			"shareCount": 0,
			"isTop": 0,
			"isEssence": 0,
			"isLocked": 0,
			"lastReplyId": "",
			"lastReplyTime": "",
			"lastReplyUserId": "",
			"status": 0,
			"chapterId": "",
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

## getLatestPosts

**接口地址**:`/api/course/post/latest`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取最新帖子列表。</p>

**请求参数**:

| 参数名称  | 参数说明   | 请求类型  | 是否必须  | 数据类型           | schema |
|-------|--------|-------|-------|----------------|--------|
| limit | 返回数量限制 | query | false | integer(int32) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultListForumPostVO |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                        | 参数说明                                | 类型                | schema         |
|-----------------------------|-------------------------------------|-------------------|----------------| 
| success                     | 请求是否成功                              | boolean           |                |
| code                        | 业务状态码 (200表示成功)                     | integer(int32)    | integer(int32) |
| message                     | 响应消息                                | string            |                |
| data                        | 响应数据体 (泛型)                          | array             | ForumPostVO    |
| &emsp;&emsp;id              | 帖子ID                                | string(uuid)      |                |
| &emsp;&emsp;forumId         | 所属论坛ID                              | string(uuid)      |                |
| &emsp;&emsp;courseId        | 所属课程ID                              | string(uuid)      |                |
| &emsp;&emsp;sysUserId       | 发帖人ID                               | string(uuid)      |                |
| &emsp;&emsp;title           | 帖子标题                                | string            |                |
| &emsp;&emsp;content         | 帖子内容                                | string            |                |
| &emsp;&emsp;postType        | 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) | integer(int32)    |                |
| &emsp;&emsp;isAnonymous     | 是否匿名发帖 (0=实名, 1=匿名)                 | integer(int32)    |                |
| &emsp;&emsp;attachmentUrls  | 附件URL列表                             | array             | string         |
| &emsp;&emsp;imageUrls       | 图片URL列表                             | array             | string         |
| &emsp;&emsp;tags            | 标签列表                                | array             | string         |
| &emsp;&emsp;viewCount       | 浏览次数                                | integer(int64)    |                |
| &emsp;&emsp;likeCount       | 点赞次数                                | integer(int64)    |                |
| &emsp;&emsp;replyCount      | 回复次数                                | integer(int64)    |                |
| &emsp;&emsp;shareCount      | 分享次数                                | integer(int64)    |                |
| &emsp;&emsp;isTop           | 是否置顶 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;isEssence       | 是否精华 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;isLocked        | 是否锁定 (0=否, 1=是)                     | integer(int32)    |                |
| &emsp;&emsp;lastReplyId     | 最新回复ID                              | string(uuid)      |                |
| &emsp;&emsp;lastReplyTime   | 最新回复时间                              | string(date-time) |                |
| &emsp;&emsp;lastReplyUserId | 最新回复用户ID                            | string(uuid)      |                |
| &emsp;&emsp;status          | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败)    | integer(int32)    |                |
| &emsp;&emsp;chapterId       | 关联章节ID                              | string(uuid)      |                |
| &emsp;&emsp;createTime      | 创建时间                                | string(date-time) |                |
| &emsp;&emsp;updateTime      | 更新时间                                | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"forumId": "",
			"courseId": "",
			"sysUserId": "",
			"title": "",
			"content": "",
			"postType": 0,
			"isAnonymous": 0,
			"attachmentUrls": [],
			"imageUrls": [],
			"tags": [],
			"viewCount": 0,
			"likeCount": 0,
			"replyCount": 0,
			"shareCount": 0,
			"isTop": 0,
			"isEssence": 0,
			"isLocked": 0,
			"lastReplyId": "",
			"lastReplyTime": "",
			"lastReplyUserId": "",
			"status": 0,
			"chapterId": "",
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

## listForumPost

**接口地址**:`/api/course/post/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据传入的条件分页查询论坛帖子信息。支持根据帖子标题、内容、作者、论坛ID等字段进行查询。</p>

**请求参数**:

| 参数名称          | 参数说明                                | 请求类型  | 是否必须  | 数据类型   | schema |
|---------------|-------------------------------------|-------|-------|--------|--------|
| forumId       | 所属论坛ID                              | query | false | string |        |
| courseId      | 所属课程ID                              | query | false | string |        |
| sysUserId     | 发帖人ID                               | query | false | string |        |
| title         | 帖子标题（模糊查询）                          | query | false | string |        |
| postType      | 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) | query | false | string |        |
| isAnonymous   | 是否匿名发帖 (0=实名, 1=匿名)                 | query | false | string |        |
| isTop         | 是否置顶 (0=否, 1=是)                     | query | false | string |        |
| isEssence     | 是否精华 (0=否, 1=是)                     | query | false | string |        |
| isLocked      | 是否锁定 (0=否, 1=是)                     | query | false | string |        |
| status        | 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败)    | query | false | string |        |
| chapterId     | 关联章节ID                              | query | false | string |        |
| tag           | 标签（模糊查询）                            | query | false | string |        |
| startTime     | 起始时间                                | query | false | string |        |
| endTime       | 结束时间                                | query | false | string |        |
| pageNum       | 当前记录起始索引                            | query | false | string |        |
| pageSize      | 每页显示记录数                             | query | false | string |        |
| orderByColumn | 排序列                                 | query | false | string |        |
| isAsc         | 排序的方向,可用值:asc,desc                  | query | false | string |        |
| reasonable    | 分页参数合理化                             | query | false | string |        |

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