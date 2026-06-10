# Security Specification & Hardening Guidelines for KALARANG

This document details the security model, invariants, and threat analysis for the Firestore database of **KALARANG — Silks & Studio**.

## 1. Data Invariants & Access Control Model

| Collection | Path | Read Access | Write Access | Key Validation / Constraint |
|------------|------|-------------|--------------|------------------------------|
| `products` | `/products/{productId}` | **Public** (Anyone) | **Admin Only** (vineshjm@gmail.com) | Valid ID, strict keys, no deleted field alterations by standard users |
| `collections` | `/collections/{collectionId}` | **Public** (Anyone) | **Admin Only** (vineshjm@gmail.com) | Valid ID, strict keys |
| `banners` | `/banners/{bannerId}` | **Public** (Anyone) | **Admin Only** (vineshjm@gmail.com) | Valid ID, strict keys |
| `settings` | `/settings/{settingsId}` | **Public** (Anyone) | **Admin Only** (vineshjm@gmail.com) | Valid ID, custom fields |
| `orders` | `/orders/{orderId}` | **Admin Only** (vineshjm@gmail.com) | **Create: Public, Read/Update: Admin Only** | Atomic values, customer details validated, status limited to enum |

## 2. Bootstrapped Administrator Concept
- Admin UID or Email is verified at the database level.
- Approved email: `vineshjm@gmail.com` with `email_verified == true`.
- Admins are the only users who can modify products, collections, banners, settings, or read and update order parameters.

## 3. The "Dirty Dozen" Rogue Payloads (Blocked by Rules)

The firestore security rules are designed to prevent the following 12 malicious payloads:

1. **Unauthenticated Saree Creation**: An anonymous user attempts to inject a new fake product.
2. **Anonymous Collection Deletion**: A visitor attempts to purge the Russian Katan Silk collection.
3. **Spoofed Order Placement**: An order created with custom-specified fields, missing `customerName` or placing incorrect positive values or custom status flags like "delivered" directly.
4. **Order Status Tampering**: A guest updates their pending order's status to "delivered" directly.
5. **Admin Email Spoofing**: A user tries to write with authentication token `email: vineshjm@gmail.com` but `email_verified = false`.
6. **Setting Tampering**: A user attempts to change the WhatsApp contact phone number in Settings.
7. **Banners Sabotage**: An attacker attempts to write malicious cta links in the banners page.
8. **Product MRP Hijack**: A user attempts to update a product to reduce its sale price to ₹0.
9. **XSS Payload in Collections**: A user attempts to write a 1MB string or high-risk input into the `collectionSlug` or ID.
10. **Malicious Field Expansion**: Injecting shadow/unapproved keys (e.g., `isVerifiedAdmin: true`) into a collection.
11. **Immoral Timeline Hack**: Creating a document with a client timestamp instead of authentic server value `request.time`.
12. **Foreign Order Infiltration**: An unauthenticated user attempts to perform bulk fetch of other users' orders.

## 4. Test Verification Plan (firestore.rules)

Verification is implemented in `firestore.rules` containing global validators:
`isValidId(id)` and verified Admin helpers.
We've set up detailed, hardened Rules ensuring these actions are secure.
