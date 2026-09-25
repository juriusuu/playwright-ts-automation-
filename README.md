# Playwright Automation Suite – SauceDemo

## Overview

This repository contains an end-to-end Playwright + TypeScript automation suite for the [SauceDemo](https://www.saucedemo.com/) web application. Designed using a clean **Page Object Model (POM)** architecture, the suite validates critical user journeys across **10 distinct testing categories**:

* **User Persona & Profile Testing:** Validates full purchase loops across valid profiles (`standard_user`, `performance_glitch_user`, `visual_user`), authentication blocks (`locked_out_user`), and explicit defect handling (`problem_user`, `error_user`).
* **Functional & Flow Validation:** Covers essential **Smoke** checks, critical **UAT** user journeys (item management & checkout), and **Boundary / Negative** edge cases (missing postal codes, cart badges, item state changes).
* **Visual & Performance Benchmarking:** Performs pixel-perfect **Visual Regression** across key pages and measures **Performance** checkout thresholds against timing logs.
## Test Coverage

Your suite covers **10 categories** of automated tests:

| Category | Description |
| :--- | :--- |
| **Successful Profiles Loop** | Full purchase flow for Standard, Performance Glitch, and Visual users. |
| **Blocked Flow** | Locked Out User login failure check. |
| **Known Bug Profiles** | Problem User and Error User defect profiling (expected failures). |
| **Smoke Test** | Quick login/logout validation. |
| **Visual Regression Tests** | Screenshot comparisons for Inventory and Cart pages across multiple users. |
| **Negative Tests** | Checkout fails without postal code. |
| **Boundary Tests** | Add/remove items from cart, badge count assertions. |
| **UI Tests** | Cart page visual regression for Standard, Visual, and Problem users. |
| **UAT Tests** | End-to-end flow: remove item before checkout, complete order successfully. |
| **Performance Tests** | Checkout duration for Standard vs. Performance Glitch user (threshold assertions with timing logs). |

## 📁 Project Structure

```text
playwright-ts-automation/
├── config/
│   └── env.config.ts
├── pages/
│   ├── AddToCart.ts
│   ├── CartPage.ts
│   ├── CheckOutPage.ts
│   └── LoginPage.ts
├── tests/
│   ├── workflow.spec.ts-snapshots/
│   │   ├── cart-problem-*.png
│   │   ├── cart-standard-*.png
│   │   ├── cart-visual-*.png
│   │   └── inventory-visual-*.png
│   └── workflow.spec.ts
├── playwright.config.ts
└── package.json
```

### Getting Started
Prerequisites
Node.js (>= 18)

npm or yarn

### Install

```bash
npm install
```

### Run All Tests

```bash
npx playwright test
```

### Run with UI Mode

```bash
npx playwright test --ui
```

### Run in Headed Mode

```bash
npx playwright test --headed
```

### Run Specific Categories

```bash
npx playwright test --grep @uat
npx playwright test --grep @performance
npx playwright test --grep @negative
```

### View Report

```bash
npx playwright show-report
```
