const fs = require('fs');
const path = require('path');

// Files to include in the combined source
const sourceFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'src/index.css',
  'src/lib/utils.ts',
  'src/hooks/useAuth.tsx',
  'src/hooks/useSupabaseData.tsx',
  'src/hooks/useEnhancedRatings.tsx',
  'src/pages/Index.tsx',
  'src/pages/Auth.tsx',
  'src/pages/NotFound.tsx',
  'src/components/auth/LoginForm.tsx',
  'src/components/auth/SignupForm.tsx',
  'src/components/dashboard/AdminDashboard.tsx',
  'src/components/dashboard/UserDashboard.tsx',
  'src/components/dashboard/StoreOwnerDashboard.tsx',
  'src/components/dashboard/StatsCard.tsx',
  'src/components/dashboard/UserTable.tsx',
  'src/components/dashboard/StoreTable.tsx',
  'src/integrations/supabase/client.ts',
  'tailwind.config.ts',
  'vite.config.ts'
];

let combinedContent = '// COMBINED SOURCE CODE\n// Generated: ' + new Date().toISOString() + '\n\n';

sourceFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    combinedContent += `// ==========================================\n`;
    combinedContent += `// FILE: ${filePath}\n`;
    combinedContent += `// ==========================================\n\n`;
    combinedContent += content;
    combinedContent += '\n\n';
  } else {
    console.log(`Warning: ${filePath} not found`);
  }
});

fs.writeFileSync('combined-source.txt', combinedContent);
console.log('✅ Combined source code saved to: combined-source.txt');