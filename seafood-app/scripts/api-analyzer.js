import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurations
const BE_DIR = 'E:/huynguyen/VAM';
const FE_DIR = path.resolve(__dirname, '..');

// Helper to recursively list files
function getFiles(dir, fileList = [], extension = '') {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, fileList, extension);
    } else if (!extension || file.endsWith(extension)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Normalize endpoint paths for comparison (e.g. convert params/templates to :param)
function normalizePath(endpointPath) {
  if (!endpointPath) return '';
  let normalized = endpointPath.trim().replace(/\\/g, '/');
  
  // Prepend / if not present
  if (!normalized.startsWith('/') && !normalized.startsWith('http')) {
    normalized = '/' + normalized;
  }

  // Prepend /api if not present
  if (!normalized.startsWith('http') && !normalized.toLowerCase().startsWith('/api')) {
    normalized = '/api' + normalized;
  }

  // Convert ${id}, {id}, and other dynamic placeholders to :param
  normalized = normalized.replace(/\$\{[^}]+\}/g, ':param');
  normalized = normalized.replace(/\{[^}]+\}/g, ':param');
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  
  // Clean double slashes
  normalized = normalized.replace(/\/{2,}/g, '/');

  return normalized.toLowerCase();
}

// 1. Analyze BE Controllers
function analyzeBackend() {
  const controllerDir = path.join(BE_DIR, 'Controllers');
  const beEndpoints = [];

  if (!fs.existsSync(controllerDir)) {
    console.warn(`⚠️ Backend Controllers directory not found at: ${controllerDir}`);
    return beEndpoints;
  }

  const files = getFiles(controllerDir, [], '.cs');

  for (const file of files) {
    const filename = path.basename(file);
    const controllerName = filename.replace('Controller.cs', '');
    const content = fs.readFileSync(file, 'utf-8');

    // 1. Find Route Attribute on the class level
    // Match [Route("api/[controller]")] or similar
    const routeRegex = /\[Route\("([^"]+)"\)\]/g;
    let routeMatch = routeRegex.exec(content);
    let basePath = '';
    if (routeMatch) {
      basePath = routeMatch[1]
        .replace('[controller]', controllerName)
        .replace('[Controller]', controllerName);
    } else {
      // Default ASP.NET Core fallback
      basePath = `api/${controllerName}`;
    }

    // 2. Find Action Methods with Http Attributes
    // Matches e.g., [HttpGet], [HttpPost("{id}")], [HttpPut("{id}/approve")]
    const methodRegex = /\[Http(Get|Post|Put|Delete|Patch)(?:\("([^"]*)"\))?\]/g;
    let match;
    
    // We parse line by line to keep track of authorize attributes or method names if needed
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let methodMatch = /\[Http(Get|Post|Put|Delete|Patch)(?:\("([^"]*)"\))?\]/.exec(line);
      if (methodMatch) {
        const httpMethod = methodMatch[1].toUpperCase();
        const subRoute = methodMatch[2] || '';
        
        let fullPath = basePath;
        if (subRoute) {
          fullPath = `${basePath}/${subRoute}`;
        }

        const normPath = normalizePath(fullPath);
        
        // Find method name (usually the line after the attribute or a few lines down)
        let methodName = 'Unknown';
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine.startsWith('public') && (nextLine.includes('Task') || nextLine.includes('IActionResult') || nextLine.includes('async'))) {
            const parts = nextLine.split(/\s+/);
            const nameIndex = parts.findIndex(p => p.includes('('));
            if (nameIndex !== -1) {
              methodName = parts[nameIndex].split('(')[0];
            } else {
              methodName = parts[parts.length - 1].split('(')[0] || 'Unknown';
            }
            break;
          }
        }

        beEndpoints.push({
          method: httpMethod,
          originalPath: fullPath,
          normalizedPath: normPath,
          controller: filename,
          methodName: methodName
        });
      }
    }
  }

  return beEndpoints;
}

// 2. Analyze FE Endpoints definition and usage
function analyzeFrontend() {
  const endpointsFile = path.join(FE_DIR, 'src', 'api', 'endpoints.js');
  const feEndpoints = [];

  if (!fs.existsSync(endpointsFile)) {
    console.warn(`⚠️ Frontend endpoints definition not found at: ${endpointsFile}`);
    return feEndpoints;
  }

  const content = fs.readFileSync(endpointsFile, 'utf-8');

  // Simple parser for endpoints.js nested objects
  // This matches: KEY: 'value' or KEY: (arg) => `value`
  const regex = /\b([A-Z0-9_]+)\s*:\s*(?:'([^'\n]+)'|"([^"\n]+)"|(?:\([^)]*\)\s*=>\s*`([^`\n]+)`))/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const rawPath = match[2] || match[3] || match[4];
    
    // Skip placeholder or wrapper configs if any
    if (rawPath.includes('http') || rawPath.startsWith('//')) continue;

    const normPath = normalizePath(rawPath);
    feEndpoints.push({
      key: key,
      originalPath: rawPath,
      normalizedPath: normPath,
      callers: []
    });
  }

  // Scan FE components to see where endpoints are referenced
  const srcFiles = getFiles(path.join(FE_DIR, 'src'), [], '.jsx').concat(getFiles(path.join(FE_DIR, 'src'), [], '.js'));
  
  for (const file of srcFiles) {
    // Skip config/api files themselves for clean reference mapping
    if (file.endsWith('endpoints.js') || file.endsWith('apiClient.js')) continue;

    const fileContent = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(FE_DIR, file).replace(/\\/g, '/');

    for (const ep of feEndpoints) {
      // Check if file mentions the endpoint key or original path
      const keyPattern = new RegExp(`\\b${ep.key}\\b`);
      if (keyPattern.test(fileContent)) {
        ep.callers.push(relativePath);
      }
    }
  }

  return feEndpoints;
}

