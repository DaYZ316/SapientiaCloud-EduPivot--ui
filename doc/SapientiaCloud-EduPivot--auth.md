# SapientiaCloud-EduPivot--auth API

**简介**:SapientiaCloud-EduPivot--auth API

**HOST**:http://192.168.77.249:31602

**联系人**:DaYZ

**Version**:1.0.0

**接口路径**:/api/auth/v3/api-docs

[TOC]

# 认证接口

## 获取用户信息

**接口地址**:`/api/auth/info`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>获取当前登录用户的信息</p>

**请求参数**:

暂无

**响应状态**:

| 状态码 | 说明 | schema                  |
|-----|----|-------------------------| 
| 200 | OK | ResultSysUserInternalVO |

**响应参数**:

| 参数名称                                               | 参数说明                | 类型                | schema            |
|----------------------------------------------------|---------------------|-------------------|-------------------| 
| success                                            | 请求是否成功              | boolean           |                   |
| code                                               | 业务状态码 (200表示成功)     | integer(int32)    | integer(int32)    |
| message                                            | 响应消息                | string            |                   |
| data                                               |                     | SysUserInternalVO | SysUserInternalVO |
| &emsp;&emsp;createTime                             | 创建时间 (系统自动生成)       | string(date-time) |                   |
| &emsp;&emsp;updateTime                             | 更新时间 (系统自动生成)       | string(date-time) |                   |
| &emsp;&emsp;id                                     | 用户ID                | string(uuid)      |                   |
| &emsp;&emsp;username                               | 用户名                 | string            |                   |
| &emsp;&emsp;nickName                               | 用户昵称                | string            |                   |
| &emsp;&emsp;email                                  | 邮箱                  | string            |                   |
| &emsp;&emsp;mobile                                 | 手机号                 | string            |                   |
| &emsp;&emsp;gender                                 | 性别 (0=未知, 1=男, 2=女) | integer(int32)    |                   |
| &emsp;&emsp;avatar                                 | 用户头像URL             | string            |                   |
| &emsp;&emsp;status                                 | 状态 (0=正常, 1=停用)     | integer(int32)    |                   |
| &emsp;&emsp;lastLoginTime                          | 最后登录时间              | string(date-time) |                   |
| &emsp;&emsp;roles                                  | 系统角色视图对象 (VO)       | array             | SysRoleVO         |
| &emsp;&emsp;&emsp;&emsp;id                         | 角色ID                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;roleName                   | 角色名称                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;roleKey                    | 角色标识                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;permissions                | 系统权限视图对象 (VO)       | array             | SysPermissionVO   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id             | 权限ID                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId       | 父级权限ID              | string            |                   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName | 权限名称                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey  | 权限标识                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children       | 子权限列表               | array             | SysPermissionVO   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort           | 排序                  | integer           |                   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status         | 状态 (0=正常, 1=停用)     | integer           |                   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime     | 创建时间                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime     | 更新时间                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;sort                       | 排序                  | integer           |                   |
| &emsp;&emsp;&emsp;&emsp;status                     | 状态 (0=正常, 1=停用)     | integer           |                   |
| &emsp;&emsp;&emsp;&emsp;description                | 描述                  | string            |                   |
| &emsp;&emsp;&emsp;&emsp;createTime                 | 创建时间                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;updateTime                 | 更新时间                | string            |                   |
| &emsp;&emsp;permissions                            | 系统权限视图对象 (VO)       | array             | SysPermissionVO   |
| &emsp;&emsp;&emsp;&emsp;id                         | 权限ID                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;parentId                   | 父级权限ID              | string            |                   |
| &emsp;&emsp;&emsp;&emsp;permissionName             | 权限名称                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;permissionKey              | 权限标识                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;children                   | 子权限列表               | array             | SysPermissionVO   |
| &emsp;&emsp;&emsp;&emsp;sort                       | 排序                  | integer           |                   |
| &emsp;&emsp;&emsp;&emsp;status                     | 状态 (0=正常, 1=停用)     | integer           |                   |
| &emsp;&emsp;&emsp;&emsp;createTime                 | 创建时间                | string            |                   |
| &emsp;&emsp;&emsp;&emsp;updateTime                 | 更新时间                | string            |                   |

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
		"lastLoginTime": "",
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
								"status": 0,
								"createTime": "",
								"updateTime": ""
							}
						],
						"sort": 0,
						"status": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"createTime": "",
				"updateTime": ""
			}
		],
		"permissions": [
			{}
		]
	}
}
```

## 用户登录

**接口地址**:`/api/auth/login`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>通过用户名和密码登录系统</p>

**请求示例**:

```javascript
{
  "username": "",
  "password": ""
}
```

**请求参数**:

| 参数名称                 | 参数说明         | 请求类型 | 是否必须  | 数据类型            | schema          |
|----------------------|--------------|------|-------|-----------------|-----------------|
| sysUserLoginDTO      | 系统用户登录数据传输对象 | body | true  | SysUserLoginDTO | SysUserLoginDTO |
| &emsp;&emsp;username | 用户名          |      | false | string          |                 |
| &emsp;&emsp;password | 密码           |      | false | string          |                 |

**响应状态**:

| 状态码 | 说明 | schema               |
|-----|----|----------------------| 
| 200 | OK | ResultSysUserLoginVO |

**响应参数**:

| 参数名称                                               | 参数说明                | 类型                | schema          |
|----------------------------------------------------|---------------------|-------------------|-----------------| 
| success                                            | 请求是否成功              | boolean           |                 |
| code                                               | 业务状态码 (200表示成功)     | integer(int32)    | integer(int32)  |
| message                                            | 响应消息                | string            |                 |
| data                                               |                     | SysUserLoginVO    | SysUserLoginVO  |
| &emsp;&emsp;createTime                             | 创建时间 (系统自动生成)       | string(date-time) |                 |
| &emsp;&emsp;updateTime                             | 更新时间 (系统自动生成)       | string(date-time) |                 |
| &emsp;&emsp;id                                     | 用户ID                | string(uuid)      |                 |
| &emsp;&emsp;username                               | 用户名                 | string            |                 |
| &emsp;&emsp;nickName                               | 用户昵称                | string            |                 |
| &emsp;&emsp;email                                  | 邮箱                  | string            |                 |
| &emsp;&emsp;mobile                                 | 手机号                 | string            |                 |
| &emsp;&emsp;gender                                 | 性别 (0=未知, 1=男, 2=女) | integer(int32)    |                 |
| &emsp;&emsp;avatar                                 | 用户头像URL             | string            |                 |
| &emsp;&emsp;status                                 | 状态 (0=正常, 1=停用)     | integer(int32)    |                 |
| &emsp;&emsp;lastLoginTime                          | 最后登录时间              | string(date-time) |                 |
| &emsp;&emsp;roles                                  | 系统角色视图对象 (VO)       | array             | SysRoleVO       |
| &emsp;&emsp;&emsp;&emsp;id                         | 角色ID                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;roleName                   | 角色名称                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;roleKey                    | 角色标识                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;permissions                | 系统权限视图对象 (VO)       | array             | SysPermissionVO |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id             | 权限ID                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId       | 父级权限ID              | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName | 权限名称                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey  | 权限标识                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children       | 子权限列表               | array             | SysPermissionVO |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort           | 排序                  | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status         | 状态 (0=正常, 1=停用)     | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime     | 创建时间                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime     | 更新时间                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;sort                       | 排序                  | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;status                     | 状态 (0=正常, 1=停用)     | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;description                | 描述                  | string            |                 |
| &emsp;&emsp;&emsp;&emsp;createTime                 | 创建时间                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;updateTime                 | 更新时间                | string            |                 |
| &emsp;&emsp;permissions                            | 系统权限视图对象 (VO)       | array             | SysPermissionVO |
| &emsp;&emsp;&emsp;&emsp;id                         | 权限ID                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;parentId                   | 父级权限ID              | string            |                 |
| &emsp;&emsp;&emsp;&emsp;permissionName             | 权限名称                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;permissionKey              | 权限标识                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;children                   | 子权限列表               | array             | SysPermissionVO |
| &emsp;&emsp;&emsp;&emsp;sort                       | 排序                  | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;status                     | 状态 (0=正常, 1=停用)     | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;createTime                 | 创建时间                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;updateTime                 | 更新时间                | string            |                 |
| &emsp;&emsp;access_token                           | 访问令牌                | string            |                 |

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
		"lastLoginTime": "",
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
								"status": 0,
								"createTime": "",
								"updateTime": ""
							}
						],
						"sort": 0,
						"status": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"createTime": "",
				"updateTime": ""
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
						"status": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"createTime": "",
				"updateTime": ""
			}
		],
		"access_token": ""
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

暂无

**响应状态**:

| 状态码 | 说明 | schema        |
|-----|----|---------------| 
| 200 | OK | ResultBoolean |

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

## 手机验证码登录

**接口地址**:`/api/auth/mobile-login`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>通过手机号和验证码登录系统</p>

**请求示例**:

```javascript
{
  "mobile": "13812345678",
  "verificationCode": "123456"
}
```

**请求参数**:

| 参数名称                         | 参数说明           | 请求类型 | 是否必须 | 数据类型                  | schema                |
|------------------------------|----------------|------|------|-----------------------|-----------------------|
| sysUserMobileLoginDTO        | 手机验证码登录请求的数据模型 | body | true | SysUserMobileLoginDTO | SysUserMobileLoginDTO |
| &emsp;&emsp;mobile           | 手机号码           |      | true | string                |                       |
| &emsp;&emsp;verificationCode | 手机验证码          |      | true | string                |                       |

**响应状态**:

| 状态码 | 说明 | schema               |
|-----|----|----------------------| 
| 200 | OK | ResultSysUserLoginVO |

**响应参数**:

| 参数名称                                               | 参数说明                | 类型                | schema          |
|----------------------------------------------------|---------------------|-------------------|-----------------| 
| success                                            | 请求是否成功              | boolean           |                 |
| code                                               | 业务状态码 (200表示成功)     | integer(int32)    | integer(int32)  |
| message                                            | 响应消息                | string            |                 |
| data                                               |                     | SysUserLoginVO    | SysUserLoginVO  |
| &emsp;&emsp;createTime                             | 创建时间 (系统自动生成)       | string(date-time) |                 |
| &emsp;&emsp;updateTime                             | 更新时间 (系统自动生成)       | string(date-time) |                 |
| &emsp;&emsp;id                                     | 用户ID                | string(uuid)      |                 |
| &emsp;&emsp;username                               | 用户名                 | string            |                 |
| &emsp;&emsp;nickName                               | 用户昵称                | string            |                 |
| &emsp;&emsp;email                                  | 邮箱                  | string            |                 |
| &emsp;&emsp;mobile                                 | 手机号                 | string            |                 |
| &emsp;&emsp;gender                                 | 性别 (0=未知, 1=男, 2=女) | integer(int32)    |                 |
| &emsp;&emsp;avatar                                 | 用户头像URL             | string            |                 |
| &emsp;&emsp;status                                 | 状态 (0=正常, 1=停用)     | integer(int32)    |                 |
| &emsp;&emsp;lastLoginTime                          | 最后登录时间              | string(date-time) |                 |
| &emsp;&emsp;roles                                  | 系统角色视图对象 (VO)       | array             | SysRoleVO       |
| &emsp;&emsp;&emsp;&emsp;id                         | 角色ID                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;roleName                   | 角色名称                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;roleKey                    | 角色标识                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;permissions                | 系统权限视图对象 (VO)       | array             | SysPermissionVO |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id             | 权限ID                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId       | 父级权限ID              | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName | 权限名称                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey  | 权限标识                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children       | 子权限列表               | array             | SysPermissionVO |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort           | 排序                  | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status         | 状态 (0=正常, 1=停用)     | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime     | 创建时间                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime     | 更新时间                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;sort                       | 排序                  | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;status                     | 状态 (0=正常, 1=停用)     | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;description                | 描述                  | string            |                 |
| &emsp;&emsp;&emsp;&emsp;createTime                 | 创建时间                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;updateTime                 | 更新时间                | string            |                 |
| &emsp;&emsp;permissions                            | 系统权限视图对象 (VO)       | array             | SysPermissionVO |
| &emsp;&emsp;&emsp;&emsp;id                         | 权限ID                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;parentId                   | 父级权限ID              | string            |                 |
| &emsp;&emsp;&emsp;&emsp;permissionName             | 权限名称                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;permissionKey              | 权限标识                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;children                   | 子权限列表               | array             | SysPermissionVO |
| &emsp;&emsp;&emsp;&emsp;sort                       | 排序                  | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;status                     | 状态 (0=正常, 1=停用)     | integer           |                 |
| &emsp;&emsp;&emsp;&emsp;createTime                 | 创建时间                | string            |                 |
| &emsp;&emsp;&emsp;&emsp;updateTime                 | 更新时间                | string            |                 |
| &emsp;&emsp;access_token                           | 访问令牌                | string            |                 |

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
		"lastLoginTime": "",
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
								"status": 0,
								"createTime": "",
								"updateTime": ""
							}
						],
						"sort": 0,
						"status": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"description": "",
				"createTime": "",
				"updateTime": ""
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
						"status": 0,
						"createTime": "",
						"updateTime": ""
					}
				],
				"sort": 0,
				"status": 0,
				"createTime": "",
				"updateTime": ""
			}
		],
		"access_token": ""
	}
}
```

