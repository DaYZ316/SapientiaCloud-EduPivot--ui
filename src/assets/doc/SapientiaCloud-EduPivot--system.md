# SapientiaCloud-EduPivot--system API


**简介**:SapientiaCloud-EduPivot--system API


**HOST**:http://192.168.1.21:31601


**联系人**:DaYZ


**Version**:1.0.0


**接口路径**:/api/system/v3/api-docs


[TOC]






# 角色管理


## addRole


**接口地址**:`/api/system/role`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加一个新的角色到系统中。</p>



**请求示例**:


```javascript
{
  "roleName": "超级管理员",
  "roleKey": "ADMIN",
  "sort": 1,
  "status": 0,
  "description": "超级管理员角色"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysRoleAddDTO|系统角色添加数据传输对象 (DTO)|body|true|SysRoleAddDTO|SysRoleAddDTO|
|&emsp;&emsp;roleName|角色名称||true|string||
|&emsp;&emsp;roleKey|角色标识||true|string||
|&emsp;&emsp;sort|排序||false|integer(int32)||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)||false|integer(int32)||
|&emsp;&emsp;description|描述||false|string||


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


## updateRole


**接口地址**:`/api/system/role`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改现有角色的信息。</p>



**请求示例**:


```javascript
{
  "id": "",
  "roleName": "",
  "roleKey": "",
  "sort": 0,
  "status": 0,
  "description": "",
  "admin": true
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysRoleDTO|系统角色数据传输对象 (DTO)|body|true|SysRoleDTO|SysRoleDTO|
|&emsp;&emsp;id|角色ID||true|string(uuid)||
|&emsp;&emsp;roleName|角色名称||true|string||
|&emsp;&emsp;roleKey|角色标识||true|string||
|&emsp;&emsp;sort|排序||false|integer(int32)||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)||false|integer(int32)||
|&emsp;&emsp;description|描述||false|string||
|&emsp;&emsp;admin|||false|boolean||


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


## removeRoleByIds


**接口地址**:`/api/system/role`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>根据角色ID列表批量删除角色。</p>



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


## getRoleById


**接口地址**:`/api/system/role/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过角色的唯一ID获取其详细信息。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|角色ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysRoleVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysRoleVO|SysRoleVO|
|&emsp;&emsp;id|角色ID|string(uuid)||
|&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;sort|排序|integer(int32)||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;description|描述|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;admin||boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"roleName": "",
		"roleKey": "",
		"permissions": [
			{
				"id": "",
				"parentId": "",
				"permissionName": "",
				"permissionKey": "",
				"children": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"createTime": "",
				"updateTime": ""
			}
		],
		"sort": 0,
		"status": 0,
		"description": "",
		"createTime": "",
		"updateTime": "",
		"admin": true
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


## removeRoleById


**接口地址**:`/api/system/role/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据角色ID从系统中移除角色。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|角色ID|path|true|string(uuid)||


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


## assignRolePermissions


**接口地址**:`/api/system/role/{roleId}/permission`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>为指定角色分配权限。</p>



**请求示例**:


```javascript
[]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleId|角色ID|path|true|string(uuid)||
|strings|string|body|true|array||


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


## listAllSysRole


**接口地址**:`/api/system/role/all`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取系统中所有的角色信息。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListSysRoleVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|SysRoleVO|
|&emsp;&emsp;id|角色ID|string(uuid)||
|&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;sort|排序|integer(int32)||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;description|描述|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;admin||boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"roleName": "",
			"roleKey": "",
			"permissions": [
				{
					"id": "",
					"parentId": "",
					"permissionName": "",
					"permissionKey": "",
					"children": [
						{
							"id": "",
							"parentId": "",
							"permissionName": "",
							"permissionKey": "",
							"children": [
								{}
							],
							"sort": 0,
							"createTime": "",
							"updateTime": ""
						}
					],
					"sort": 0,
					"createTime": "",
					"updateTime": ""
				}
			],
			"sort": 0,
			"status": 0,
			"description": "",
			"createTime": "",
			"updateTime": "",
			"admin": true
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


## listSysRole


**接口地址**:`/api/system/role/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据传入的条件分页查询角色信息。支持根据角色名称、角色标识等字段进行模糊查询。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|startTime|角色名称|query|false|string||
|roleKey|角色标识|query|false|string||
|status|状态 (0=正常, 1=停用)|query|false|string||
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


# 角色内部接口


## getRoleByKey


