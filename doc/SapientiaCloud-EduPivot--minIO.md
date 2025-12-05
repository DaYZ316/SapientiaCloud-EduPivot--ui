# SapientiaCloud-EduPivot - MinIO API

**简介**:SapientiaCloud-EduPivot - MinIO API

**HOST**:http://192.168.1.21:31603

**联系人**:DaYZ

**Version**:1.0.0

**接口路径**:/api/minIO/v3/api-docs

[TOC]

# 文件操作

## batchDeleteFiles

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

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| strings    | string                                                                       | body  | true  | array  |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

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

## batchDeleteFilesByPath

**接口地址**:`/api/minIO/file/batch-delete/path`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>根据文件路径批量删除文件接口</p>

**请求示例**:

```javascript
[]
```

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| strings    | string                                                                       | body  | true  | array  |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

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

## listBuckets

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

## deleteFile

**接口地址**:`/api/minIO/file/delete`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>删除文件接口</p>

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| objectName | 文件对象名称                                                                       | query | true  | string |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

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

## deleteFileByPath

**接口地址**:`/api/minIO/file/delete/path`

**请求方式**:`DELETE`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>根据文件路径删除文件接口</p>

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| filePath   | 文件路径                                                                         | query | true  | string |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

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

## downloadFile

**接口地址**:`/api/minIO/file/download`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>下载文件接口</p>

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| objectName | 文件对象名称                                                                       | query | true  | string |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

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

## getFileInfo

**接口地址**:`/api/minIO/file/info`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取文件详细信息接口</p>

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| objectName | 文件对象名称                                                                       | query | true  | string |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema            |
|-----|-------------|-------------------| 
| 200 | OK          | ResultFileInfoDTO |
| 400 | Bad Request |                   |
| 403 | Forbidden   | ResultString      |

**响应状态码-200**:

**响应参数**:

| 参数名称                     | 参数说明            | 类型                | schema         |
|--------------------------|-----------------|-------------------|----------------| 
| success                  | 请求是否成功          | boolean           |                |
| code                     | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                  | 响应消息            | string            |                |
| data                     |                 | FileInfoDTO       | FileInfoDTO    |
| &emsp;&emsp;objectName   | 文件对象名称          | string            |                |
| &emsp;&emsp;fileName     | 文件名             | string            |                |
| &emsp;&emsp;size         | 文件大小（字节）        | integer(int64)    |                |
| &emsp;&emsp;contentType  | 文件内容类型          | string            |                |
| &emsp;&emsp;lastModified | 最后修改时间          | string(date-time) |                |
| &emsp;&emsp;etag         | ETag            | string            |                |
| &emsp;&emsp;isDir        | 是否为目录           | boolean           |                |
| &emsp;&emsp;url          | 文件访问URL         | string            |                |
| &emsp;&emsp;extension    | 文件扩展名           | string            |                |
| &emsp;&emsp;path         | 文件路径（不包含文件名）    | string            |                |
| &emsp;&emsp;bucketName   | 存储桶名称           | string            |                |
| &emsp;&emsp;bucketCode   | 业务桶编码           | string            |                |
| &emsp;&emsp;error        | 是否有错误           | boolean           |                |
| &emsp;&emsp;errorMessage | 错误信息            | string            |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"objectName": "2024/01/15/example.jpg",
		"fileName": "example.jpg",
		"size": 1024000,
		"contentType": "image/jpeg",
		"lastModified": "",
		"etag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
		"isDir": false,
		"url": "http://localhost:9000/bucket/2024/01/15/example.jpg",
		"extension": ".jpg",
		"path": "2024/01/15/",
		"bucketName": "edupivot-files",
		"bucketCode": "COURSE_PUBLIC",
		"error": false,
		"errorMessage": "文件不存在"
	}
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

## getBatchFileInfo

**接口地址**:`/api/minIO/file/info/batch`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>批量获取文件详细信息接口</p>

**请求示例**:

