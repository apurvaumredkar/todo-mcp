#!/usr/bin/env node
import { spawn } from 'child_process';
import { createInterface } from 'readline';

const mcp = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: process.cwd()
});

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Handle MCP output
mcp.stdout.on('data', (data) => {
  console.log('MCP Response:', data.toString());
});

mcp.stderr.on('data', (data) => {
  console.error('MCP Error:', data.toString());
});

mcp.on('close', (code) => {
  console.log(`MCP server exited with code ${code}`);
  process.exit(code);
});

// Test commands
const testCommands = [
  // Initialize
  JSON.stringify({ jsonrpc: '2.0', method: 'initialize', params: { protocolVersion: '1.0.0', capabilities: {} }, id: 1 }),

  // List available tools
  JSON.stringify({ jsonrpc: '2.0', method: 'tools/list', params: {}, id: 2 }),

  // Create a test task
  JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'create_task',
      arguments: {
        title: 'Test MCP Task',
        description: 'Testing MCP server integration',
        tags: ['test', 'mcp'],
        status: 'pending',
        priority: 'high'
      }
    },
    id: 3
  }),

  // List all tasks
  JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'list_tasks',
      arguments: {}
    },
    id: 4
  })
];

// Send test commands
console.log('Starting MCP server test...\n');

let commandIndex = 0;
const sendNextCommand = () => {
  if (commandIndex < testCommands.length) {
    const command = testCommands[commandIndex];
    console.log(`\nSending command ${commandIndex + 1}:`, command);
    mcp.stdin.write(command + '\n');
    commandIndex++;
    setTimeout(sendNextCommand, 2000); // Wait 2 seconds between commands
  } else {
    console.log('\nAll test commands sent. Press Ctrl+C to exit.');
  }
};

setTimeout(sendNextCommand, 1000); // Wait for server to start

// Handle user input
rl.on('line', (input) => {
  if (input.trim()) {
    console.log('Sending custom command:', input);
    mcp.stdin.write(input + '\n');
  }
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  mcp.kill();
  process.exit();
});