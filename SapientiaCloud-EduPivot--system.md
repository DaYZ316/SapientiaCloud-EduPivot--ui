# SapientiaCloud-EduPivot--system API


**简介**:SapientiaCloud-EduPivot--system API


**HOST**:http://172.16.0.10:31601


**联系人**:DaYZ


**Version**:1.0.0


**接口路径**:/api/system/v3/api-docs


[TOC]






# 角色管理


## 更新现有角色


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 批量删除角色


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 根据ID获取角色


**接口地址**:`/api/system/role/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过角色ID获取其详细信息和权限列表。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|角色ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysRoleVO|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysRoleVO|SysRoleVO|
|&emsp;&emsp;id|角色ID|string(uuid)||
|&emsp;&emsp;role_name|角色名称|string||
|&emsp;&emsp;role_key|角色标识|string||
|&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parent_id|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permission_name|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permission_key|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;sort|排序|integer(int32)||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;description|描述|string||
|&emsp;&emsp;create_time|创建时间|string(date-time)||
|&emsp;&emsp;update_time|更新时间|string(date-time)||
|&emsp;&emsp;admin||boolean||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"role_name": "",
		"role_key": "",
		"permissions": [
			{
				"id": "",
				"parent_id": "",
				"permission_name": "",
				"permission_key": "",
				"children": [
					{
						"id": "",
						"parent_id": "",
						"permission_name": "",
						"permission_key": "",
						"children": [
							{}
						],
						"sort": 0,
						"create_time": "",
						"update_time": ""
					}
				],
				"sort": 0,
				"create_time": "",
				"update_time": ""
			}
		],
		"sort": 0,
		"status": 0,
		"description": "",
		"create_time": "",
		"update_time": "",
		"admin": true
	}
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


**响应状态码-500**:


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


## 删除角色


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 分配角色权限


**接口地址**:`/api/system/role/{id}/permission`


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
|id|角色ID|path|true|string(uuid)||
|strings|string|body|true|array||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 添加新角色


**接口地址**:`/api/system/role/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>管理员向系统中添加一个新角色。</p>



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
|sysRoleAddDTO|系统角色数据传输对象 (DTO)|body|true|SysRoleAddDTO|SysRoleAddDTO|
|&emsp;&emsp;roleName|角色名称||true|string||
|&emsp;&emsp;roleKey|角色标识||true|string||
|&emsp;&emsp;sort|排序||false|integer(int32)||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)||false|integer(int32)||
|&emsp;&emsp;description|描述||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 分页查找角色