```javascript
[]
```

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| strings    | string                                                                       | body  | true  | array  |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultListFileInfoDTO |
| 400 | Bad Request |                       |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                     | 参数说明            | 类型                | schema         |
|--------------------------|-----------------|-------------------|----------------| 
| success                  | 请求是否成功          | boolean           |                |
| code                     | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                  | 响应消息            | string            |                |
| data                     | 响应数据体 (泛型)      | array             | FileInfoDTO    |
| &emsp;&emsp;objectName   | 文件对象名称          | string            |                |
| &emsp;&emsp;fileName     | 文件名             | string            |                |
| &emsp;&emsp;size         | 文件大小（字节）        | integer(int64)    |                |
| &emsp;&emsp;contentType  | 文件内容类型          | string            |                |
| &emsp;&emsp;lastModified | 最后修改时间          | string(date-time) |                |
| &emsp;&emsp;etag         | ETag            | string            |                |
| &emsp;&emsp;isDir        | 是否为目录           | boolean           |                |
| &emsp;&emsp;url          | 文件访问URL         | string            |                |
| &emsp;&emsp;extension    | 文件扩展名           | string            |                |
| &emsp;&emsp;path         | 文件路径（不包含文件名）    | string            |                |
| &emsp;&emsp;bucketName   | 存储桶名称           | string            |                |
| &emsp;&emsp;bucketCode   | 业务桶编码           | string            |                |
| &emsp;&emsp;error        | 是否有错误           | boolean           |                |
| &emsp;&emsp;errorMessage | 错误信息            | string            |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"objectName": "2024/01/15/example.jpg",
			"fileName": "example.jpg",
			"size": 1024000,
			"contentType": "image/jpeg",
			"lastModified": "",
			"etag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
			"isDir": false,
			"url": "http://localhost:9000/bucket/2024/01/15/example.jpg",
			"extension": ".jpg",
			"path": "2024/01/15/",
			"bucketName": "edupivot-files",
			"bucketCode": "COURSE_PUBLIC",
			"error": false,
			"errorMessage": "文件不存在"
		}
	]
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

## getBatchFileInfoByPath

**接口地址**:`/api/minIO/file/info/batch/path`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>通过路径数组批量获取文件详细信息接口</p>

**请求示例**:

```javascript
[]
```

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| strings    | string                                                                       | body  | true  | array  |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema                |
|-----|-------------|-----------------------| 
| 200 | OK          | ResultListFileInfoDTO |
| 400 | Bad Request |                       |
| 403 | Forbidden   | ResultString          |

**响应状态码-200**:

**响应参数**:

| 参数名称                     | 参数说明            | 类型                | schema         |
|--------------------------|-----------------|-------------------|----------------| 
| success                  | 请求是否成功          | boolean           |                |
| code                     | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                  | 响应消息            | string            |                |
| data                     | 响应数据体 (泛型)      | array             | FileInfoDTO    |
| &emsp;&emsp;objectName   | 文件对象名称          | string            |                |
| &emsp;&emsp;fileName     | 文件名             | string            |                |
| &emsp;&emsp;size         | 文件大小（字节）        | integer(int64)    |                |
| &emsp;&emsp;contentType  | 文件内容类型          | string            |                |
| &emsp;&emsp;lastModified | 最后修改时间          | string(date-time) |                |
| &emsp;&emsp;etag         | ETag            | string            |                |
| &emsp;&emsp;isDir        | 是否为目录           | boolean           |                |
| &emsp;&emsp;url          | 文件访问URL         | string            |                |
| &emsp;&emsp;extension    | 文件扩展名           | string            |                |
| &emsp;&emsp;path         | 文件路径（不包含文件名）    | string            |                |
| &emsp;&emsp;bucketName   | 存储桶名称           | string            |                |
| &emsp;&emsp;bucketCode   | 业务桶编码           | string            |                |
| &emsp;&emsp;error        | 是否有错误           | boolean           |                |
| &emsp;&emsp;errorMessage | 错误信息            | string            |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"objectName": "2024/01/15/example.jpg",
			"fileName": "example.jpg",
			"size": 1024000,
			"contentType": "image/jpeg",
			"lastModified": "",
			"etag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
			"isDir": false,
			"url": "http://localhost:9000/bucket/2024/01/15/example.jpg",
			"extension": ".jpg",
			"path": "2024/01/15/",
			"bucketName": "edupivot-files",
			"bucketCode": "COURSE_PUBLIC",
			"error": false,
			"errorMessage": "文件不存在"
		}
	]
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

