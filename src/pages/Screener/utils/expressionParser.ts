/**
 * 表达式解析器 - 词法分析和语法分析
 */

// Token 类型
export enum TokenType {
  // 字面量
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  IDENTIFIER = 'IDENTIFIER',
  
  // 运算符
  GT = 'GT',           // >
  LT = 'LT',           // <
  GTE = 'GTE',         // >=
  LTE = 'LTE',         // <=
  EQ = 'EQ',           // ==
  NEQ = 'NEQ',         // !=
  
  // 逻辑运算符
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
  
  // 括号
  LPAREN = 'LPAREN',   // (
  RPAREN = 'RPAREN',   // )
  LBRACKET = 'LBRACKET', // [
  RBRACKET = 'RBRACKET', // ]
  
  // 其他
  COMMA = 'COMMA',     // ,
  EOF = 'EOF',
  UNKNOWN = 'UNKNOWN',
}

export interface Token {
  type: TokenType;
  value: string;
  position: number;
  line: number;
  column: number;
}

export interface ParseError {
  message: string;
  position: number;
  line: number;
  column: number;
  token?: Token;
}

/**
 * 词法分析器
 */
export class Lexer {
  private input: string;
  private position = 0;
  private line = 1;
  private column = 1;
  private tokens: Token[] = [];
  private errors: ParseError[] = [];

  constructor(input: string) {
    this.input = input;
  }

  /**
   * 执行词法分析
   */
  tokenize(): { tokens: Token[]; errors: ParseError[] } {
    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.position >= this.input.length) break;
      
      const char = this.currentChar();
      
      // 数字
      if (this.isDigit(char)) {
        this.readNumber();
        continue;
      }
      
      // 标识符或关键字
      if (this.isAlpha(char) || this.isChinese(char)) {
        this.readIdentifierOrKeyword();
        continue;
      }
      
      // 字符串
      if (char === '"' || char === "'") {
        this.readString(char);
        continue;
      }
      
      // 运算符和符号
      if (this.readOperatorOrSymbol()) {
        continue;
      }
      
      // 未知字符
      this.errors.push({
        message: `未知字符: '${char}'`,
        position: this.position,
        line: this.line,
        column: this.column,
      });
      this.advance();
    }
    
    // 添加 EOF token
    this.addToken(TokenType.EOF, '');
    
    return { tokens: this.tokens, errors: this.errors };
  }

  private currentChar(): string {
    return this.input[this.position];
  }

  private peek(offset = 1): string {
    const pos = this.position + offset;
    return pos < this.input.length ? this.input[pos] : '';
  }

  private advance(): void {
    if (this.currentChar() === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && /\s/.test(this.currentChar())) {
      this.advance();
    }
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private isAlpha(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  private isChinese(char: string): boolean {
    return /[\u4e00-\u9fa5]/.test(char);
  }

  private readNumber(): void {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';
    
    while (this.position < this.input.length && 
           (this.isDigit(this.currentChar()) || this.currentChar() === '.')) {
      value += this.currentChar();
      this.advance();
    }
    
    // 检查科学计数法
    if (this.currentChar() === 'e' || this.currentChar() === 'E') {
      value += this.currentChar();
      this.advance();
      
      if (this.currentChar() === '+' || this.currentChar() === '-') {
        value += this.currentChar();
        this.advance();
      }
      
      while (this.position < this.input.length && this.isDigit(this.currentChar())) {
        value += this.currentChar();
        this.advance();
      }
    }
    
    this.tokens.push({
      type: TokenType.NUMBER,
      value,
      position: start,
      line: startLine,
      column: startColumn,
    });
  }

  private readIdentifierOrKeyword(): void {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';
    
    while (this.position < this.input.length && 
           (this.isAlpha(this.currentChar()) || 
            this.isDigit(this.currentChar()) || 
            this.isChinese(this.currentChar()))) {
      value += this.currentChar();
      this.advance();
    }
    
    // 检查是否为关键字
    const upperValue = value.toUpperCase();
    let type = TokenType.IDENTIFIER;
    
    if (upperValue === 'AND') type = TokenType.AND;
    else if (upperValue === 'OR') type = TokenType.OR;
    else if (upperValue === 'NOT') type = TokenType.NOT;
    
    this.tokens.push({
      type,
      value,
      position: start,
      line: startLine,
      column: startColumn,
    });
  }

  private readString(quote: string): void {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    
    this.advance(); // skip opening quote
    let value = '';
    
    while (this.position < this.input.length && this.currentChar() !== quote) {
      if (this.currentChar() === '\\' && this.peek() === quote) {
        this.advance(); // skip escape
        value += this.currentChar();
        this.advance();
      } else {
        value += this.currentChar();
        this.advance();
      }
    }
    
    if (this.currentChar() === quote) {
      this.advance(); // skip closing quote
    } else {
      this.errors.push({
        message: '字符串未闭合',
        position: start,
        line: startLine,
        column: startColumn,
      });
    }
    
    this.tokens.push({
      type: TokenType.STRING,
      value,
      position: start,
      line: startLine,
      column: startColumn,
    });
  }

  private readOperatorOrSymbol(): boolean {
    const char = this.currentChar();
    const next = this.peek();
    const start = this.position;
    
    // 两字符运算符
    if (char === '>' && next === '=') {
      this.addToken(TokenType.GTE, '>=');
      this.advance();
      this.advance();
      return true;
    }
    
    if (char === '<' && next === '=') {
      this.addToken(TokenType.LTE, '<=');
      this.advance();
      this.advance();
      return true;
    }
    
    if (char === '=' && next === '=') {
      this.addToken(TokenType.EQ, '==');
      this.advance();
      this.advance();
      return true;
    }
    
    if (char === '!' && next === '=') {
      this.addToken(TokenType.NEQ, '!=');
      this.advance();
      this.advance();
      return true;
    }
    
    // 单字符运算符
    switch (char) {
      case '>':
        this.addToken(TokenType.GT, '>');
        this.advance();
        return true;
      case '<':
        this.addToken(TokenType.LT, '<');
        this.advance();
        return true;
      case '(':
        this.addToken(TokenType.LPAREN, '(');
        this.advance();
        return true;
      case ')':
        this.addToken(TokenType.RPAREN, ')');
        this.advance();
        return true;
      case '[':
        this.addToken(TokenType.LBRACKET, '[');
        this.advance();
        return true;
      case ']':
        this.addToken(TokenType.RBRACKET, ']');
        this.advance();
        return true;
      case ',':
        this.addToken(TokenType.COMMA, ',');
        this.advance();
        return true;
    }
    
    return false;
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      position: this.position,
      line: this.line,
      column: this.column,
    });
  }
}

