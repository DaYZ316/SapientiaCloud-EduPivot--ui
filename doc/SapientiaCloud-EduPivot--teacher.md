# SapientiaCloud-EduPivot--teacher API

**简介**:SapientiaCloud-EduPivot--teacher API

**HOST**:http://192.168.77.249:31604

**联系人**:DaYZ

**Version**:1.0.0

**接口路径**:/api/teacher/v3/api-docs

[TOC]

# 教师管理

## 添加新教师

**接口地址**:`/api/teacher/teacher`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>向系统中添加一个新的教师。</p>

**请求示例**:

```javascript
{
  "teacherCode": "",
  "realName": "",
  "birthDate": "",
  "department": "",
  "education": 0,
  "specialization": "",
  "description": "",
  "sysUserId": ""
}
```

**请求参数**:

| 参数名称                       | 参数说明                        | 请求类型 | 是否必须  | 数据类型           | schema        |
|----------------------------|-----------------------------|------|-------|----------------|---------------|
| teacherAddDTO              | 教师添加信息数据传输对象                | body | true  | TeacherAddDTO  | TeacherAddDTO |
| &emsp;&emsp;teacherCode    | 教师工号                        |      | true  | string         |               |
| &emsp;&emsp;realName       | 教师真实姓名                      |      | true  | string         |               |
| &emsp;&emsp;birthDate      | 出生日期                        |      | false | string(date)   |               |
| &emsp;&emsp;department     | 所属部门/学院                     |      | false | string         |               |
| &emsp;&emsp;education      | 学历 (0=专科, 1=本科, 2=硕士, 3=博士) |      | false | integer(int32) |               |
| &emsp;&emsp;specialization | 专业特长/研究方向                   |      | false | string         |               |
| &emsp;&emsp;description    | 自我描述                        |      | false | string         |               |
| &emsp;&emsp;sysUserId      | 系统用户ID                      |      | false | string(uuid)   |               |

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

## 更新教师信息

**接口地址**:`/api/teacher/teacher`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>更新现有教师的信息。</p>

**请求示例**:

```javascript
{
  "id": "",
  "teacherCode": "",
  "realName": "",
  "birthDate": "",
  "department": "",
  "education": 0,
  "specialization": "",
  "description": "",
  "sysUserId": ""
}
```

**请求参数**:

| 参数名称                       | 参数说明                        | 请求类型 | 是否必须  | 数据类型           | schema     |
|----------------------------|-----------------------------|------|-------|----------------|------------|
| teacherDTO                 | 教师信息数据传输对象                  | body | true  | TeacherDTO     | TeacherDTO |
| &emsp;&emsp;id             | 教师ID，更新时必须提供                |      | false | string(uuid)   |            |
| &emsp;&emsp;teacherCode    | 教师工号                        |      | true  | string         |            |
| &emsp;&emsp;realName       | 教师真实姓名                      |      | true  | string         |            |
| &emsp;&emsp;birthDate      | 出生日期                        |      | false | string(date)   |            |
| &emsp;&emsp;department     | 所属部门/学院                     |      | false | string         |            |
| &emsp;&emsp;education      | 学历 (0=专科, 1=本科, 2=硕士, 3=博士) |      | false | integer(int32) |            |
| &emsp;&emsp;specialization | 专业特长/研究方向                   |      | false | string         |            |
| &emsp;&emsp;description    | 自我描述                        |      | false | string         |            |
| &emsp;&emsp;sysUserId      | 系统用户ID                      |      | false | string(uuid)   |            |

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

## 批量删除教师

**接口地址**:`/api/teacher/teacher`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>根据教师ID列表批量删除教师信息。</p>

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

## 根据ID获取教师信息

