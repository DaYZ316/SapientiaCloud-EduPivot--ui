# SapientiaCloud-EduPivot--student API

**简介**:SapientiaCloud-EduPivot--student API

**HOST**:http://192.168.77.249:31605

**联系人**:DaYZ

**Version**:1.0.0

**接口路径**:/api/student/v3/api-docs

[TOC]

# 学生管理

## 添加新学生

**接口地址**:`/api/student/student`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>向系统中添加一个新的学生。</p>

**请求示例**:

```javascript
{
  "studentCode": "",
  "realName": "",
  "birthDate": "",
  "admissionYear": 0,
  "major": "",
  "academicStatus": 0,
  "description": "",
  "sysUserId": ""
}
```

**请求参数**:

| 参数名称                       | 参数说明                          | 请求类型 | 是否必须  | 数据类型           | schema        |
|----------------------------|-------------------------------|------|-------|----------------|---------------|
| studentAddDTO              | 学生添加信息数据传输对象                  | body | true  | StudentAddDTO  | StudentAddDTO |
| &emsp;&emsp;studentCode    | 学号                            |      | true  | string         |               |
| &emsp;&emsp;realName       | 学生真实姓名                        |      | true  | string         |               |
| &emsp;&emsp;birthDate      | 出生日期                          |      | false | string(date)   |               |
| &emsp;&emsp;admissionYear  | 入学年份                          |      | false | integer(int32) |               |
| &emsp;&emsp;major          | 专业                            |      | false | string         |               |
| &emsp;&emsp;academicStatus | 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) |      | false | integer(int32) |               |
| &emsp;&emsp;description    | 自我描述                          |      | false | string         |               |
| &emsp;&emsp;sysUserId      | 系统用户ID                        |      | false | string(uuid)   |               |

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

## 更新学生信息

**接口地址**:`/api/student/student`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>更新现有学生的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "studentCode": "",
  "realName": "",
  "birthDate": "",
  "admissionYear": 0,
  "major": "",
  "academicStatus": 0,
  "description": "",
  "sysUserId": ""
}
```

**请求参数**:

| 参数名称                       | 参数说明                          | 请求类型 | 是否必须  | 数据类型           | schema     |
|----------------------------|-------------------------------|------|-------|----------------|------------|
| studentDTO                 | 学生信息数据传输对象                    | body | true  | StudentDTO     | StudentDTO |
| &emsp;&emsp;id             | 学生ID，更新时必须提供                  |      | false | string(uuid)   |            |
| &emsp;&emsp;studentCode    | 学号                            |      | true  | string         |            |
| &emsp;&emsp;realName       | 学生真实姓名                        |      | true  | string         |            |
| &emsp;&emsp;birthDate      | 出生日期                          |      | false | string(date)   |            |
| &emsp;&emsp;admissionYear  | 入学年份                          |      | false | integer(int32) |            |
| &emsp;&emsp;major          | 专业                            |      | false | string         |            |
| &emsp;&emsp;academicStatus | 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) |      | false | integer(int32) |            |
| &emsp;&emsp;description    | 自我描述                          |      | false | string         |            |
| &emsp;&emsp;sysUserId      | 系统用户ID                        |      | false | string(uuid)   |            |

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

## 批量删除学生

**接口地址**:`/api/student/student`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>根据学生ID列表批量删除学生信息。</p>

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

## 根据ID获取学生信息

**接口地址**:`/api/student/student/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过学生的唯一ID获取其详细信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 学生ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultStudentVO       |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                          | 类型                | schema         |
|----------------------------|-------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                        | boolean           |                |
| code                       | 业务状态码 (200表示成功)               | integer(int32)    | integer(int32) |
| message                    | 响应消息                          | string            |                |
| data                       |                               | StudentVO         | StudentVO      |
| &emsp;&emsp;id             | 学生ID                          | string(uuid)      |                |
| &emsp;&emsp;studentCode    | 学号                            | string            |                |
| &emsp;&emsp;realName       | 学生真实姓名                        | string            |                |
| &emsp;&emsp;birthDate      | 出生日期                          | string(date)      |                |
| &emsp;&emsp;admissionYear  | 入学年份                          | integer(int32)    |                |
| &emsp;&emsp;major          | 专业                            | string            |                |
| &emsp;&emsp;academicStatus | 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) | integer(int32)    |                |
| &emsp;&emsp;description    | 自我描述                          | string            |                |
| &emsp;&emsp;sysUserId      | 系统用户ID                        | string(uuid)      |                |
| &emsp;&emsp;createTime     | 创建时间                          | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                          | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"studentCode": "",
		"realName": "",
		"birthDate": "",
		"admissionYear": 0,
		"major": "",
		"academicStatus": 0,
		"description": "",
		"sysUserId": "",
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