**接口地址**:`/api/system/role/internal/key/{roleKey}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过角色标识获取角色详细信息，包含权限列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleKey|角色标识|path|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysRoleVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysRoleVO|SysRoleVO|
|&emsp;&emsp;id|角色ID|string(uuid)||
|&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;sort|排序|integer(int32)||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;description|描述|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;admin||boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"roleName": "",
		"roleKey": "",
		"permissions": [
			{
				"id": "",
				"parentId": "",
				"permissionName": "",
				"permissionKey": "",
				"children": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"createTime": "",
				"updateTime": ""
			}
		],
		"sort": 0,
		"status": 0,
		"description": "",
		"createTime": "",
		"updateTime": "",
		"admin": true
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


## addRoleToUser


**接口地址**:`/api/system/role/internal/user/{userId}/role`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过用户ID和角色标识为用户分配角色</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||
|roleKey|角色标识|query|true|string||


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


## removeRoleFromUser


**接口地址**:`/api/system/role/internal/user/{userId}/role`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过用户ID和角色标识从用户中移除角色</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||
|roleKey|角色标识|query|true|string||


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


# 权限管理


## addPermission


**接口地址**:`/api/system/permission`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加一个新的权限到系统中。</p>



**请求示例**:


```javascript
{
  "parentId": "",
  "permissionName": "",
  "permissionKey": "",
  "sort": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysPermissionAddDTO|系统权限添加数据传输对象 (DTO)|body|true|SysPermissionAddDTO|SysPermissionAddDTO|
|&emsp;&emsp;parentId|父级权限ID||false|string(uuid)||
|&emsp;&emsp;permissionName|权限名称||true|string||
|&emsp;&emsp;permissionKey|权限标识||true|string||
|&emsp;&emsp;sort|排序||false|integer(int32)||


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


## updatePermission


**接口地址**:`/api/system/permission`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改现有权限的信息。</p>



**请求示例**:


```javascript
{
  "id": "",
  "parentId": "",
  "permissionName": "",
  "permissionKey": "",
  "sort": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysPermissionDTO|系统权限数据传输对象 (DTO)|body|true|SysPermissionDTO|SysPermissionDTO|
|&emsp;&emsp;id|权限ID||true|string(uuid)||
|&emsp;&emsp;parentId|父级权限ID||false|string(uuid)||
|&emsp;&emsp;permissionName|权限名称||true|string||
|&emsp;&emsp;permissionKey|权限标识||true|string||
|&emsp;&emsp;sort|排序||false|integer(int32)||


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


## removePermissionByIds


**接口地址**:`/api/system/permission`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>根据权限ID列表批量删除权限。</p>



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


## getPermissionById


**接口地址**:`/api/system/permission/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过权限的唯一ID获取其详细信息。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|权限ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysPermissionVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysPermissionVO|SysPermissionVO|
|&emsp;&emsp;id|权限ID|string(uuid)||
|&emsp;&emsp;parentId|父级权限ID|string(uuid)||
|&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;sort|排序|integer(int32)||
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
		"parentId": "",
		"permissionName": "",
		"permissionKey": "",
		"children": [
			{
				"id": "",
				"parentId": "",
				"permissionName": "",
				"permissionKey": "",
				"children": [
					{}
				],
				"sort": 0,
				"createTime": "",
				"updateTime": ""
			}
		],
		"sort": 0,
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


## removePermissionById


**接口地址**:`/api/system/permission/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据权限ID从系统中移除权限。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|权限ID|path|true|string(uuid)||


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


## listSysPermission


**接口地址**:`/api/system/permission/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据传入的条件分页查询权限信息。支持根据权限名称、标识等字段进行模糊查询。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|permissionName|权限名称|query|false|string||
|permissionKey|权限标识|query|false|string||
|parentId|父级权限ID|query|false|string||
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


## listSysPermissionTree


**接口地址**:`/api/system/permission/tree`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>查询权限树结构。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListSysPermissionVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|SysPermissionVO|
|&emsp;&emsp;id|权限ID|string(uuid)||
|&emsp;&emsp;parentId|父级权限ID|string(uuid)||
|&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;sort|排序|integer(int32)||
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
			"parentId": "",
			"permissionName": "",
			"permissionKey": "",
			"children": [
				{
					"id": "",
					"parentId": "",
					"permissionName": "",
					"permissionKey": "",
					"children": [
						{}
					],
					"sort": 0,
					"createTime": "",
					"updateTime": ""
				}
			],
			"sort": 0,
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


# 权限验证内部接口


## clearUserPermissionCache


**接口地址**:`/api/system/permission/internal/{userId}/cache`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>清除指定用户的权限缓存</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||


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


## getUserPermissions


**接口地址**:`/api/system/permission/internal/{userId}/permissions`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取指定用户的所有权限标识列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListString|
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


## clearAllPermissionCache


**接口地址**:`/api/system/permission/internal/cache/all`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>清除所有用户的权限缓存</p>



**请求参数**:


暂无


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


## hasPermission


**接口地址**:`/api/system/permission/internal/check/{permission}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>验证当前用户是否有指定权限</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|permission|权限标识|path|true|string||


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


## hasAllPermissions


**接口地址**:`/api/system/permission/internal/check/all`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>验证当前用户是否有所有指定权限</p>



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


## hasAnyPermission


**接口地址**:`/api/system/permission/internal/check/any`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>验证当前用户是否有任一指定权限</p>



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


# 系统通知管理


## updateNotification


**接口地址**:`/api/system/notification`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改通知消息内容（仅限管理员修改消息体，不影响用户阅读状态）</p>



**请求示例**:


```javascript
{
  "id": "",
  "title": "",
  "content": "",
  "attachmentUrls": "",
  "type": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|notificationDTO|通知数据传输对象|body|true|NotificationDTO|NotificationDTO|
|&emsp;&emsp;id|通知ID，更新时必须提供||true|string(uuid)||
|&emsp;&emsp;title|通知标题||false|string||
|&emsp;&emsp;content|通知内容（富文本HTML）||false|string||
|&emsp;&emsp;attachmentUrls|附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用）||false|string||
|&emsp;&emsp;type|通知类型||false|integer(int32)||


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


## removeNotificationByIds


**接口地址**:`/api/system/notification`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>用户批量删除通知（仅从自己的收件箱移除）</p>



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


## getNotificationById


**接口地址**:`/api/system/notification/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据收件箱ID获取通知详情（包含完整内容）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户收件箱记录ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultNotificationVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||NotificationVO|NotificationVO|
|&emsp;&emsp;id|通知ID|string(uuid)||
|&emsp;&emsp;userId|接收用户ID|string(uuid)||
|&emsp;&emsp;title|通知标题|string||
|&emsp;&emsp;content|通知内容（富文本HTML）|string||
|&emsp;&emsp;attachmentUrls|附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用）|string||
|&emsp;&emsp;type|通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他)|integer(int32)||
|&emsp;&emsp;typeLabel|通知类型标签|string||
|&emsp;&emsp;status|阅读状态 (0=未读, 1=已读)|integer(int32)||
|&emsp;&emsp;statusLabel|阅读状态标签|string||
|&emsp;&emsp;readTime|阅读时间|string(date-time)||
|&emsp;&emsp;senderId|发送者ID|string(uuid)||
|&emsp;&emsp;senderName|发送者名称|string||
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
		"userId": "",
		"title": "",
		"content": "",
		"attachmentUrls": "",
		"type": 0,
		"typeLabel": "",
		"status": 0,
		"statusLabel": "",
		"readTime": "",
		"senderId": "",
		"senderName": "",
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


## removeNotificationById


**接口地址**:`/api/system/notification/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>用户删除单条通知（仅从自己的收件箱移除）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户收件箱记录ID|path|true|string(uuid)||


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


## markAsRead


**接口地址**:`/api/system/notification/{id}/read`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>标记单条通知为已读</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户收件箱记录ID|path|true|string(uuid)||


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


## addNotification


**接口地址**:`/api/system/notification/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>发送单条通知给指定用户</p>



**请求示例**:


```javascript
{
  "userId": "",
  "title": "",
  "content": "",
  "attachmentUrls": "",
  "type": 0,
  "senderId": "",
  "senderName": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|notificationAddDTO|创建通知数据传输对象|body|true|NotificationAddDTO|NotificationAddDTO|
|&emsp;&emsp;userId|接收用户ID||true|string(uuid)||
|&emsp;&emsp;title|通知标题||true|string||
|&emsp;&emsp;content|通知内容（富文本HTML）||false|string||
|&emsp;&emsp;attachmentUrls|附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用）||false|string||
|&emsp;&emsp;type|通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他)||false|integer(int32)||
|&emsp;&emsp;senderId|发送者ID||false|string(uuid)||
|&emsp;&emsp;senderName|发送者名称||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultNotificationVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||NotificationVO|NotificationVO|
|&emsp;&emsp;id|通知ID|string(uuid)||
|&emsp;&emsp;userId|接收用户ID|string(uuid)||
|&emsp;&emsp;title|通知标题|string||
|&emsp;&emsp;content|通知内容（富文本HTML）|string||
|&emsp;&emsp;attachmentUrls|附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用）|string||
|&emsp;&emsp;type|通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他)|integer(int32)||
|&emsp;&emsp;typeLabel|通知类型标签|string||
|&emsp;&emsp;status|阅读状态 (0=未读, 1=已读)|integer(int32)||
|&emsp;&emsp;statusLabel|阅读状态标签|string||
|&emsp;&emsp;readTime|阅读时间|string(date-time)||
|&emsp;&emsp;senderId|发送者ID|string(uuid)||
|&emsp;&emsp;senderName|发送者名称|string||
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
		"userId": "",
		"title": "",
		"content": "",
		"attachmentUrls": "",
		"type": 0,
		"typeLabel": "",
		"status": 0,
		"statusLabel": "",
		"readTime": "",
		"senderId": "",
		"senderName": "",
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


## listAllNotification


**接口地址**:`/api/system/notification/all`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取当前用户的所有通知列表（不分页，按时间倒序）</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListNotificationVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|NotificationVO|
|&emsp;&emsp;id|通知ID|string(uuid)||
|&emsp;&emsp;userId|接收用户ID|string(uuid)||
|&emsp;&emsp;title|通知标题|string||
|&emsp;&emsp;content|通知内容（富文本HTML）|string||
|&emsp;&emsp;attachmentUrls|附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用）|string||
|&emsp;&emsp;type|通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他)|integer(int32)||
|&emsp;&emsp;typeLabel|通知类型标签|string||
|&emsp;&emsp;status|阅读状态 (0=未读, 1=已读)|integer(int32)||
|&emsp;&emsp;statusLabel|阅读状态标签|string||
|&emsp;&emsp;readTime|阅读时间|string(date-time)||
|&emsp;&emsp;senderId|发送者ID|string(uuid)||
|&emsp;&emsp;senderName|发送者名称|string||
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
			"userId": "",
			"title": "",
			"content": "",
			"attachmentUrls": "",
			"type": 0,
			"typeLabel": "",
			"status": 0,
			"statusLabel": "",
			"readTime": "",
			"senderId": "",
			"senderName": "",
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


