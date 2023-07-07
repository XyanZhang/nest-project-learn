# nestJs

在 NestJS 中，Controller、Service 和 Module 是三个最基本和常用的概念。它们分别处理以下逻辑：

+ Controller：Controller 处理 HTTP 请求和响应。它们接收来自客户端的请求，并调用相应的 Service 来处理这些请求。Controller 中包含一些 API 端点，以及在这些端点上执行的处理逻辑。 Controller 主要关注于处理输入和输出。

+ Service：Service 负责处理业务逻辑。它们包含了应用程序的核心处理逻辑。它们接收来自 Controller 的请求，并执行相应的处理逻辑，然后将结果返回给 Controller。 Service 主要关注于执行业务逻辑，如数据处理、条件流程等。

+ Module： Module 将 Controller 和 Service 组织在一起。它们定义了如何将应用程序的各个部分进行组装、配置和提供。 Module 负责初始化应用程序，并注册和管理它所需要的组件和依赖项。 Module 还可以定义各种提供者、控制器和服务，并将它们所有的组件绑定在一起以构建应用程序。

> 总之，Controller 主要处理输入和输出，Service 处理业务逻辑，Module 则负责组织和管理它们。这些概念极其重要，有助于构建高度可维护、松耦合的应用程序。

## 装饰器

装饰器是一种特殊的语法，它可以用来修改类或者类的属性和方法。在 TypeScript 中，装饰器是通过注解的方式来实现的。装饰器可以用来实现很多功能，比如日志记录、权限控制、性能分析等等。

装饰器的原理其实就是利用了 TypeScript 的元数据机制。在 TypeScript 中，每个类、属性、方法都有一个对应的元数据，可以通过 Reflect 库来获取。装饰器就是通过修改这些元数据来实现对类、属性、方法的修改。

具体来说，装饰器是一个函数，它接受三个参数：target、propertyKey、descriptor。其中，target 表示被装饰的类或者类的原型，propertyKey 表示被装饰的属性或者方法的名称，descriptor 表示被装饰的属性或者方法的描述符。装饰器可以在这些参数上进行修改，从而实现对类、属性、方法的修改。

例如，下面是一个简单的装饰器示例：

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with arguments: ${JSON.stringify(args)}`);
    const result = originalMethod.apply(this, args);
    console.log(`Result: ${JSON.stringify(result)}`);
    return result;
  };
  return descriptor;
}

class MyClass {
  @log
  myMethod(arg1: string, arg2: number) {
    return { arg1, arg2 };
  }
}

const myClass = new MyClass();
myClass.myMethod('hello', 42);
```

这个装饰器可以在调用 MyClass 的 myMethod 方法时输出日志。具体来说，它会在方法调用前输出方法名和参数，然后调用原始方法，最后输出方法的返回值。这个装饰器的实现就是利用了 TypeScript 的元数据机制，通过修改方法的描述符来实现对方法的修改。

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

```js
// PUT /my_index/_doc/1
{
  "title": "Elasticsearch Introduction",
  "content": "This is an introduction to Elasticsearch."
}
// 这个命令将在 my_index 索引中添加一个新的文档，其 ID 为 1，包含 title 和 content 两个字段。
```

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
// 这个命令将返回一个名为 avg_title_length 的聚合结果，其中包含 title 字段的平均长度。
```

### Elasticsearch 为什么快

+ 倒排索引：Elasticsearch 使用倒排索引来存储和搜索数据，这种索引方式可以快速地定位到包含关键字的文档，而不需要遍历整个数据集。同时，倒排索引还可以支持复杂的查询操作，如布尔查询、范围查询、模糊查询等。
+ 分布式架构：Elasticsearch 的分布式架构可以将数据分散存储在多个节点上，每个节点都可以独立地处理搜索请求，并将搜索结果合并返回给用户。这种架构可以提高系统的处理能力和存储容量，同时还可以保证系统的可用性和容错性。
+ 内存缓存：Elasticsearch 使用内存缓存来加速搜索操作，它会将最常用的数据缓存在内存中，以便快速地响应搜索请求。同时，Elasticsearch 还支持多级缓存，可以根据数据的访问频率和大小来动态调整缓存策略。
+ 多线程处理：Elasticsearch 使用多线程来处理搜索请求，可以同时处理多个请求，提高系统的并发能力和响应速度。同时，Elasticsearch 还支持异步处理和批量操作，可以进一步提高系统的性能和吞吐量。
+ 索引优化：Elasticsearch 提供了多种索引优化技术，如分片、副本、路由、映射等，可以根据数据的特点和访问模式来优化索引结构，提高搜索效率和减少存储空间。

综上所述，Elasticsearch 之所以快，是因为它采用了先进的索引和分布式架构技术，同时还支持多级缓存、多线程处理和索引优化等优化技术，可以满足各种不同的搜索需求，并提供快速、可靠的搜索服务。

### es 项目中的使用说明

创建文章索引，创建文章索引的时候，我们需要指定文章的 mapping，即文章的字段类型，这里我们使用了 text 类型，它会对文章的内容进行分词，以便于搜索。同时，我们还需要指定文章的分片数和副本数，这里我们将分片数设置为 1，副本数设置为 0，以便于节省资源。

+ 分片数是什么：分片数是指索引数据的分片数，它会将索引数据分散存储在多个分片中，从而提高系统的存储容量和处理能力。
+ 分片数决定了索引数据的存储方式，它会将索引数据分散存储在多个分片中，从而提高系统的存储容量和处理能力。分片数越多，系统的存储容量和处理能力就越高，但是会占用更多的资源。分片数的默认值为 5，一般来说，我们可以将分片数设置为节点数的 1 到 2 倍。
+ 节点数是什么：节点数是指 Elasticsearch 集群中的节点数，它会将索引数据分散存储在多个节点中，从而提高系统的存储容量和处理能力。
+ 副本数：副本数是指索引数据的副本数，它会将索引数据的副本存储在多个节点中，从而提高系统的可用性和容错性。副本数越多，系统的可用性和容错性就越高，但是会占用更多的资源。副本数的默认值为 1，一般来说，我们可以将副本数设置为节点数的 1 到 2 倍。

运用：

+ nestjs调用search 对文章进行搜索
+ create 文章的时候，同时创建索引，把该文章的 `id` 等字段存入索引中
+ update 文章的时候，同时更新索引
+ delete 文章的时候，同时删除索引（软删除是从es中删除，恢复时再次添加到es中


## class-transformer

@Expose 作用：在序列化时，只暴露指定的属性