## 更新密码

**接口地址**:`/api/auth/password`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>更新当前登录用户的密码</p>

**请求示例**:

```javascript
{
  "currentPassword": "",
  "newPassword": "",
  "confirmPassword": ""
}
```

**请求参数**:

| 参数名称                        | 参数说明               | 请求类型 | 是否必须 | 数据类型               | schema             |
|-----------------------------|--------------------|------|------|--------------------|--------------------|
| sysUserPasswordDTO          | SysUserPasswordDTO | body | true | SysUserPasswordDTO | SysUserPasswordDTO |
| &emsp;&emsp;currentPassword | 当前密码               |      | true | string             |                    |
| &emsp;&emsp;newPassword     | 新密码                |      | true | string             |                    |
| &emsp;&emsp;confirmPassword | 确认密码               |      | true | string             |                    |

**响应状态**:

| 状态码 | 说明 | schema        |
|-----|----|---------------| 
| 200 | OK | ResultBoolean |

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

## 用户注册

**接口地址**:`/api/auth/register`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>注册一个新的用户</p>

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

| 参数名称                         | 参数说明                   | 请求类型 | 是否必须  | 数据类型               | schema             |
|------------------------------|------------------------|------|-------|--------------------|--------------------|
| sysUserRegisterDTO           | 用户注册请求的数据模型            | body | true  | SysUserRegisterDTO | SysUserRegisterDTO |
| &emsp;&emsp;username         | 用户名，必须是4-20位的字母、数字或下划线 |      | true  | string             |                    |
| &emsp;&emsp;password         | 用户密码，必须是6-20位的任意字符     |      | true  | string             |                    |
| &emsp;&emsp;confirmPassword  | 确认密码，必须与密码字段一致         |      | true  | string             |                    |
| &emsp;&emsp;avatar           | 用户头像URL                |      | false | string             |                    |
| &emsp;&emsp;nickName         | 用户昵称                   |      | false | string             |                    |
| &emsp;&emsp;mobile           | 手机号码，用于接收短信验证码         |      | true  | string             |                    |
| &emsp;&emsp;verificationCode | 注册验证码（短信或邮件验证码）        |      | true  | string             |                    |

**响应状态**:

| 状态码 | 说明 | schema        |
|-----|----|---------------| 
| 200 | OK | ResultBoolean |

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

## 验证令牌

**接口地址**:`/api/auth/validate`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>验证JWT令牌是否有效</p>

**请求参数**:

| 参数名称  | 参数说明 | 请求类型  | 是否必须 | 数据类型   | schema |
|-------|------|-------|------|--------|--------|
| token |      | query | true | string |        |

**响应状态**:

| 状态码 | 说明 | schema        |
|-----|----|---------------| 
| 200 | OK | ResultBoolean |

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