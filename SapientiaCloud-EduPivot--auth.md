# SapientiaCloud-EduPivot--auth API


**简介**:SapientiaCloud-EduPivot--auth API


**HOST**:http://172.16.0.10:31602


**联系人**:DaYZ


**Version**:1.0.0


**接口路径**:/api/auth/v3/api-docs


[TOC]






# 认证接口


## 用户登录


**接口地址**:`/api/auth/login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过用户名和密码登录系统</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|username|用户名|query|true|string||
|password|密码|query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultSysUserLoginVO|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||SysUserLoginVO|SysUserLoginVO|
|&emsp;&emsp;create_time|创建时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;update_time|更新时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;id|用户ID|string(uuid)||
|&emsp;&emsp;username|用户名|string||
|&emsp;&emsp;nick_name|用户昵称|string||
|&emsp;&emsp;email|邮箱|string||
|&emsp;&emsp;mobile|手机号|string||
|&emsp;&emsp;gender|性别 (0=未知, 1=男, 2=女)|integer(int32)||
|&emsp;&emsp;avatar|用户头像URL|string||
|&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer(int32)||
|&emsp;&emsp;last_login_time|最后登录时间|string(date-time)||
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
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;description|描述|string||
|&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;permissions|系统权限视图对象 (VO)|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;id|权限ID|string||
|&emsp;&emsp;&emsp;&emsp;parent_id|父级权限ID|string||
|&emsp;&emsp;&emsp;&emsp;permission_name|权限名称|string||
|&emsp;&emsp;&emsp;&emsp;permission_key|权限标识|string||
|&emsp;&emsp;&emsp;&emsp;children|子权限列表|array|SysPermissionVO|
|&emsp;&emsp;&emsp;&emsp;sort|排序|integer||
|&emsp;&emsp;&emsp;&emsp;status|状态 (0=正常, 1=停用)|integer||
|&emsp;&emsp;&emsp;&emsp;create_time|创建时间|string||
|&emsp;&emsp;&emsp;&emsp;update_time|更新时间|string||
|&emsp;&emsp;accessToken|访问令牌|string||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": "",
		"username": "",
		"nick_name": "",
		"email": "",
		"mobile": "",
		"gender": 0,
		"avatar": "",
		"status": 0,
		"last_login_time": "",
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
								"status": 0,
								"create_time": "",
								"update_time": ""
							}
						],
						"sort": 0,
						"status": 0,
						"create_time": "",
						"update_time": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"create_time": "",
				"update_time": ""
			}
		],
		"permissions": [
			{}
		],
		"accessToken": ""
	}
}
```


## 用户登出


**接口地址**:`/api/auth/logout`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>使当前JWT令牌失效</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|token||query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|


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


## 验证令牌


**接口地址**:`/api/auth/validate`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>验证JWT令牌是否有效</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|token||query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultBoolean|


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