# SapientiaCloud-EduPivot--auth API

**简介**:SapientiaCloud-EduPivot--auth API

**HOST**:http://172.21.0.1:31602

**联系人**:DaYZ

**Version**:1.0.0

**接口路径**:/api/auth/v3/api-docs

[TOC]

# 认证接口

## bindMobile

**接口地址**:`/api/auth/bind-mobile`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>绑定手机号（验证码校验成功后更新用户手机号，支持通过userId参数或当前登录用户）</p>

**请求示例**:

```javascript
{
  "mobile": "13812345678",
  "verificationCode": "123456",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**请求参数**:

| 参数名称                         | 参数说明                               | 请求类型 | 是否必须  | 数据类型          | schema        |
|------------------------------|------------------------------------|------|-------|---------------|---------------|
| bindMobileDTO                | 绑定手机号请求的数据模型                       | body | true  | BindMobileDTO | BindMobileDTO |
| &emsp;&emsp;mobile           | 手机号码                               |      | true  | string        |               |
| &emsp;&emsp;verificationCode | 手机验证码                              |      | true  | string        |               |
| &emsp;&emsp;userId           | 用户ID（可选，如果不传则从当前登录用户获取，或用于第三方登录场景） |      | false | string(uuid)  |               |

**响应状态**:

| 状态码 | 说明 | schema                    |
|-----|----|---------------------------| 
| 200 | OK | ResultBindMobileResultDTO |

**响应参数**:

| 参数名称                               | 参数说明            | 类型                  | schema              |
|------------------------------------|-----------------|---------------------|---------------------| 
| success                            | 请求是否成功          | boolean             |                     |
| code                               | 业务状态码 (200表示成功) | integer(int32)      | integer(int32)      |
| message                            | 响应消息            | string              |                     |
| data                               |                 | BindMobileResultDTO | BindMobileResultDTO |
| &emsp;&emsp;success                | 是否成功            | boolean             |                     |
| &emsp;&emsp;needConfirm            | 是否需要确认          | boolean             |                     |
| &emsp;&emsp;existingUserInfo       | 用户基本信息（脱敏）      | SysUserBasicInfoVO  | SysUserBasicInfoVO  |
| &emsp;&emsp;&emsp;&emsp;id         | 用户ID            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;username   | 用户名             | string              |                     |
| &emsp;&emsp;&emsp;&emsp;nickName   | 用户昵称            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;avatar     | 用户头像URL         | string              |                     |
| &emsp;&emsp;&emsp;&emsp;createTime | 创建时间            | string              |                     |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"success": true,
		"needConfirm": true,
		"existingUserInfo": {
			"id": "",
			"username": "",
			"nickName": "",
			"avatar": "",
			"createTime": ""
		}
	}
}
```

## bindMobileConfirm

**接口地址**:`/api/auth/bind-mobile/confirm`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>确认绑定手机号（当手机号已被使用时，用户确认是否为同一账户）</p>

**请求示例**:

```javascript
{
  "mobile": "13812345678",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "isSameAccount": true
}
```

**请求参数**:

| 参数名称                      | 参数说明                     | 请求类型 | 是否必须 | 数据类型                 | schema               |
|---------------------------|--------------------------|------|------|----------------------|----------------------|
| bindMobileConfirmDTO      | 绑定手机号确认请求的数据模型           | body | true | BindMobileConfirmDTO | BindMobileConfirmDTO |
| &emsp;&emsp;mobile        | 手机号码                     |      | true | string               |                      |
| &emsp;&emsp;userId        | 临时账户ID                   |      | true | string(uuid)         |                      |
| &emsp;&emsp;isSameAccount | 是否为同一账户（true=是，false=不是） |      | true | boolean              |                      |

**响应状态**:

| 状态码 | 说明 | schema                    |
|-----|----|---------------------------| 
| 200 | OK | ResultBindMobileResultDTO |

**响应参数**:

| 参数名称                               | 参数说明            | 类型                  | schema              |
|------------------------------------|-----------------|---------------------|---------------------| 
| success                            | 请求是否成功          | boolean             |                     |
| code                               | 业务状态码 (200表示成功) | integer(int32)      | integer(int32)      |
| message                            | 响应消息            | string              |                     |
| data                               |                 | BindMobileResultDTO | BindMobileResultDTO |
| &emsp;&emsp;success                | 是否成功            | boolean             |                     |
| &emsp;&emsp;needConfirm            | 是否需要确认          | boolean             |                     |
| &emsp;&emsp;existingUserInfo       | 用户基本信息（脱敏）      | SysUserBasicInfoVO  | SysUserBasicInfoVO  |
| &emsp;&emsp;&emsp;&emsp;id         | 用户ID            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;username   | 用户名             | string              |                     |
| &emsp;&emsp;&emsp;&emsp;nickName   | 用户昵称            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;avatar     | 用户头像URL         | string              |                     |
| &emsp;&emsp;&emsp;&emsp;createTime | 创建时间            | string              |                     |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"success": true,
		"needConfirm": true,
		"existingUserInfo": {
			"id": "",
			"username": "",
			"nickName": "",
			"avatar": "",
			"createTime": ""
		}
	}
}
```

## checkMobile

**接口地址**:`/api/auth/check-mobile`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>检查手机号是否可用，如果已被使用则返回已存在用户的基本信息</p>

**请求参数**:

| 参数名称   | 参数说明 | 请求类型  | 是否必须 | 数据类型   | schema |
|--------|------|-------|------|--------|--------|
| mobile |      | query | true | string |        |

**响应状态**:

| 状态码 | 说明 | schema                    |
|-----|----|---------------------------| 
| 200 | OK | ResultBindMobileResultDTO |

**响应参数**:

| 参数名称                               | 参数说明            | 类型                  | schema              |
|------------------------------------|-----------------|---------------------|---------------------| 
| success                            | 请求是否成功          | boolean             |                     |
| code                               | 业务状态码 (200表示成功) | integer(int32)      | integer(int32)      |
| message                            | 响应消息            | string              |                     |
| data                               |                 | BindMobileResultDTO | BindMobileResultDTO |
| &emsp;&emsp;success                | 是否成功            | boolean             |                     |
| &emsp;&emsp;needConfirm            | 是否需要确认          | boolean             |                     |
| &emsp;&emsp;existingUserInfo       | 用户基本信息（脱敏）      | SysUserBasicInfoVO  | SysUserBasicInfoVO  |
| &emsp;&emsp;&emsp;&emsp;id         | 用户ID            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;username   | 用户名             | string              |                     |
| &emsp;&emsp;&emsp;&emsp;nickName   | 用户昵称            | string              |                     |
| &emsp;&emsp;&emsp;&emsp;avatar     | 用户头像URL         | string              |                     |
| &emsp;&emsp;&emsp;&emsp;createTime | 创建时间            | string              |                     |

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"success": true,
		"needConfirm": true,
		"existingUserInfo": {
			"id": "",
			"username": "",
			"nickName": "",
			"avatar": "",
			"createTime": ""
		}
	}
}
```

## checkUsername

**接口地址**:`/api/auth/check-username`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>检查用户名是否可用</p>

**请求参数**:

| 参数名称     | 参数说明 | 请求类型  | 是否必须 | 数据类型   | schema |
|----------|------|-------|------|--------|--------|
| username |      | query | true | string |        |

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

## getUserInfo

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
| &emsp;&emsp;githubId                               | GitHub用户ID          | string            |                   |
| &emsp;&emsp;wechatId                               | 微信OpenID            | string            |                   |
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