## batchAddNotification


**接口地址**:`/api/system/notification/batch-add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>批量发送通知给多个用户</p>



**请求示例**:


```javascript
{
  "userIds": [],
  "title": "",
  "content": "",
  "attachmentUrls": "",
  "type": 0,
  "senderId": "",
  "senderName": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|notificationBatchAddDTO|批量创建通知数据传输对象|body|true|NotificationBatchAddDTO|NotificationBatchAddDTO|
|&emsp;&emsp;userIds|接收用户ID列表||true|array|string(uuid)|
|&emsp;&emsp;title|通知标题||true|string||
|&emsp;&emsp;content|通知内容（富文本HTML）||false|string||
|&emsp;&emsp;attachmentUrls|附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用）||false|string||
|&emsp;&emsp;type|通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他)||false|integer(int32)||
|&emsp;&emsp;senderId|发送者ID||false|string(uuid)||
|&emsp;&emsp;senderName|发送者名称||false|string||


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


## batchMarkAsRead


**接口地址**:`/api/system/notification/batch-read`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>批量标记多条通知为已读</p>



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


## listNotification


**接口地址**:`/api/system/notification/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>分页查询用户的通知列表（包含已读/未读状态、消息内容）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|query|false|string||
|type|通知类型|query|false|string||
|status|阅读状态 (0=未读, 1=已读)|query|false|string||
|title|通知标题（模糊查询）|query|false|string||
|startTime|开始时间|query|false|string||
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


## removeNotificationMsg


**接口地址**:`/api/system/notification/msg/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员撤回/逻辑删除通知消息（所有接收者将不可见）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|通知消息ID (MsgID)|path|true|string(uuid)||


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


