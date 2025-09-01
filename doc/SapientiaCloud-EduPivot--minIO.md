# SapientiaCloud-EduPivot - MinIO API

**简介**:SapientiaCloud-EduPivot - MinIO API

**HOST**:http://172.16.0.10:31603

**联系人**:DaYZ

**Version**:1.0.0

**接口路径**:/api/minIO/v3/api-docs

[TOC]

# 文件操作

## 批量删除文件

**接口地址**:`/api/minIO/file/batch-delete`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>批量删除文件接口</p>

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
| 200 | OK          | ResultMapStringString |
| 400 | Bad Request |                       |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

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

## 获取所有存储桶

**接口地址**:`/api/minIO/file/buckets`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取所有存储桶接口</p>

**请求参数**:

暂无

**响应状态**:

| 状态码 | 说明          | schema           |
|-----|-------------|------------------| 
| 200 | OK          | ResultListString |
| 400 | Bad Request |                  |
| 403 | Forbidden   | ResultString     |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | array          |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": []
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

## 删除文件

**接口地址**:`/api/minIO/file/delete`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>删除文件接口</p>

**请求参数**:

| 参数名称       | 参数说明   | 请求类型  | 是否必须 | 数据类型   | schema |
|------------|--------|-------|------|--------|--------|
| objectName | 文件对象名称 | query | true | string |        |

**响应状态**:

| 状态码 | 说明          | schema        |
|-----|-------------|---------------| 
| 200 | OK          | ResultBoolean |
| 400 | Bad Request |               |
| 403 | Forbidden   | ResultString  |

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

## 下载文件

**接口地址**:`/api/minIO/file/download`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>下载文件接口</p>

**请求参数**:

| 参数名称       | 参数说明   | 请求类型  | 是否必须 | 数据类型   | schema |
|------------|--------|-------|------|--------|--------|
| objectName | 文件对象名称 | query | true | string |        |

**响应状态**:

| 状态码 | 说明          | schema       |
|-----|-------------|--------------| 
| 200 | OK          |              |
| 400 | Bad Request |              |
| 403 | Forbidden   | ResultString |

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

## 列出指定前缀的文件

**接口地址**:`/api/minIO/file/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>列出指定前缀的文件接口</p>

**请求参数**:

| 参数名称   | 参数说明 | 请求类型  | 是否必须  | 数据类型   | schema |
|--------|------|-------|-------|--------|--------|
| prefix | 文件前缀 | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema                    |
|-----|-------------|---------------------------| 
| 200 | OK          | ResultListMapStringObject |
| 400 | Bad Request |                           |
| 403 | Forbidden   | ResultString              |

**响应状态码-200**:

**响应参数**:

| 参数名称    | 参数说明            | 类型             | schema         |
|---------|-----------------|----------------|----------------| 
| success | 请求是否成功          | boolean        |                |
| code    | 业务状态码 (200表示成功) | integer(int32) | integer(int32) |
| message | 响应消息            | string         |                |
| data    | 响应数据体 (泛型)      | array          |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": []
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

## 上传文件

**接口地址**:`/api/minIO/file/upload`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>上传文件接口</p>

**请求参数**:

| 参数名称      | 参数说明     | 请求类型  | 是否必须  | 数据类型   | schema |
|-----------|----------|-------|-------|--------|--------|
| file      | 上传的文件    | query | true  | file   |        |
| directory | 存储目录（可选） | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultMapStringString |
| 400 | Bad Request |                       |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

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

## 获取文件URL

**接口地址**:`/api/minIO/file/url`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取文件URL接口</p>

**请求参数**:

| 参数名称       | 参数说明    | 请求类型  | 是否必须  | 数据类型           | schema |
|------------|---------|-------|-------|----------------|--------|
| objectName | 文件对象名称  | query | true  | string         |        |
| expiry     | 过期时间（秒） | query | false | integer(int32) |        |

**响应状态**:

| 状态码 | 说明          | schema       |
|-----|-------------|--------------| 
| 200 | OK          | ResultString |
| 400 | Bad Request |              |
| 403 | Forbidden   | ResultString |

**响应状态码-200**:

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