## login

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
| &emsp;&emsp;githubId                               | GitHub用户ID          | string            |                 |
| &emsp;&emsp;wechatId                               | 微信OpenID            | string            |                 |
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
| &emsp;&emsp;accessToken                            | 访问令牌                | string            |                 |

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
		"accessToken": ""
	}
}
```

## logout

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

## mobileLogin

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
| &emsp;&emsp;githubId                               | GitHub用户ID          | string            |                 |
| &emsp;&emsp;wechatId                               | 微信OpenID            | string            |                 |
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
| &emsp;&emsp;accessToken                            | 访问令牌                | string            |                 |

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
		"accessToken": ""
	}
}
```

## updatePasswordByMobile

**接口地址**:`/api/auth/mobile-password`

**请求方式**:`PUT`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>通过手机验证码修改密码</p>

**请求示例**:

```javascript
{
  "mobile": "13812345678",
  "verificationCode": "123456",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**请求参数**:

| 参数名称                         | 参数说明               | 请求类型 | 是否必须 | 数据类型                     | schema                   |
|------------------------------|--------------------|------|------|--------------------------|--------------------------|
| sysUserMobilePasswordDTO     | 通过手机验证码修改密码请求的数据模型 | body | true | SysUserMobilePasswordDTO | SysUserMobilePasswordDTO |
| &emsp;&emsp;mobile           | 手机号码               |      | true | string                   |                          |
| &emsp;&emsp;verificationCode | 手机验证码              |      | true | string                   |                          |
| &emsp;&emsp;newPassword      | 新密码                |      | true | string                   |                          |
| &emsp;&emsp;confirmPassword  | 确认密码               |      | true | string                   |                          |

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

## updatePassword

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

## register

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

## sendVerificationCode

**接口地址**:`/api/auth/send-code`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>发送手机验证码</p>

**请求示例**:

```javascript
{
  "mobile": "13812345678"
}
```

**请求参数**:

| 参数名称                    | 参数说明           | 请求类型 | 是否必须 | 数据类型                    | schema                  |
|-------------------------|----------------|------|------|-------------------------|-------------------------|
| sendVerificationCodeDTO | 发送验证码请求的数据模型   | body | true | SendVerificationCodeDTO | SendVerificationCodeDTO |
| &emsp;&emsp;mobile      | 手机号码，用于接收短信验证码 |      | true | string                  |                         |

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

## validateToken

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

# 身份选择接口

## selectIdentity

**接口地址**:`/api/auth/identity/select`

**请求方式**:`POST`

**请求数据类型**:`application/x-www-form-urlencoded,application/json`

**响应数据类型**:`*/*`

**接口描述**:<p>选择身份并创建对应的学生或教师记录，完成后返回token</p>

**请求示例**:

```javascript
{
  "identityType": "student",
  "studentInfo": {
    "studentCode": "",
    "realName": "",
    "birthDate": "",
    "admissionYear": 0,
    "major": "",
    "academicStatus": 0,
    "description": "",
    "sysUserId": ""
  },
  "teacherInfo": {
    "teacherCode": "",
    "realName": "",
    "birthDate": "",
    "department": "",
    "education": 0,
    "specialization": "",
    "description": "",
    "sysUserId": ""
  }
}
```

**请求参数**:

| 参数名称                                   | 参数说明                          | 请求类型 | 是否必须  | 数据类型              | schema            |
|----------------------------------------|-------------------------------|------|-------|-------------------|-------------------|
| selectIdentityDTO                      | 身份选择数据传输对象                    | body | true  | SelectIdentityDTO | SelectIdentityDTO |
| &emsp;&emsp;identityType               | 身份类型 (student=学生, teacher=教师) |      | true  | string            |                   |
| &emsp;&emsp;studentInfo                | 学生添加信息数据传输对象                  |      | false | StudentAddDTO     | StudentAddDTO     |
| &emsp;&emsp;&emsp;&emsp;studentCode    | 学号                            |      | true  | string            |                   |
| &emsp;&emsp;&emsp;&emsp;realName       | 学生真实姓名                        |      | true  | string            |                   |
| &emsp;&emsp;&emsp;&emsp;birthDate      | 出生日期                          |      | false | string            |                   |
| &emsp;&emsp;&emsp;&emsp;admissionYear  | 入学年份                          |      | false | integer           |                   |
| &emsp;&emsp;&emsp;&emsp;major          | 专业                            |      | false | string            |                   |
| &emsp;&emsp;&emsp;&emsp;academicStatus | 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) |      | false | integer           |                   |
| &emsp;&emsp;&emsp;&emsp;description    | 自我描述                          |      | false | string            |                   |
| &emsp;&emsp;&emsp;&emsp;sysUserId      | 系统用户ID                        |      | false | string            |                   |
| &emsp;&emsp;teacherInfo                | 教师添加信息数据传输对象                  |      | false | TeacherAddDTO     | TeacherAddDTO     |
| &emsp;&emsp;&emsp;&emsp;teacherCode    | 教师工号                          |      | true  | string            |                   |
| &emsp;&emsp;&emsp;&emsp;realName       | 教师真实姓名                        |      | true  | string            |                   |
| &emsp;&emsp;&emsp;&emsp;birthDate      | 出生日期                          |      | false | string            |                   |
| &emsp;&emsp;&emsp;&emsp;department     | 所属部门/学院                       |      | false | string            |                   |
| &emsp;&emsp;&emsp;&emsp;education      | 学历 (0=专科, 1=本科, 2=硕士, 3=博士)   |      | false | integer           |                   |
| &emsp;&emsp;&emsp;&emsp;specialization | 专业特长/研究方向                     |      | false | string            |                   |
| &emsp;&emsp;&emsp;&emsp;description    | 自我描述                          |      | false | string            |                   |
| &emsp;&emsp;&emsp;&emsp;sysUserId      | 系统用户ID                        |      | false | string            |                   |

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
| &emsp;&emsp;githubId                               | GitHub用户ID          | string            |                 |
| &emsp;&emsp;wechatId                               | 微信OpenID            | string            |                 |
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
| &emsp;&emsp;accessToken                            | 访问令牌                | string            |                 |

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
		"accessToken": ""
	}
}
```

# OAuth2.0接口

## authorize

**接口地址**:`/api/auth/oauth2/authorize/{provider}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>发起授权</p>

**请求参数**:

| 参数名称     | 参数说明       | 请求类型 | 是否必须 | 数据类型   | schema |
|----------|------------|------|------|--------|--------|
| provider | 第三方登录提供商名称 | path | true | string |        |

**响应状态**:

| 状态码 | 说明 | schema |
|-----|----|--------| 
| 200 | OK |        |

**响应参数**:

暂无

**响应示例**:

```javascript

```

## callback

**接口地址**:`/api/auth/oauth2/callback/{provider}`

**请求方式**:`GET`

**请求数据类型**:`application/x-www-form-urlencoded`

**响应数据类型**:`*/*`

**接口描述**:<p>处理授权回调</p>

**请求参数**:

| 参数名称     | 参数说明       | 请求类型  | 是否必须 | 数据类型   | schema |
|----------|------------|-------|------|--------|--------|
| provider | 第三方登录提供商名称 | path  | true | string |        |
| code     | 授权码        | query | true | string |        |
| state    | 状态参数       | query | true | string |        |

**响应状态**:

| 状态码 | 说明 | schema                        |
|-----|----|-------------------------------| 
| 200 | OK | ResultOAuth2CallbackResultDTO |

**响应参数**:

| 参数名称                                                           | 参数说明                | 类型                      | schema                  |
|----------------------------------------------------------------|---------------------|-------------------------|-------------------------| 
| success                                                        | 请求是否成功              | boolean                 |                         |
| code                                                           | 业务状态码 (200表示成功)     | integer(int32)          | integer(int32)          |
| message                                                        | 响应消息                | string                  |                         |
| data                                                           |                     | OAuth2CallbackResultDTO | OAuth2CallbackResultDTO |
| &emsp;&emsp;accessToken                                        | 访问令牌                | string                  |                         |
| &emsp;&emsp;refreshToken                                       | 刷新令牌                | string                  |                         |
| &emsp;&emsp;user                                               | 系统用户内部数据传输对象 (VO)   | SysUserInternalVO       | SysUserInternalVO       |
| &emsp;&emsp;&emsp;&emsp;createTime                             | 创建时间 (系统自动生成)       | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;updateTime                             | 更新时间 (系统自动生成)       | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;id                                     | 用户ID                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;username                               | 用户名                 | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;nickName                               | 用户昵称                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;email                                  | 邮箱                  | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;mobile                                 | 手机号                 | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;gender                                 | 性别 (0=未知, 1=男, 2=女) | integer                 |                         |
| &emsp;&emsp;&emsp;&emsp;avatar                                 | 用户头像URL             | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;status                                 | 状态 (0=正常, 1=停用)     | integer                 |                         |
| &emsp;&emsp;&emsp;&emsp;lastLoginTime                          | 最后登录时间              | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;githubId                               | GitHub用户ID          | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;wechatId                               | 微信OpenID            | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;roles                                  | 系统角色视图对象 (VO)       | array                   | SysRoleVO               |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id                         | 角色ID                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;roleName                   | 角色名称                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;roleKey                    | 角色标识                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissions                | 系统权限视图对象 (VO)       | array                   | SysPermissionVO         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id             | 权限ID                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId       | 父级权限ID              | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName | 权限名称                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey  | 权限标识                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children       | 子权限列表               | array                   | SysPermissionVO         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort           | 排序                  | integer                 |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status         | 状态 (0=正常, 1=停用)     | integer                 |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime     | 创建时间                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime     | 更新时间                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort                       | 排序                  | integer                 |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status                     | 状态 (0=正常, 1=停用)     | integer                 |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;description                | 描述                  | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime                 | 创建时间                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime                 | 更新时间                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;permissions                            | 系统权限视图对象 (VO)       | array                   | SysPermissionVO         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;id                         | 权限ID                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;parentId                   | 父级权限ID              | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionName             | 权限名称                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;permissionKey              | 权限标识                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;children                   | 子权限列表               | array                   | SysPermissionVO         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sort                       | 排序                  | integer                 |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;status                     | 状态 (0=正常, 1=停用)     | integer                 |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;createTime                 | 创建时间                | string                  |                         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;updateTime                 | 更新时间                | string                  |                         |
| &emsp;&emsp;registrationStatus                                 | 注册状态信息              | RegistrationStatusDTO   | RegistrationStatusDTO   |
| &emsp;&emsp;&emsp;&emsp;isNewUser                              | 是否为新用户              | boolean                 |                         |
| &emsp;&emsp;&emsp;&emsp;needBindMobile                         | 是否需要绑定手机号           | boolean                 |                         |
| &emsp;&emsp;&emsp;&emsp;needSelectIdentity                     | 是否需要选择身份            | boolean                 |                         |
| &emsp;&emsp;&emsp;&emsp;needCompleteInfo                       | 是否需要完善信息            | boolean                 |                         |
| &emsp;&emsp;&emsp;&emsp;currentStep                            | 当前步骤: bindMobile    | selectIdentity          | completeInfo            | completed|string||

**响应示例**:

```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"accessToken": "",
		"refreshToken": "",
		"user": {
			"id": "",
			"username": "",
			"nickName": "",
			"email": "",
			"mobile": "",
			"gender": 0,
			"avatar": "",
			"status": 0,
			"lastLoginTime": "",
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
		},
		"registrationStatus": {
			"isNewUser": true,
			"needBindMobile": true,
			"needSelectIdentity": true,
			"needCompleteInfo": true,
			"currentStep": ""
		}
	}
}
```