**接口地址**:`/api/teacher/teacher/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过教师的唯一ID获取其详细信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 教师ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultTeacherVO       |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                        | 类型                | schema         |
|----------------------------|-----------------------------|-------------------|----------------| 
| success                    | 请求是否成功                      | boolean           |                |
| code                       | 业务状态码 (200表示成功)             | integer(int32)    | integer(int32) |
| message                    | 响应消息                        | string            |                |
| data                       |                             | TeacherVO         | TeacherVO      |
| &emsp;&emsp;id             | 教师ID                        | string(uuid)      |                |
| &emsp;&emsp;teacherCode    | 教师工号                        | string            |                |
| &emsp;&emsp;realName       | 教师真实姓名                      | string            |                |
| &emsp;&emsp;birthDate      | 出生日期                        | string(date)      |                |
| &emsp;&emsp;department     | 所属部门/学院                     | string            |                |
| &emsp;&emsp;education      | 学历 (0=专科, 1=本科, 2=硕士, 3=博士) | integer(int32)    |                |
| &emsp;&emsp;specialization | 专业特长/研究方向                   | string            |                |
| &emsp;&emsp;description    | 自我描述                        | string            |                |
| &emsp;&emsp;sysUserId      | 系统用户ID                      | string(uuid)      |                |
| &emsp;&emsp;createTime     | 创建时间                        | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                        | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"teacherCode": "",
		"realName": "",
		"birthDate": "",
		"department": "",
		"education": 0,
		"specialization": "",
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

## 根据ID删除教师

**接口地址**:`/api/teacher/teacher/{id}`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过教师的唯一ID删除教师信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 教师ID | path | true | string(uuid) |        |

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

## 获取所有教师

**接口地址**:`/api/teacher/teacher/all`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取系统中所有的教师信息。</p>

**请求参数**:

暂无

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
| &emsp;&emsp;createTime     | 创建时间                        | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                        | string(date-time) |                |

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

## 分页查询教师列表

**接口地址**:`/api/teacher/teacher/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据传入的条件分页查询教师信息。支持根据工号、姓名、部门等字段进行模糊查询。</p>

**请求参数**:

| 参数名称           | 参数说明                        | 请求类型  | 是否必须  | 数据类型   | schema |
|----------------|-----------------------------|-------|-------|--------|--------|
| teacherCode    | 教师工号                        | query | false | string |        |
| realName       | 教师真实姓名                      | query | false | string |        |
| department     | 所属部门/学院                     | query | false | string |        |
| education      | 学历 (0=专科, 1=本科, 2=硕士, 3=博士) | query | false | string |        |
| specialization | 专业特长/研究方向                   | query | false | string |        |
| startTime      | 起始时间                        | query | false | string |        |
| endTime        | 结束时间                        | query | false | string |        |
| pageNum        | 当前记录起始索引                    | query | false | string |        |
| pageSize       | 每页显示记录数                     | query | false | string |        |
| orderByColumn  | 排序列                         | query | false | string |        |
| isAsc          | 排序的方向,可用值:asc,desc          | query | false | string |        |
| reasonable     | 分页参数合理化                     | query | false | string |        |

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

## 根据用户ID获取教师信息

**接口地址**:`/api/teacher/teacher/user/{id}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过用户的唯一ID获取其关联的教师信息。</p>

**请求参数**:

| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型         | schema |
|------|------|------|------|--------------|--------|
| id   | 用户ID | path | true | string(uuid) |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultTeacherVO       |
| 400 | Bad Request | ResultMapStringString |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                       | 参数说明                        | 类型                | schema         |
|----------------------------|-----------------------------|-------------------|----------------| 
| success                    | 请求是否成功                      | boolean           |                |
| code                       | 业务状态码 (200表示成功)             | integer(int32)    | integer(int32) |
| message                    | 响应消息                        | string            |                |
| data                       |                             | TeacherVO         | TeacherVO      |
| &emsp;&emsp;id             | 教师ID                        | string(uuid)      |                |
| &emsp;&emsp;teacherCode    | 教师工号                        | string            |                |
| &emsp;&emsp;realName       | 教师真实姓名                      | string            |                |
| &emsp;&emsp;birthDate      | 出生日期                        | string(date)      |                |
| &emsp;&emsp;department     | 所属部门/学院                     | string            |                |
| &emsp;&emsp;education      | 学历 (0=专科, 1=本科, 2=硕士, 3=博士) | integer(int32)    |                |
| &emsp;&emsp;specialization | 专业特长/研究方向                   | string            |                |
| &emsp;&emsp;description    | 自我描述                        | string            |                |
| &emsp;&emsp;sysUserId      | 系统用户ID                      | string(uuid)      |                |
| &emsp;&emsp;createTime     | 创建时间                        | string(date-time) |                |
| &emsp;&emsp;updateTime     | 更新时间                        | string(date-time) |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"teacherCode": "",
		"realName": "",
		"birthDate": "",
		"department": "",
		"education": 0,
		"specialization": "",
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