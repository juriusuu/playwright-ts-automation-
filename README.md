🎭 Playwright Automation Suite – SauceDemo
📖 Overview
This repository contains a comprehensive Playwright + TypeScript automation suite for the SauceDemo application.
It demonstrates functional, regression, UAT, performance, and visual testing using a clean Page Object Model (POM) design.

🚀 Test Coverage
Your suite includes 10 categories of tests:

Successful Profiles Loop

Full purchase flow for Standard, Performance Glitch, and Visual users.

Blocked Flow

Locked Out User login failure check.

Known Bug Profiles

Problem User and Error User defect profiling (expected failures).

Smoke Test

Quick login/logout validation.

Visual Regression Tests

Screenshot comparisons for Inventory and Cart pages across multiple users.

Negative Tests

Checkout fails without postal code.

Boundary Tests

Add/remove items from cart, badge count assertions.

UI Tests

Cart page visual regression for Standard, Visual, and Problem users.

UAT Tests

End‑to‑end flow: remove item before checkout, complete order successfully.

Performance Tests

Checkout duration for Standard vs Performance Glitch user.

Threshold assertions with timing logs.

Project Structure
```
/pages
  LoginPage.ts
  AddToCart.ts
  CartPage.ts
  CheckOutPage.ts

/tests
  workflow.spec.ts   # All functional, UAT, and performance tests

/config
  env.config.ts      # User accounts, URLs, test data
```

⚡ Getting Started
Prerequisites
Node.js (>= 18)

npm or yarn

Install
```bash
npm install
```

Run All Tests
```bash
npx playwright test
```

Run Specific Categories
```bash
npx playwright test --grep @uat
npx playwright test --grep @performance
npx playwright test --grep @negative
```
View Report
```bash
npx playwright show-report
```