## getFileInfoByPath

**接口地址**:`/api/minIO/file/info/path`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>通过路径获取文件详细信息接口</p>

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| filePath   | 文件路径                                                                         | query | true  | string |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

**响应状态**:

| 状态码 | 说明          | schema            |
|-----|-------------|-------------------| 
| 200 | OK          | ResultFileInfoDTO |
| 400 | Bad Request |                   |
| 403 | Forbidden   | ResultString      |

**响应状态码-200**:

**响应参数**:

| 参数名称                     | 参数说明            | 类型                | schema         |
|--------------------------|-----------------|-------------------|----------------| 
| success                  | 请求是否成功          | boolean           |                |
| code                     | 业务状态码 (200表示成功) | integer(int32)    | integer(int32) |
| message                  | 响应消息            | string            |                |
| data                     |                 | FileInfoDTO       | FileInfoDTO    |
| &emsp;&emsp;objectName   | 文件对象名称          | string            |                |
| &emsp;&emsp;fileName     | 文件名             | string            |                |
| &emsp;&emsp;size         | 文件大小（字节）        | integer(int64)    |                |
| &emsp;&emsp;contentType  | 文件内容类型          | string            |                |
| &emsp;&emsp;lastModified | 最后修改时间          | string(date-time) |                |
| &emsp;&emsp;etag         | ETag            | string            |                |
| &emsp;&emsp;isDir        | 是否为目录           | boolean           |                |
| &emsp;&emsp;url          | 文件访问URL         | string            |                |
| &emsp;&emsp;extension    | 文件扩展名           | string            |                |
| &emsp;&emsp;path         | 文件路径（不包含文件名）    | string            |                |
| &emsp;&emsp;bucketName   | 存储桶名称           | string            |                |
| &emsp;&emsp;bucketCode   | 业务桶编码           | string            |                |
| &emsp;&emsp;error        | 是否有错误           | boolean           |                |
| &emsp;&emsp;errorMessage | 错误信息            | string            |                |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"objectName": "2024/01/15/example.jpg",
		"fileName": "example.jpg",
		"size": 1024000,
		"contentType": "image/jpeg",
		"lastModified": "",
		"etag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
		"isDir": false,
		"url": "http://localhost:9000/bucket/2024/01/15/example.jpg",
		"extension": ".jpg",
		"path": "2024/01/15/",
		"bucketName": "edupivot-files",
		"bucketCode": "COURSE_PUBLIC",
		"error": false,
		"errorMessage": "文件不存在"
	}
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

## listFiles

**接口地址**:`/api/minIO/file/list`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>列出指定前缀的文件接口</p>

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| prefix     | 文件前缀                                                                         | query | false | string |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

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

## uploadFile

**接口地址**:`/api/minIO/file/upload`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>上传文件接口</p>

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型   | schema |
|------------|------------------------------------------------------------------------------|-------|-------|--------|--------|
| file       | 上传的文件                                                                        | query | true  | file   |        |
| directory  | 存储目录（可选）                                                                     | query | false | string |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string |        |

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

## getFileUrl

**接口地址**:`/api/minIO/file/url`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取文件URL接口</p>

**请求参数**:

| 参数名称       | 参数说明                                                                         | 请求类型  | 是否必须  | 数据类型           | schema |
|------------|------------------------------------------------------------------------------|-------|-------|----------------|--------|
| objectName | 文件对象名称                                                                       | query | true  | string         |        |
| expiry     | 过期时间（秒）                                                                      | query | false | integer(int32) |        |
| bucketCode | 业务桶编码,可用值:USER_AVATAR,COURSE_PUBLIC,COURSE_PRIVATE,LIVE_PLAYBACK,AI_QA_ASSET | query | false | string         |        |

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