## markAllAsRead


**接口地址**:`/api/system/notification/read-all`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>一键标记当前用户所有通知为已读</p>



**请求参数**:


暂无


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


## sendNotificationByScope


**接口地址**:`/api/system/notification/send-by-scope`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>按范围群发通知（支持按角色Key或课程ID群发）</p>



**请求示例**:


```javascript
{
  "scopeType": 0,
  "roleKey": "",
  "courseId": "",
  "title": "",
  "content": "",
  "attachmentUrls": "",
  "type": 0,
  "senderId": "",
  "senderName": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|notificationScopeSendDTO|按范围发送通知数据传输对象|body|true|NotificationScopeSendDTO|NotificationScopeSendDTO|
|&emsp;&emsp;scopeType|发送范围类型 (0=按角色, 1=按课程学生)||true|integer(int32)||
|&emsp;&emsp;roleKey|角色标识 (scopeType=0 时必填)||false|string||
|&emsp;&emsp;courseId|课程ID (scopeType=1 时必填)||false|string(uuid)||
|&emsp;&emsp;title|通知标题||true|string||
|&emsp;&emsp;content|通知内容（富文本HTML）||false|string||
|&emsp;&emsp;attachmentUrls|附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用）||false|string||
|&emsp;&emsp;type|通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他)||false|integer(int32)||
|&emsp;&emsp;senderId|发送者ID||false|string(uuid)||
|&emsp;&emsp;senderName|发送者名称||false|string||


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


## getUnreadCount


**接口地址**:`/api/system/notification/unread-count`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取当前用户的未读通知总数</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultLong|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|integer(int64)|integer(int64)|


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


# 仪表盘管理


## getStatistics


**接口地址**:`/api/system/dashboard/statistics`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取系统统计数据，包括学生总数、教师总数和课程总数。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultStatisticsVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||StatisticsVO|StatisticsVO|
|&emsp;&emsp;studentCount|学生总数|integer(int64)||
|&emsp;&emsp;teacherCount|教师总数|integer(int64)||
|&emsp;&emsp;courseCount|课程总数|integer(int64)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"studentCount": 0,
		"teacherCount": 0,
		"courseCount": 0
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


# 用户管理


## updateUser


**接口地址**:`/api/system/user`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改现有用户的信息。</p>



**请求示例**:


```javascript
{
  "id": "",
  "nickName": "",
  "email": "",
  "mobile": "",
  "gender": 0,
  "avatar": "",
  "status": 0,
  "lastLoginTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysUserDTO|系统用户数据传输对象|body|true|SysUserDTO|SysUserDTO|
|&emsp;&emsp;id|用户ID，更新时必须提供||true|string(uuid)||
|&emsp;&emsp;nickName|用户昵称||true|string||
|&emsp;&emsp;email|邮箱||true|string||
|&emsp;&emsp;mobile|手机号||true|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)||false|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL||false|string||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)||false|integer(int32)||
|&emsp;&emsp;lastLoginTime|最后登录时间||false|string(date-time)||


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