// 3. Main runner
function run() {
  console.log('🔍 Starting API Synchronization Analyzer...');
  
  const beList = analyzeBackend();
  const feList = analyzeFrontend();

  console.log(`📊 Found ${beList.length} endpoints defined in Backend Controllers.`);
  console.log(`📊 Found ${feList.length} endpoints defined in Frontend endpoints.js.`);

  // Mapping results
  const report = [];
  const processedFE = new Set();
  const processedBE = new Set();

  // Combine FE and BE
  for (const be of beList) {
    // Find matching FE endpoint
    const feMatches = feList.filter(fe => fe.normalizedPath === be.normalizedPath);
    
    if (feMatches.length > 0) {
      for (const fe of feMatches) {
        report.push({
          method: be.method,
          endpoint: be.originalPath.startsWith('/') ? be.originalPath : '/' + be.originalPath,
          normalized: be.normalizedPath,
          status: fe.callers.length > 0 ? '🟢 Connected' : '🟡 BE Only (FE Unused)',
          feCallers: fe.callers,
          beController: `${be.controller} (${be.methodName})`
        });
        processedFE.add(fe.normalizedPath);
      }
    } else {
      report.push({
        method: be.method,
        endpoint: be.originalPath.startsWith('/') ? be.originalPath : '/' + be.originalPath,
        normalized: be.normalizedPath,
        status: '🟡 BE Only (FE Missing)',
        feCallers: [],
        beController: `${be.controller} (${be.methodName})`
      });
    }
    processedBE.add(be.normalizedPath);
  }

  // Find FE only endpoints (FE has them but BE doesn't)
  for (const fe of feList) {
    if (!processedFE.has(fe.normalizedPath)) {
      // Find method from endpoints.js context or default to GET/POST guess
      let guessedMethod = 'GET/POST';
      if (fe.key.includes('CREATE') || fe.key.includes('ADD') || fe.key.includes('LOGIN') || fe.key.includes('REGISTER')) {
        guessedMethod = 'POST';
      } else if (fe.key.includes('UPDATE') || fe.key.includes('APPROVE')) {
        guessedMethod = 'PUT';
      } else if (fe.key.includes('DELETE') || fe.key.includes('REMOVE')) {
        guessedMethod = 'DELETE';
      }

      report.push({
        method: guessedMethod,
        endpoint: fe.originalPath,
        normalized: fe.normalizedPath,
        status: '🔴 FE Only (BE Missing)',
        feCallers: fe.callers,
        beController: 'N/A'
      });
    }
  }

  // Summary Metrics
  const connectedCount = report.filter(r => r.status.includes('🟢')).length;
  const beOnlyCount = report.filter(r => r.status.includes('🟡')).length;
  const feOnlyCount = report.filter(r => r.status.includes('🔴')).length;

  // Generate Markdown
  let mdContent = `# 📊 Báo Cáo Đối Chiếu API (Tự Động)
*Cập nhật lúc: ${new Date().toLocaleString('vi-VN')}*

Báo cáo này được tự động sinh ra bởi script để đối chiếu trạng thái phát triển API giữa **Frontend (React)** và **Backend (.NET)**.

---

## 📈 Tóm tắt trạng thái
- **🟢 Connected (Đã ráp & sử dụng):** ${connectedCount} APIs
- **🟡 BE Only (BE đã viết, FE chưa ráp):** ${beOnlyCount} APIs
- **🔴 FE Only (FE định nghĩa nhưng BE chưa có):** ${feOnlyCount} APIs

---

## 🔍 Chi tiết trạng thái các API

| Method | Endpoint thực tế | Trạng thái | Nơi sử dụng ở FE | Controller BE (Action) |
| :--- | :--- | :--- | :--- | :--- |
`;

  // Sort report by status and path
  report.sort((a, b) => {
    if (a.status !== b.status) return a.status.localeCompare(b.status);
    return a.endpoint.localeCompare(b.endpoint);
  });

  for (const item of report) {
    const callersStr = item.feCallers.length > 0 
      ? item.feCallers.map(c => `\`${path.basename(c)}\``).join(', ') 
      : '*Chưa ráp*';
    
    mdContent += `| \`${item.method}\` | \`${item.endpoint}\` | ${item.status} | ${callersStr} | \`${item.beController}\` |\n`;
  }

  const outputPath = path.join(FE_DIR, 'API_SYNC_STATUS.md');
  fs.writeFileSync(outputPath, mdContent, 'utf-8');
  console.log(`✅ Saved API report to: ${outputPath}`);
}

run();
