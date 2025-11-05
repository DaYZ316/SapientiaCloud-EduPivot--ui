# SapientiaCloud-EduPivot--celestial-hub API


**简介**:SapientiaCloud-EduPivot--celestial-hub API


**HOST**:http://192.168.1.21:31608


**联系人**:DaYZ


**Version**:1.0.0


**接口路径**:/api/celestial-hub/v3/api-docs


[TOC]






# 知识管理


## deleteChapterVectors


**接口地址**:`/api/celestial-hub/chapter/{chapterId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除指定章节的所有向量数据</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|chapterId|章节ID|path|true|string(uuid)||


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


## deleteCourseVectors


**接口地址**:`/api/celestial-hub/course/{courseId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>删除指定课程的所有向量数据</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|courseId|课程ID|path|true|string(uuid)||


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


## getCourseVectorCount


**接口地址**:`/api/celestial-hub/course/{courseId}/count`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取课程的向量化统计信息</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|courseId|课程ID|path|true|string(uuid)||


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


## searchKnowledge


**接口地址**:`/api/celestial-hub/search`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>基于向量相似度检索知识内容</p>



**请求示例**:


```javascript
{
  "query": "",
  "courseId": "",
  "chapterId": "",
  "contentTypes": [],
  "topK": 0,
  "similarityThreshold": 0,
  "tags": []
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|knowledgeRequestDTO|知识检索请求|body|true|KnowledgeRequestDTO|KnowledgeRequestDTO|
|&emsp;&emsp;query|查询内容||true|string||
|&emsp;&emsp;courseId|课程ID||false|string(uuid)||
|&emsp;&emsp;chapterId|章节ID||false|string(uuid)||
|&emsp;&emsp;contentTypes|内容类型过滤: 0-章节, 1-问题, 2-答案, 3-论坛||false|array|integer(int32)|
|&emsp;&emsp;topK|返回结果数量||false|integer(int32)||
|&emsp;&emsp;similarityThreshold|相似度阈值(0.0-1.0)||false|number(double)||
|&emsp;&emsp;tags|标签过滤||false|array|string|


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultKnowledgeSearchVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||KnowledgeSearchVO|KnowledgeSearchVO|
|&emsp;&emsp;query|查询内容|string||
|&emsp;&emsp;items|知识项|array|KnowledgeItemVO|
|&emsp;&emsp;&emsp;&emsp;id|内容ID|string||
|&emsp;&emsp;&emsp;&emsp;contentType|内容类型: 0-章节, 1-问题, 2-答案, 3-论坛|integer||
|&emsp;&emsp;&emsp;&emsp;title|标题|string||
|&emsp;&emsp;&emsp;&emsp;content|内容|string||
|&emsp;&emsp;&emsp;&emsp;score|相似度分数|number||
|&emsp;&emsp;&emsp;&emsp;courseId|课程ID|string||
|&emsp;&emsp;&emsp;&emsp;chapterId|章节ID|string||
|&emsp;&emsp;&emsp;&emsp;tags|标签列表|array|string|
|&emsp;&emsp;&emsp;&emsp;metadata|元数据|object||
|&emsp;&emsp;total|总数|integer(int32)||
|&emsp;&emsp;queryTime|查询耗时(ms)|integer(int64)||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"query": "",
		"items": [
			{
				"id": "",
				"contentType": 0,
				"title": "",
				"content": "",
				"score": 0,
				"courseId": "",
				"chapterId": "",
				"tags": [],
				"metadata": {}
			}
		],
		"total": 0,
		"queryTime": 0
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


## vectorizeContent


**接口地址**:`/api/celestial-hub/vectorize`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>将课程内容向量化并存储到向量库</p>



**请求示例**:


```javascript
{
  "courseId": "",
  "chapterId": "",
  "contentType": "",
  "forceReindex": true,
  "tags": []
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|vectorizeRequestDTO|向量化请求|body|true|VectorizeRequestDTO|VectorizeRequestDTO|
|&emsp;&emsp;courseId|课程ID||false|string(uuid)||
|&emsp;&emsp;chapterId|章节ID||false|string(uuid)||
|&emsp;&emsp;contentType|内容类型: chapter-章节, question-问题, answer-答案, forum-论坛||true|string||
|&emsp;&emsp;forceReindex|是否强制重新向量化||false|boolean||
|&emsp;&emsp;tags|标签过滤||false|array|string|


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


# AI对话会话管理


## addChatSession


**接口地址**:`/api/celestial-hub/session`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>创建一个新的AI对话会话。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|courseId|课程ID|query|false|string(uuid)||
|sessionType|会话类型|query|false|integer(int32)||
|title|会话标题|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultChatSessionVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||ChatSessionVO|ChatSessionVO|
|&emsp;&emsp;id|会话ID|string(uuid)||
|&emsp;&emsp;sysUserId|用户ID|string(uuid)||
|&emsp;&emsp;sessionTitle|会话标题|string||
|&emsp;&emsp;sessionType|会话类型|integer(int32)||
|&emsp;&emsp;messageCount|消息数量|integer(int32)||
|&emsp;&emsp;isPinned|是否置顶|integer(int32)||
|&emsp;&emsp;isFavorite|是否收藏|integer(int32)||
|&emsp;&emsp;lastMessagePreview|最后一条消息预览|string||
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
		"sysUserId": "",
		"sessionTitle": "",
		"sessionType": 0,
		"messageCount": 0,
		"isPinned": 0,
		"isFavorite": 0,
		"lastMessagePreview": "",
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


## removeChatSessionByIds


**接口地址**:`/api/celestial-hub/session`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>根据会话ID列表批量删除会话。</p>



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


## getChatSessionById


**接口地址**:`/api/celestial-hub/session/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过会话的唯一ID获取其详细信息。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|会话ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultChatSessionVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||ChatSessionVO|ChatSessionVO|
|&emsp;&emsp;id|会话ID|string(uuid)||
|&emsp;&emsp;sysUserId|用户ID|string(uuid)||
|&emsp;&emsp;sessionTitle|会话标题|string||
|&emsp;&emsp;sessionType|会话类型|integer(int32)||
|&emsp;&emsp;messageCount|消息数量|integer(int32)||
|&emsp;&emsp;isPinned|是否置顶|integer(int32)||
|&emsp;&emsp;isFavorite|是否收藏|integer(int32)||
|&emsp;&emsp;lastMessagePreview|最后一条消息预览|string||
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
		"sysUserId": "",
		"sessionTitle": "",
		"sessionType": 0,
		"messageCount": 0,
		"isPinned": 0,
		"isFavorite": 0,
		"lastMessagePreview": "",
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


## removeChatSessionById


**接口地址**:`/api/celestial-hub/session/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过会话的唯一ID删除会话。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|会话ID|path|true|string(uuid)||


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


## archiveSession


**接口地址**:`/api/celestial-hub/session/{id}/archive`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>将指定会话归档。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|会话ID|path|true|string(uuid)||


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


## favoriteSession


**接口地址**:`/api/celestial-hub/session/{id}/favorite`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>收藏或取消收藏会话。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|会话ID|path|true|string(uuid)||
|isFavorite|是否收藏|query|true|boolean||


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


## pinSession


**接口地址**:`/api/celestial-hub/session/{id}/pin`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>置顶或取消置顶会话。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|会话ID|path|true|string(uuid)||
|isPinned|是否置顶|query|true|boolean||


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


## updateChatSessionTitle


**接口地址**:`/api/celestial-hub/session/{id}/title`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>修改会话的标题。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|会话ID|path|true|string(uuid)||
|title|新标题|query|true|string||


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


## listChatSession


**接口地址**:`/api/celestial-hub/session/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据传入的条件分页查询AI对话会话信息。支持根据用户ID、会话标题、会话类型等字段进行查询。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysUserId|用户ID|query|false|string||
|sessionTitle|会话标题（模糊查询）|query|false|string||
|sessionType|会话类型: 0-普通对话, 1-课程问答, 2-题目辅导, 3-知识检索|query|false|string||
|isPinned|是否置顶: 0-否, 1-是|query|false|string||
|isFavorite|是否收藏: 0-否, 1-是|query|false|string||
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


## getUserSessions


**接口地址**:`/api/celestial-hub/session/my`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取当前用户的对话会话列表。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListChatSessionVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|ChatSessionVO|
|&emsp;&emsp;id|会话ID|string(uuid)||
|&emsp;&emsp;sysUserId|用户ID|string(uuid)||
|&emsp;&emsp;sessionTitle|会话标题|string||
|&emsp;&emsp;sessionType|会话类型|integer(int32)||
|&emsp;&emsp;messageCount|消息数量|integer(int32)||
|&emsp;&emsp;isPinned|是否置顶|integer(int32)||
|&emsp;&emsp;isFavorite|是否收藏|integer(int32)||
|&emsp;&emsp;lastMessagePreview|最后一条消息预览|string||
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
			"sysUserId": "",
			"sessionTitle": "",
			"sessionType": 0,
			"messageCount": 0,
			"isPinned": 0,
			"isFavorite": 0,
			"lastMessagePreview": "",
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


## listAllChatSessionByUserId


**接口地址**:`/api/celestial-hub/session/user/{sysUserId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据用户ID获取该用户的所有会话列表。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sysUserId|用户ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListChatSessionVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|ChatSessionVO|
|&emsp;&emsp;id|会话ID|string(uuid)||
|&emsp;&emsp;sysUserId|用户ID|string(uuid)||
|&emsp;&emsp;sessionTitle|会话标题|string||
|&emsp;&emsp;sessionType|会话类型|integer(int32)||
|&emsp;&emsp;messageCount|消息数量|integer(int32)||
|&emsp;&emsp;isPinned|是否置顶|integer(int32)||
|&emsp;&emsp;isFavorite|是否收藏|integer(int32)||
|&emsp;&emsp;lastMessagePreview|最后一条消息预览|string||
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
			"sysUserId": "",
			"sessionTitle": "",
			"sessionType": 0,
			"messageCount": 0,
			"isPinned": 0,
			"isFavorite": 0,
			"lastMessagePreview": "",
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


# AI对话消息管理


## getChatMessageById


**接口地址**:`/api/celestial-hub/message/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>通过消息的唯一ID获取其详细信息。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|消息ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultChatMessage|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||ChatMessage|ChatMessage|
|&emsp;&emsp;createTime|创建时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;updateTime|更新时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;deleted||integer(int32)||
|&emsp;&emsp;id|消息ID|string(uuid)||
|&emsp;&emsp;sessionId|会话ID|string(uuid)||
|&emsp;&emsp;role|角色: 0-用户, 1-AI助手, 2-系统|integer(int32)||
|&emsp;&emsp;content|消息内容|string||
|&emsp;&emsp;messageType|消息类型: 0-文本, 1-代码, 2-图片, 3-文件|integer(int32)||
|&emsp;&emsp;tokenCount|token数量|integer(int32)||
|&emsp;&emsp;modelName|使用的模型名称|string||
|&emsp;&emsp;references|引用的参考内容|array|object|
|&emsp;&emsp;attachments|附件URL列表|array|string|
|&emsp;&emsp;isFeedback|用户反馈: 0-无, 1-有用, -1-无用|integer(int32)||
|&emsp;&emsp;metadata|元数据|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"deleted": 0,
		"id": "",
		"sessionId": "",
		"role": 0,
		"content": "",
		"messageType": 0,
		"tokenCount": 0,
		"modelName": "",
		"references": [],
		"attachments": [],
		"isFeedback": 0,
		"metadata": {}
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


## feedbackMessage


**接口地址**:`/api/celestial-hub/message/{id}/feedback`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>对AI回复进行反馈（有用/无用）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|消息ID|path|true|string(uuid)||
|feedback|反馈类型: 1-有用, -1-无用|query|true|integer(int32)||


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


## chat


**接口地址**:`/api/celestial-hub/message/send`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>发送消息给AI助手并获取回复</p>



**请求示例**:


```javascript
{
  "sessionId": "",
  "message": "",
  "courseId": "",
  "chapterId": "",
  "sessionType": 0,
  "useRag": true,
  "stream": true,
  "temperature": 0,
  "maxTokens": 0,
  "attachments": []
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|chatRequestDTO|AI对话请求|body|true|ChatRequestDTO|ChatRequestDTO|
|&emsp;&emsp;sessionId|会话ID（新对话时可为空）||false|string(uuid)||
|&emsp;&emsp;message|用户消息内容||true|string||
|&emsp;&emsp;courseId|课程ID（课程相关问答时提供）||false|string(uuid)||
|&emsp;&emsp;chapterId|章节ID（章节相关问答时提供）||false|string(uuid)||
|&emsp;&emsp;sessionType|会话类型: 0-普通对话, 1-课程问答, 2-题目辅导, 3-知识检索||false|integer(int32)||
|&emsp;&emsp;useRag|是否使用RAG检索||false|boolean||
|&emsp;&emsp;stream|是否流式输出||false|boolean||
|&emsp;&emsp;temperature|温度参数(0.0-1.0)||false|number(double)||
|&emsp;&emsp;maxTokens|最大token数||false|integer(int32)||
|&emsp;&emsp;attachments|附件URL列表||false|array|string|


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultChatResponseVO|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data||ChatResponseVO|ChatResponseVO|
|&emsp;&emsp;sessionId|会话ID|string(uuid)||
|&emsp;&emsp;messageId|消息ID|string(uuid)||
|&emsp;&emsp;content|AI回复内容|string||
|&emsp;&emsp;model|使用的模型|string||
|&emsp;&emsp;tokenCount|token使用量|integer(int32)||
|&emsp;&emsp;references|引用内容|array|ReferenceVO|
|&emsp;&emsp;&emsp;&emsp;contentId|内容ID|string||
|&emsp;&emsp;&emsp;&emsp;contentType|内容类型: 0-章节, 1-问题, 2-答案, 3-论坛|integer||
|&emsp;&emsp;&emsp;&emsp;title|标题|string||
|&emsp;&emsp;&emsp;&emsp;snippet|内容片段|string||
|&emsp;&emsp;&emsp;&emsp;similarityScore|相似度分数|number||
|&emsp;&emsp;&emsp;&emsp;sourceUrl|来源URL|string||
|&emsp;&emsp;responseTime|响应时间|string(date-time)||
|&emsp;&emsp;finished|是否完成|boolean||
|&emsp;&emsp;metadata|元数据|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": {
		"sessionId": "",
		"messageId": "",
		"content": "",
		"model": "",
		"tokenCount": 0,
		"references": [
			{
				"contentId": "",
				"contentType": 0,
				"title": "",
				"snippet": "",
				"similarityScore": 0,
				"sourceUrl": ""
			}
		],
		"responseTime": "",
		"finished": true,
		"metadata": {}
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


## listMessagesBySessionId


**接口地址**:`/api/celestial-hub/message/session/{sessionId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取指定会话的消息列表</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|sessionId|会话ID|path|true|string(uuid)||
|limit|限制数量|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultListChatMessage|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|success|请求是否成功|boolean||
|code|业务状态码 (200表示成功)|integer(int32)|integer(int32)|
|message|响应消息|string||
|data|响应数据体 (泛型)|array|ChatMessage|
|&emsp;&emsp;createTime|创建时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;updateTime|更新时间 (系统自动生成)|string(date-time)||
|&emsp;&emsp;deleted||integer(int32)||
|&emsp;&emsp;id|消息ID|string(uuid)||
|&emsp;&emsp;sessionId|会话ID|string(uuid)||
|&emsp;&emsp;role|角色: 0-用户, 1-AI助手, 2-系统|integer(int32)||
|&emsp;&emsp;content|消息内容|string||
|&emsp;&emsp;messageType|消息类型: 0-文本, 1-代码, 2-图片, 3-文件|integer(int32)||
|&emsp;&emsp;tokenCount|token数量|integer(int32)||
|&emsp;&emsp;modelName|使用的模型名称|string||
|&emsp;&emsp;references|引用的参考内容|array|object|
|&emsp;&emsp;attachments|附件URL列表|array|string|
|&emsp;&emsp;isFeedback|用户反馈: 0-无, 1-有用, -1-无用|integer(int32)||
|&emsp;&emsp;metadata|元数据|object||


**响应示例**:
```javascript
{
	"success": true,
	"code": 200,
	"message": "操作成功",
	"data": [
		{
			"deleted": 0,
			"id": "",
			"sessionId": "",
			"role": 0,
			"content": "",
			"messageType": 0,
			"tokenCount": 0,
			"modelName": "",
			"references": [],
			"attachments": [],
			"isFeedback": 0,
			"metadata": {}
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


## chatStream


**接口地址**:`/api/celestial-hub/message/stream`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`text/event-stream,*/*`


**接口描述**:<p>发送消息并以流式方式接收AI回复</p>



**请求示例**:


```javascript
{
  "sessionId": "",
  "message": "",
  "courseId": "",
  "chapterId": "",
  "sessionType": 0,
  "useRag": true,
  "stream": true,
  "temperature": 0,
  "maxTokens": 0,
  "attachments": []
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|chatRequestDTO|AI对话请求|body|true|ChatRequestDTO|ChatRequestDTO|
|&emsp;&emsp;sessionId|会话ID（新对话时可为空）||false|string(uuid)||
|&emsp;&emsp;message|用户消息内容||true|string||
|&emsp;&emsp;courseId|课程ID（课程相关问答时提供）||false|string(uuid)||
|&emsp;&emsp;chapterId|章节ID（章节相关问答时提供）||false|string(uuid)||
|&emsp;&emsp;sessionType|会话类型: 0-普通对话, 1-课程问答, 2-题目辅导, 3-知识检索||false|integer(int32)||
|&emsp;&emsp;useRag|是否使用RAG检索||false|boolean||
|&emsp;&emsp;stream|是否流式输出||false|boolean||
|&emsp;&emsp;temperature|温度参数(0.0-1.0)||false|number(double)||
|&emsp;&emsp;maxTokens|最大token数||false|integer(int32)||
|&emsp;&emsp;attachments|附件URL列表||false|array|string|


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


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
[
	{
		"success": true,
		"code": 200,
		"message": "操作成功",
		"data": {}
	}
]
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
[
	{
		"success": true,
		"code": 200,
		"message": "操作成功",
		"data": ""
	}
]
```


## getStreamConnection


**接口地址**:`/api/celestial-hub/message/stream/{requestId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`text/event-stream,*/*`


**接口描述**:<p>通过requestId建立SSE连接，接收AI流式响应（异步架构）</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|requestId|请求ID|path|true|string(uuid)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|SseEmitter|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|timeout||integer(int64)|integer(int64)|


**响应示例**:
```javascript
{
	"timeout": 0
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


## chatStreamAsync


**接口地址**:`/api/celestial-hub/message/stream/async`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>发送消息到Kafka并立即返回requestId（异步架构）</p>



**请求示例**:


```javascript
{
  "sessionId": "",
  "message": "",
  "courseId": "",
  "chapterId": "",
  "sessionType": 0,
  "useRag": true,
  "stream": true,
  "temperature": 0,
  "maxTokens": 0,
  "attachments": []
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|chatRequestDTO|AI对话请求|body|true|ChatRequestDTO|ChatRequestDTO|
|&emsp;&emsp;sessionId|会话ID（新对话时可为空）||false|string(uuid)||
|&emsp;&emsp;message|用户消息内容||true|string||
|&emsp;&emsp;courseId|课程ID（课程相关问答时提供）||false|string(uuid)||
|&emsp;&emsp;chapterId|章节ID（章节相关问答时提供）||false|string(uuid)||
|&emsp;&emsp;sessionType|会话类型: 0-普通对话, 1-课程问答, 2-题目辅导, 3-知识检索||false|integer(int32)||
|&emsp;&emsp;useRag|是否使用RAG检索||false|boolean||
|&emsp;&emsp;stream|是否流式输出||false|boolean||
|&emsp;&emsp;temperature|温度参数(0.0-1.0)||false|number(double)||
|&emsp;&emsp;maxTokens|最大token数||false|integer(int32)||
|&emsp;&emsp;attachments|附件URL列表||false|array|string|


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ResultMapStringObject|
|400|Bad Request|ResultMapStringString|
|403|Forbidden|ResultString|


**响应状态码-200**:


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