**接口地址**:`/api/system/role/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据传入的条件分页查询角色信息。支持根据角色名、角色描述等字段进行模糊查询。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|roleName|角色名称|query|false|string||
|roleKey|角色标识|query|false|string||
|status|状态 (0=正常, 1=停用)|query|false|string||
|pageNum|当前页码|query|false|string||
|pageSize|每页记录数|query|false|string||
|startTime|起始时间|query|false|string||
|endTime|结束时间|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageInfoSysRoleVO|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||PageInfoSysRoleVO|PageInfoSysRoleVO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;role_name|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;role_key|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parent_id|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permission_name|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permission_key|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;pageNum||integer(int32)||
|&emsp;&emsp;pageSize||integer(int32)||
|&emsp;&emsp;size||integer(int32)||
|&emsp;&emsp;startRow||integer(int64)||
|&emsp;&emsp;endRow||integer(int64)||
|&emsp;&emsp;pages||integer(int32)||
|&emsp;&emsp;prePage||integer(int32)||
|&emsp;&emsp;nextPage||integer(int32)||
|&emsp;&emsp;isFirstPage||boolean||
|&emsp;&emsp;isLastPage||boolean||
|&emsp;&emsp;hasPreviousPage||boolean||
|&emsp;&emsp;hasNextPage||boolean||
|&emsp;&emsp;navigatePages||integer(int32)||
|&emsp;&emsp;navigatepageNums||array|integer(int32)|
|&emsp;&emsp;navigateFirstPage||integer(int32)||
|&emsp;&emsp;navigateLastPage||integer(int32)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"total": 0,
		"list": [
			{
				"id": "",
				"role_name": "",
				"role_key": "",
				"permissions": [
					{
						"id": "",
						"parent_id": "",
						"permission_name": "",
						"permission_key": "",
						"children": [
							{
								"id": "",
								"parent_id": "",
								"permission_name": "",
								"permission_key": "",
								"children": [
									{}
								],
								"sort": 0,
								"create_time": "",
								"update_time": ""
							}
						],
						"sort": 0,
						"create_time": "",
						"update_time": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"create_time": "",
				"update_time": "",
				"admin": true
			}
		],
		"pageNum": 0,
		"pageSize": 0,
		"size": 0,
		"startRow": 0,
		"endRow": 0,
		"pages": 0,
		"prePage": 0,
		"nextPage": 0,
		"isFirstPage": true,
		"isLastPage": true,
		"hasPreviousPage": true,
		"hasNextPage": true,
		"navigatePages": 0,
		"navigatepageNums": [],
		"navigateFirstPage": 0,
		"navigateLastPage": 0
	}
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


**响应状态码-500**:


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


## 添加权限


**接口地址**:`/api/system/permission`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>添加新的权限信息。</p>



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
|sysPermissionAddDTO|系统权限数据传输对象 (DTO)|body|true|SysPermissionAddDTO|SysPermissionAddDTO|
|&emsp;&emsp;parentId|父级权限ID||false|string(uuid)||
|&emsp;&emsp;permissionName|权限名称||true|string||
|&emsp;&emsp;permissionKey|权限标识||true|string||
|&emsp;&emsp;sort|排序||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 更新现有权限


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 批量删除权限


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 根据ID获取权限


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
|200|OK|ResultSysPermission|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysPermission|SysPermission|
|&emsp;&emsp;create_time|创建时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;update_time|更新时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;id|权限ID|string(uuid)||
|&emsp;&emsp;parent_id|父级权限ID|string(uuid)||
|&emsp;&emsp;permission_name|权限名称|string||
|&emsp;&emsp;permission_key|权限标识|string||
|&emsp;&emsp;sort|排序|integer(int32)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"parent_id": "",
		"permission_name": "",
		"permission_key": "",
		"sort": 0
	}
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


**响应状态码-500**:


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


## 删除权限


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 分页查找权限


**接口地址**:`/api/system/permission/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据传入的条件分页查询权限信息。支持根据权限名称、权限标识等字段进行模糊查询。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|permissionName|权限名称|query|false|string||
|permissionKey|权限标识|query|false|string||
|parentId|父级权限ID|query|false|string||
|pageNum|当前页码|query|false|string||
|pageSize|每页记录数|query|false|string||
|startTime|起始时间|query|false|string||
|endTime|结束时间|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageInfoSysPermissionVO|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||PageInfoSysPermissionVO|PageInfoSysPermissionVO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parent_id|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permission_name|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permission_key|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;pageNum||integer(int32)||
|&emsp;&emsp;pageSize||integer(int32)||
|&emsp;&emsp;size||integer(int32)||
|&emsp;&emsp;startRow||integer(int64)||
|&emsp;&emsp;endRow||integer(int64)||
|&emsp;&emsp;pages||integer(int32)||
|&emsp;&emsp;prePage||integer(int32)||
|&emsp;&emsp;nextPage||integer(int32)||
|&emsp;&emsp;isFirstPage||boolean||
|&emsp;&emsp;isLastPage||boolean||
|&emsp;&emsp;hasPreviousPage||boolean||
|&emsp;&emsp;hasNextPage||boolean||
|&emsp;&emsp;navigatePages||integer(int32)||
|&emsp;&emsp;navigatepageNums||array|integer(int32)|
|&emsp;&emsp;navigateFirstPage||integer(int32)||
|&emsp;&emsp;navigateLastPage||integer(int32)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"total": 0,
		"list": [
			{
				"id": "",
				"parent_id": "",
				"permission_name": "",
				"permission_key": "",
				"children": [
					{
						"id": "",
						"parent_id": "",
						"permission_name": "",
						"permission_key": "",
						"children": [
							{}
						],
						"sort": 0,
						"create_time": "",
						"update_time": ""
					}
				],
				"sort": 0,
				"create_time": "",
				"update_time": ""
			}
		],
		"pageNum": 0,
		"pageSize": 0,
		"size": 0,
		"startRow": 0,
		"endRow": 0,
		"pages": 0,
		"prePage": 0,
		"nextPage": 0,
		"isFirstPage": true,
		"isLastPage": true,
		"hasPreviousPage": true,
		"hasNextPage": true,
		"navigatePages": 0,
		"navigatepageNums": [],
		"navigateFirstPage": 0,
		"navigateLastPage": 0
	}
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


**响应状态码-500**:


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