## removeUserByIds


**接口地址**:`/api/system/user`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>根据用户ID列表批量删除用户。</p>



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


## getUserById


**接口地址**:`/api/system/user/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过用户的唯一ID获取其详细信息。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysUserVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysUserVO|SysUserVO|
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;lastLoginTime|最后登录时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"username": "",
		"nickName": "",
		"email": "",
		"mobile": "",
		"gender": 0,
		"avatar": "",
		"roles": [
			{
				"id": "",
				"roleName": "",
				"roleKey": "",
				"permissions": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{
								"id": "",
								"parentId": "",
								"permissionName": "",
								"permissionKey": "",
								"children": [
									{}
								],
								"sort": 0,
								"createTime": "",
								"updateTime": ""
							}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"createTime": "",
				"updateTime": "",
				"admin": true
			}
		],
		"status": 0,
		"createTime": "",
		"updateTime": "",
		"lastLoginTime": ""
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


## removeUserById


**接口地址**:`/api/system/user/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据用户ID从系统中移除用户。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户ID|path|true|string(uuid)||


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


## resetPassword


**接口地址**:`/api/system/user/{id}/reset-password`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>重置指定用户的密码为123456</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户ID|path|true|string(uuid)||


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


## assignRoles


**接口地址**:`/api/system/user/{userId}/role`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>为指定用户分配角色。</p>



**请求示例**:


```javascript
[]
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||
|strings|string|body|true|array||


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


## addSysUser


**接口地址**:`/api/system/user/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员添加系统用户</p>



**请求示例**:


```javascript
{
  "username": "",
  "nickName": "",
  "email": "",
  "mobile": "",
  "gender": 0,
  "avatar": "",
  "status": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysUserAdminDTO|系统用户数据传输对象|body|true|SysUserAdminDTO|SysUserAdminDTO|
|&emsp;&emsp;username|用户名||false|string||
|&emsp;&emsp;nickName|用户昵称||false|string||
|&emsp;&emsp;email|邮箱||false|string||
|&emsp;&emsp;mobile|手机号||false|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)||false|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL||false|string||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysUserVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysUserVO|SysUserVO|
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;lastLoginTime|最后登录时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"username": "",
		"nickName": "",
		"email": "",
		"mobile": "",
		"gender": 0,
		"avatar": "",
		"roles": [
			{
				"id": "",
				"roleName": "",
				"roleKey": "",
				"permissions": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{
								"id": "",
								"parentId": "",
								"permissionName": "",
								"permissionKey": "",
								"children": [
									{}
								],
								"sort": 0,
								"createTime": "",
								"updateTime": ""
							}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"createTime": "",
				"updateTime": "",
				"admin": true
			}
		],
		"status": 0,
		"createTime": "",
		"updateTime": "",
		"lastLoginTime": ""
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


## listAllSysUser


**接口地址**:`/api/system/user/all`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有用户列表。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListSysUserVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|SysUserVO|
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;lastLoginTime|最后登录时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"username": "",
			"nickName": "",
			"email": "",
			"mobile": "",
			"gender": 0,
			"avatar": "",
			"roles": [
				{
					"id": "",
					"roleName": "",
					"roleKey": "",
					"permissions": [
						{
							"id": "",
							"parentId": "",
							"permissionName": "",
							"permissionKey": "",
							"children": [
								{
									"id": "",
									"parentId": "",
									"permissionName": "",
									"permissionKey": "",
									"children": [
										{}
									],
									"sort": 0,
									"createTime": "",
									"updateTime": ""
								}
							],
							"sort": 0,
							"createTime": "",
							"updateTime": ""
						}
					],
					"sort": 0,
					"status": 0,
					"description": "",
					"createTime": "",
					"updateTime": "",
					"admin": true
				}
			],
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


## listSysUser


**接口地址**:`/api/system/user/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据传入的条件分页查询用户信息。支持根据用户名、昵称等字段进行模糊查询。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|username|用户名|query|false|string||
|nickName|用户昵称|query|false|string||
|gender|性别 (0=未知, 1=男, 2=女)|query|false|string||
|status|状态 (0=正常, 1=停用)|query|false|string||
|mobile|手机号码|query|false|string||
|email|邮箱|query|false|string||
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


## mobileLogin


