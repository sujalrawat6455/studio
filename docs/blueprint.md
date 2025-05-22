# **App Name**: MiniC Compiler

## Core Features:

- Datatype Mapping: Define a simplified set of datatypes, mapping C datatypes (int, char, float, double) to MiniC equivalents (integer, character, decimal).
- Lexical Analysis: Implement a lexical analyzer to tokenize the MiniC source code, identifying keywords, identifiers, operators, and literals.
- Syntactic Analysis: Develop a parser to create an Abstract Syntax Tree (AST) from the tokens, ensuring the code adheres to MiniC's grammar.
- Code Generation: Implement a code generator to translate the AST into JavaScript code that mirrors the functionality of the MiniC source.
- Code Editor: Create a simple text editor within the Next.js application to input MiniC code.
- Output Display: Display the generated JavaScript code in a separate panel within the application.
- Explanatory Output: The system will automatically explain each step performed during conversion, aided by a tool, to help you to understand how the MiniC gets converted to JavaScript code

## Style Guidelines:

- Primary color: Deep purple (#673AB7) to evoke a sense of sophistication and intellect.
- Background color: Very light purple (#F3E5F5) to maintain a soft, non-distracting backdrop.
- Accent color: Electric blue (#3D5AFE) for interactive elements and key actions.
- Use a monospace font to provide distinction of the code sections from other textual data.
- Divide the screen into three main sections: code input, output display, and step-by-step explanation panel.
- Minimal, line-based icons for actions such as 'Compile', 'Clear', and 'Copy'.