/**
 * AST 节点类型
 */
export enum ASTNodeType {
  BINARY_EXPRESSION = 'BinaryExpression',
  LOGICAL_EXPRESSION = 'LogicalExpression',
  UNARY_EXPRESSION = 'UnaryExpression',
  IDENTIFIER = 'Identifier',
  LITERAL = 'Literal',
}

export interface ASTNode {
  type: ASTNodeType;
  [key: string]: any;
}

/**
 * 语法分析器
 */
export class Parser {
  private tokens: Token[];
  private position = 0;
  private errors: ParseError[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * 执行语法分析
   */
  parse(): { ast: ASTNode | null; errors: ParseError[] } {
    try {
      const ast = this.parseExpression();
      return { ast, errors: this.errors };
    } catch (error) {
      return { ast: null, errors: this.errors };
    }
  }

  private currentToken(): Token {
    return this.tokens[this.position] || this.tokens[this.tokens.length - 1];
  }

  private peek(offset = 1): Token {
    const pos = this.position + offset;
    return pos < this.tokens.length ? this.tokens[pos] : this.tokens[this.tokens.length - 1];
  }

  private advance(): Token {
    const token = this.currentToken();
    if (this.position < this.tokens.length - 1) {
      this.position++;
    }
    return token;
  }

  private expect(type: TokenType): Token {
    const token = this.currentToken();
    if (token.type !== type) {
      this.errors.push({
        message: `期望 ${type}，但得到 ${token.type}`,
        position: token.position,
        line: token.line,
        column: token.column,
        token,
      });
      throw new Error('Parse error');
    }
    return this.advance();
  }

  private parseExpression(): ASTNode {
    return this.parseLogicalOr();
  }

  private parseLogicalOr(): ASTNode {
    let left = this.parseLogicalAnd();
    
    while (this.currentToken().type === TokenType.OR) {
      const operator = this.advance();
      const right = this.parseLogicalAnd();
      left = {
        type: ASTNodeType.LOGICAL_EXPRESSION,
        operator: operator.value,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseLogicalAnd(): ASTNode {
    let left = this.parseUnary();
    
    while (this.currentToken().type === TokenType.AND) {
      const operator = this.advance();
      const right = this.parseUnary();
      left = {
        type: ASTNodeType.LOGICAL_EXPRESSION,
        operator: operator.value,
        left,
        right,
      };
    }
    
    return left;
  }

  private parseUnary(): ASTNode {
    if (this.currentToken().type === TokenType.NOT) {
      const operator = this.advance();
      const argument = this.parseUnary();
      return {
        type: ASTNodeType.UNARY_EXPRESSION,
        operator: operator.value,
        argument,
      };
    }
    
    return this.parseComparison();
  }

  private parseComparison(): ASTNode {
    let left = this.parsePrimary();
    
    const comparisonOps = [TokenType.GT, TokenType.LT, TokenType.GTE, TokenType.LTE, TokenType.EQ, TokenType.NEQ];
    
    if (comparisonOps.includes(this.currentToken().type)) {
      const operator = this.advance();
      const right = this.parsePrimary();
      return {
        type: ASTNodeType.BINARY_EXPRESSION,
        operator: operator.value,
        left,
        right,
      };
    }
    
    return left;
  }

  private parsePrimary(): ASTNode {
    const token = this.currentToken();
    
    // 括号表达式
    if (token.type === TokenType.LPAREN) {
      this.advance(); // skip (
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN);
      return expr;
    }
    
    // 标识符
    if (token.type === TokenType.IDENTIFIER) {
      this.advance();
      return {
        type: ASTNodeType.IDENTIFIER,
        name: token.value,
      };
    }
    
    // 字面量
    if (token.type === TokenType.NUMBER || token.type === TokenType.STRING) {
      this.advance();
      return {
        type: ASTNodeType.LITERAL,
        value: token.type === TokenType.NUMBER ? parseFloat(token.value) : token.value,
        raw: token.value,
      };
    }
    
    this.errors.push({
      message: `意外的 token: ${token.type}`,
      position: token.position,
      line: token.line,
      column: token.column,
      token,
    });
    
    throw new Error('Parse error');
  }
}

/**
 * 完整的表达式解析
 */
export const parseExpression = (expression: string): {
  tokens: Token[];
  ast: ASTNode | null;
  errors: ParseError[];
} => {
  // 词法分析
  const lexer = new Lexer(expression);
  const { tokens, errors: lexerErrors } = lexer.tokenize();
  
  if (lexerErrors.length > 0) {
    return { tokens, ast: null, errors: lexerErrors };
  }
  
  // 语法分析
  const parser = new Parser(tokens);
  const { ast, errors: parserErrors } = parser.parse();
  
  return {
    tokens,
    ast,
    errors: [...lexerErrors, ...parserErrors],
  };
};
