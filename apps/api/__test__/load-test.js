import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// --------------------
// Load test options
// --------------------
export const options = {
  scenarios: {
    browse_menu: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '3m', target: 150 },
        { duration: '3m', target: 300 },
        { duration: '1m', target: 0 },
      ],
    },
    checkout_flow: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10 },
        { duration: '3m', target: 30 },
        { duration: '3m', target: 50 },
        { duration: '1m', target: 0 },
      ],
      startTime: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<2000'],
  },
};

// --------------------
// Config
// --------------------
const BASE_URL = __ENV.BASE_URL || 'https://api.dynleaf.com';

// Example static data (real menus don’t change often)
const categories = new SharedArray('categories', () => [
  'starters',
  'mains',
  'desserts',
  'drinks',
]);

// --------------------
// Scenario: Browse menu
// --------------------
export function browseMenu() {
  group('Open menu', () => {
    const res = http.get(`${BASE_URL}/api/menu`);
    check(res, { 'menu loaded': (r) => r.status === 200 });
    sleep(1);
  });

  group('Browse category', () => {
    const category = categories[Math.floor(Math.random() * categories.length)];

    const res = http.get(`${BASE_URL}/api/menu/category/${category}`);

    check(res, { 'category loaded': (r) => r.status === 200 });
    sleep(Math.random() * 2 + 1);
  });

  // 60% of users view item details
  if (Math.random() < 0.6) {
    const itemId = Math.floor(Math.random() * 100) + 1;

    group('View item', () => {
      const res = http.get(`${BASE_URL}/api/menu/item/${itemId}`);
      check(res, { 'item loaded': (r) => r.status === 200 });
      sleep(Math.random() * 3 + 1);
    });
  }
}

// --------------------
// Scenario: Checkout flow
// --------------------
export function checkoutFlow() {
  // create cart
  const cartRes = http.post(`${BASE_URL}/api/cart`, null);
  check(cartRes, { 'cart created': (r) => r.status === 201 });

  const cartId = cartRes.json('id');

  // add items
  for (let i = 0; i < 2; i++) {
    const itemId = Math.floor(Math.random() * 100) + 1;

    http.post(
      `${BASE_URL}/api/cart/${cartId}/items`,
      JSON.stringify({ itemId, quantity: 1 }),
      { headers: { 'Content-Type': 'application/json' } },
    );

    sleep(1);
  }

  // checkout (only some succeed in real life)
  if (Math.random() < 0.8) {
    const res = http.post(`${BASE_URL}/api/checkout/${cartId}`);
    check(res, { 'checkout success': (r) => r.status === 200 });
  }

  sleep(2);
}
