# nestJs

在 NestJS 中，Controller、Service 和 Module 是三个最基本和常用的概念。它们分别处理以下逻辑：

+ Controller：Controller 处理 HTTP 请求和响应。它们接收来自客户端的请求，并调用相应的 Service 来处理这些请求。Controller 中包含一些 API 端点，以及在这些端点上执行的处理逻辑。 Controller 主要关注于处理输入和输出。

+ Service：Service 负责处理业务逻辑。它们包含了应用程序的核心处理逻辑。它们接收来自 Controller 的请求，并执行相应的处理逻辑，然后将结果返回给 Controller。 Service 主要关注于执行业务逻辑，如数据处理、条件流程等。

+ Module： Module 将 Controller 和 Service 组织在一起。它们定义了如何将应用程序的各个部分进行组装、配置和提供。 Module 负责初始化应用程序，并注册和管理它所需要的组件和依赖项。 Module 还可以定义各种提供者、控制器和服务，并将它们所有的组件绑定在一起以构建应用程序。

> 总之，Controller 主要处理输入和输出，Service 处理业务逻辑，Module 则负责组织和管理它们。这些概念极其重要，有助于构建高度可维护、松耦合的应用程序。

## 管道验证

```typescript
@Query(
    new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
    }),
)
options: QueryPostDto,
```

在实例化ValidationPipe这个验证管道时，传入的参数的作用如下
● transform 如果设置成true则代码在验证之后对数据进行序列化
● forbidUnknownValues 代表如果请求数据中有多余的数据(比如没有在验证管道中定义的属性)则会报出403错误
● validationError.target 代表不会在响应数据中使我们的验证类也暴露传来
● groups用于设置验证组

ValidationPipe这个验证管道流程如下
一，在验证前先把自动把传入的请求数据先通过class-transformer导出的plainToInstance函数把普通对象的请求数据转换成通过验证数据类型提示的类的实例，比如data: UpdatePostDto，会是传入的{"id": "xxx","title": "yyy"}变成

```ts
const data = new UpdatePostDto()
data.id = 'xxx'
data.title = 'yyy'
```

二，通过每个属性的验证约束对它们进行验证(如果有转译则转译之后对该属性进行验证)
三，验证失败则响应403给前端
四，如果transform选项设置成true，则在验证无误后调用instanceToPlain函数(也是class-transformer的内置函数)把前面生成的DTO实例再次转换为普通对象(这时候那些加了@Transform装饰器的属性已经被转译了的)
五，把对象转入到控制器，以便传给服务进行数据操作

### provider

> 提供者就是通过类型提示或者标识符的方式使某个类或函数以依赖注入的方式在其它需要使用到它的地方进行实例化
> 提供者需要在模块元元素的providers中注册才可以被本模块的其它类注入，需要在exports中导出后才能被其它模块调用

自定义提供者
● 值提供者: 使用useValue来构建一个提供者
● 字符串提供者: 使用字符串，比如CONNECT来构建一个提供者
● 类映射提供者: 使用一个类映射另一个类来构建一个提供者
● 构造器提供者: 使用factory来构建一个提供者
● 别名提供者: 使用useExisting来为一个提供者指定一个别名
● 异步提供者: 使用async关键字+factory构建异步提供者

### 数据验证

```typescript
/**
 * 判断两个字段的值是否相等的验证规则
 */
@ValidatorConstraint({ name: 'isMatch' })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedProperty] = args.constraints;
        const relatedValue = (args.object as any)[relatedProperty];
        return value === relatedValue;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedProperty] = args.constraints;
        return `${relatedProperty} and ${args.property} don't match`;
    }
}
/**
 * 判断DTO中两个属性的值是否相等的验证规则
 * @param relatedProperty 用于对比的属性名称
 * @param validationOptions class-validator库的选项
 */
