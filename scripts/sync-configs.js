#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration templates
const TSCONFIG_TEMPLATE = {
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    composite: true,
    skipLibCheck: true
  },
  include: ['src/**/*'],
  exclude: ['node_modules', 'dist']
};

async function syncConfigs() {
  console.log('🔄 Syncing configuration files across the monorepo...\n');
  
  // Define the root directories to process
  const rootDirs = [
    '.', // root
    'apps/web',
    'packages/equipment-asset-management',
    'packages/shared',
    'packages/ui',
    'packages/user-management',
    'services/equipment-management-service',
    'services/user-management-service'
  ];
  
  try {
    for (const dir of rootDirs) {
      if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        continue;
      }
      
      console.log(`📁 Processing ${dir}`);
      
      // Update or create tsconfig.json
      const tsConfigPath = path.join(dir, 'tsconfig.json');
      if (!fs.existsSync(tsConfigPath)) {
        console.log('  + Creating tsconfig.json');
        fs.writeFileSync(
          tsConfigPath,
          JSON.stringify(TSCONFIG_TEMPLATE, null, 2) + '\n',
          'utf8'
        );
      }
      
      
      // Ensure .gitignore has common entries
      const gitignorePath = path.join(dir, '.gitignore');
      const gitignoreEntries = new Set([
        'node_modules',
        'dist',
        '.DS_Store',
        '*.log',
        'coverage',
        '.env',
        '.env.local',
        '.env.*.local',
        '.next',
        '.turbo'
      ]);
      
      if (fs.existsSync(gitignorePath)) {
        const content = fs.readFileSync(gitignorePath, 'utf8');
        const existingEntries = new Set(content.split('\n').filter(Boolean));
        const newEntries = [...gitignoreEntries].filter(x => !existingEntries.has(x));
        
        if (newEntries.length > 0) {
          console.log(`  + Updating .gitignore`);
          fs.appendFileSync(gitignorePath, '\n' + newEntries.join('\n') + '\n');
        }
      } else {
        console.log('  + Creating .gitignore');
        fs.writeFileSync(gitignorePath, [...gitignoreEntries].join('\n') + '\n', 'utf8');
      }
    }
    
    console.log('\n✅ Configuration sync complete!');
  } catch (error) {
    console.error('❌ Error syncing configurations:', error);
    process.exit(1);
  }
}

syncConfigs();
