import { spawn } from 'child_process'
import waitOn from 'wait-on'
import path from 'path'

// Start Next.js dev server with Webpack
const next = spawn('npx', ['next', 'dev', '--webpack'], { stdio: 'inherit', shell: true })

waitOn({ resources: ['http://localhost:3000'] }).then(() => {
  console.log("Starting Electron...")

  const electronPath = path.resolve('node_modules', '.bin', 'electron')
  spawn(electronPath, ['.'], { stdio: 'inherit', shell: true })
})