**接口地址**:`/api/system/user/mobile-login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>通过手机号码和验证码进行登录验证</p>



**请求示例**:


```javascript
{
  "mobile": "13812345678",
  "verificationCode": "123456"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysUserMobileLoginDTO|手机验证码登录请求的数据模型|body|true|SysUserMobileLoginDTO|SysUserMobileLoginDTO|
|&emsp;&emsp;mobile|手机号码||true|string||
|&emsp;&emsp;verificationCode|手机验证码||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysUserInternalVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysUserInternalVO|SysUserInternalVO|
|&emsp;&emsp;createTime|创建时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;updateTime|更新时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;last_login_time|最后登录时间|string(date-time)||
|&emsp;&emsp;githubId|GitHub用户ID|string||
|&emsp;&emsp;wechatId|微信OpenID|string||
|&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"username": "",
		"nickName": "",
		"email": "",
		"mobile": "",
		"gender": 0,
		"avatar": "",
		"status": 0,
		"last_login_time": "",
		"githubId": "",
		"wechatId": "",
		"roles": [
			{
				"id": "",
				"roleName": "",
				"roleKey": "",
				"permissions": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{
								"id": "",
								"parentId": "",
								"permissionName": "",
								"permissionKey": "",
								"children": [
									{}
								],
								"sort": 0,
								"createTime": "",
								"updateTime": ""
							}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"createTime": "",
				"updateTime": "",
				"admin": true
			}
		],
		"permissions": [
			{
				"id": "",
				"parentId": "",
				"permissionName": "",
				"permissionKey": "",
				"children": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"createTime": "",
				"updateTime": ""
			}
		]
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


## updateProfile


**接口地址**:`/api/system/user/profile`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>修改用户自己的个人信息</p>



**请求示例**:


```javascript
{
  "username": "",
  "nickName": "",
  "email": "",
  "mobile": "",
  "gender": 0,
  "avatar": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysUserProfileDTO|SysUserProfileDTO|body|true|SysUserProfileDTO|SysUserProfileDTO|
|&emsp;&emsp;username|用户名||true|string||
|&emsp;&emsp;nickName|用户昵称||true|string||
|&emsp;&emsp;email|邮箱||true|string||
|&emsp;&emsp;mobile|手机号||true|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)||false|integer(int32)||
|&emsp;&emsp;avatar|头像||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysUserVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysUserVO|SysUserVO|
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;lastLoginTime|最后登录时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"username": "",
		"nickName": "",
		"email": "",
		"mobile": "",
		"gender": 0,
		"avatar": "",
		"roles": [
			{
				"id": "",
				"roleName": "",
				"roleKey": "",
				"permissions": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{
								"id": "",
								"parentId": "",
								"permissionName": "",
								"permissionKey": "",
								"children": [
									{}
								],
								"sort": 0,
								"createTime": "",
								"updateTime": ""
							}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"createTime": "",
				"updateTime": "",
				"admin": true
			}
		],
		"status": 0,
		"createTime": "",
		"updateTime": "",
		"lastLoginTime": ""
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


# 用户内部接口


## removeUserById


**接口地址**:`/api/system/user/internal/{userId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除用户</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||


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


## getUserPermissions


**接口地址**:`/api/system/user/internal/{userId}/permission`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取指定用户的权限列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListSysPermissionVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|SysPermissionVO|
|&emsp;&emsp;id|权限ID|string(uuid)||
|&emsp;&emsp;parentId|父级权限ID|string(uuid)||
|&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;sort|排序|integer(int32)||
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
			"parentId": "",
			"permissionName": "",
			"permissionKey": "",
			"children": [
				{
					"id": "",
					"parentId": "",
					"permissionName": "",
					"permissionKey": "",
					"children": [
						{}
					],
					"sort": 0,
					"createTime": "",
					"updateTime": ""
				}
			],
			"sort": 0,
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


## getUserRoles


**接口地址**:`/api/system/user/internal/{userId}/role`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取指定用户的角色列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListSysRoleVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|SysRoleVO|
|&emsp;&emsp;id|角色ID|string(uuid)||
|&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;sort|排序|integer(int32)||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;description|描述|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;admin||boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"roleName": "",
			"roleKey": "",
			"permissions": [
				{
					"id": "",
					"parentId": "",
					"permissionName": "",
					"permissionKey": "",
					"children": [
						{
							"id": "",
							"parentId": "",
							"permissionName": "",
							"permissionKey": "",
							"children": [
								{}
							],
							"sort": 0,
							"createTime": "",
							"updateTime": ""
						}
					],
					"sort": 0,
					"createTime": "",
					"updateTime": ""
				}
			],
			"sort": 0,
			"status": 0,
			"description": "",
			"createTime": "",
			"updateTime": "",
			"admin": true
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


## listAllSysUser


**接口地址**:`/api/system/user/internal/all`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取所有用户列表。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListSysUserVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|SysUserVO|
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|&emsp;&emsp;lastLoginTime|最后登录时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"id": "",
			"username": "",
			"nickName": "",
			"email": "",
			"mobile": "",
			"gender": 0,
			"avatar": "",
			"roles": [
				{
					"id": "",
					"roleName": "",
					"roleKey": "",
					"permissions": [
						{
							"id": "",
							"parentId": "",
							"permissionName": "",
							"permissionKey": "",
							"children": [
								{
									"id": "",
									"parentId": "",
									"permissionName": "",
									"permissionKey": "",
									"children": [
										{}
									],
									"sort": 0,
									"createTime": "",
									"updateTime": ""
								}
							],
							"sort": 0,
							"createTime": "",
							"updateTime": ""
						}
					],
					"sort": 0,
					"status": 0,
					"description": "",
					"createTime": "",
					"updateTime": "",
					"admin": true
				}
			],
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


## checkMobileAvailable


**接口地址**:`/api/system/user/internal/check-mobile`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>检查手机号是否可用</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|mobile|手机号|query|true|string||


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


## checkUsernameAvailable


**接口地址**:`/api/system/user/internal/check-username`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>检查用户名是否可用</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|username|用户名|query|true|string||


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


## updateGithubId


**接口地址**:`/api/system/user/internal/github-id/{userId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>更新用户的GitHub ID</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||
|githubId|GitHub ID|query|true|string||


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


## getUserInfoByUsername


**接口地址**:`/api/system/user/internal/info/{username}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过用户名获取用户详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|username||path|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysUserInternalVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysUserInternalVO|SysUserInternalVO|
|&emsp;&emsp;createTime|创建时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;updateTime|更新时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;last_login_time|最后登录时间|string(date-time)||
|&emsp;&emsp;githubId|GitHub用户ID|string||
|&emsp;&emsp;wechatId|微信OpenID|string||
|&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"username": "",
		"nickName": "",
		"email": "",
		"mobile": "",
		"gender": 0,
		"avatar": "",
		"status": 0,
		"last_login_time": "",
		"githubId": "",
		"wechatId": "",
		"roles": [
			{
				"id": "",
				"roleName": "",
				"roleKey": "",
				"permissions": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{
								"id": "",
								"parentId": "",
								"permissionName": "",
								"permissionKey": "",
								"children": [
									{}
								],
								"sort": 0,
								"createTime": "",
								"updateTime": ""
							}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"createTime": "",
				"updateTime": "",
				"admin": true
			}
		],
		"permissions": [
			{
				"id": "",
				"parentId": "",
				"permissionName": "",
				"permissionKey": "",
				"children": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"createTime": "",
				"updateTime": ""
			}
		]
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


## getUserInfoById


**接口地址**:`/api/system/user/internal/info/id/{userId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过用户ID获取用户详细信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysUserInternalVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysUserInternalVO|SysUserInternalVO|
|&emsp;&emsp;createTime|创建时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;updateTime|更新时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;last_login_time|最后登录时间|string(date-time)||
|&emsp;&emsp;githubId|GitHub用户ID|string||
|&emsp;&emsp;wechatId|微信OpenID|string||
|&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"username": "",
		"nickName": "",
		"email": "",
		"mobile": "",
		"gender": 0,
		"avatar": "",
		"status": 0,
		"last_login_time": "",
		"githubId": "",
		"wechatId": "",
		"roles": [
			{
				"id": "",
				"roleName": "",
				"roleKey": "",
				"permissions": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{
								"id": "",
								"parentId": "",
								"permissionName": "",
								"permissionKey": "",
								"children": [
									{}
								],
								"sort": 0,
								"createTime": "",
								"updateTime": ""
							}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"createTime": "",
				"updateTime": "",
				"admin": true
			}
		],
		"permissions": [
			{
				"id": "",
				"parentId": "",
				"permissionName": "",
				"permissionKey": "",
				"children": [
					{
						"id": "",
						"parentId": "",
						"permissionName": "",
						"permissionKey": "",
						"children": [
							{}
						],
						"sort": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"createTime": "",
				"updateTime": ""
			}
		]
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


## getUserInfoByMobile


**接口地址**:`/api/system/user/internal/info/mobile/{mobile}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过手机号获取用户基本信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|mobile|手机号|path|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysUserBasicInfoVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysUserBasicInfoVO|SysUserBasicInfoVO|
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"username": "",
		"nickName": "",
		"avatar": "",
		"createTime": ""
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


## updatePassword


**接口地址**:`/api/system/user/internal/password`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>更新用户密码</p>



**请求示例**:


```javascript
{
  "currentPassword": "",
  "newPassword": "",
  "confirmPassword": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysUserPasswordDTO|SysUserPasswordDTO|body|true|SysUserPasswordDTO|SysUserPasswordDTO|
|&emsp;&emsp;currentPassword|当前密码||true|string||
|&emsp;&emsp;newPassword|新密码||true|string||
|&emsp;&emsp;confirmPassword|确认密码||true|string||


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


## updatePasswordByUserId


**接口地址**:`/api/system/user/internal/password/{userId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过用户ID更新密码</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||
|newPassword|新密码|query|true|string||


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


## physicalDeleteUserById


**接口地址**:`/api/system/user/internal/physical/{userId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>物理删除用户</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||


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


## registerUser


**接口地址**:`/api/system/user/internal/register`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>用户UI端注册用户。</p>



**请求示例**:


```javascript
{
  "username": "zhangsan",
  "password": "MyP@ssw0rd123",
  "confirmPassword": "MyP@ssw0rd123",
  "avatar": "",
  "nickName": "",
  "mobile": "13812345678",
  "verificationCode": "123456"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysUserRegisterDTO|用户注册请求的数据模型|body|true|SysUserRegisterDTO|SysUserRegisterDTO|
|&emsp;&emsp;username|用户名，必须是4-20位的字母、数字或下划线||true|string||
|&emsp;&emsp;password|用户密码，必须是6-20位的任意字符||true|string||
|&emsp;&emsp;confirmPassword|确认密码，必须与密码字段一致||true|string||
|&emsp;&emsp;avatar|用户头像URL||false|string||
|&emsp;&emsp;nickName|用户昵称||false|string||
|&emsp;&emsp;mobile|手机号码，用于接收短信验证码||true|string||
|&emsp;&emsp;verificationCode|注册验证码（短信或邮件验证码）||true|string||


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


## softDeleteUserById


**接口地址**:`/api/system/user/internal/soft-delete/{userId}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>软删除用户</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|string(uuid)||


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


## findOrCreateByThirdParty


**接口地址**:`/api/system/user/internal/third-party/find-or-create`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过第三方账号查找或创建用户，返回注册状态</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|provider||query|true|string||
|providerId||query|true|string||
|username||query|true|string||
|email||query|false|string||
|name||query|false|string||
|avatarUrl||query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultThirdPartyLoginResultVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||ThirdPartyLoginResultVO|ThirdPartyLoginResultVO|
|&emsp;&emsp;user|系统用户内部数据传输对象 (VO)|SysUserInternalVO|SysUserInternalVO|
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间 (系统自动生成)|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间 (系统自动生成)|string||
|&emsp;&emsp;&emsp;&emsp;id|用户ID|string||
|&emsp;&emsp;&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer||
|&emsp;&emsp;&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;last_login_time|最后登录时间|string||
|&emsp;&emsp;&emsp;&emsp;githubId|GitHub用户ID|string||
|&emsp;&emsp;&emsp;&emsp;wechatId|微信OpenID|string||
|&emsp;&emsp;&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;roleName|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;roleKey|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;isNewUser|是否为新用户|boolean||
|&emsp;&emsp;needBindMobile|是否需要绑定手机号|boolean||
|&emsp;&emsp;needSelectIdentity|是否需要选择身份|boolean||
|&emsp;&emsp;needCompleteInfo|是否需要完善信息|boolean||
|&emsp;&emsp;currentStep|当前步骤: bindMobile | selectIdentity | completeInfo | completed|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"user": {
			"id": "",
			"username": "",
			"nickName": "",
			"email": "",
			"mobile": "",
			"gender": 0,
			"avatar": "",
			"status": 0,
			"last_login_time": "",
			"githubId": "",
			"wechatId": "",
			"roles": [
				{
					"id": "",
					"roleName": "",
					"roleKey": "",
					"permissions": [
						{
							"id": "",
							"parentId": "",
							"permissionName": "",
							"permissionKey": "",
							"children": [
								{
									"id": "",
									"parentId": "",
									"permissionName": "",
									"permissionKey": "",
									"children": [
										{}
									],
									"sort": 0,
									"createTime": "",
									"updateTime": ""
								}
							],
							"sort": 0,
							"createTime": "",
							"updateTime": ""
						}
					],
					"sort": 0,
					"status": 0,
					"description": "",
					"createTime": "",
					"updateTime": "",
					"admin": true
				}
			],
			"permissions": [
				{
					"id": "",
					"parentId": "",
					"permissionName": "",
					"permissionKey": "",
					"children": [
						{
							"id": "",
							"parentId": "",
							"permissionName": "",
							"permissionKey": "",
							"children": [
								{}
							],
							"sort": 0,
							"createTime": "",
							"updateTime": ""
						}
					],
					"sort": 0,
					"createTime": "",
					"updateTime": ""
				}
			]
		},
		"isNewUser": true,
		"needBindMobile": true,
		"needSelectIdentity": true,
		"needCompleteInfo": true,
		"currentStep": ""
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


## updateUserInternal


**接口地址**:`/api/system/user/internal/update`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>内部接口，更新用户信息</p>



**请求示例**:


```javascript
{
  "id": "",
  "nickName": "",
  "email": "",
  "mobile": "",
  "gender": 0,
  "avatar": "",
  "status": 0,
  "lastLoginTime": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysUserDTO|系统用户数据传输对象|body|true|SysUserDTO|SysUserDTO|
|&emsp;&emsp;id|用户ID，更新时必须提供||true|string(uuid)||
|&emsp;&emsp;nickName|用户昵称||true|string||
|&emsp;&emsp;email|邮箱||true|string||
|&emsp;&emsp;mobile|手机号||true|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)||false|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL||false|string||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)||false|integer(int32)||
|&emsp;&emsp;lastLoginTime|最后登录时间||false|string(date-time)||


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