## 根据ID删除学生

**接口地址**:`/api/student/student/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过学生的唯一ID删除学生信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 学生ID | path | true | string(uuid) |        |

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

## 获取所有学生

**接口地址**:`/api/student/student/all`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取系统中所有的学生信息。</p>

**请求参数**:

暂无

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultListStudentVO   |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                          | 类型                | schema         |
|----------------------------|-------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                        | boolean           |                |
| code                       | 业务状态码 (200表示成功)               | integer(int32)    | integer(int32) |
| message                    | 响应消息                          | string            |                |
| data                       | 响应数据体 (泛型)                    | array             | StudentVO      |
| &emsp;&emsp;id             | 学生ID                          | string(uuid)      |                |
| &emsp;&emsp;studentCode    | 学号                            | string            |                |
| &emsp;&emsp;realName       | 学生真实姓名                        | string            |                |
| &emsp;&emsp;birthDate      | 出生日期                          | string(date)      |                |
| &emsp;&emsp;admissionYear  | 入学年份                          | integer(int32)    |                |
| &emsp;&emsp;major          | 专业                            | string            |                |
| &emsp;&emsp;academicStatus | 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) | integer(int32)    |                |
| &emsp;&emsp;description    | 自我描述                          | string            |                |
| &emsp;&emsp;sysUserId      | 系统用户ID                        | string(uuid)      |                |
| &emsp;&emsp;createTime     | 创建时间                          | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                          | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"studentCode": "",
			"realName": "",
			"birthDate": "",
			"admissionYear": 0,
			"major": "",
			"academicStatus": 0,
			"description": "",
			"sysUserId": "",
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

## 分页查询学生列表

**接口地址**:`/api/student/student/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据传入的条件分页查询学生信息。支持根据学号、姓名、专业等字段进行模糊查询。</p>

**请求参数**:

| 参数名称           | 参数说明                          | 请求类型  | 是否必须  | 数据类型   | schema |
|----------------|-------------------------------|-------|-------|--------|--------|
| studentCode    | 学号                            | query | false | string |        |
| realName       | 学生真实姓名                        | query | false | string |        |
| admissionYear  | 入学年份                          | query | false | string |        |
| major          | 专业                            | query | false | string |        |
| academicStatus | 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) | query | false | string |        |
| startTime      | 起始时间                          | query | false | string |        |
| endTime        | 结束时间                          | query | false | string |        |
| pageNum        | 当前记录起始索引                      | query | false | string |        |
| pageSize       | 每页显示记录数                       | query | false | string |        |
| orderByColumn  | 排序列                           | query | false | string |        |
| isAsc          | 排序的方向,可用值:asc,desc            | query | false | string |        |
| reasonable     | 分页参数合理化                       | query | false | string |        |

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

## 根据用户ID获取学生信息

**接口地址**:`/api/student/student/user/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过学生的用户ID获取其详细信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 用户ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultStudentVO       |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                          | 类型                | schema         |
|----------------------------|-------------------------------|-------------------|----------------| 
| success                    | 请求是否成功                        | boolean           |                |
| code                       | 业务状态码 (200表示成功)               | integer(int32)    | integer(int32) |
| message                    | 响应消息                          | string            |                |
| data                       |                               | StudentVO         | StudentVO      |
| &emsp;&emsp;id             | 学生ID                          | string(uuid)      |                |
| &emsp;&emsp;studentCode    | 学号                            | string            |                |
| &emsp;&emsp;realName       | 学生真实姓名                        | string            |                |
| &emsp;&emsp;birthDate      | 出生日期                          | string(date)      |                |
| &emsp;&emsp;admissionYear  | 入学年份                          | integer(int32)    |                |
| &emsp;&emsp;major          | 专业                            | string            |                |
| &emsp;&emsp;academicStatus | 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) | integer(int32)    |                |
| &emsp;&emsp;description    | 自我描述                          | string            |                |
| &emsp;&emsp;sysUserId      | 系统用户ID                        | string(uuid)      |                |
| &emsp;&emsp;createTime     | 创建时间                          | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                          | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"studentCode": "",
		"realName": "",
		"birthDate": "",
		"admissionYear": 0,
		"major": "",
		"academicStatus": 0,
		"description": "",
		"sysUserId": "",
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