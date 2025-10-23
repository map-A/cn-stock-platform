#!/bin/bash

##########################################################
# OpenAPI 自动生成工具
# 功能：分析前端 services 中的真实 API 调用，生成准确的 OpenAPI 规范
# 这是"反向工程"方式 — 从代码推导 API 规范
##########################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SERVICE_DIR="$PROJECT_ROOT/src/services"

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }

# 生成智能 Node 脚本来分析真实的 API 调用
create_analyzer() {
    cat > /tmp/analyze-apis.js << 'ANALYZER_EOF'
const fs = require('fs');
const path = require('path');

const serviceDir = process.argv[2];
const outputFile = process.argv[3];

// 正则表达式集合
const patterns = {
  // 捕获: get/post/del(...'endpoint'...)
  httpCall: /(?:get|post|del|put|patch)\s*\(\s*['"`]([^'"`]+)['"`](?:\s*,\s*({[\s\S]*?}))?/g,
  // 捕获函数定义
  functionDef: /export\s+(?:async\s+)?function\s+(\w+)\s*\((.*?)\)\s*(?::\s*Promise<([^>]+)>)?/g,
  // 捕获 JSDoc
  jsdoc: /\/\*\*\n([\s\S]*?)\*\//g,
};

const apis = {};
let totalApis = 0;

// 扫描所有 service 文件
const files = fs.readdirSync(serviceDir)
  .filter(f => f.endsWith('.ts') && !f.startsWith('.'));

files.forEach(file => {
  const filePath = path.join(serviceDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const module = file.replace('.ts', '');
  
  apis[module] = [];

  // 提取每个函数
  let funcMatch;
  patterns.functionDef.lastIndex = 0;
  
  while ((funcMatch = patterns.functionDef.exec(content)) !== null) {
    const [fullFuncMatch, funcName, params, returnType] = funcMatch;
    const funcStart = funcMatch.index;
    
    // 获取该函数的 JSDoc
    const beforeFunc = content.substring(Math.max(0, funcStart - 500), funcStart);
    let jsdocComment = '';
    let jsdocMatch;
    patterns.jsdoc.lastIndex = 0;
    
    while ((jsdocMatch = patterns.jsdoc.exec(beforeFunc)) !== null) {
      jsdocComment = jsdocMatch[1];
    }
    
    // 获取该函数的 HTTP 调用
    const funcBody = content.substring(funcStart, Math.min(content.length, funcStart + 1000));
    let httpMatch;
    patterns.httpCall.lastIndex = 0;
    
    const httpCalls = [];
    while ((httpMatch = patterns.httpCall.exec(funcBody)) !== null) {
      const [fullCall, endpoint, data] = httpMatch;
      const method = fullCall.match(/^(get|post|del|put|patch)/)[1].toUpperCase();
      
      httpCalls.push({
        endpoint,
        method: method === 'DEL' ? 'DELETE' : method,
        data: data ? 'with-body' : 'no-body'
      });
    }
    
    // 如果有 HTTP 调用，记录这个函数
    httpCalls.forEach(call => {
      const paramList = params.split(',').map(p => p.trim().split(':')[0]).filter(p => p);
      
      apis[module].push({
        function: funcName,
        method: call.method,
        endpoint: call.endpoint,
        parameters: paramList,
        description: jsdocComment.split('\n')[0].replace(/^\s*\*\s?/, '').trim() || funcName,
        returnType: returnType || 'any',
        hasRequestBody: call.data === 'with-body'
      });
      
      totalApis++;
    });
  }
});

// 生成 OpenAPI 3.0 规范
function generateOpenAPI() {
  const openapi = {
    openapi: '3.0.0',
    info: {
      title: '中国股票平台 API 规范',
      description: '自动从前端代码生成的 API 规范（反向工程）',
      version: '1.0.0',
      contact: { name: 'Frontend Team' }
    },
    servers: [
      { url: 'http://api.example.com', description: '开发环境' },
      { url: 'https://api.example.com', description: '生产环境' }
    ],
    paths: {},
    components: {
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            code: { type: 'integer', example: 200 },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            code: { type: 'integer' },
            message: { type: 'string' }
          }
        }
      }
    }
  };

  // 合并重复的端点
  const pathMap = {};
  
  Object.entries(apis).forEach(([module, functions]) => {
    functions.forEach(api => {
      const path = api.endpoint;
      
      if (!pathMap[path]) {
        pathMap[path] = {};
      }
      
      const method = api.method.toLowerCase();
      pathMap[path][method] = {
        tags: [module],
        summary: api.description,
        operationId: api.function,
        parameters: api.parameters.map(p => ({
          name: p,
          in: 'query',
          schema: { type: 'string' }
        })),
        responses: {
          '200': {
            description: '成功',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          '400': {
            description: '请求错误',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      };
      
      if (api.hasRequestBody) {
        pathMap[path][method].requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' }
            }
          }
        };
      }
    });
  });
  
  openapi.paths = pathMap;
  
  return openapi;
}

try {
  const openapi = generateOpenAPI();
  fs.writeFileSync(outputFile, JSON.stringify(openapi, null, 2));
  console.log(`✓ 从 ${files.length} 个文件扫描出 ${totalApis} 个 API`);
  console.log(`✓ 生成 ${Object.keys(openapi.paths).length} 个唯一端点`);
  console.log(`✓ OpenAPI 规范: ${outputFile}`);
} catch (err) {
  console.error('❌ 错误:', err.message);
  process.exit(1);
}
ANALYZER_EOF
}

main() {
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  OpenAPI 自动生成工具 (反向工程)         ║${NC}"
    echo -e "${BLUE}║  从前端代码推导后端 API 规范              ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""

    if [ ! -d "$SERVICE_DIR" ]; then
        echo -e "${RED}❌ 服务目录不存在${NC}: $SERVICE_DIR"
        exit 1
    fi

    log_info "分析前端 API 调用..."
    create_analyzer
    
    node /tmp/analyze-apis.js "$SERVICE_DIR" "$PROJECT_ROOT/openapi.json"
    
    if [ -f "$PROJECT_ROOT/openapi.json" ]; then
        log_success "✅ OpenAPI 规范生成成功"
        echo ""
        echo -e "${BLUE}📄 生成的文件:${NC}"
        echo "  • openapi.json ($(ls -lh $PROJECT_ROOT/openapi.json | awk '{print $5}'))"
        echo ""
        echo -e "${BLUE}💡 下一步:${NC}"
        echo "  1. 将此规范发送给后端团队"
        echo "  2. 后端根据规范实现 API"
        echo "  3. 使用 Swagger UI 预览: https://editor.swagger.io/?url=file:///path/to/openapi.json"
    else
        echo -e "${RED}❌ 生成失败${NC}"
        exit 1
    fi
    
    rm -f /tmp/analyze-apis.js
}

main "$@"
