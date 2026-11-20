# Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Default Deny**: All unmatched paths in Firestore are denied by default (`match /{document=**} { allow read, write: if false; }`).
2. **PII Isolation**: `enquiries` and `applications` contain client and applicant PII (`email`, `phone`, `fullName`, `companyName`). Public visitors may ONLY `create` new submissions; `get`, `list`, `update`, and `delete` are strictly restricted to verified admins (`isAdmin()`). Public tracking uses `/enquiry_status/{referenceId}`, which stores zero PII and permits direct `get` by valid Reference ID while denying public `list`.
3. **Immutable Creation Metadata & Atomicity**: `createdAt` must equal `request.time` on `create` and must never change on `update`. Public creations must always enter with `status == 'New'`, and public `/enquiry_status/{referenceId}` creation requires `existsAfter` + matching `referenceId` via `getAfter` on the parent `/enquiries/{sourceId}` or `/applications/{sourceId}` document.
4. **Strict Key & Size Enforcement**: Every string field has explicit `size()` bounds, every document ID is validated via `isValidId()` (`^[a-zA-Z0-9_\-]+$`, `<= 128` chars) or `isValidTrackingReferenceId()`, and `hasAll`/`hasOnly` prevent shadow/ghost fields.
5. **Verified Admin Identity**: Bootstrapped admin check requires `request.auth.token.email_verified == true` alongside exact email match (`trustlineservice566@gmail.com`) or existence in `/admins/{request.auth.uid}`.

## 2. The "Dirty Dozen" Malicious Payloads (Must Return `PERMISSION_DENIED`)
1. **Unauthenticated List Enquiries**: Visitor queries `list /enquiries` without admin auth -> `PERMISSION_DENIED`.
2. **Unverified Admin Email Spoof**: Signed-in user with `email == 'trustlineservice566@gmail.com'` and `email_verified == false` attempts `list /enquiries` -> `PERMISSION_DENIED`.
3. **Non-Admin Authenticated Read**: Signed-in user with `email == 'attacker@example.com'` attempts `get /enquiries/eq1` -> `PERMISSION_DENIED`.
4. **Shadow Field Injection on Create**: Visitor submits `enquiries/eq2` with extra field `{ isVerified: true }` -> `PERMISSION_DENIED` (`hasOnly` rejects).
5. **Pre-Converted Status Injection**: Visitor submits `enquiries/eq3` with `{ status: 'Converted' }` -> `PERMISSION_DENIED` (`status == 'New'` required on create).
6. **Fake Client Timestamp**: Visitor submits `enquiries/eq4` with `createdAt: Timestamp(2020-01-01)` -> `PERMISSION_DENIED` (`createdAt == request.time` required).
7. **Oversized Denial-of-Wallet Payload**: Visitor submits `enquiries/eq5` with 50KB `message` -> `PERMISSION_DENIED` (`message.size() <= 2000`).
8. **ID Poisoning**: Visitor submits `enquiries/bad$id` or 200-char ID -> `PERMISSION_DENIED` (`isValidId` rejects).
9. **Self-Assigned Admin Escalation**: Non-admin user creates `/admins/{theirUid}` with `{ role: 'owner' }` -> `PERMISSION_DENIED`.
10. **Unauthenticated List Public Tracking Collection**: Visitor attempts `list /enquiry_status` to scrape reference IDs -> `PERMISSION_DENIED` (`allow list: if isAdmin()`).
11. **Orphan Tracking Record Spoof**: Visitor creates `/enquiry_status/TCS-2026-999999` without an atomic matching `/enquiries/{sourceId}` write or with `status: 'Converted'` -> `PERMISSION_DENIED`.
12. **Public Status Tampering / Admin Immutable Field Tampering**: Visitor attempts `update /enquiry_status/TCS-2026-123456`, or admin attempts to mutate `createdAt` or `referenceId` -> `PERMISSION_DENIED`.