export function IsMatch(relatedProperty: string, validationOptions?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [relatedProperty],
            validator: MatchConstraint,
        });
    };
}
```

```typescript
/**
 * 密码验证规则
 */
@ValidatorConstraint({ name: 'isPassword', async: false })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        const validateModel: ModelType = args.constraints[0] ?? 1;
        switch (validateModel) {
            // 必须由大写或小写字母组成(默认模式)
            case 1:
                return /\d/.test(value) && /[a-zA-Z]/.test(value);
            // 必须由小写字母组成
            case 2:
                return /\d/.test(value) && /[a-z]/.test(value);
            // 必须由大写字母组成
            case 3:
                return /\d/.test(value) && /[A-Z]/.test(value);
            // 必须包含数字,小写字母,大写字母
            case 4:
                return /\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value);
            // 必须包含数字,小写字母,大写字母,特殊符号
            case 5:
                return (
                    /\d/.test(value) &&
                    /[a-z]/.test(value) &&
                    /[A-Z]/.test(value) &&
                    /[!@#$%^&]/.test(value)
                );
            default:
                return /\d/.test(value) && /[a-zA-Z]/.test(value);
        }
    }

    defaultMessage(_args: ValidationArguments) {
        return "($value) 's format error!";
    }
}

/**
 * 密码复杂度验证
 * 模式1: 必须由大写或小写字母组成(默认模式)
 * 模式2: 必须由小写字母组成
 * 模式3: 必须由大写字母组成
 * 模式4: 必须包含数字,小写字母,大写字母
 * 模式5: 必须包含数字,小写字母,大写字母,特殊符号
 * @param model 验证模式
 * @param validationOptions
 */
export function IsPassword(model?: ModelType, validationOptions?: ValidationOptions) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [model],
            validator: IsPasswordConstraint,
        });
    };
}

// 用法
@IsPassword(5, {
    message: '密码必须由小写字母,大写字母,数字以及特殊字符组成',
})
@Length(8, 50, {
    message: '密码长度不得少于$constraint1',
})
readonly password!: string;
```

## elasticsearch

Elasticsearch 是一个基于 Lucene 的搜索引擎，它提供了分布式、多租户的全文搜索引擎功能。它可以快速地存储、搜索和分析大量的数据，支持实时搜索和分析，具有高可用性和可扩展性。

基本使用包括以下几个方面：

安装和启动 Elasticsearch：您可以从 Elasticsearch 的官方网站（<https://www.elastic.co/downloads/elasticsearch）>下载适用于您的操作系统的安装程序，并按照提示进行安装。安装完成后，您可以在命令行中输入 elasticsearch 命令来启动 Elasticsearch。

创建索引：在 Elasticsearch 中，数据存储在索引中。您可以使用 PUT 请求来创建一个新的索引，例如：

PUT /my_index
这个命令将创建一个名为 my_index 的新索引。

添加文档：在 Elasticsearch 中，文档是索引中的基本单位。您可以使用 PUT 请求来添加一个新的文档，例如：
PUT /my_index/_doc/1
{
  "title": "Elasticsearch Introduction",
  "content": "This is an introduction to Elasticsearch."
}
这个命令将在 my_index 索引中添加一个新的文档，其 ID 为 1，包含 title 和 content 两个字段。

搜索文档：在 Elasticsearch 中，您可以使用 GET 请求来搜索文档。例如，以下命令将搜索 my_index 索引中包含 "Elasticsearch" 关键字的文档：
GET /my_index/_search?q=Elasticsearch
聚合数据：在 Elasticsearch 中，您可以使用聚合来对数据进行分析和统计。例如，以下命令将计算 my_index 索引中 title 字段的平均长度：

```js
// GET /my_index/_search
{
  "aggs": {
    "avg_title_length": {
      "avg": {
        "field": "title.length"
      }
    }
  }
}
```

这个命令将返回一个名为 avg_title_length 的聚合结果，其中包含 title 字段的平均长度。
