async function testRoutes() {
  const routes = [
    '/',
    '/tiles',
    '/tiles/oasis-marble-4d',
    '/about',
    '/contact',
    '/admin/login',
    '/admin',
    '/admin/products',
    '/admin/products/new',
    '/admin/categories',
    '/admin/settings'
  ];

  console.log('Testing Next.js routes on http://localhost:3000 ...\n');
  let allOk = true;

  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`);
      const text = await res.text();
      if (res.status === 200) {
        console.log(`✓ [200 OK] ${route.padEnd(25)} (${text.length} bytes)`);
      } else {
        console.error(`✗ [${res.status}] ${route}`);
        allOk = false;
      }
    } catch (e) {
      console.error(`✗ [ERROR] ${route}: ${e.message}`);
      allOk = false;
    }
  }

  if (allOk) {
    console.log('\nAll 11 core routes responding with HTTP 200 OK!');
  } else {
    process.exit(1);
  }
}

testRoutes();