## 更新现有用户


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
  "last_login_time": ""
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
|&emsp;&emsp;last_login_time|最后登录时间||false|string(date-time)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 批量删除用户


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 根据ID获取用户


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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
|&emsp;&emsp;&emsp;&emsp;role_name|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;role_key|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parent_id|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permission_name|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permission_key|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
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
				"role_name": "",
				"role_key": "",
				"permissions": [
					{
						"id": "",
						"parent_id": "",
						"permission_name": "",
						"permission_key": "",
						"children": [
							{
								"id": "",
								"parent_id": "",
								"permission_name": "",
								"permission_key": "",
								"children": [
									{}
								],
								"sort": 0,
								"create_time": "",
								"update_time": ""
							}
						],
						"sort": 0,
						"create_time": "",
						"update_time": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"create_time": "",
				"update_time": "",
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


**响应状态码-500**:


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


## 删除用户


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 分配用户角色


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
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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


## 分页查找用户


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
|pageNum|当前页码|query|false|string||
|pageSize|每页记录数|query|false|string||
|startTime|起始时间|query|false|string||
|endTime|结束时间|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultPageInfoSysUserVO|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||PageInfoSysUserVO|PageInfoSysUserVO|
|&emsp;&emsp;total||integer(int64)||
|&emsp;&emsp;list|系统用户视图对象 (VO)|array|SysUserVO|
|&emsp;&emsp;&emsp;&emsp;id|用户ID|string||
|&emsp;&emsp;&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;&emsp;&emsp;nickName|用户昵称|string||
|&emsp;&emsp;&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer||
|&emsp;&emsp;&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;&emsp;&emsp;roles|系统角色视图对象 (VO)|array|SysRoleVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|角色ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;role_name|角色名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;role_key|角色标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parent_id|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permission_name|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permission_key|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;admin||boolean||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;createTime|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;updateTime|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;lastLoginTime|最后登录时间|string||
|&emsp;&emsp;pageNum||integer(int32)||
|&emsp;&emsp;pageSize||integer(int32)||
|&emsp;&emsp;size||integer(int32)||
|&emsp;&emsp;startRow||integer(int64)||
|&emsp;&emsp;endRow||integer(int64)||
|&emsp;&emsp;pages||integer(int32)||
|&emsp;&emsp;prePage||integer(int32)||
|&emsp;&emsp;nextPage||integer(int32)||
|&emsp;&emsp;isFirstPage||boolean||
|&emsp;&emsp;isLastPage||boolean||
|&emsp;&emsp;hasPreviousPage||boolean||
|&emsp;&emsp;hasNextPage||boolean||
|&emsp;&emsp;navigatePages||integer(int32)||
|&emsp;&emsp;navigatepageNums||array|integer(int32)|
|&emsp;&emsp;navigateFirstPage||integer(int32)||
|&emsp;&emsp;navigateLastPage||integer(int32)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"total": 0,
		"list": [
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
						"role_name": "",
						"role_key": "",
						"permissions": [
							{
								"id": "",
								"parent_id": "",
								"permission_name": "",
								"permission_key": "",
								"children": [
									{
										"id": "",
										"parent_id": "",
										"permission_name": "",
										"permission_key": "",
										"children": [
											{}
										],
										"sort": 0,
										"create_time": "",
										"update_time": ""
									}
								],
								"sort": 0,
								"create_time": "",
								"update_time": ""
							}
						],
						"sort": 0,
						"status": 0,
						"description": "",
						"create_time": "",
						"update_time": "",
						"admin": true
					}
				],
				"status": 0,
				"createTime": "",
				"updateTime": "",
				"lastLoginTime": ""
			}
		],
		"pageNum": 0,
		"pageSize": 0,
		"size": 0,
		"startRow": 0,
		"endRow": 0,
		"pages": 0,
		"prePage": 0,
		"nextPage": 0,
		"isFirstPage": true,
		"isLastPage": true,
		"hasPreviousPage": true,
		"hasNextPage": true,
		"navigatePages": 0,
		"navigatepageNums": [],
		"navigateFirstPage": 0,
		"navigateLastPage": 0
	}
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


**响应状态码-500**:


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


## 注册用户


**接口地址**:`/api/system/user/register`


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
  "nickName": ""
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
|&emsp;&emsp;nickName|用户昵称||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|
|400|Bad Request||
|403|Forbidden|ResultString|
|500|Internal Server Error|ResultString|


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


**响应状态码-500**:


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